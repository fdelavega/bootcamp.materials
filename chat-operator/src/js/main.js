/*
 * chat-operator
 * https://github.com/fdelavega/bootcamp.materials
 *
 * Copyright (c) 2019 FICODES
 * Licensed under the MIT license.
 */

(function() {

    "use strict";

    var chatroom = null;
    var ngsi_connection = null;

    function init() {
        MashupPlatform.wiring.registerCallback('toBeSent', publishMsg);
        MashupPlatform.prefs.registerCallback(function(new_values) {
            if ('chatroom' in new_values) {
                subscribeChatRoom();
            }
        });

        subscribeChatRoom();
    }


    function publishMsg(event_data) {
    }

    function subscribeChatRoom() {
    }

    function receiveMessage(data){
        for(var msg in data.elements){
            MashupPlatform.wiring.pushEvent('toBeReceived', JSON.stringify(data.elements[msg]));
        }
    }

    init();

})();
