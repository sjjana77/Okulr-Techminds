const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "techisetz08@gmail.com",
        pass: "ibmb wrqd ysni yyus"
    },
    port : 587,
    secure: false
});


async function sendmail(req, res) {
  try {
    // console.log(req.body);
    const {firstname, lastname, mobile, emailid, pdf, pdf_name, video_path} = req.body;
    const pdff = req.file;

    // console.log(pdf.path);21
    const mail_details= {
        from: "techisetz08@gmail.com",
        to: "sujaykolar@okulr.com",
        subject: "Task Completed - "+firstname,
        html: `First Name : ${firstname}<br>
        Last Name : ${lastname}<br>
        Mobile : ${mobile}<br>
        Email Id : ${emailid}<br>
        path : ${pdf}<br>
        `,
        
        attachments: [{ filename: pdf_name, path: pdf }, { filename: firstname+".webm", path: video_path }],
    }
    transporter.sendMail(mail_details, (err,info)=>{
        if(err){
            console.log(err);
            return res.status(500).json({message:err})
        } else {
          res.status(200).json("Email sent");
      }
  })
    // res.status(200).json("Email sent");
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
}

async function upload_pdf(req, res) {
  try {
    console.log(req.file);
    const pdff = req.pdf;
    // const rec_video = req.body.videoBlob;
    const upload = multer({
        dest: 'uploads/'
    })


    res.status(200).json("Mail Sent");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



module.exports = {
    sendmail, upload_pdf
};
