const sequelize = require('../models').sequelize;
const BDE = require('../models').BDE;
const Users = require('../models').Users;

module.exports = {
  increment(req, res) {
    if(req.session.userId) {
      Users.findAll({
        where: {
          id: req.session.userId
        }
      }).then(users => {
        if(users.length == 1) {
          if(!users[0].lastVote || ((new Date().getTime() - new Date(users[0].lastVote).getTime()) / 3600000) > 1) {
            BDE.update({
              nbVotes: sequelize.literal('nbVotes + 1')
            }, {
              where: {
                name: req.params.bde
              }
            })
            .then(bde => {
              Users.update({
                lastVote: new Date(),
                nbVotes: sequelize.literal('nbVotes + 1')
              }, {
                where: {
                  id: users[0].id
                }
              })
              .then(() => res.redirect('/'))
            })
            .catch(error => res.status(400).send(error));
          } else {
            res.send("Attend un peu ! Tu serais pas entrain d'essayer de voter plusieurs fois ? Ca ne fait que " + (new Date().getTime() - new Date(users[0].lastVote).getTime()) / 60000  + " minutes que tu as voté :/ <br> <a href=\"/\">Retour à la page d'accueil ></a>")
          }
        }
      }) 
    } else {
      res.status(403).send("Tu dois être connecté <br> <a href=\"/\">Retour à la page d'accueil ></a>")
    }
  },
  scores(req, res) {
    BDE.findAll({
      attributes: ['name', 'nbVotes', 'score']
    }).then(bdes => res.status(200).send(bdes));
  },
  updateScores(req, res) {
    if(req.body.pass = "pass") { // To change
      let promise1 = BDE.update({
        score: req.body.genesis
      }, {
        where: {
          id: 1
        }
      })
      let promise2 = BDE.update({
        score: req.body.unchained
      }, {
        where: {
          id: 2
        }
      })
      Promise.all([promise1, promise2]).then(() => {
        BDE.findAll({attributes: ['id', 'name', 'nbVotes', 'score']}).then(bdes => res.status(200).send(bdes));
      })
    }
  }
}