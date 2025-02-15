import { connect } from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const db = process.env.MONGO_URI; // עכשיו זה תמיד ייקח את ה-URI הנכון

export const conn = async () => {
    try {
        if (!db) {
            throw new Error("MongoDB URI is undefined! Check your .env file.");
        }
        await connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(chalk.magenta("✅ Connected To MongoDB Atlas"));
    } catch (err) {
        console.log("❌ MongoDB Connection Error:", err.message);
    }
};
