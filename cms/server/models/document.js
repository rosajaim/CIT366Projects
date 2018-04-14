var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema ({
  id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  url: { type: String },
  children: [{
    id: {type: String},
    name: {type: String},
    description: {type: String},
    url: {type: String}
  }]
});

module.exports = mongoose.model('Document', schema);
