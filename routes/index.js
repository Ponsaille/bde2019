var express = require('express');
var router = express.Router();
const BDEController = require('../controllers/index').BDE;
const BDE = require('../models').BDE;
const Users = require('../models').Users;

const { urlGoogle, getGoogleAccountFromCode } = require('../utils/googleapis');

/* GET home page. */
router.get('/', function(req, res, next) {
  BDE.findAll({attributes: ['name', "score", "nbVotes"]}).then(bdes => {
    const percentsScore1 = (bdes[0].score/(bdes[0].score + bdes[1].score));
    const percentsScore2 = (bdes[0].nbVotes/(bdes[0].nbVotes + bdes[1].nbVotes));
    const percents = 100 * (percentsScore1 + percentsScore2) / 2;
    const scores = {
      unchained: {
        votes: bdes[1].nbVotes,
        score: bdes[1].score
      },
      genesis: {
        votes: bdes[0].nbVotes,
        score: bdes[0].score
      }
    }
    res.render('index', { title: 'BDE 2019', googleLink: urlGoogle(), geneScore: percents, scores, session: req.session });
  });
});

router.get('/increment/:bde', BDEController.increment);
router.get('/scores', BDEController.scores);
router.post('/updateScores', BDEController.updateScores);

router.get('/google-auth', async function(req, res) {
  const data = await getGoogleAccountFromCode(req.query.code);
  Users.findAll({
    where: {
      id: data.id
    }
  })
  .then(users => {
    if(users.length == 1) {
      req.session.userId = users[0].id;
      res.redirect('/');
    } else {
      Users.create({
        id: data.id,
        email: data.email,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .then(user => {
        req.session.userId = user.id;
        res.redirect('/');
      })
      .catch(error => res.status(400).send(error));
    }
  })
  .catch(error => res.status(400).send(error));
})


router.get('/disconnect', async function(req, res) {
  await req.session.destroy();
  res.redirect('/');
})



module.exports = router;
