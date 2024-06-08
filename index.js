import express from 'express';
import cors from 'cors';
import Connection from './helpers/init_mongo.js';
import FoodRoutes from './routes/route.js';
import AuthRoute from './routes/Auth.Route.js'
import morgan from "morgan";
import createError from "http-errors";
import jwt_helper from './helpers/jwt_helper.js';
import './helpers/init_redis.js';

const app = express();
app.use(cors());

app.use(morgan('dev'))
app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true}))

app.use('/auth',AuthRoute);
app.use('/food', jwt_helper.verifyAccessToken, FoodRoutes);

app.use(async (req, res, next) => {
    next(createError.NotFound("This route does not exist"))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error:{
            status: err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT || 7000
Connection();
app.listen(PORT, ()=> {console.log(`Server running succesfully on Port ${PORT}`)})