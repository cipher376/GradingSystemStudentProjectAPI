"use strict";
const nodemailer = require("nodemailer");
export interface EmailMessage {
  from: string;
  to: string; //"bar@example.com, baz@example.com"
  subject: string;
  text: string;
  html: string;
}

export class MyMailer {

  transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      // name: "Kejettia.com",
      port: 587,
      // port: 465,
      // transactionLog: true,
      debug: true,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'kejettiaofficial@gmail.com', // generated ethereal user
        pass: 'GreAT4#us', // generated ethereal password
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });
  }

  async sendMail(email: EmailMessage) {
    try {
      this.transporter.sendMail(email)?.then((info: any) => {
        console.log(info);
      }).catch((e: any) => {
        console.log(e)
      })
    } catch (error) {
      console.log(error);
    }

  }

}
