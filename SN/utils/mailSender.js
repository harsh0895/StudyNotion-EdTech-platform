const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    try {
        
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
                user: 'harshbhola7404888499@gmail.com',
                pass: 'bzqytyfufghdisqx',
            }
        })

        // send mail
        let info = await transporter.sendMail({
            from: "StudyNotion || CodeHelp - by Harsh",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        console.log("information: ",info)
        return info;

    } catch (error) {
        console.log("error in mail sender: ",error);
    }
}

module.exports = mailSender