/*
 * chat
 * https://github.com/fdelavega/chat-widget
 *
 * Copyright (c) 2019 FICODES
 * Licensed under the MIT license.
 */

/* exported Chat */

var Chat = (function () {

    "use strict";

    (function() {
        "use strict";
    
        // object with the data received from gravatar
        var userData = null;
    
        function init() {
            document.getElementById("send").onclick = sendBtnHandler;
            getInfoFromGravatar();
        }
    
        function sendBtnHandler(e) {
        }
    
        function createMsgDiv(text,imageSrc,received,id){
            var newMsgP = document.createElement('p');
            var newMsgImg = document.createElement('img');
            var newMsgDiv = document.createElement('div');

            newMsgP.innerHTML = text;
            newMsgP.id = id;
            newMsgImg.src = imageSrc;
            newMsgImg.alt = 'User profile img';
            newMsgDiv.className=(received)?'received':'sent';
            newMsgDiv.appendChild(newMsgImg);
            newMsgDiv.appendChild(newMsgP);

            var conversations = document.getElementById('conversations');
            conversations.appendChild(newMsgDiv);
            conversations.scrollTop = newMsgDiv.offsetTop;
        }
    
        function getInfoFromGravatar() {
            // Put the info in userData variable
        }
    
        function printUserData(user_data) {
            document.getElementById('username').innerHTML = user_data.entry[0].displayName;
            document.getElementById('photo').src = user_data.entry[0].thumbnailUrl;
        }
    
        document.addEventListener('DOMContentLoaded', init.bind(this), true);
    
    })();

    return Chat;

})();
