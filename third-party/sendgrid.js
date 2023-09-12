const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const from = process.env.FROM_USER;

exports.sendEmailViaSendgrid = (to, subject, message) => {

    const msg = {
        to: to,
        from: from,
        subject: subject,
        text: message
    }

    sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}

