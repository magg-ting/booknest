import mongoose from "mongoose";

const dbConn = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_CONN_URI);
        console.log(`Connect to MongoDB ${conn.connection.host}`);

    } catch (error){
        console.log(`MongoDB error: ${error}`);
    }
};

export default dbConn;