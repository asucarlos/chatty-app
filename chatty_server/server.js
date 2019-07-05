// server.js
const uuidv4 = require('uuid/v4');
const express = require('express');
const WebSocket = require('ws');
const randomColor = require('randomcolor');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));


let idToName = [];
let color = {};
// Create the WebSockets server
const wss = new WebSocket.Server({ server });
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  sendUserCount()
  const userColor = {
    type: 'userColor',
    color: randomColor(),
  }
  ws.send(JSON.stringify(userColor))

  const userId = uuidv4();
  ws.on('message', (message) =>{

    const msg = JSON.parse(message)
    wss.clients.forEach(function each(client) {

        if (client.readyState == WebSocket.OPEN) {
            switch(msg.type) {
                case 'postMessage':
                    msg.id = uuidv4();
                    msg.type = 'incomingMessage';
                    // if(color[msg.color]){
                    //   console.log(color[msg.color])
                    //   console.log('color exist!')
                    // } else {     
                    //   idToName.userId = userId;
                    //   msg.userId = userId;
                    //   let userColor = randomColor();
                    //   msg.color = userColor;
                    //   color.userColor = userColor;
                    //   console.log('inside color obj'+ color[msg.color])
                    //   console.log(msg.color)
                    // }
                    break;
                case 'postNotification':
                    msg.id = uuidv4(),
                    msg.type = 'incomingNotification'
                    // console.log('does this exist' + idToName[msg.userId])
                    // if(color[msg.color]){
                    //   console.log(color[msg.color])
                    //   console.log('color exist!')
                    // } else {     
                    //   idToName.userId = userId;
                    //   msg.userId = userId;
                    //   msg.color = randomColor();
                    //   color.userColor = msg.color;
                    //   console.log('inside color obj'+ color)
                    //   console.log(msg.color)
                    // }
                    break;
                case 'incomingMessage':
                    console.log('wrong incoming Message'+ msg.id)
                    break;
                case 'incomingNotification':
                    console.log('wrong incoming notification' + msg)
                    break;

                default: 
                  // show an error in the console if the message type is unknown
                  throw new Error('Unknown event type on server ' + msg.type);
            }
          client.send(JSON.stringify(msg));
        }
    })
    });


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => 
  delete idToName[userId],
  sendUserCount()
  );
});

//send number of users to app
const sendUserCount = () =>{
  wss.clients.forEach(function each(client) {
    const userCount = {
      type: 'userCount',
      number: wss.clients.size,
    }
    client.send(JSON.stringify(userCount))
  })
}
// const sendUserColor = () =>{

// }