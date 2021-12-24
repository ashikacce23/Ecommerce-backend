
const nodeMailer = require("nodemailer");

const sendEmail = async(options)=>{
    const transporter = nodeMailer.createTransport({
        //gmail jeno pb na kore sejonno host & port add korte hobe.
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        //Then egula
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD,
        }
    });
    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message, 
    };

    await transporter.sendMail(mailOptions)
};

module.exports = sendEmail;







