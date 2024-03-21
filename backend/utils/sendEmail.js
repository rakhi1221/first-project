const nodeMailer =require("nodemailer");

const sendEmail=async(options)=>{
    const transporter =nodeMailer.createTransport({
        host:process.env.SMPT_HOST,
        secure:true,
        port:process.env.SMPT_PORT,
        auth:{
            //IF THE EMAIL gets expired or blocked we can use any other email
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD,
        },
    });
    const mailOptions={
        //JHA SE MAIL AYA
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,

    };
    //isse mail chli jayegi
   await transporter.sendMail(mailOptions);

};
module.exports=sendEmail;


