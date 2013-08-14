// ***
// *** Required modules
// ***
var express = require('express');
var Firebase = require('firebase');
var OpenTokLibrary = require('opentok');

// ***
// *** OpenTok Constants for creating Session and Token values
// ***
var OTKEY = process.env.TB_KEY;
var OTSECRET = process.env.TB_SECRET;
var OpenTokObject = new OpenTokLibrary.OpenTokSDK(OTKEY, OTSECRET);

// ***
// *** Setup Express to handle static files in public folder
// *** Express is also great for handling url routing
// ***
var app = express();
app.use(express.static(__dirname + '/public'));
app.set( 'views', __dirname + "/views");
app.set( 'view engine', 'ejs' );

// ***
// *** When user goes to root directory, redirect them to a room (timestamp)
// ***
app.get("/", function( req, res ){
  res.render( 'index', {greeting:"Hello World"} );
});

app.get("/:rid", function( req, res ){
  var rid = req.params.rid;
  var roomRef = new Firebase("https://rtcdemo.firebaseIO.com/room/" + rid);

  // Remove room if there are no users
  var presenceRef = new Firebase("https://rtcdemo.firebaseIO.com/room/" + rid + "/users");
  presenceRef.on('value', function(dataSnapshot){
    if(dataSnapshot.numChildren() == 0){
      roomRef.remove();
    }
  });

  // Generate sessionId if there are no existing session Id's
  roomRef.once('value', function(dataSnapshot){
    var sidSnapshot = dataSnapshot.child('sid');
    var sid = sidSnapshot.val();
    if(!sid){
      OpenTokObject.createSession(function(sessionId){
        sidSnapshot.ref().set( sessionId );
        returnRoomResponse( res, { rid: rid, sid: sessionId });
      });
    }else{
      returnRoomResponse( res, { rid: rid, sid: sid });
    }
  });
});

function returnRoomResponse( res, data ){
  data.apiKey = OTKEY;
  data.token = OpenTokObject.generateToken( {session_id: data.sid, role:OpenTokLibrary.RoleConstants.MODERATOR} );
  res.render( 'room', data );
}

// ***
// *** start server, listen to port (predefined or 9393)
// ***
var port = process.env.PORT || 5000;
app.listen(port);
