Dropzone.autoDiscover = false;

function WorkerMessage(cmd, parameter) {
    this.cmd = cmd;
    this.parameter = parameter;
}


$(document)

    .on('click', 'a.saveFile', function (event) {
        event.preventDefault();

        var fileId = parseInt($(this).attr('id').replace('file-', ''));
        var self = $(this);
        var worker = new Worker("js/worker.decrypt.js");

        worker.addEventListener("message", function (event) {
            if (typeof event.data !== 'number') {
                saveAs(new Blob([event.data], {type: self.attr('data-type')}), self.attr('data-name'));
            } else {
                console.log(event.data);
            }

        }, false);


        console.log(window.data[fileId].length + ' packages to decrypt');

        worker.postMessage(new WorkerMessage('decrypt', window.data[fileId]));

        window.data[fileId] = null;

    });

$(function () {
    var myDropzone = new Dropzone("#myDrz", {
        maxFilesize: 20000,
        accept: function (file, done) {
            done();
        }
    });

    myDropzone.on("addedfile", function (file) {

        var name = file.name;
        var reader = new FileReader();

        reader.onloadend = function (loadedFile) {

            var extData,
                typeMatch = new RegExp('^data:([a-z]+\/[a-z0-9\-\.]+;base64),'),
                type = loadedFile.currentTarget.result.match(typeMatch);


            if (type instanceof Array) {

                extData = type[1].match(/^[a-z]+\/([a-z0-9]+)/);

                if (extData instanceof Array) {

                    var worker = new Worker("js/worker.encrypt.js");

                    worker.addEventListener("message", function (event) {

                        if (event.data instanceof Array) {

                            if (window.data === undefined) {
                                window.data = [];
                            }

                            window.data.push(event.data);

                            var id = window.data.length - 1;


                            $('#preview').html('<a data-name="' + name + '" data-type="' + type[1] + '" class="saveFile" href="#" id="file-' + id + '">' + name + '</a>');

                        } else {
                            console.log(event.data);

                        }
                    }, false);


                    var chunkData = atob(loadedFile.currentTarget.result.replace(typeMatch, ''));

                    worker.postMessage(new WorkerMessage('encrypt', chunkData));
                }
            } else {
                alert('error');
            }
        };


        // Read in the image file as a data URL.
        reader.readAsDataURL(file);
        // reader.readAsBinaryString(file);
    });
});