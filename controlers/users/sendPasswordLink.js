const UserModel = require("../../models/UserModel");
const nodemailer = require("nodemailer")

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SUPPORT_MAIL,
        pass: process.env.SUPPORT_MAIL_PASSWORD
    }
});


//sending  a single mail





// sending multiple mail
// var mailOptions = {
//     from: 'youremail@gmail.com',
//     to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   }

module.exports = async function (req, res) {
    const value = req.query.value

    const data = await UserModel.findOne().or([{ username: value }, { email: value }])

    if (data) {
        var mailOptions = {
            from: process.env.SUPPORT_MAIL,
            to: data.email,
            subject: 'Password Reset',
            // text: 'You requested a password reset?',
            html: '<h1>Welcome</h1><p>That was easy!</p><a href="fixlancer.com" style="color:red;"> Visit</a>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json(data)
            }
        });

    } else {
        return res.status(401).json({
            error: "not found"
        })
    }





}