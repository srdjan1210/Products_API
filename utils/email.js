const nodemailer = require('nodemailer')

const sendEmail = async options => {
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "313c619c79c5d0",
            pass: "e65db229a63d5d"
        }
    });

    const mailOptions = {
        from: "Srdjan Stjepanovic <hello@srdjan.io>",
        to: options.to,
        subject: options.subject,
        text: options.message
    }
    await transport.sendMail(mailOptions);
}

module.exports = sendEmail;