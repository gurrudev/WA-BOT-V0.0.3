

////////////////////////////////////////////////////////
////////  This app is for testing  Templates    ////////
////////////////////////////////////////////////////////


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

    // parse application/x-www-form-urlencoded
    app.use(body_parser.urlencoded({ extended: false }))

const token = process.env.WHATSAPP_TOKEN;

// Sets server port and logs message on success
app.listen(process.env.PORT, () => console.log("🚀 App is running on port number:", process.env.PORT));

app.set("views", path.join(__dirname, "/views"));
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('welcome')
})

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // let entrypoint = body.entry;
    // console.dir(
    //     body,
    //    //entrypoint[0].changes[0].value.messages[0].interactive.button_reply.id,
    //   {
    //     depth: null,
    //   }
    // );

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (body.object) {
        if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0] &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            let data1; // The variable is for JSON format in the axios function
            let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
            
            let data =body.entry[0].changes[0].value.messages[0];
            let id="";
            if(Object.prototype.hasOwnProperty.call(data, "interactive"))
            {
                let data2=data.interactive;
                if(Object.prototype.hasOwnProperty.call(data2, "button_reply"))
                {
                    id= data2.button_reply.id;
                }
                if(Object.prototype.hasOwnProperty.call(data2, "list_reply"))
                {
                    id=  data2.list_reply.id;
                }
            }
            else
            {
                if(Object.prototype.hasOwnProperty.call(data, "text"))
                  {
                    id=data.text.body;
                  }
                  if(Object.prototype.hasOwnProperty.call(data, "image"))
                  {
                    id = data.image.id;
                  }

            }
           console.log(id);

            //console.log(phone_number_id )
            //console.log(req.body.messaging)

            if(id == "product_7"){
                console.log('list working')
            }
            else if(id.toLowerCase() == "hi"){
                console.log('text working')
            }else if(id == "btn_no" || id == "btn_yes"){
                console.log('button  working')
            }
            
        }
        res.sendStatus(200);
    } else {
        // Return a '404 Not Found' if event is not from a WhatsApp API
        res.sendStatus(404);
    }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests 
app.get("/webhook", async (req, res) => {

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

