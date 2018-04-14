var express = require('express');
var router = express.Router();
var Document = require('../models/document');
var sequenceGenerator = require('./SequenceGenerator');

var getDocuments = function (response) {
  Document.find().exec(function (err, documents) {
    if (err) {
      return response.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    response.status(200).json({
      document: 'Success',
      obj: documents
    });
  });
};

var saveDocument = function (response, document) {
  var response = response;
  document.save(function (err, result) {
    response.setHeader('Content-Type', 'application/json');
    if (err) {
      return response.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    getDocuments(response);
  });
}

var deleteDocument = function (res, document) {
  var response = res;
  document.remove(function (err, result) {
    res.setHeader('Content-Type', 'application/json');
    if (err) {
      return response.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
   getDocuments(response)
  });
};

router.get('/', function (req, res, next) {
  getDocuments(res);
});

router.post('/', function (req, res, next) {
  var maxDocumentId = sequenceGenerator.nextId("documents");

  var document = new Document({
    id: maxDocumentId,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  });
  console.log(JSON.stringify(document));
  saveDocument(res, document);
});

router.patch('/:id', function (req, res, next) {
  Document.findOne({'id': req.params.id}, function (err, document) {
    var documentId = req.params.id;
    if (err || !document) {
      return res.status(500).json({
        title: 'No Document Found',
        error: {document: 'Document not found'}
      });
    }

    document.name = req.body.name;
    document.description = req.body.description;
    document.url = req.body.url;

    saveDocument(res, document);
  });
});

router.delete('/:id', function (req, res, next) {
  var query = {id: req.params.id};

  Document.findOne(query, function (err, document) {
    if (err) {
      return res.status(500).json({
        title: 'No Document Found',
        error: err
      });
    }
    if (!document) {
      return response.status(500).json({
        title: 'No Document Found',
        error: {documentId: req.params.id}
      })
    }
    deleteDocument(res, document);
  });
});

module.exports = router;
