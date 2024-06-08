import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const USERNAME = process.env.DB_USERNAME
const PASSWORD = process.env.DB_PASSWORD
const CLUSTER = process.env.DB_CLUSTER
const DATABASE = process.env.DB_NAME

const Connection = () => {
    
    const MONGODB_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@${CLUSTER}.59cgwbd.mongodb.net`
    mongoose.connect(MONGODB_URI, {
        dbName: DATABASE
    })

    mongoose.connection.on('connected',()=>{
        console.log('MongoDB => connected Successfully')
    })

    mongoose.connection.on('disconnected',()=>{
        console.log('Database Disconnected')
    })

    mongoose.connection.on('error',(error)=>{
        console.log('Error while connecting to database',error.message)
    })

    process.on('SIGINT', async () => {
        await mongoose.connection.close()
        process.exit(0)
    })
}

export default Connection