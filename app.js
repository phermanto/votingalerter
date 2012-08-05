
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , store  = new express.session.MemoryStore;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ secret: 'topsecret', store: store }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/session', function(req, res){
    console.log("SessionID: " + req.cookies['SESSIONID']);

    io.sockets.in(req.sessionID).send("Good to see you back!");
    
    res.render('index', { title: 'Be Heard Yo.', rating: 0, lowLabel: "Too Slow", highLabel: "Too Fast" });
});

// hack alert
var count = 0;
var people = [];

io.sockets.on('connection', function (socket) {
    console.log("CONNECTED!!!");
    
    console.log("val: " + count);
    
    socket.emit('count', { value: count });
    
    socket.on('count', function (msg) {
        console.log("Server recieved message with value: " + msg.value);
        count = msg.value;
        console.log("Server emitting message with value: " + count);
        io.sockets.emit('count', { value: count });
    });
    
    socket.on('people', function (msg) {
        var name = msg.name;
        people = people.concat(name);
        console.log("Server emitting message with people: " + people);
        io.sockets.emit('people', { list: people });
    });
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
