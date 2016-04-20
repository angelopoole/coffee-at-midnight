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


//<!-------------------------------------------------------!>//
//<!-------------------------------------------------------!>//
//<!-------------------------------------------------------!>//

//this wll be where pubnub is worked on//
 var user = {
            uuid: null,
            subscribed: false
        };
dom = {};
        dom.messageLog = $( "div.messageLog" );
        dom.messageLogItems = dom.messageLog.find( "> ul" );
        dom.form = $( "form" );
        dom.formInput = dom.form.find( "input" );
        dom.formSubmit = dom.form.find( "button" );

dom.form.submit(
            function( event ){
                // Cancel the default event.
                event.preventDefault();
                // Make sure there is a message to send and that the
                // user is subscribed.
                if (
                    !user.subscribed ||
                    !dom.formInput.val().length
                    ){
                    // Nothing more we can do with this request.
                    return;
                }
            
            
                // Send the message to the current channel.
                sendMessage( dom.formInput.val() );
                // Clear and focus the current message so the
                // user can keep typing new messages.
                dom.formInput
                    .val( "" )
                    .focus()
                ;
            }
        );
        // I append the given message to the message log.
        function appendMessage( message, isFromMe ){
            // Creat the message item.
            var messageItem = $( "<li />" ).text( message );
            // If the message is form me (ie. the local user) then
            // add the appopriate class for visual distinction.
            if (isFromMe){
                messageItem.addClass( "mine" );
            }
            
                        // Add the message element to the list.
            dom.messageLogItems.append( messageItem );
        }
        // I send the given message to all subscribed clients.
        function sendMessage( message ){
            // Immediately add the message to the UI so the user
            // feels like the interface is super responsive.
            appendMessage( message, true );
            // Push the message to PubNub. Attach the user UUID as
            // part of the message so we can filter it out when it
            // gets echoed back (as part of our subscription).
            PUBNUB.publish({
                channel: "hello_world",
                message: {
                    uuid: user.uuid,
                    message: message
                }
            });
        };
        // I receive the message on the current channel.
        function receiveMessage( message ){
            // Check to make sure the message is not just being
            // echoed back.
            if (message.uuid === user.uuid){
                // This message has already been handled locally.
                return;
            }
            // Add the message to the chat log.
            appendMessage( message.message );
        }
        // -------------------------------------------------- //
        // -------------------------------------------------- //
        // In order to initialize the system, we have to wait for the
        // client to receive a UUID and for the subscription to the
        // PubNub server to be established.
        var init = $.when(
            // Get the user ID.
            getUUID(),
            // Subscribe to the PubNub channel.
            $.Deferred(
                function( deferred ){
                    // When the PubNub connection has been
                    // established, resolve the deferred container.
                    PUBNUB.subscribe({
                        channel: "hello_world",
                        callback: receiveMessage,
                        connect: deferred.resolve,
                        error: deferred.fail
                    });
                }
            )
        );
        // When the UUID has come back, prepare the user for use
        // within the system.
        init.done(
            function( uuid ){
                // Store the UUID with the user.
                user.uuid = uuid;
                // Flag the user as subscribed.
                user.subscribed = true;
                // Enable the message form.
                dom.formSubmit.removeAttr( "disabled" );
            }
        );
        // -------------------------------------------------- //
        // -------------------------------------------------- //
        // -------------------------------------------------- //
        // -------------------------------------------------- //
        // NOTE: The following are just PubNub utility methods that
        // have been converted from callback-based responses to
        // deferred-based promises.
        // I get a UUID from the PUBNUB server. I return a promise
        // of the value to be returned.
        function getUUID(){
            // Since the core UUID method uses a callback, we need to
            // create our own intermediary deferred object to wire
            // the two workflows together.
            var deferred = $.Deferred();
            // Ask PubNub for a UUID.
            PUBNUB.uuid(
                function( uuid ){
                    // Resolve the uuid promise.
                    deferred.resolve( uuid );
                }
            );
            // Return the UUID promise.
            return( deferred.promise() );
        }

