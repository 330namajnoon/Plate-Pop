const http = require("http");
const express = require("express");
const path = require("path");
const port = process.env.PORT || 4000;
const pdp = path.join(__dirname,"./public");
const app = express();
const multer = require("multer");
const fs = require("fs");
app.use(express.static(pdp));
const server = http.createServer(app);
server.listen(port,()=> {
    console.log(`server is up on port ${port}!`);
})

app.post("/niveles",multer().none(),(req,res)=> {
    fs.readFile("./database/niveles.json",(err,data)=> {
        if(err) throw err;
        res.send(data.toString());
    })
})