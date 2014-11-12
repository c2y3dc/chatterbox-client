// YOUR CODE HERE:
var app = {};
var chats = {};
var firstTime = true;
var chatRooms = [];
var chosenRoom = "lobby";
app.server = 'https://api.parse.com/1/classes/chatterbox';

// Initialize Chatterbox
app.init = function(){
  app.updateMessages();
};

// Send Messages
app.send = function(message){
  $.ajax({
  // always use this url
  url: app.server,
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message. Error data:', data);
  }
});
};

// Fetch Messages
app.fetch = function(){
  $.ajax({
  // always use this url
  url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
  type: 'GET',
  // data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message received.');
    app.messageHandler(data);
    //console.log(data.results)
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to get message');
  }
});
}

// Convert Data Object to Message DOM nodes
app.messageHandler = function(data){
  var messages = data.results;
  $('.user').click(function(){
    console.log(this);
    $('#friends').append($(this).text());
  });
  for(var i=messages.length/5; i > 0; i--){
    if(!_.contains(chatRooms, messages[i].roomname)){
      if(messages[i].roomname === undefined || messages[i].roomname.slice(0,3) !== 'var'){
      chatRooms.push(messages[i].roomname);
      }
    }
    if(app.messageFilter(messages[i])) {
      if(app.chatRoomFilter(messages[i])){
        $('#chatroom').prepend(app.renderMessage(messages[i]));
      }
      $('#chats').prepend(app.renderMessage(messages[i]));
      chats[messages[i].objectId] = messages[i].text; //update cache
      $('#roomlist').children().remove();
      for(var i = 0; i < chatRooms.length; i++){
        var newRoom = '<option value='+ chatRooms[i] + '>' + chatRooms[i] + '</option>';
        $('#roomlist').append(newRoom);
      }
    }
  }
}

app.renderMessage = function(message){
  var $user = $('<div>', {class: 'user'}).text(message.username + ": ");
  var $text = $('<div>', {class: 'text'}).text(message.text);
  var $date = $('<div>', {class: 'date'}).text('['+moment(message.createdAt).format("MMMM Do, h:mm:ss a")+'] ')
  var $message = $('<div>', {class: 'chat', 'data-id':message.objectId}).append($date, $user, $text);
  return $message;
}

// filter haxors
app.messageFilter = function(message){
  if (message.text !== undefined
    && message.text.slice(0,8) !== '<script>'
    && message.text.slice(0,5) !== '<img'
    && !chats.hasOwnProperty(message.objectId)
    && message.username !== 'BRETTSPENCER'
    && message.username !== 'Chuck Norris'
  ) {
    return true;
  }
  return false;

}

// only display selected chatroom messages
app.chatRoomFilter = function(message){
  if(message.roomname === chosenRoom){return true;}
  return false;
}

// Clear Chat Box
app.clearMessages = function(){
  $('#chats :last-child').remove();
}

// Update Chats
app.updateMessages = function(){
  app.fetch();
  setInterval(function(){
    firstTime = false;
    app.fetch();
}, 700);
};

// Initialize!
app.init();


// JQuery Magic!
$(document).ready(function(){
  $(".username").text('username: ' + window.location.search.slice(10));
  $(".button").click(function() {
    var message = {
      'username': window.location.search.slice(10),
      'text': $('.input').val(),
      'roomname': chosenRoom
   };
  app.send(message);
  $('.input').val("");
  });
  $("#roomlist").change(function(){
    $("#chatroom").children().remove();
        chosenRoom = $( "#roomlist").val();
  });
});


