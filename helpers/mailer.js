
import nodemailer from "nodemailer";

// Send Email to user to Activate 
const sendActivationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.autoemail,
            pass: process.env.autoemailpass
        }
    });

    const mailOptions = {
        from: "vaasaviram@gmail.com",
        to: email,
        subject: `Activate Link for ${email} to Login`,
        html: `
        <h3>Activation Link</h3>
        <p>Click on the Below link / Copy and Pase it in your browser</p>
        <a href="http://localhost:5173/useractivation?activate=${token}">
            Click to Activate to login
        </a>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Activation Link Email Sent Successfully");
        return true;
    } catch (error) {
        console.log("Activation Link Email Sending Failed");
        return false;
    }
}

// Send User reset Pwd link to email
const resetPasswordEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.autoemail,
            pass: process.env.autoemailpass
        }
    });

    const mailOptions = {
        from: "vaasaviram@gmail.com",
        to: email,
        subject: `Reset Link for ${email}`,
        html: `
        <h3>Reset Link</h3>
        <p>Click on the Below link / Copy and Pase it in your browser</p>
        <a href="http://localhost:5173/resetpasswordlink?auth=${token}">
            Click to ResetPassword
        </a>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Password Reset Email Sent Successfully");
        return true;
    } catch (error) {
        console.log("Sending Email Failed for Password Reset");
        return false;
    }

}

export { sendActivationEmail, resetPasswordEmail }