////////////////////////////////////////////////////////////
////////  This app is for testing Main Templates    ////////
////////////////////////////////////////////////////////////

"use strict";

const { render } = require('ejs');
const { response } = require('express');
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

    // Check the Incoming webhook message
    console.log(JSON.stringify(body, null, 2));

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (body.object) {
        if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0] &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            let data;       // The variable is for JSON format in the axios function
            let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id; // extract the phone_number_id from the webhook payload
            let from = body.entry[0].changes[0].value.messages[0].from;     // extract the phone number from the webhook payload
            let msg_id = body.entry[0].changes[0].value.messages[0].id;     // extract the message_id from the webhook payload
            let participents_wa_id = body.entry[0].changes[0].value.contacts[0].wa_id;      // extract the Users_wa_id from the webhook payload
            let participents_profile_name = body.entry[0].changes[0].value.contacts[0].profile.name;        // extract the Profine_Name from the webhook payload
            let data_msg = body.entry[0].changes[0].value.messages[0];      // extract the whole_message_payload from the webhook payload
            let id = ""
            let msg_payload = id;
            let msg_body = "";

            var latitude = id;
            var longitude = id;

            let msg_data_contacts_first_name = body.entry[0].changes[0].value.messages[0].contacts[0].name.first_name;
            let details_data_contact;
            //console.log(msg_data_contacts)

            // let received_contact_name;
            let received_contact_phone_no;
            let received_contact_wa_id;

            if (Object.prototype.hasOwnProperty.call(data_msg, "interactive")) {
                let data_interactive = data_msg.interactive;
                if (Object.prototype.hasOwnProperty.call(data_interactive, "button_reply")) {
                    msg_payload = data_interactive.button_reply.id;
                }
                if (Object.prototype.hasOwnProperty.call(data_interactive, "list_reply")) {
                    msg_payload = data_interactive.list_reply.id;
                }

            }
            if (Object.prototype.hasOwnProperty.call(data_msg, "contacts")) {
                details_data_contact = data_msg.contacts[0];
                // received_contact_name = data_msg.contacts.name.first_name
                if (Object.prototype.hasOwnProperty.call(details_data_contact, "phones")) {
                    msg_payload = details_data_contact;

                    received_contact_phone_no = details_data_contact.phones[0].phone;
                    received_contact_wa_id = details_data_contact.phones[0].wa_id;
                }
            }
            else {
                if (Object.prototype.hasOwnProperty.call(data_msg, "text")) {
                    msg_payload = data_msg.text.body;
                }
                if (Object.prototype.hasOwnProperty.call(data_msg, "button")) {
                    msg_payload = data_msg.button.payload;
                }
                if (Object.prototype.hasOwnProperty.call(data_msg, "image")) {
                    let image = data_msg.image.mime_type;
                    let algo = data_msg.image.sha256;
                    let id = data_msg.image.id

                    msg_payload = image
                }
                if (Object.prototype.hasOwnProperty.call(data_msg, "reaction")) {

                    //msg_payload = data_msg.reaction.emoji;  //This variable is to extract the emoji which is reacted by the user
                }
                if (Object.prototype.hasOwnProperty.call(data_msg, "location")) {

                    msg_payload = data_msg.location;

                    latitude = data_msg.location.latitude;
                    longitude = data_msg.location.longitude;

                }

            }



            //console.log(msg_payload);  

            let emojiArray = [" mn", "mnb "];  //}----\\\\    these two variables are used to block the response of reaction made by user on the messages
            let emo = emojiArray;              //}----////    otherwise else part will be activated


            // if (msg_payload.toLowerCase() == "hi") {

            //     let ammount = 5432009.89;

            //     msg_body = `Your account balance is: *₹${ammount} /-*`;

            //     data = {
            //         messaging_product: "whatsapp",
            //         to: from,
            //         text: {
            //             body: msg_body,
            //         }
            //     }

            // } 

            if (msg_payload == data_msg.location) {

                msg_body = `Thanks for sharing your location \n\nlatitude:${latitude}\nlongitude:${longitude}`;

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body,
                    }
                }

            }

            else if (msg_payload == details_data_contact) {

                msg_body = `*contact recieved* \n\nName: *${msg_data_contacts_first_name}*\nPhone: *${received_contact_phone_no}*`;

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body,
                    }
                }

            }

            else if (msg_payload == "image/jpeg") {

                msg_body = "Thanks For sharing the image";
                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body
                    }
                }
            }

            else {
                msg_body = "*Sorry I did not get what you have said!* \n\nI can do following please type correct keyword.\n\n*Balance* - To know your account balance\n*Portfolio* - To know your holdings\n*Orders* - To know about your orders\n*Document* - To get your document\n*Contact* - Contact with our customer care\n*Location* - To get our office location\n*Help* - To get additional help"
                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body
                    }
                }
            }


            //////////////////////////////////////////
            ///////////   Axios:  To respond   ///////
            //////////////////////////////////////////

            axios({
                // This first axios function is for read reciepts --- if blue ticks then goes to the second axios 

                method: "POST", // Required, HTTP method, a string, e.g. POST, GET
                url:
                    "https://graph.facebook.com/v15.0/" +
                    phone_number_id +
                    "/messages/?access_token=" +
                    token,
                data: {
                    messaging_product: "whatsapp",
                    message_id: msg_id,
                    status: "read"
                },
                headers: { "Content-Type": "application/json" },
            }).then(response => {
                console.log(response.data)

                // this axios is to responding the user's message 
                axios({
                    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
                    url:
                        "https://graph.facebook.com/v15.0/" +
                        phone_number_id +
                        "/messages/?access_token=" +
                        token,
                    data,
                    headers: { "Content-Type": "application/json" },
                }).then(response => {
                    console.log('Reply message sent:', response.data);
                })
                    .catch(error => {
                        console.log('Error sending reply message:', error.response.data);
                    });
            }).catch(error => {
                console.log('Error marking message as read:', error.response.data);
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

    //  UPDATE VERIFY TOKEN
    //  This will be the Verify Token value when you set up webhook

    // res.render('webhook')
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
    }
});

// Sets server port and logs message on success
app.listen(process.env.PORT, () => {
    console.log("🚀 App is running on port number:", process.env.PORT)
});