importScripts(
    '/components/cryptojslib/components/core-min.js',
    '/components/cryptojslib/rollups/aes.js'
);

function messageHandler(event) {
    // Accessing to the message data sent by the main page  
    var messageSent = event.data;

    // Testing the command sent by the main page  
    switch (messageSent.cmd) {

        case 'encrypt':

            // var typeMatch = new RegExp('^data:([a-z]+\/[a-z0-9\-]+;base64),'),
            //     type = loadedFile.currentTarget.result.match(typeMatch),
            //     encrypted = ;

            // setTimeout(function () {
            this.postMessage(CryptoJS.AES.encrypt(event.data.parameter, 'meinpw1').toString());
            // }.bind(this), 5000);


            break;

        default:
            this.postMessage("invalid command!!!");
            break;

    }

}

// Defining the callback function raised when the main page will call us  
this.addEventListener('message', messageHandler, false);