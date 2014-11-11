// YOUR CODE HERE:
var app = {};
var chats = {};
var firstTime = true;
app.server = 'https://api.parse.com/1/classes/chatterbox';

// Initialize Chatterbox
app.init = function(){
  app.updateMessages();
};

// message format:
  var message = {
  'username': 'TARS',
  'text': "Rage, rage against the dying of the light.",
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
    // console.log(data.results)
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
  for(var i=messages.length/5; i > 0; i--){
    if(messages[i].text !== undefined && messages[i].text.slice(0,8) !== '<script>' && !chats.hasOwnProperty(messages[i].objectId)) {
    // console.log(messages[i].username + ": " + messages[i].text)
      $('#chats').prepend('<div>' + '[' + moment(messages[i].createdAt).format("MMMM Do, h:mm:ss a") + '] ' + messages[i].username + ": " + messages[i].text + '</div>');
      chats[messages[i].objectId] = messages[i].text;
      if (!firstTime){
        app.clearMessages();
      }
    }
  }
}

app.addMessage = function(){

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

