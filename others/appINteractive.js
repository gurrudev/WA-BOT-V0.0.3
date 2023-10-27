

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
            let data; // The variable is for JSON format in the axios function
            let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
            
            let data_msg =body.entry[0].changes[0].value.messages[0];
            let id =""
            let msg_payload = id;
            let msg_body= "";

            if(Object.prototype.hasOwnProperty.call(data_msg, "interactive"))
            {
                let data_interactive=data_msg.interactive;
                if(Object.prototype.hasOwnProperty.call(data_interactive, "button_reply"))
                {
                    msg_payload= data_interactive.button_reply.id;
                }
                if(Object.prototype.hasOwnProperty.call(data_interactive, "list_reply"))
                {
                    msg_payload=  data_interactive.list_reply.id;
                }
            }
            else
            {
                if(Object.prototype.hasOwnProperty.call(data_msg, "text"))
                  {
                    msg_payload=data_msg.text.body;
                  }
                  if(Object.prototype.hasOwnProperty.call(data_msg, "image"))
                  {
                    msg_payload = data_msg.image.id;
                  }

            }

           //console.log(msg_payload);


            if(msg_payload == "product_7"){
                msg_body = "List is working....."
                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: { 
                        body: msg_body
                    }
                }
            }
            else if(msg_payload.toLowerCase() == "hi"){

                msg_body = "*Hi there! I am your virtual asistant from * \n\nI can do following please type correct keyword.\n\n*Balance* - To know your account balance\n*Portfolio* - To know your holdings\n*Orders* - To know about your orders\n*Contact* - Contact with our customer care\n*Document* - To get your document\n*Help* - To get additional help"
                data = {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: from,
                    type: "interactive",
                    interactive: {
                        type: "button",
                        body: {
                            text: msg_body
                        },
                        footer: {
                            text: "footer text"
                        },
                        action: {
                            buttons: [
                                {
                                    type: "reply",
                                    reply: {
                                        id: "btn_yes",
                                        title: "Yes"
                                    }
                                },
                                {
                                    type: "reply",
                                    reply: {
                                        id: "btn_no",
                                        title: "No"
                                    }
                                }
                            ]
                        }
                    }
                }

            }else if(msg_payload == "btn_no" || msg_payload == "btn_yes"){
                msg_body = "btn Working"
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
                    "https://graph.facebook.com/v15.0/" +
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

