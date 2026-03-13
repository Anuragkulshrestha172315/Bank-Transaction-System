const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log('Database connected successfully!');       
    })
    .catch(err=>{
        console.log("Error in Database",err);
        process.exit(1)
        
    })
}
module.exports = connectDB