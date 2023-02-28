const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  mongoose.set('strictQuery', false);
  mongoose.connect(process.env.URLDB);
  console.log("Mongo Is Connected To Atlas Server");
}