/**
 * Created by kingson on 2019/9/3.
 */

const nodemailer = require('nodemailer');


//let Service = "163";
//let SenderAddress = "kingson_cai@163.com";
//let AuthCode = "authcode1";

let Service = "qq";
let SenderAddress = "caijinsheng@foxmail.com";
let AuthCode = "bbqydjodkosubdfg";

let send = async function(email, verifyUrl) {
    let transporter = nodemailer.createTransport({
        //host: 'smtp.ethereal.email',
        service: Service,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: SenderAddress,
            pass: AuthCode
        }
    });

// send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"投票系统"<${SenderAddress}>`, // sender address
        to: email + ',' + SenderAddress, // list of receivers
        subject: '投票系统-邮箱验证', // Subject line
        text: '', // plain text body
        html: `<html><b>请点击连接,进行验证 : <a href="${verifyUrl}">${verifyUrl}</a></b></html>` // html body
    });

    console.log('Message sent: %s', info.messageId);
// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

// Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};


exports.send = send;


// for test
//send('kingsonCai@163.com', `http://localhost:3000/vote/verify/2`);