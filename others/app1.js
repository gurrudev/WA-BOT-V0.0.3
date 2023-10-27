
///////////////////////////////////////////////////////////////////
////////  This app is for sending Interactive Templates    ////////
///////////////////////////////////////////////////////////////////


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

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('welcome')
})

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
    // Parse the request body from the POST
    //let body = req.body;

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

            
            if (msg_body.toLowerCase() == "hi") {
                msg_body = "*Hi there! I am your virtual asistant \n\nI can do following please type correct keyword.\n\n*Balance* - To know your account balance\n*Portfolio* - To know your holdings\n*Orders* - To know about your orders\n*Contact* - Contact with our customer care\n*Document* - To get your document\n*Help* - To get additional help"
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
            }


            if (msg_body.toLowerCase() == "list") {
                //msg_body = "*Hi there! I am your virtual asistant from * \n\nI can do following please type correct keyword.\n\n*Balance* - To know your account balance\n*Portfolio* - To know your holdings\n*Orders* - To know about your orders\n*Contact* - Contact with our customer care\n*Document* - To get your document\n*Help* - To get additional help"
                data = {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: from,
                    type: "interactive",
                    interactive: {
                        type: "list",
                        header: {
                            type: "text",
                            text: "This Is Header"
                        },
                        body: {
                            text: "Body Content"
                        },
                        footer: {
                            text: "footer content"
                        },
                        action: {
                            button: "List",
                            sections: [
                                {
                                    title: "Section 1",
                                    rows: [
                                        {
                                            id: "btn-1",
                                            title: "Title Content 1",
                                            description: "row-description-content 1"
                                        }
                                    ]
                                },
                                {
                                    title: "Section 2",
                                    rows: [
                                        {
                                            id: "btn-2",
                                            title: "Title Content 2",
                                            description: "row-description-content 2"
                                        }
                                    ]
                                }
                            ]
                        }
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

