var express = require('express');
var Message = require('../models/message');
var SequenceGenerator = require('../routes/SequenceGenerator');
var router = express.Router();
module.exports = router;

var getMessages = function (response)
{  Message.find()
  .exec(function (err, messages) {
    if (err) {
      return response.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    response.status(200).json({
      messages: 'Success',
      obj: messages
    });
  });
}

var saveMessage = function (response, message)
{  message.save(function (err, result) {
  if (err) {
    return response.status(500).json({
      title: 'An error occurred',
      error: err
    });
  }
  getMessages(response);
});
}

var deleteMessage = function (response, message)
{ message.remove(function(err, result) {
  if (err) {
    return response.status(500).json({
      title: 'An error occurred',
      error: err
    });
  }
  getMessages(response);
});
}

router.get('/', function (request, response, next){
  getMessages(response);
});

router.post('/', function (request, response, next) {
  var maxMessageId = SequenceGenerator.nextId("messages");
  var message = new Message({
    id: maxMessageId,
    subject: request.body.subject,
    message: request.body.message
  });
  saveMessage(response, message);
});

router.patch('/:id', function (request, response, next){
  Message.findOne({id: request.params.id}, function (err, message){
    if (err || !message) {
      return response.status(500).json({
        title: 'No Message Found!',
        error: {message: 'Message not found'}
      });
    }

    message.subject = request.body.subject;
    message.message = request.body.message;

    saveMessage(response, message);
  });
});

router.delete('/:id', function (request, response, next) {
  var query = {id: request.params.id};

  Message.findOne(query, function (err, message) {
    if (err) {
      return response.status(500).json({
        title: 'No Message Found',
        error: err
      });
    }
    if (!message) {
      return response.status(500).json({
        title: 'No Message Found!',
        error: {messageId: request.params.id}
      });
    }

    deleteMessage(response, message);
  });
});
