import { SHORTURL } from "../models/shorturl.js";
import { USER } from "../models/user.js";

// Getting userdata by Id
function getUserById(userId) {
    return USER.findOne({_id: userId});
};

// Getting userdata by email
function getUserByEmail(req) {
    return USER.findOne({email: req.body.email});
};

// Create New User
function createNewUser(req, hashPass, activateHashKey) {
    return new USER({
        ...req.body,
        password: hashPass,
        activateHash: activateHashKey
    }).save();
};

// Finding User by activateKey
function getUserByActivateHash(activateHashKey) {
    return USER.findOne(
        { activateHash: activateHashKey }
    );
};

// Activating User by activate Key when clicked from Mail.
function userActivation(activateHashKey) {
    return USER.updateOne(
        { activateHash: activateHashKey },
        { isActive: true, activateHash: "Activated" }
    );
}


// Adding Reset Hash Key in User document
function addUserPwdResetHash(req, pwdResetHash) {
    return USER.updateOne(
        { email: req.body.email },
        { resetPassword: pwdResetHash }
    )
};

// Get User Data based on Pwd Reset Hash
function getUserByPwdResetHash(resetPasswordHash) {
    return USER.findOne({resetPassword: resetPasswordHash});
};

// Update New Password based on resethash and empty resethash
function updateNewPwd(resetHashAuth, hashPass) {
    return USER.updateOne(
        { resetPassword: resetHashAuth },
        {
            password: hashPass,
            resetPassword: ""
        }
    )
};

// Find shortname in the existing database
function getShortUrl(req) {
    return SHORTURL.findOne({shortname: req.params.shortname})
};

// Create New Short URL
function createNewShortUrl(req, currentDate) {
    console.log(req.body, req.user._id, currentDate)
    return new SHORTURL({
        date: currentDate,
        userId: req.user._id,
        ...req.body,
    }).save()
};

// Get the ShortUrls based on Loggedin User
function getShortUrlList(req) {
    return SHORTURL.find({userId: req.user._id})
    .populate({
        path: "userId",
        select: "userName email isAdmin isActive"
    })
};

// Get Total URLs Count based on LoggedIn User
function getShortUrlListCount(req) {
    return SHORTURL.find({userId: req.user._id}).count()
};

// Get Today Created URLs Count based on LoggedIn User
function getShortUrlTodayCount(req) {
    const currentDate = new Date().toJSON().slice(0, 10)
    return SHORTURL.find({userId: req.user._id, date: {$eq: currentDate}}).count()
};

// Get This Month Created URLs Count based on LoggedIn User
function getShortUrlThisMonthCount(req) {
    const currentMonthYear = new Date().toJSON().slice(0, 7)
    return SHORTURL.find({
        userId: req.user._id, 
        date: {$gte: `${currentMonthYear}-01`, $lte: `${currentMonthYear}-31`}
    }).count()
};

export {
    getUserById,
    getUserByEmail,
    createNewUser,
    getUserByActivateHash,
    userActivation,
    addUserPwdResetHash,
    getUserByPwdResetHash,
    updateNewPwd,
    getShortUrl,
    createNewShortUrl,
    getShortUrlList,
    getShortUrlListCount,
    getShortUrlTodayCount,
    getShortUrlThisMonthCount
};