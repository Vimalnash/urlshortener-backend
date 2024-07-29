import express from "express";
import { getLongUrl } from "../controllers/public.js";

const router = express.Router();

// End User clicks the Short Url
router.get("/:shortname", async (req, res) => {
    try {
        const longUrl = await getLongUrl(req.params.shortname);
        if(!longUrl) {
            return res.status(400).json({error: "URL Not Found"});
        };

        return res.status(200).json({message: "SuccessGettingURL", data: longUrl});
    } catch (error) {
        return serverError(error, res);
    }
});


export const publicRouter = router;