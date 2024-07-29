import express from "express";
import { getShortUrlList, getShortUrlListCount, getShortUrlThisMonthCount, getShortUrlTodayCount } from "../controllers/admin.js";
import { serverError } from "../helpers/helper.js";

const router = express.Router();

//  Get OverAll Short Url List for Dashboard
router.get("/shorturllist", async(req, res) => {
    try {
        const shortUrlList = await getShortUrlList(req);
        if(shortUrlList.length <=0 ) {
            return res.status(400).json({error: "No Data Found"});
        };

        return res.status(200).json({message: "SuccessGetting ShortUrlList", data: shortUrlList});
    } catch (error) {
        return serverError(error, res);
    }
});

// Getting ShortUrls Count Overall for Today, ThisMonth, Total
router.get("/dashboard", async(req, res) => {
    try {
        const shortUrlListCount = await getShortUrlListCount(req);
        const shortUrlTodayCount = await getShortUrlTodayCount(req);
        const shortUrlThisMonthCount = await getShortUrlThisMonthCount(req);
        return res.status(200).json({message: "SuccessGetting TotalCount", shortUrlCount: {shortUrlListCount, shortUrlTodayCount, shortUrlThisMonthCount} });
    } catch (error) {
        return serverError(error, res);
    }
});


export const adminRouter = router;