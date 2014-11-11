// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.init = function(){};

// message format:
// var message = {
//   'username': 'shawndrost',
//   'text': 'trololo',
//   'roomname': '4chan'
// };

app.send = function(message){
  $.ajax({
  // always use this url
  url: app.server,
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');app.messageHandler(data);
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message. Error data:', data);
  }
});
};

app.fetch = function(){
  $.ajax({
  // always use this url
  url: app.server,
  type: 'GET',
  // data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message received. contents:', data);
    app.messageHandler(data);
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to get message');
  }
});
}

app.messageHandler = function(data){
  var messages = data.results;
  for(var i=0; i < messages.length; i++){
    if(messages[i].text !== undefined && messages[i].text.slice(0,8) !== '<script>'){
    // console.log(messages[i].username + ": " + messages[i].text)
      $('.chat').append('<div>' + messages[i].username + ": " + messages[i].text + '</div>');
    }
  }
}

app.fetch();
