require("dotenv").config();
console.log(process.env.DBUSER);

exports.config = {
    mongoUser: process.env.DBUSER,
    mongoPass: process.env.DBPASSWORD,
    tokenSecret: process.env.TOKEN
}