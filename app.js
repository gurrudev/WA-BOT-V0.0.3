////////////////////////////////////////////////////////////
////////  This app is for testing Main Templates    ////////
////////////////////////////////////////////////////////////

"use strict";

const { render } = require('ejs');
const { response } = require('express');
const path = require('path');
// Imports dependencies and set up http server
require('dotenv').config();
const request = require("request"),
    express = require("express"),
    body_parser = require("body-parser"),
    axios = require("axios"),

    app = express().use(body_parser.json()); // creates express http server

// parse application/x-www-form-urlencoded
app.use(body_parser.urlencoded({ extended: false }))

const token = process.env.WHATSAPP_TOKEN;

const call = require('./db/dbcalling')

app.set("views", path.join(__dirname, "/views"));
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('welcome')
})

// Accepts POST requests at /webhook endpoint
app.post("/webhook", async (req, res) => {
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
            let data_msg = body.entry[0].changes[0].value.messages[0];  // extract the whole_message_payload from the webhook payload
            let id = ""
            let msg_payload = id;
            let msg_body = "";


            if (Object.prototype.hasOwnProperty.call(data_msg, "interactive")) {
                let data_interactive = data_msg.interactive;
                if (Object.prototype.hasOwnProperty.call(data_interactive, "button_reply")) {
                    msg_payload = data_interactive.button_reply.id;
                }
                if (Object.prototype.hasOwnProperty.call(data_interactive, "list_reply")) {
                    msg_payload = data_interactive.list_reply.id;
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

                    //msg_payload = data_msg.reaction.emoji;  // This variable is to extract the emoji which is reacted by the user
                }

            }

            ///////////////////////////////// Random OTP Generator start ///////////////////////////////////////////////////////

            function generateOTP() {

                // Declare a digits variable 
                // which stores all digits
                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 6; i++) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }
                return OTP;
            }

            //console.log("OTP of 6 digits: ")
            //console.log(generateOTP());

            //////////////////////////////////////// Random OTP Generator end //////////////////////////////////////////////////

            //console.log(msg_payload);  

            let emojiArray = ["mn", "mnb "];  //}----\\\\    these two variables are used to block the response of reaction made by user on the messages
            let emo = emojiArray;             //}----////    otherwise else part will be activated


            if (msg_payload.toLowerCase() == "hi" || msg_payload.toLowerCase() == "hello" || msg_payload.toLowerCase() == "hey" || msg_payload.toLowerCase() == "hala" || msg_payload.toLowerCase() == "hola" || msg_payload.toLowerCase() == "heyy" || msg_payload.toLowerCase() == "hiii" || msg_payload.toLowerCase() == "hii" || msg_payload.toLowerCase() == "he") {

                msg_body = `*Hi ${participents_profile_name}!*👋 \n\*I am your virtual asistant * \n\nI can do following please type correct keyword.\n\n*Balance* - To know your account balance\n*Portfolio* - To know your holdings\n*Orders* - To know about your orders\n*Document* - To get your document\n*Contact* - Contact with our customer care\n*Location* - To get our office location\n*Help* - To get additional help`;

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body,
                    }
                }

            }

            else if (msg_payload.toLowerCase() == "otp") {

                //let otp = 543200;


                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    recipient_type: "individual",
                    type: "template",
                    template: {
                        name: "otp_for_user",
                        language: {
                            code: "en",
                            policy: "deterministic"
                        },
                        components: [
                            {
                                type: "body",
                                parameters: [
                                    {
                                        type: "text",
                                        text: `*${generateOTP()}*`
                                    }
                                ]
                            },
                            {
                                type: "button",
                                sub_type: "quick_reply",
                                index: 0,
                                parameters: [
                                    {
                                        type: "payload",
                                        payload: "btn_resend_otp"
                                    }
                                ]
                            }
                        ]
                    }
                }

            } else if (msg_payload == "btn_resend_otp") {

                //let re_otp = 123474;

                msg_body = `Your new OTP is: _*${generateOTP()}*_`;

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body,
                    }
                }

            }
            else if (msg_payload.toLowerCase() == "thank you" || msg_payload.toLowerCase() == "thanks" || msg_payload.toLowerCase() == "ty" || msg_payload.toLowerCase() == "thank you❤️" || msg_payload.toLowerCase() == "thank") {

                msg_body = `You are most welcome! 😊`;

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body,
                    }
                }

            } 
            // else if (msg_payload.toLowerCase() == "balance") {

            //     //Calling the getLedger() method from dbcalling.js file
            //     let balance = await call.getLedger().then((ledgerBalance) => {
            //         return ledgerBalance
            //     })

            //     let user = 'user'

            //     if (user === 'user') {
            //         msg_body = `${balance}`;
            //     } else {
            //         msg_body = 'Sorry you are not the authorized user, please try again later'
            //     }

            //     data = {
            //         messaging_product: "whatsapp",
            //         to: from,
            //         text: {
            //             body: msg_body,
            //         }
            //     }

            // } 
            else if (msg_payload.toLowerCase() == "orders") {

                msg_body = `*Woohoo*🎉 \n\nYour order *[Order No.]* of *[Product name]* for *[Amount]* has been confirmed & will be added to your portfolio \n\n*Want to add more products to your portfolio?*`;
                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "interactive",
                    interactive: {
                        type: "button",
                        body: {
                            text: msg_body
                        },
                        // footer: {
                        //     text: "Some Text"
                        // },
                        action: {
                            buttons: [
                                {
                                    type: "reply",
                                    reply: {
                                        id: "btn_order_yes",
                                        title: "Yes"
                                    }
                                },
                                {
                                    type: "reply",
                                    reply: {
                                        id: "btn_order_no",
                                        title: "No"
                                    }
                                },
                            ]
                        }
                    }
                }

            } else if (msg_payload == "btn_order_yes") {
                msg_body = "Market data of the top gainers on the BSE and NSE or across sectoral indices. Track the day’s highs and lows."

                data = {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: from,
                    type: "interactive",
                    interactive: {
                        type: "list",
                        header: {
                            type: "text",
                            text: "Top Gainers - BSE200 🔝📈"
                        },
                        body: {
                            text: msg_body
                        },
                        footer: {
                            text: "As on 02 Mar, 2023, 03:39 PM"
                        },
                        action: {
                            button: "Order",
                            sections: [
                                {
                                    title: "Stocks",
                                    rows: [
                                        {
                                            id: "btn_stocks_1",
                                            title: "Adani Transmission",
                                            description: "₹708.35"
                                        },
                                        {
                                            id: "btn_stocks_2",
                                            title: "Ambuja Cement",
                                            description: "₹368.95"
                                        },
                                        {
                                            id: "btn_stocks_3",
                                            title: "NBCC (India)",
                                            description: "₹35.82"
                                        },
                                        {
                                            id: "btn_stocks_4",
                                            title: "BHEL",
                                            description: "₹74.75"
                                        },
                                        {
                                            id: "btn_stocks_5",
                                            title: "Bank Of India",
                                            description: "₹75.60"
                                        },

                                    ]
                                }
                            ]
                        }
                    }
                }

            } else if (msg_payload == "btn_stocks_1") {
                msg_body = "Your order for *Adani Transmission* has been placed"

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body
                    }
                }

            } else if (msg_payload == "btn_stocks_2") {
                msg_body = "Your order for *Ambuja Cement* has been placed"

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body
                    }
                }

            } else if (msg_payload == "btn_stocks_3") {
                msg_body = "Your order for *NBCC (India)* has been placed"

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body
                    }
                }

            } else if (msg_payload == "btn_stocks_4") {
                msg_body = "Your order for *BHEL* has been placed"

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body
                    }
                }

            } else if (msg_payload == "btn_stocks_5") {
                msg_body = "Your order for *Bank Of India* has been placed"

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body
                    }
                }

            } else if (msg_payload == "btn_order_no") {
                msg_body = "Thank you for using our service"

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body
                    }
                }

            } else if (msg_payload.toLowerCase() == "portfolio") {

                msg_body = `portfolio`;

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body,
                    }
                }

            } else if (msg_payload.toLowerCase() == "contact") {

                // msg_body = `contact`;

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "contacts",
                    contacts: [
                        {
                            addresses: [
                                {
                                    city: "Mumbai",
                                    country: "India",
                                    country_code: "in",
                                    state: "Maharastra",
                                    street: " 408, 'L' Wing, Narayan Plaza, Chandivali, Saki Naka , Andheri East",
                                    type: "WORK",
                                    zip: "400072"
                                }

                            ],
                            emails: [
                                {
                                    email: "test@whatsapp.com",
                                    type: "WORK"
                                }
                            ],
                            name: {
                                first_name: "John",
                                formatted_name: "John Smith",
                                last_name: "Smith"
                            },
                            org: {
                                company: "WhatsApp",
                                department: "Design",
                                title: "Manager"
                            },
                            phones: [
                                {
                                    phone: "+1 (650) 555-1234",
                                    type: "WORK",
                                    wa_id: "16505551234"
                                }
                            ],
                            urls: [
                                {
                                    url: "https://myg.com/",
                                    type: "WORK"
                                }
                            ]
                        }
                    ]
                }

            } else if (msg_payload.toLowerCase() == "location") {

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "location",
                    location: {
                        longitude: -122.425332,
                        latitude: 37.758056,
                        name: "Name",
                        address: "408, 'L' Wing, Narayan Plaza, Chandivali, Saki Naka, Andheri East, Mumbai - 400072."
                    }
                }

            } else if (msg_payload.toLowerCase() == "document") {

                msg_body = `Your Banks & Financial Institutions can send month-end bank account statements to users on WhatsApp without any worries with its *end-to-end* encryption guarantee.\n\nHere's a sample WhatsApp message template for the _*Month-end*_ Bank statement.`;

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "document",
                    document: {
                        link: "https://www.tutorialspoint.com/sql/sql_tutorial.pdf",
                        caption: msg_body
                    }
                }

            } else if (msg_payload.toLowerCase() == "help") {

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    recipient_type: "individual",
                    type: "template",
                    template: {
                        name: "help",
                        language: {
                            code: "en_US",
                            policy: "deterministic"
                        },
                        components: [
                            {
                                type: "header",
                                parameters: [{
                                    type: "image",
                                    image: {
                                        link: "https://www.learnatrise.in/wp-content/uploads/2019/07/technology-framework-of-today.png"
                                    }
                                }]
                            },
                            {
                                type: "button",
                                index: "0",
                                sub_type: "url",
                                parameters: [
                                    {
                                        type: "text",
                                        text: "/"
                                    }
                                ]
                            }
                        ]
                    }
                }

            } else if (msg_payload == emojiArray.includes(emo)) {

                /**
                        // just to block emoji and all other responses from user. 
                        // for example:- if user delete's message for everyone cloud api takes it as response 
                */

                // msg_body = emo;
                // data = {
                //     messaging_product: "whatsapp",
                //     to: from,
                //     text: {
                //         body: msg_body
                //     }
                // }

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

            } else if (msg_payload.toLowerCase() == "bye" || msg_payload.toLowerCase() == "byee" || msg_payload.toLowerCase() == "bye!" || msg_payload.toLowerCase() == "byeee" || msg_payload.toLowerCase() == "by") {

                msg_body = `Bye! have a nice day 😊 `;

                data = {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body,
                    }
                }

            } else {

                const client_code = "GE0005";

                try {
                    let new_text = msg_payload.toUpperCase();
                    let keyword = await call.proc_GetDetailData_whatsAPP(msg_payload, client_code).then((keyword) => {
                        return keyword[0];
                    });
                    console.log(keyword[new_text]);
                    if (keyword[new_text] != undefined) {
                        const str2 = msg_payload.charAt(0).toUpperCase() + msg_payload.slice(1);
                        msg_body = `Your ${str2} is: *₹${keyword[new_text]}*`
                    }
                    else {
                        msg_body = '*Sorry I did not get what you have said!* \n\nI can do following please type correct keyword.\n\n*Balance* - To know your account balance\n*Portfolio* - To know your holdings\n*Orders* - To know about your orders\n*Document* - To get your document\n*Contact* - Contact with our customer care\n*Location* - To get our office location\n*Help* - To get additional help'
                    }
                } catch (err) {
                    console.log(err)
                }

                //msg_body = "*Sorry I did not get what you have said!* \n\nI can do following please type correct keyword.\n\n*Balance* - To know your account balance\n*Portfolio* - To know your holdings\n*Orders* - To know about your orders\n*Document* - To get your document\n*Contact* - Contact with our customer care\n*Location* - To get our office location\n*Help* - To get additional help"
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

                url: "https://graph.facebook.com/v15.0/" + phone_number_id + "/messages/?access_token=" + token,

                data: {
                    messaging_product: "whatsapp",
                    message_id: msg_id,
                    status: "read"
                },
                headers: { "Content-Type": "application/json" },
            }).then(response => {
                console.log(response.data)

                // this axios is to respond the user's message 
                axios({
                    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
                    url: "https://graph.facebook.com/v15.0/" + phone_number_id + "/messages/?access_token=" + token,
                    data,
                    headers: { "Content-Type": "application/json" },
                }).then(response => {
                    console.log('Reply message sent:\n', response.data);
                }).catch(error => {
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

const PORT = process.env.PORT;

// Sets server port and logs message on success
app.listen(PORT, () => {
    console.log("🚀 App is running on port number:", PORT)
});