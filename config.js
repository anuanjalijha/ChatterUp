import mongoose from 'mongoose';

export const connect = async()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/chatter", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Db is connected");
}

