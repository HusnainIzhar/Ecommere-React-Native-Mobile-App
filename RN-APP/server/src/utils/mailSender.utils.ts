import nodemailer, { Transporter } from 'nodemailer';
import ejs from "ejs";
import path from "path";
import { EmailOptions } from '../interfaces/mail.interface';
require("dotenv").config();

const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

// send email
export const sendEmail = async (options: EmailOptions): Promise<void> => {
    const { email, subject, template, data } = options;

    // get the path to email template
    const templatePath = path.join(__dirname, "../views/mail-templates/", template);

    //render the template
    const html: string = await ejs.renderFile(templatePath, data);
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: subject,
        html
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully");
      } catch (error) {
        console.error("Error sending mail:", error);
      }
      
};
