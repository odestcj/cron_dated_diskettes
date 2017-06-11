/**
   INSTALLATION:
   
   Install Node.js (http://nodejs.org) for your platform.  Put
   relay.js in a directory by itself (anywhere), and then in that
   directory run:

      npm install socket.io

   RUNNING:

   Launch the relay under the Node.js program by executing the command:
                                 
      node relay.js 25560 '*:*' 'welcome to the relay' 

   at the command line.  You can use any port in place of 1080. If
   running on OS X with a port number lower than 1024 you must run
   'sudo node relay.js port'.

   The '*:*' is the allowed originating webserver (not the location of
   the browser that is using pages from the webserver).  For example,
   if you set it to 'http://www.foo.edu:*'

   then only pages from www.foo.edu will be able to use this relay,
   thus preventing other people's codeheart programs from using your
   relay.  The default is '*:*' for an open relay.  You can use any
   message in place of 'welcome ...'.  The default message is empty.

   Running will print the server's address immediately. That is
   the address that the clients need to connect.

   relay.js allows the browser-based server program and browser-based
   client programs to communicate with each other.  Note that both the
   codeheart.js "server" and "client" programs are clients of the relay 
   server.

   UBUNTU INSTALLATION NOTES:   
     # Install node (from http://apptob.org/)
     sudo apt-get -y update
     sudo apt-get -y install libssl-dev git-core pkg-config build-essential
     mkdir /tmp/node-install
     cd /tmp/node-install
     wget http://nodejs.org/dist/v0.8.6/node-v0.8.6.tar.gz
     tar -zxf *.tar.gz
     cd node-v0.8.6
     ./configure
     sudo make install

     # Install relay
     sudo mkdir /usr/local/relay
     sudo chown username /usr/local/relay
     cd /usr/local/relay
     sudo wget http://codeheartjs.com/1.1/relay.js
     sudo npm install socket.io

     # Open firewall
     sudo ufw allow from any to any port 25560

   To make the relay run on startup (as a normal user!), add the
   launch command to /etc/rc.local, for example:

     su username -c "node /usr/local/relay/relay.js 25560 '*:*' 'message'"

 */

/** Set to true to enable debug output for testing the relay itself. */
var debug = true;

/** Default to port 25560 */
var PORT = process.argv[2] ? parseInt(process.argv[2]) : 25560;

var ORIGINS = (process.argv.length >= 4) ? process.argv[3] : '*:*';

/** What the relay tells the server at onOpenOnlineGame */
var RELAY_NOTES = (process.argv.length >= 5) ? process.argv[4] : '';

var dns = require('dns');
var os  = require('os');

dns.lookup(os.hostname(), function (err, addr, fam) {
  console.log('Relay running at http://' + os.hostname() + ':' + PORT + 
              ' (http://' + addr + ':' + PORT + ')');
});

// https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
var SOCKET_OPTIONS = 
{
    'log level': 3,           // 3 = debug,  0 = errors only
    'browser client' : false, // don't serve the client files
};

var io = require('socket.io').listen(PORT, SOCKET_OPTIONS);

// Only allow connection from pages hosted on a certain domain
io.set('origins', ORIGINS);

io.set('transports', [
    'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling' ]);

// If this JavaScript doesn't support the Object.keys method, create it
if (! Object.keys) {
    Object.keys = function (obj){
        if (obj !== Object(obj)) throw new TypeError('Object.keys called on non-object');
        var ret=[], p;
        for (p in obj) if (Object.prototype.hasOwnProperty.call(obj, p)) ret.push(p);
        return ret;
    }
}


//---------------------------------------------------------------------------

/** A server of game. If advertise is false, does not appear in
    the browsable list.
 */
function Server(game, name, socket) {
    this.game      = game;
    this.name      = name;
    this.socket    = socket;
    this.advertisement = null;
    this.state     = '';

    // Table mapping client IDs to Clients
    this.clientTable   = {};
}


Server.prototype.addClient = function (client) {
    this.clientTable[client.clientID] = client;
    console.log('Current clients are: ' + Object.keys(this.clientTable));
    this.socket.emit('joinOnlineGame', {clientID: client.clientID});
}


Server.prototype.removeClient = function (client) {
    if (this.clientTable[client.clientID]) {
        console.log('removeClient("' + client.clientID + '")');
        // Remove the client (the syntax HAS to be exactly as below;
        // "delete client" doesn't work)
        delete this.clientTable[client.clientID];
        this.socket.emit('leaveOnlineGame', {clientID: client.clientID});
        
    } else if (debug) {
        console.log('Unable to remove client ' + client.clientID);
        console.log('Current clients are: ' + Object.keys(this.clientTable));
    }
}


Server.prototype.forEachMatchingClient = function(clientID, callback) {
    var i, id, keys;

    if (clientID === '*') {

        // Generate the keys first, in case the callback modifies the table
        keys = Object.keys(this.clientTable);
        for (i = 0; i < keys.length; ++i) {
	    callback(this.clientTable[keys[i]]);
        }

    } else if (clientID.substring(0, 4) === '* - ') {

	var excludeID = clientID.substring(4);

        // Generate the keys first, in case the callback modifies the table
        keys = Object.keys(this.clientTable);
        for (i = 0; i < keys.length; ++i) {
            id = keys[i];
	    if (id !== excludeID) {
	        callback(this.clientTable[id]);
            }
        }

    } else {
	callback(this.clientTable[msg.clientID]);
    }
}


//---------------------------------------------------------------------------

function Client(server, socket, id) {
    this.server    = server;
    this.socket    = socket;
    this.clientID  = id;
}

//---------------------------------------------------------------------------

/** 
    Maps game names to a table mapping server names 
    to instances.
 */
var gameTable = {};

/** Debugging tool */
function printGameTable() {
    console.log('gameTable: ');
    for (var gameName in gameTable) {
        var game = gameTable[gameName];
        console.log('  Game "' + gameName + '" Servers:');
        for (var serverName in game) {
            console.log('    "' + serverName + '"');
        }
    }
}

function getServer(gameName, serverName) {
    var serverTable = gameTable[gameName];
    if (serverTable) {
	var server = serverTable[serverName];
	if (server) {
	    return server;
	}
    }

    return null;
}

/** Values for type */
var SERVER = 'SERVER';
var CLIENT = 'CLIENT';

// State in which a server has requested shutdown but the clients have not yet been notified
var LAME_DUCK = 'LAME_DUCK';

io.sockets.on('connection', function (socket) {
    
    var me   = null;
    var type = null;

    if (debug) console.log('Connection received, awaiting init message');
    
    //-----------------------------------------------------------------------
    // Server communication

    socket.on('message', function(data) {
        console.log('received ' + data);
    });

    // Sent by a server registering itself
    // data = {gameName:, serverName:}
    socket.on('openOnlineGame', function (data) {

	me = new Server(data.gameName, data.serverName, socket);
        if (debug) console.log(me.name + ': openOnlineGame');

	var previous = getServer(data.gameName, data.serverName);

	type = SERVER;

	if (previous === null) { 
            // Success
	    socket.emit('onOpenOnlineGame', {relayNotes: RELAY_NOTES});
        } else {
            // Failure
	    socket.emit('onOpenOnlineGameFail', {reason: 'duplicate'});
	    socket.disconnect();
            return;
        }

	// This is a new server.  Allocate an entry for the game if
        // needed.
        if (gameTable[data.gameName] === undefined) {
            gameTable[data.gameName] = {}
        }
        
        // Register the server
	gameTable[data.gameName][data.serverName] = me;
        if (debug) console.log('openOnlineGame "' + data.gameName + '"/"' + data.serverName + '"');
        
	// Register the disconnect handler for when the server loses connection
	socket.on('disconnect', function () {
            console.log('disconnect in state ' + me.state);
            if (me.state !== LAME_DUCK) {
                // Remove the clients.  They will see the unexpected
                // disconnect and correctly diagnose it as network
                // trouble (but not know at what stage).
	        me.forEachMatchingClient('*', function(client) {
                    me.removeClient(client);
                    client.socket.disconnect();
                });
            }
            
            // Remove the server from the table
            var game = gameTable[me.game];
	    delete game[me.name];
	});

        
        // msg = {clientID:, explanation:}
        socket.on('kickClient', function (msg) {
            if (debug) console.log(me.name + ': kickClient');

            // The server wants to kick certain clients.  Tell them,
            // and then disconnect them.
            me.forEachMatchingClient(msg.clientID, function(client) { 
                if (debug) console.log('Kicking ' + client.clientID);
                client.socket.emit('kickClient', msg);
                client.socket.disconnect();
            });
        });

        
	// Message received from the server to be relayed to one or more clients
	//
	// data = {clientID: ID or "*", type: string, data: arbitrary}
	socket.on('message', function (msg) {
            if (debug) console.log('Received message for clientID: ' + msg.clientID);

            me.forEachMatchingClient(msg.clientID, function (client) {
                client.socket.emit('message', msg); 
            });
	});


        socket.on('closeOnlineGame', function (msg) {
            if (debug) console.log(me.name + ': closeOnlineGame');
            me.state = LAME_DUCK;

            // Tell the clients that the game is about to end.  There
            // is no need to remove them explicitly, since the server
            // will shut down and the disconnect event triggers their
            // closure and removal.
            me.forEachMatchingClient('*', function (client) {
                client.socket.emit('closeOnlineGame');
                client.socket.disconnect();
            });
        });
       
    });


    //-----------------------------------------------------------------------
    // Browse communication

    socket.on('requestServerList', function (data) {
	console.log('Received request for server list.');
	var serverTable = gameTable[data.gameName];
	var result = [];
	var i;

	if (serverTable) {
	    // Get all of the server names
	    result = Object.keys(serverTable);

	    // Convert to advertisements
	    for (i = 0; i < result.length; ++i) {
		result[i] = {serverName: result[i]};
	    }
	}
	
	socket.emit('onReceiveServerList', {serverList: result});
	socket.disconnect();
    });
    
    //-----------------------------------------------------------------------
    // Client communication

    // Sent by the client opening its relayed connection to a server
    // data = {game: g, server: c}
    socket.on('joinOnlineGame', function (data) {
	type = CLIENT;

        if (debug) console.log('looking for "' + data.gameName + '"/"' + data.serverName + '"');
	var server = getServer(data.gameName, data.serverName);

	if (server !== null) {
	    me = new Client(server, socket, data.clientID);

            if (debug) console.log(me.clientID + ': joinOnlineGame');

            if (server.clientTable[me.clientID]) {
                // This ID is already in use; autokick
                me.socket.emit('onJoinOnlineGameFail', {reason: 'duplicate'});
                me.socket.disconnect();
                
                if (debug) console.log('Autokicked new ' + me.clientID + ' for non-unique ID');
                
            } else {

                // Tell the client that it has connected successfully
                me.socket.emit('onJoinOnlineGame');

	        // Tell the server that it has a new client
	        server.addClient(me);
                
	        // Message received from a client to be relayed to the server
	        // msg = {data: arbitrary} (all other fields reserved)
	        socket.on('message', function(msg) {
		    // Wrap the mssage
		    msg.clientID = me.clientID;
		    me.server.socket.emit('message', msg);
	        });
                
	        // Register the disconnect handler
	        socket.on('disconnect', function() {
                    // Sometimes we get this event TWICE
                    console.log('client disconnected');

		    // Tell the server that I've disconnected
		    server.removeClient(me);
	        });
            }

	} else {
            // Failed to connect
            if (debug) console.log('(new client): registerClient');

	    socket.emit('error', 'There is no server with that name.');
            if (debug) printGameTable();
	    socket.disconnect();
	}
    });

});
