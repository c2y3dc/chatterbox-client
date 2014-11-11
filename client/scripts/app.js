// YOUR CODE HERE:
var app = {};
var chats = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

// Initialize Chatterbox
app.init = function(){
  app.updateMessages();
};

// message format:
var message = {
  'username': 'HAL9000',
  'text': '',
  'roomname': '4chan'
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
    console.log(data.results)
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
  var lastId = 0;
  for(var i=0; i < messages.length/5; i++){
    if(messages[i].text !== undefined && messages[i].text.slice(0,8) !== '<script>' && !chats.hasOwnProperty(messages[i].objectId)) {
    // console.log(messages[i].username + ": " + messages[i].text)
      $('#chats').append('<div>' + messages[i].username + ": " + messages[i].text + '</div>');
      chats[messages[i].objectId] = messages[i].text;
    }
  }
}

app.addMessage = function(){

}

// Clear Chat Box
app.clearMessages = function(){
  $('#chats').children().remove();
}

// Update Chats
app.updateMessages = function(){
  app.fetch();
  setInterval(function(){
  // app.clearMessages();
  app.fetch();
}, 3000);
};

// Initialize!
app.init();

