'use strict';

var Sequelize = require('sequelize'); //import sqlize module
var sequelize = new Sequelize('basketballapp', 'aemassa', 'abc123', {
  host: "localhost",
  port: 5432,
  dialect: 'postgres'
}); // connect to sqlize database

var mongoose = require('mongoose'); //import mongoose module
mongoose.connect('mongodb://localhost/basketballapp'); // connect to mongodb

var models = {}; //creates models object
models.User = sequelize.import('./user'); //create models
models.Ownership = sequelize.import('./ownership');
models.Team = require('./team')(mongoose, models); // models object gets bigger, contains team

Object.keys(models).forEach(function(modelName) {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
}); //associate all of our models

sequelize.sync(); // we impose our psql model schemas on our database

module.exports = models; //export models so they're ready to use elsewhere
