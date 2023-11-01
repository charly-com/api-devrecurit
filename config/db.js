import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectToMongoose = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
     
    });
    console.log(`Connected to Mongoose Through ${db.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectToMongoose;
