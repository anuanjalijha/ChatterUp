import mongoose from "mongoose";

import { userSchema } from "./user.schema.js";



// creating model from schema.
const UserModel = mongoose.model('User', userSchema)

export default class UserRepository{

    

    async signUp(user){
        
        try{
            // create instance of model.
            // const hashedPassword = await bcrypt.hash(user.password, 12);
            // user.password = hashedPassword;
            const newUser = new UserModel(user);
            await newUser.save();
            return newUser;
        }
        catch(err){
            
                console.log(err);
                         
            
        }
    }

    async signIn(email, password){
        try{
           return await UserModel.findOne({email, password});
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async findByEmail(email) {
        try{
        return await UserModel.findOne({email});
      }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);
      }
      }
      
    async findById(userID) {
        try {
            return await UserModel.findById(userID);
        } catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }
    async findAll() {
        try {
            return await UserModel.find();
        } catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }
    

}