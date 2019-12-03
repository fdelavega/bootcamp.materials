# Bootcamp Malaga

## WireCloud Deployment

Deployment with Docker

    cd docker
    docker-compose up -d

Create admin user

    docker exec -ti docker_wirecloud_1 manage.py createsuperuser

MACS Catalog
- https://macs.opplafy.eu

## WireCloud Usage

**NGSI Browser**
NGSI Server: http://context.demos.opplafy.eu:1026

Service: berlin19
type: Vehicle
attrs: location, speed, batteryLevel

**Open Layers Map**
Location: 13.392478, 52.518373
Zoom: 14

**NGSI Source**
NGSI Server: http://context.demos.opplafy.eu:1026
Proxy: https://ngsiproxy.opplafy.eu

Service: berlin19
type: Vehicle
attrs: location, speed, batteryLevel

**NGSI Entity 2 POI**
icon: http://j.mp/poi_png

**NGSI Datamodel 2 POI**

**Value Filter**
Property: data.batteryLevel
null: no

**Gauge Chart Generator**
Min: 0
Max: 100

**Value List Filter**
Property: data.batteryLevel
null: no

**Calculate Tendency**
**Pie Chart Generator**

**QuantumLeap Source**
ID: urn:Vehicle:moto1
Server: http://sthdata.demos.opplafy.eu:8668/

NGSI Server: http://context.demos.opplafy.eu:1026
Proxy: https://ngsiproxy.opplafy.eu

Service: berlin19
type: Vehicle
attrs: location, speed, batteryLevel

**QuantumLeap 2 Echart**
Chart1 Title: Battery
Chart1 Attributes: batteryLevel

Chart2 Title: Speed
Chart2 Attribute: speed

**Echart**

## Development

Install grunt init

    npm install -g grunt-init
    git clone https://github.com/Wirecloud/grunt-init-wirecloud-widget.git ~/.grunt-init/wirecloud-widget
    git clone https://github.com/Wirecloud/grunt-init-wirecloud-operator.git ~/.grunt-init/wirecloud-operator


Create a Widget

    grunt-init wirecloud-widget


Create a operator

    grunt-init wirecloud-operator

### Chat Widget

Gravatars:
- http://gravatar.com/mjimenezganan
- http://gravatar.com/fdelavegaca3797ed73

MashupPlatform Reference

Install dependencies

   cd chat-widget
   npm install


1) Add Gravatar preference:

    <preference name="gravatar" type="text" label="Gravatar URL" description="URL to the gravatar profile of the user" />


2) Read gravatar preference (getInfoFromGravatar)
    var gravatarURL = MashupPlatform.prefs.get('gravatar');


3) Subscribe preference changes (init)

    MashupPlatform.prefs.registerCallback(function(new_values) {
        if ('gravatar' in new_values) {
            getInfoFromGravatar();
        }
    });

4) Make HTTP Request

    var url = gravatarURL + '.json';
    MashupPlatform.http.makeRequest(url, {
        method: 'GET',
        onSuccess: function(response) {
            var user_data;
            user_data = JSON.parse(response.responseText);
            if (user_data.error) {
                onError();
            } else {
                userData = user_data;
                printUserData(user_data);
            }
        },
        onError: function() {
            onError();
        }
    });

5) Configure Wiring

    <wiring>
        <outputendpoint name="sendMsg" type="text" label="Send a message" description="The messages sent by the user are sent through this output endpoint" friendcode="message"/>
        <inputendpoint name="receiveMsg" type="text" label="Receive a message"  description="This is where messages sent by other widgets can be received" friendcode="message" />
    </wiring>

6) Send Message on handler (sendButtonHandler)

    var msgToSend = {};
    msgToSend.msg = document.getElementById("input").value;
    if (msgToSend.msg !== "" && userData != null) {
        msgToSend.hash= userData.entry[0].hash;
        MashupPlatform.wiring.pushEvent('sendMsg', msgToSend);
    }

7) Init wiring callback (init)

    MashupPlatform.wiring.registerCallback('receiveMsg', processMsg);

8) Process incomming messages

    function processMsg(receivedMsg) {
            if (userData != null && receivedMsg.hash !== userData.entry[0].hash) {
                createMsgDiv(receivedMsg.msg, 'http://www.gravatar.com/avatar/' + receivedMsg.hash, true, receivedMsg.id);
            } else { // My message, echo, mark as sent
                createMsgDiv(receivedMsg.msg,'http://www.gravatar.com/avatar/' + receivedMsg.hash, false, receivedMsg.id);
                document.getElementById(receivedMsg.id).parentElement.className = 'sent'; 
            }
        }


### Chat operator

http://conwetlab.github.io/ngsijs/stable/NGSI.html

Install dependencies

    cd chat-operator
    npm install

1) Add NGSI Properties config

    <preferences>
        <preference name="ngsi_server"
            type="text" label="NGSI server URL"
            description="URL of the Orion Context Broker to use for retrieving entity information"
            default="http://context.demos.opplafy.eu:1026/"/>
        <preference name="ngsi_proxy"
            type="text"
            label="NGSI proxy URL"
            description="URL of the PubSub Context Broker proxy to use for receiving notifications about changes"
            default="https://ngsiproxy.opplafy.eu/"/>
        <preference name="chatroom"
            type="text"
            label="Chat room"
            description="Chat room to send and receive messages"
            default="bootcamp"/>
    </preferences>

2) Add Wiring

    <wiring>
        <outputendpoint name="toBeReceived"
            type="text"
            label="Messages from NGSI"
            description="Forward a message to a chat widget"
            friendcode="message" />
        <inputendpoint name="toBeSent"
            type="text"
            label="Message to NGSI"
            description="Receive messages to be sent to the chat room"
            friendcode="message" />
    </wiring>

3) Add NGSI Feature

    <feature name="NGSI"/>

    /* global NGSI */

4) Create NGSI Connection (susbcribeChat)

    ngsi_connection = new NGSI.Connection(MashupPlatform.prefs.get('ngsi_server'), {
            ngsi_proxy_url: MashupPlatform.prefs.get('ngsi_proxy'),
            request_headers: {
                "FIWARE-Service": chatroom
            }
        });

5) Publish messages as NGSI entity

    function publishMsg(event_data) {
        var now = new Date();
        ngsi_connection.v2.createEntity({
            "id": "Chat-" + now.getTime() + event_data.hash,
            "type": "ChatMessage",
            "hash": event_data.hash,
            "message": event_data.msg
        }, {keyValues: true}).then(
            (response) => {
                // Entity created successfully
                // response.correlator transaction id associated with the server response
            }, (error) => {
                // Error creating the entity
                // If the error was reported by Orion, error.correlator will be
                // filled with the associated transaction id
            }
        );
    }

6) Subscribe to messages in context broker (subscribeMessage)

    ngsi_connection.v2.createSubscription({
            "description": "One subscription to rule them all",
            "subject": {
                "entities": [
                    {
                        "idPattern": ".*",
                        "type": "ChatMessage"
                    }
                ]
            },
            "notification": {
                callback: function (notification, headers, error) {
                    for (let i = 0; i < notification.data.length; i++) {
                        let msg = {
                            hash: notification.data[i].hash.value,
                            msg: notification.data[i].message.value
                        }
                        MashupPlatform.wiring.pushEvent('toBeReceived', msg);
                    }                    
                }
            }
         }).then(
             (response) => {
                 // Subscription created successfully
                 // response.correlator transaction id associated with the server response
             }, (error) => {
                 // Error creating the subscription
                 // If the error was reported by Orion, error.correlator will be
                 // filled with the associated transaction id
             }
         );