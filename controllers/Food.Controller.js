export default {
    ping : async (request, response) => {
        response.status(200).json({"message":"Server is running"})
    },
    docker: async(req, res) => {
        res.status(200).json({"message":"Hello from NodeJs container"})
    }
}