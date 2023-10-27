const config = {
    user: 'username',
    password: "ashutosh@123" ,
    server:  '172.16.100.79',
    database: "WA_DB",
    options: {
        encrypt: false, // For secure connection
        trustServerCertificate: true,
    },
};

module.exports.config = config;
