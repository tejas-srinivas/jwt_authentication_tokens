import createHttpError from "http-errors";
import JWT from "jsonwebtoken";
import client from "./init_redis.js";

export default{
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn:'1h',
                issuer: "nutricious-food-app",
                audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err){
                    console.log(err)
                    reject(createHttpError.InternalServerError())  
                } 
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req,res,next) => {
        if (!req.headers['authorization']) return next(createHttpError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err){
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createHttpError.Unauthorized(message))
            }
            req.payload = payload
            next()
        })
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn:'1y',
                issuer: "nutricious-food-app",
                audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err){
                    console.log(err)
                    reject(createHttpError.InternalServerError())  
                } 
                client.set(userId, token, 'EX', 365*24*60*60 , (err, reply) => {
                    if(err) {
                        console.log(err.message)
                        rejext(createHttpError.InternalServerError()) 
                        return
                    }
                })
                resolve(token)
            })
        })
    },
    verifyRefreshToken: (token) => {
        return new Promise((reslove, reject) => {
            JWT.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if(err) return reject(createHttpError.Unauthorized())
                const userId = payload.aud
                client.get(userId, (err, result) => {
                    if(err) {
                        console.log(err.message)
                        reject(createHttpError.InternalServerError())
                        return
                    }
                    if(token === result) return reslove(userId)
                    reject(createHttpError.Unauthorized())
                })
            })
        })
    }
}