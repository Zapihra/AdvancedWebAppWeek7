var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
});

router.post('/api/user/register', function(req, res) {
  console.log(req.params)
})

module.exports = router;
