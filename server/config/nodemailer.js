import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "83456b004@smtp-brevo.com",
    pass: "tLIBOs7Jq6ZwEShz",
  },
});

export default async function sendMail({ email, subject, text, html }) {
  let mailOptions = {
    from: {
      address: process.env.STMP_EMAIL,
      name: "Medo Dev",
    },
    to: email,
    subject,
    text,
    html,
  };
  await transporter.sendMail(mailOptions, (err, info) => {
    if (info) console.log("info", info);
    if (err) console.log("error", err);
  });
}
