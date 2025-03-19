import mongoose from "mongoose";

//connect to the MongoDB database

const connectDB = async ()=>{
    mongoose.connection.on('connected', ()=> console.log('databse Connected'))

    await mongoose.connect(`${process.env.MONGODB_URI}/lms`);
}



export default connectDB;
