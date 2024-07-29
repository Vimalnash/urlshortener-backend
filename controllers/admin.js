import { SHORTURL } from "../models/shorturl.js";

// Find ShortUrls List
function getShortUrlList(req) {
    return SHORTURL.find()
    .populate({
        path: "userId",
        select: "userName email isAdmin isActive"
    })
};

// Find ShortUrls Count
function getShortUrlListCount(req) {
    return SHORTURL.find().count();
};

// Find ShortUrls Count based on CurrentDate
function getShortUrlTodayCount(req) {
    const currentDate = new Date().toJSON().slice(0, 10);
    return SHORTURL.find({date: {$eq: currentDate}}).count();
};

// Find ShortUrls Count based on Current Month and Year
function getShortUrlThisMonthCount(req) {
    const currentMonthYear = new Date().toJSON().slice(2, 10);
    return SHORTURL.find({date: {$gte: `${currentMonthYear}-01`, $lte: `${currentMonthYear}-31`}}).count();
};

export {
    getShortUrlList,
    getShortUrlListCount,
    getShortUrlTodayCount,
    getShortUrlThisMonthCount
}