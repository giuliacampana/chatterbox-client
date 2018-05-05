// class App {
//   constructor() {}

//   init() {

//   }
// };

var app = {};

var chats = [];
var rooms = {};

app.init = function() {
  
};

handleData = function(chats) {
  console.log(chats);
  chats = chats.results; // an array of objects -- each object is a message
  for (var i = 0; i < chats.length; i++) {
    //console.log(i);
    if (!filterBadMessages(chats[i])) { // check each item in array for whether it's an object, has the 3 correct properties, and doesn't have faulty input
      continue; // if it's fine, keep going
    }
    if (!rooms.hasOwnProperty(chats[i].roomname)) { // if there's not already a property in rooms object for the roomname
      rooms[chats[i].roomname] = []; // set the roomname property as an empty array
    }
    rooms[chats[i].roomname].push(chats[i]); // for all objects, push it to the array at property corresponding with the roomname
  }
  // console.log('rooms ' + JSON.stringify(rooms));
  var i = 0;
  var firstRoom;
  _.each(rooms, function(value, key) {
    if (i === 0) {
      firstRoom = key;
      i++;
    }
    $option = $(`<option value="${key}">${key}</option>`);
    $option.appendTo($('#rooms'));
  });
  
  app.renderRoom(firstRoom);
  
};

filterBadMessages = function(message) {
  if (typeof message !== 'object' || !message.hasOwnProperty('text') || !message.hasOwnProperty('username') || !message.hasOwnProperty('roomname') || message.roomname.includes('<') || message.roomname.includes('>')) {
    return false;
  }
  return true;
};

app.send = function(message) {
  $.ajax({
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message fetched');
      handleData(data);
    },
    error: function () {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message');
    }
  });
};

app.clearMessages = function() {
  $('#chats').remove();
};

app.renderMessage = function(message) {
  var $chat = $(`<div class="chat"><div class="username" >${message.username}</div> <div class="text">${message.text}</div> <div class="roomname">${message.roomname}</div></div>`);
  $chat.appendTo('#chats');
};

app.renderRoom = function(roomname) {
  if (rooms.hasOwnProperty(roomname)) {
    var room = rooms[roomname];
    for (var i = 0; i < room.length; i++) {
      this.renderMessage(room[i]);
    }
  }
};

app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';


$(document).ready(function() {
  app.fetch();
  
  $().change();
  
});