
/////////////////////////////////////////////////
////////  This app is main APP v0.0.1    ////////
/////////////////////////////////////////////////



"use strict";

const { render } = require('ejs');
const path = require('path');
// Imports dependencies and set up http server
require('dotenv').config()
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios"),
  
  
  app = express().use(body_parser.json()); // creates express http server

  
const token = process.env.WHATSAPP_TOKEN;
// Sets server port and logs message on success
app.listen(process.env.PORT, () => console.log("🚀 App is running on port number:", process.env.PORT));

app.set("views", path.join(__dirname, "/views"));
app.set('view engine', 'ejs');

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

app.get('/', (req, res) =>{
  res.render('welcome')
})

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  
  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let data; // The variable is for JSON format in the axios function
      let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

    
      if (msg_body.toLowerCase() == "👋"|| msg_body.toLowerCase() == "✋"|| msg_body.toLowerCase() == "hi" || msg_body.toLowerCase() == "hello"|| msg_body.toLowerCase() == "hey"){
        msg_body = "*Hi there! I am your virtual asistant \n\nI can do following please type correct keyword.\n\n*Balance* - To know your account balance\n*Portfolio* - To know your holdings\n*Orders* - To know about your orders\n*Contact* - Contact with our customer care\n*Document* - To get your document\n*Help* - To get additional help"
        data = {
          messaging_product: "whatsapp",
          to: from,
          text: { 
            body: msg_body
          }
        }
      }else if (msg_body.toLowerCase() == "balance"){
        msg_body = "Dear, {i} your account balance is {i}"
        data = {
          messaging_product: "whatsapp",
          to: from,
          text: { 
            body: msg_body
          }
        }
      }else if (msg_body.toLowerCase() == "document"){
        let msg = "Please find attached document\n"
        msg_body = msg + "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        data = {
          messaging_product: "whatsapp",
          to: from,
          text: { 
            body: msg_body
          }
        }
      }else if (msg_body.toLowerCase() == "portfolio" ){
        msg_body = "This is For portfolio\n\n{i}\n{i}\n{i}\n{i}"
        data = {
          messaging_product: "whatsapp",
          to: from,
          text: { 
            body: msg_body
          }
        }
      }else if (msg_body.toLowerCase() == "orders"){
        msg_body = "This is For orders\n\n{i}\n{i}\n{i}\n{i}"
        data = {
          messaging_product: "whatsapp",
          to: from,
          text: { 
            body: msg_body
          }
        }
      }else if (msg_body.toLowerCase() == "contact"){
        msg_body = "Contact with our customer care{i}"
        data = {
          messaging_product: "whatsapp",
          to: from,
          text: { 
            body: msg_body
          }
        }
      }else if (msg_body.toLowerCase() == "help"){
        msg_body = "For more information visit our website: https://nwww.example.com"
        data = {
          messaging_product: "whatsapp",
          to: from,
          text: { 
            body: msg_body
          }
        }
      }else if (msg_body.toLowerCase() == "thank You"){
        msg_body = "You are most welcome!, please let me know if you want any help"
        data = {
          messaging_product: "whatsapp",
          to: from,
          text: { 
            body: msg_body
          }
        }
      }else{
        msg_body = "Sorry, I didn't get what you have said. Please type correct keyword\n\n*Balance* - To know your account balance\n*Portfolio* - To know your holdings\n*Orders* - To know about your orders\n*Contact* - Contact with our customer care\n*Help* - To get additional help"
        data = {
          messaging_product: "whatsapp",
          to: from,
          text: { 
            body: msg_body
          }
        }
      }

      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data,
        headers: { "Content-Type": "application/json" },
      });
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests 
app.get("/webhook", async(req, res) => {
  
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
  **/

  //res.render('webhook')
  console.log("web listening..")
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }//else{
    // Responds with '403 Forbidden' if verify tokens do not match
  //   res.sendStatus(403);
  // }
});

