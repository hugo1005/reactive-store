// This script should encompass any db logic you have 
const db = require('./db'); 
const express = require('express');

var app = express();

app.use(express.static(path.join( ____dirname , 'dist'))); 

// Return Ng4 app
app.get('/*', function(req, res){
res.sendFile(__dirname + '/dist/index.html');
});

// Listen on port / production port from Heroku 
var server = app.listen(process.env.PORT || 3000);

// Socket listen 
var io = require('socket.io').listen(server);

var collection;
var store = { 'pathA': 
    {
        'pathB': {
            'object': "Test 1"
        }
    }
};


var mongoUrl = "";

db.connect(mongoUrl, function(err) {
    if(err) {
        console.log('Error: ' + err);
        return; 
    } 

    /* Implementation by database */ 
    collection = db.get().collection('collection'); 
    db.open(collection).then(data => store = data);
});

io.on('connection', function(socket) { 
    io.emit('db', store);
    
    socket.on('dbUpdate', function (dbData) { 
        SetValue(dbData.path.slice(), dbData.data);
        socket.broadcast.emit('clientUpdate', dbData);
    });
});
    
var SetValue = function(route, data) {
    UpdateValue(route, store, value);
    
    /* Custom per database implementation */
    db.update(collection, store);
}

var UpdateValue = function(route, store, value) {
    var next = null;
    
    //Return condition (Assign value to store[next])
    if(route.length <= 1) {
        next = route.shift();
        store[next] = value;
        return;
    };

    next = route.shift();
    var subStore = store[next]; 
    UpdateValue(route, subStore, value);
}