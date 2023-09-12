const { sendEmailViaSendgrid } = require("../third-party/sendgrid");

exports.sendEmail = (email, subject, message) => {
    try {
        console.log("sending mail to client")
        sendEmailViaSendgrid(email, subject, message);
    } catch (error) {
        console.log(error.message);
    }

}