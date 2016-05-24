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


            var encrypted,
                rawData,
                data = [],
                size = 10000,
                i = size,
                completed = 0;



            rawData = event.data.parameter.substr(0, size);

            while (rawData.length !== 0) {
                data.push(CryptoJS.AES.encrypt(rawData, 'meinpw1').toString());
                rawData = event.data.parameter.substr(i, size);
                i += size;

                if (Math.round((i / event.data.parameter.length) * 100) !== completed) {
                    completed = Math.round((i / event.data.parameter.length) * 100);

                    this.postMessage(completed);
                }
            }


            this.postMessage(data);

            break;

        default:
            this.postMessage("invalid command!!!");
            break;

    }

}

// Defining the callback function raised when the main page will call us  
this.addEventListener('message', messageHandler, false);