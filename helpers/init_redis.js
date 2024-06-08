import { Redis } from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT = process.env.REDIS_PORT

const client = Redis.createClient({
    port: REDIS_PORT,
    host: REDIS_HOST
})

client.on('connect', () => {
    console.log(`Redis server is running at PORT: ${REDIS_PORT}`)
})

client.on('ready', () => {
    console.log("RedisDB => connected successfully")
})

client.on('error', (err) => {
    console.log(err.message)
})

client.on('end', () => {
    console.log("Client disconnected from redis")
})

process.on('SIGINT', () => {
    client.quit()
})

export default client