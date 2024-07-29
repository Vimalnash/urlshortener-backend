import express from "express";
import { serverError } from "../helpers/helper.js";
import bcrypt from "bcrypt";
import { generateToken } from "../helpers/auth.js";
import { resetPasswordEmail, sendActivationEmail } from "../helpers/mailer.js";
import { isUserAuthenticated } from "../middlewares/auth.js";
import { addUserPwdResetHash, 
    createNewShortUrl, 
    createNewUser, 
    getShortUrl, 
    getShortUrlList, 
    getShortUrlListCount, 
    getShortUrlThisMonthCount, 
    getShortUrlTodayCount, 
    getUserByActivateHash, 
    getUserByEmail, 
    getUserByPwdResetHash, 
    updateNewPwd, 
    userActivation 
} from "../controllers/user.js";

const router = express.Router();

// Create New User account
router.post("/signup", async (req, res) => {
    try {
        const isUserExists = await getUserByEmail(req);
        if(isUserExists) {
            return res.status(400).json({error: "User Already Exists"});
        };

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password, salt);

        const activateSalt = await bcrypt.genSalt(10);
        const activateHashKey = await bcrypt.hash(req.body.email, activateSalt);

        const userActivateEmail = await sendActivationEmail(req.body.email, activateHashKey);
        if(!userActivateEmail) {
            return res.status(400).json({error: "Mail Sending Failed, Try After Sometime"})
        };

        const createdUser = await createNewUser(req, hashPass, activateHashKey);
        
        return res.status(201).json( { message: "Check Email to Activate and Login", data: createdUser } );
    } catch (error) {
        return serverError(error, res);
    }
});

// User Activation when clicked link from the mail
router.put("/useractivationlink", async (req, res) => {
    try {
        const user = await getUserByActivateHash(req.query.activate);
        if (!user) {
            return res.status(400).json({message: "Already Activated, Try Login"});
        };

        const activatedRes = await userActivation(req.query.activate);
        if (activatedRes.modifiedCount != 1) {
            return res.status(400).json({error: "Not Activated, Try Again"});
        };

        return res.status(200).json({message: "Activation Successfull, Try Login"})

    } catch (error) {
        return serverError(error, res);
    }
});

// User Login Handling
router.post("/login", async (req, res) => {
    try {
        const userData = await getUserByEmail(req);

        if (!userData.isActive) {
            return res.status(400).json({error: "Activate from the link sent to mail or Try Signup"})
        };

        if(!userData) {
            return res.status(400).json({error: "Invalid Credentials"})
        };

        const userValidate = await bcrypt.compare(req.body.password, userData.password);

        if (!userValidate) {
            return res.status(400).json({error: "Invalid Credentials"});
        };

        const token = generateToken(userData._id);

        const { userName, email, isAdmin } = userData;

        return res.status(201).json({message: "LoggedIn Successfully", user: {userName, email, isAdmin}, token: token });
    } catch(error) {
        return serverError(error, res);
    }
});

// User give email to get reset link for forgot password
router.put("/forgotpassword", async (req, res) => {
    try {
        const isUserExists = await getUserByEmail(req);
        if (!isUserExists) {
            return res.status(400).json({error: "Invalid Credential"});
        };

        const salt = await bcrypt.genSalt(10);
        const pwdResetHash = await bcrypt.hash(req.body.email, salt);

        const addPwdResetHashRes = await addUserPwdResetHash(req, pwdResetHash);

        if( !addPwdResetHashRes ) {
            return res.status(400).json({error: "Error Occurred, Please Try after sometime"});
        };

        const isEmailSent = await resetPasswordEmail(isUserExists.email, pwdResetHash);
        if(!isEmailSent) {
            return res.status(400).json({error: "Mail Sending Failed, Try After Sometime"})
        };
        return res.status(200).json({message: "Check Email for ResetLink"})
    } catch (error) {
        return serverError(error, res);
    }
});

// Verify User when click reset link from the mail
router.get("/resetpassword/resetlinkverify", async (req, res) => {
    try {
        const isUserExists = await getUserByPwdResetHash(req.query.reset);
        if (!isUserExists) {
            return res.status(400).json({error: "Password Reset Link Expired"});
        };

        return res.status(200).json({message: "Proceed to NewPassword Page"})

    } catch (error) {
        return serverError(error, res);
    }
});

// User New Password Setting
router.put("/resetpassword/newpassword", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hassPass = await bcrypt.hash(req.body.password, salt);
        const updatedRes = await updateNewPwd(req.query.reset, hassPass);
        if (!updatedRes) {
            return res.status(400).json({error: "Update Failed, Try After Sometime"});
        };
        return res.status(200).json({message: "New Password Updated Successfully"})
    } catch (error) {
        return serverError(error, res);
    }
});

// Add shorturl and shortname for the longurl
router.post("/shortname/:shortname", isUserAuthenticated, async (req, res) => {
    try {
        const isAlreadyExists = await getShortUrl(req);
        if(isAlreadyExists) {
            return res.status(400).json({error: "ShortName Already Exists!"});
        };

        const currentDate = new Date().toJSON().slice(0, 10)

        const newShortUrlData = await createNewShortUrl(req, currentDate);
        if(!newShortUrlData) {
            return res.status(400).json({error: "Error Creation"});
        };
        
        return res.status(201).json({message: "Successfully Created", data: newShortUrlData});
    } catch (error) {
        return serverError(error, res);
    }
});

// Get Short Url List for the user
router.get("/shorturllist", isUserAuthenticated, async(req, res) => {
    try {
        const ShortUrlList = await getShortUrlList(req);
        if(ShortUrlList.length <=0 ) {
            return res.status(400).json({error: "No Data Found"});
        };

        return res.status(200).json({message: "SuccessGetting ShortUrlList", data: ShortUrlList});
    } catch (error) {
        return serverError(error, res);
    }
});

// Get short url listcounts for today, thismonth, total
router.get("/dashboard", isUserAuthenticated, async(req, res) => {
    try {
        const shortUrlListCount = await getShortUrlListCount(req);
        const shortUrlTodayCount = await getShortUrlTodayCount(req);
        const shortUrlThisMonthCount = await getShortUrlThisMonthCount(req);

        return res.status(200).json({message: "SuccessGetting TotalCount", shortUrlCount: {shortUrlListCount, shortUrlTodayCount, shortUrlThisMonthCount} });
    } catch (error) {
        return serverError(error, res);
    }
});

export const userRouter = router;
