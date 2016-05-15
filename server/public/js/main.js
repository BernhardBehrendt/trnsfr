Dropzone.autoDiscover = false;

function WorkerMessage(cmd, parameter) {
    this.cmd = cmd;
    this.parameter = parameter;
    console.log(this);
}


$(document)

    .on('click', 'a.saveFile', function (event) {
        event.preventDefault();

        var fileId = parseInt($(this).attr('id').replace('file-', ''));

        var decrypted = CryptoJS.AES.decrypt(window.data[fileId], 'meinpw1');

        var byteCharacters = atob(decrypted.toString(CryptoJS.enc.Utf8));

        var byteNumbers = new Array(byteCharacters.length);

        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);


        saveAs(new Blob([byteArray], {type: $(this).attr('data-type')}), $(this).attr('data-name'));
    });

$(function () {
    // Now that the DOM is fully loaded, create the dropzone, and setup the
    // event listeners


    var myDropzone = new Dropzone("#myDrz", {
        maxFilesize: 20000,
        accept: function (file, done) {
            done();
        }
    });

    myDropzone.on("addedfile", function (file) {
//            console.log(file.name);
        /* Maybe display some more file information on your page */

        var name = file.name;
        var reader = new FileReader();

        reader.onload = function (e) {
            console.log(e);
        };


        reader.onloadend = function (loadedFile) {

            var typeMatch = new RegExp('^data:([a-z]+\/[a-z0-9\-\.]+;base64),');

            console.log(loadedFile.currentTarget.result.substr(0, 1000));

            var type = loadedFile.currentTarget.result.match(typeMatch);

            console.log(type);

            if (type instanceof Array) {

                var extData = type[1].match(/^[a-z]+\/([a-z0-9]+)/);

                if (extData instanceof Array) {

                    var worker = new Worker("js/worker.encrypt.js");

                    worker.addEventListener("message", function (event) {

                        if (window.data === undefined) {
                            window.data = [];
                        }


                        window.data.push(event.data);

                        var id = window.data.length - 1;
                        $('#preview').html('<a data-name="' + name + '" data-type="' + type[1] + '" class="saveFile" href="#" id="file-' + id + '">' + name + '</a>');
                    }, false);

                    worker.postMessage(new WorkerMessage('encrypt', loadedFile.currentTarget.result.replace(typeMatch, '')));


                }
            } else {
                // alert('error');
            }
        };

        // Read in the image file as a data URL.
        reader.readAsDataURL(file);
    });
});