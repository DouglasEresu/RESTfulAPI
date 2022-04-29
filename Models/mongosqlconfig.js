import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = () => {
    try{
mongoose.connect(process.env.DB_URI, )
    }
    catch(err) {
        console.log(err)
    }
}

export default connectDB