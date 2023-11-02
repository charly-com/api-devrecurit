import nodemailer from "nodemailer";

 const transporter = nodemailer.createTransport({
   
    service: 'Gmail',
    auth: {
      user: 'devcharles40@gmail.com',
      pass: 'pnfusfxdhutwsiko',
    },
  });

  export default transporter;