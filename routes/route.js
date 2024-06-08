import express from "express";
import FoodController from '../controllers/Food.Controller.js'

const route = express.Router();

route.get('/', FoodController.ping)
route.get('/docker', FoodController.docker)

export default route;