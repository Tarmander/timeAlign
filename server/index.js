const express = require('express');
const { Server } = require("socket.io");
const http = require('http');
const db = require('./db.js')
const app = express();
const server = http.createServer(app);
const io = new Server(server);


const port = 3000;

app.use(express.static('client'));
app.use(express.json());

//basic websocket handler for dynamic information
io.on('connection', (socket) => {
    socket.on("hello", async (arg) => {
        console.log("joined:" + arg);
        socket.join(arg);
        try {
            const data = await db.grabGroupInfo(arg);
            data.unshift( {'overlap' : db.getOverlap(data)});
            io.to(arg).emit("times", data);
        }

        catch(err){
            console.log(err);
        }
    });
  
    socket.on("times", async (args) => {
        try {
            await db.save(args);
            const data = await db.grabGroupInfo(args.groupID);
            data.unshift( {'overlap' : db.getOverlap(data)});
            io.to(args.groupID).emit("times", data);
            }
        catch(err){
            console.log(err);
        }
    });
});

server.listen(port, () => {
    console.log(`Zonelink listening on port ${port}`)
    db.connectToDB();
});