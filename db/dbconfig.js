const config = {
    user: 'username',
    password: "ashutosh@123" ,
    server:  '1**.**.100.21',
    database: "WA_DB",
    options: {
        encrypt: false, // For secure connection
        trustServerCertificate: true,
    },
};

module.exports.config = config;
