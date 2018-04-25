function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

localstream = null;
captureButton = document.getElementById('capture');
player = null;
textExampleInput = document.getElementById('text-example');
imgExample = document.getElementById('example');
h2 = document.getElementById('h2');
h2.innerText = chrome.i18n.getMessage("h2_title");
document.getElementsByTagName('title').innerText = chrome.i18n.getMessage("h2_title");
document.getElementById('capture').innerText = chrome.i18n.getMessage("capture_button_text");
var canvas = document.getElementById('canvas'),
  context = canvas.getContext('2d');

GumHelper.startVideoStreaming(function callback(err, stream, videoElement, width, height) {
  if(err) {
    errorDiv = document.getElementById('error');
    errorDiv.classList.add('visible');
  } else {
     
      player = videoElement;
      videoElement.id = 'vid';
      jQuery('.video-wrp-inner').prepend(videoElement);
      jQuery('.text-example-wrp').width(player.videoWidth - 60 )
      setTimeout(function(){
        console.log(jQuery('.video-wrp-inner').width(), jQuery('.video-wrp-inner').height());
        jQuery('.text-example-wrp').draggable({
          containment:'.video-wrp-inner'
        });

      },40);
      // (or you could just keep a reference and use it later)
  }
}, { timeout: 20000 });
 captureButton.addEventListener('click', () => {
   //console.log(player);
    // Draw the video frame to the canvas.
    var coordinates = jQuery('.text-example-wrp').position();
    canvas.width = player.videoWidth;
    canvas.height = player.videoHeight;
    context.drawImage(player, 0, 0, player.videoWidth, player.videoHeight);
    context.textBaseline  = "top";
    context.font = "32px Calibri";
    context.textAlign  = "left";
    context.fillStyle = '#fff';

    context.fillText(textExampleInput.value,coordinates.left + 32 ,coordinates.top);
    dataUrl = canvas.toDataURL(),
    imageFoo = document.createElement('img');
    imageFoo.src = dataUrl;
   
   
    canvas.toBlob(function(blob){
            url = URL.createObjectURL(blob);
        chrome.downloads.download({
          url: url ,
          filename : getfilenameByExtention('png')
        });

     },'image/png');

  });


  $(function(){
  })


  function getfilenameByExtention(ext){
    var now = new Date(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        year = now.getFullYear(),
        seconds = now.getSeconds(),
        minutes = now.getMinutes(),
        hour = now.getHours(),
        filename = chrome.runtime.getManifest().name + '--' + [day,month,year].join('-') + '--' +[hour,minutes,seconds].join('-');
        filename = filename.replace(/(\s|\t)+/g,'-').toLocaleLowerCase() + '.' + ext;
    return filename;
  }