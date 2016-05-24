importScripts(
    '/components/cryptojslib/components/core-min.js',
    '/components/cryptojslib/rollups/aes.js'
);

function messageHandler(event) {
    // Accessing to the message data sent by the main page
    var messageSent = event.data;

    // Testing the command sent by the main page
    switch (messageSent.cmd) {

        case 'decrypt':

            var i,
                byteNumbers = [],
                items = event.data.parameter.length,
                completed = 0;


            event.data.parameter.forEach(function (item, index) {

                var procCompleted = Math.round((index / items) * 100);

                if (procCompleted !== completed) {

                    completed = procCompleted;

                    this.postMessage(completed);
                }

                item = CryptoJS.AES.decrypt(item, 'meinpw1').toString(CryptoJS.enc.Utf8);

                for (i = 0; i < item.length; i += 1) {
                    byteNumbers.push(item.charCodeAt(i));
                }

                item = null;
                event.data.parameter[index] = null;

            });


            this.postMessage(new Uint8Array(byteNumbers));

            break;

        default:
            this.postMessage("invalid command!!!");
            break;

    }

}

// Defining the callback function raised when the main page will call us
this.addEventListener('message', messageHandler, false);