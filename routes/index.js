var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs')
const numberGenerator = require("number-generator");
const generator = numberGenerator.aleaRNGFactory(2)

var list = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send("hello")
});

router.post('/api/user/register', function(req, res) {
  //console.log(req.body)
  var found = false;
  
  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    //console.log(element.username, req.body.username)
    found = (element.username == req.body.username)
    if (found == true) {
      res.status(400).send("username already in use")
      break
    }
  }

  if (found == false) {
    var number = generator.uInt32();
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync( req.body.password, salt)

    list.push({"id": number,
      "username": req.body.username, 
      "password": hash
    })
    res.json({
      "id": number,
      "username": req.body.username,
      "password": hash
    })
  }

})

router.get('/api/user/list', function(req, res) {
  res.send(JSON.stringify(list))
})




module.exports = router;
