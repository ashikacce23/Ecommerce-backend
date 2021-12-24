const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

//uncoaught exception error handling
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandle promise rejection`);
    process.exit(1);
})

//config
dotenv.config({path:"backend/config/config.env"})
//database
connectDatabase();


// app.listen(process.env.PORT, ()=>{
//     console.log(`Server is running at http://localhost:${process.env.PORT}`);
// })
const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
})
//Unhandle promise rejection
process.on("unhandleRejection", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandle promise rejection`);
    server.close(()=>{
        process.exit(1);
    });
})
//jehetu amra ekhane DB error handling korsi,
//tai database.js e ".catch"- rakhae dorkar nai.


