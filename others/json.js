
const data = {
    messaging_product: "whatsapp",
    to: "from",
    text: { 
        body: "msg_body" 
    }
  }

const universal_data = {
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      "phone_number_id" +
      "/messages?access_token=" +
      "token",
    data,
    headers: { "Content-Type": "application/json" },
  }


const universal_dataJSON = JSON.stringify(universal_data);
console.log(universal_dataJSON)
