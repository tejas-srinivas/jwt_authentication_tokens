import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const schema = mongoose.Schema

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    phone:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        bcrypt: true
    },
    createdAt: {
        type:Date,
        default:Date.now
    }
})

UserSchema.pre('save', async function(next) {
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    }catch(error){
        next(error)
    }
})

UserSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const User = mongoose.model('user', UserSchema)
export default User