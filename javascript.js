var webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: 'remoteVideos',
    // immediately ask for camera access
    autoRequestMedia: true
});
// we have to wait until it's ready
webrtc.on('readyToCall', function () {
    // you can name it anything
    webrtc.joinRoom('your awesome room name');
});


(function(){
var box = PUBNUB.$('box'), input = PUBNUB.$('input'), channel = 'chat';
PUBNUB.subscribe({
    channel  : channel,
    callback : function(text) { box.innerHTML = (''+text).replace( /[<>]/g, '' ) + '<br>' + box.innerHTML }
});
PUBNUB.bind( 'keyup', input, function(e) {
    (e.keyCode || e.charCode) === 13 && PUBNUB.publish({
        channel : channel, message : input.value, x : (input.value='')
    })
} )
})()
PUBNUB.publish({ channel : 'chat', message : "hello!" })
PUBNUB.subscribe({ channel : 'chat', message : fun })