const express = require("express");
const cors = require("cors")
const nodemailer = require("nodemailer");
const iparty = require("multiparty");
require("dotenv").config();

// create an express app
const app = express();

// cors
app.use(cors({ origin: "*" }));

app.use("/public", express.static(process.cwd() + "/public")); //make public static

// configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // replace with your email address
    pass: process.env.PASS, // replace with your password
  },
  port: 587,
  host: "smtp.gmail.com"
});

// verify connection configuration
// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  


// create a route to handle form submission
app.post("/send", (req, res) => {
  // create a new multiparty form
  let form = new iparty.Form();
  let data = {};

  // parse the form data
  form.parse(req, (err, fields) => {
    // check if fields is an object
    if (typeof fields === "object") {
      // convert the fields object to a regular object
      Object.keys(fields).forEach((property) => {
        data[property] = fields[property].toString();
      });

      // construct the email
      const mail = {
        sender: `${data.name} <${data.email}>`,
        to: "abiodunebun12@gmail.com", // replace with the recipient's email address
        subject: `${data.subject}`,
        text: `${data.name} <${data.email}> \n${data.message}`
      };

      // send the email
      transporter.sendMail(mail, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send("Something went wrong.");
        } else {
          console.log("Email sent sucessfully");
          res.status(200).send("Email successfully sent to recipient!");
        }
      });
    } else {
      // send an error if fields is not an object
      res.status(500).send("Error parsing form data.");
    }
  });
});


//Index page (static HTML)
app.route("/").get(function (req, res) {
    res.sendFile(process.cwd() + "/public/index.html");
  });

// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
