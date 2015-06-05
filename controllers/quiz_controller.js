
/// <reference path="../typings/sequelize/sequelize.d.ts" />


var models = require('../models/models.js')


// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{ next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error){next(error);});
};


exports.index = function (req, res) {
  var search = req.query.search;
  if (search == undefined ) {
      models.Quiz.findAll().then(function (quizes) {
          res.render('quizes/index.ejs', { search: req.query.search, quizes: quizes});
      }).catch(function (error) {next(error);});
   } else {
      search = search.replace(/\s+/g,'%');
      search = '%' + search + '%';
      console.log(search);
      models.Quiz.findAll({where: ['pregunta like ?', search], order: 'pregunta'}).then(function (quizes) {
          res.render('quizes/index.ejs', { search: req.query.search, quizes: quizes});
      }).catch(function (error) {next(error);});     
   }
};

exports.show = function (req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    res.render('quizes/show', { quiz: req.quiz});
  });
};

exports.answer = function(req,res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
    } 
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
  });
};

