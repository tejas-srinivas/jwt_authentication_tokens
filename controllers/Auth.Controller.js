import createHttpError from "http-errors";
import User from "../models/User.model.js";
import Validation from "../helpers/validation_schema.js";
import JWT_helper from "../helpers/jwt_helper.js";
import client from "../helpers/init_redis.js";

export default {
    register: async (req, res, next) => {
        try{
            // console.log(req.body)
            const result = await Validation.authSchema.validateAsync(req.body);

            const doesExist = await User.findOne({email: result.email});
            if(doesExist) throw createHttpError.Conflict(`This ${result.email} already been registered`);
            
            const user = new User(result);
            const savedUser = await user.save();
            const accessToken = await JWT_helper.signAccessToken(savedUser.id);
            const refreshToken = await JWT_helper.signRefreshToken(savedUser.id)
            
            res.send({accessToken, refreshToken});
        } catch (error){
            if(error.isJoi === true) error.status = 422;
            next(error);
        }
    },

    login: async (req, res, next) => {
        try{
            const result = await Validation.loginSchema.validateAsync(req.body);
            const user = await User.findOne({email: result.email});

            if(!user) throw createHttpError.NotFound('User is not registered')
            const isMatchPass = await user.isValidPassword(result.password)
            if(!isMatchPass) throw createHttpError.Unauthorized('Username/Password is not valid')        
            
            const accessToken = await JWT_helper.signAccessToken(user.id)
            const refreshToken = await JWT_helper.signRefreshToken(user.id)

            res.send({ accessToken, refreshToken })
        } catch (error){
            if(error.isJoi === true) return next(createHttpError.BadRequest("Invalid username or password"));
            next(error);
        }
    },

    refreshToken: async (req, res, next) => {
        try{
            const { refreshToken } = req.body
            if (!refreshToken) throw createHttpError.BadRequest()
            const userId = await JWT_helper.verifyRefreshToken(refreshToken)
            
            const accessToken = await JWT_helper.signAccessToken(userId)
            const newRefreshToken = await JWT_helper.signRefreshToken(userId)
            res.send({ accessToken: accessToken, refreshToken: newRefreshToken })
        } catch (error){
            next(error)
        }
    },

    logout: async (req, res, next) => {
        try {
          const { refreshToken } = req.body
          if (!refreshToken) throw createError.BadRequest()
          const userId = await JWT_helper.verifyRefreshToken(refreshToken)
          client.del(userId, (err, val) => {
            if (err) {
              console.log(err.message)
              throw createError.InternalServerError()
            }
            console.log(val)
            res.sendStatus(204)
          })
        } catch (error) {
          next(error)
        }
    },
}