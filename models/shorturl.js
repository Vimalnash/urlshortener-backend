import mongoose from "mongoose";
import { ObjectId } from "bson";

const shorturlSchema = new mongoose.Schema(
    {
        date: { type: String, required: true, trim: true },
        userId: {type: ObjectId, ref:"users", required: true},
        longUrl: { type: String, required: true, trim: true},
        shortname: { type: String, required: true, trim: true, unique: true },
        shortUrl: { type: String, required: true, trim: true,  unique: true },
    },
    {
        timestamps: true
    }
);

const SHORTURL = mongoose.model("shorturls", shorturlSchema);
export { SHORTURL }