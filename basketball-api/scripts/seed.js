var async = require('async');

// require our models, both psql and mongodb
var models = require('../models/index');
// require our mongoose connection explicitly
var mongoose = require('mongoose');
// now we seed the data
async.series([
  // first we clear the database of teams. Remember, this is done ASYNCHRONOUSLY
  function(done){
    async.parallel([
      function(done){
        models.Team.remove({}, done);
      }, function(done){
        models.User.destroy({where: {}}).then(function(){
          done();
        });
      }, function(done){
        models.Ownership.destroy({where: {}}).then(function(){
          done();
        });
      }
    ], function(err, results){
      done();
    })
  },
  // next, we add the all of the teams.
  function(done){
    async.parallel([
      function(done){
        models.Team.create({
          name: 'Cavaliers',
          city: 'Cleveland',
          players: [
            {
              name: 'Lebron James',
              position: 'SF',
              jerseyNumber: 23
            },
            {
              name: 'Kyrie Irving',
              position: 'PG',
              jerseyNumber: 2
            },
            {
              name: 'Timothy Mozgov',
              position: 'C',
              jerseyNumber: 20
            },
            {
              name: 'Tristan Thompson',
              position: 'PF',
              jerseyNumber: 13
            },
            {
              name: 'J.R. Smith',
              position: 'SG',
              jerseyNumber: 5
            }
          ]
        }, done);
      },
      function(done){
        models.Team.create({
          name: 'Warriors',
          city: 'Golden State',
          players: [
            {
              name: 'Stephen Curry',
              position: 'PG',
              jerseyNumber: 30
            },
            {
              name: 'Klay Thompson',
              position: 'SG',
              jerseyNumber: 11
            },
            {
              name: 'Draymond Green',
              position: 'PF',
              jerseyNumber: 23
            },
            {
              name: 'Andrew Bogut',
              position: 'C',
              jerseyNumber: 13
            },
            {
              name: 'Harrison Barnes',
              position: 'SF',
              jerseyNumber: 40
            }
          ]
        }, done);
      },
    ], function(err, results){
      models.User.create({
        firstName: "Fred",
        lastName: "Durst",
        email: "limpkickinit@hotmail.com"
      }).then(function(user){
        async.parallel([
          function(done){
            models.Ownership.create({
              UserId: user.id,
              teamId: results[0]._id.toString()
            }).then(function(){
              done();
            })
          }, function(done){
            models.Ownership.create({
              UserId: user.id,
              teamId: results[1]._id.toString()
            }).then(function(){
              done();
            });
        }], function(err, results){
          done();
        })
      });
    });
  }
], function(err, results){
  mongoose.disconnect();
});
