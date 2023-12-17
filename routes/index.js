var express = require('express');
var router = express.Router();
var session = require('express-session')

var bcrypt = require('bcryptjs')
const numberGenerator = require("number-generator");
const generator = numberGenerator.aleaRNGFactory(2);

var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var numbers = [514426, 885999, 404];
var users = [];
var userTodo = [];
var i = 0;

passport.use(new LocalStrategy(
  (username, password, done) => {
  const user = users.find(u => u.username === username);
  //console.log(user)
  if (!user) {
  return done(null, false, { message: 'Incorrect username.' });
  }
  if (false === bcrypt.compareSync(password, user.password) ) {
    return done(null, false, { message: 'Incorrect password.' });
  }
  return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
  });
 passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send("hello")
});

router.post('/api/user/register', function(req, res) {
  
  if (req.isAuthenticated()) {
    res.redirect('/')
  }
  else {
  var found = false;
  
  for (let i = 0; i < users.length; i++) {
    const element = users[i];
    //console.log(element.username, req.body.username)
    found = (element.username == req.body.username)
    if (found == true) {
      res.status(400).send("username already in use")
      break
    }
  }

  if (found == false) {
    //var number = generator.uInt32();
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync( req.body.password, salt)

    users.push({"id": numbers[i],
      "username": req.body.username, 
      "password": hash
    })
    i = i + 1;
    res.json({
      "id": numbers[i-1],
      "username": req.body.username,
      "password": hash
    })
  }
}
})

router.get('/api/user/list', function(req, res) {
  res.send(users)
})

router.post('/api/user/login', function(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('/')
      }
    else{
      next()
    }
  },
  passport.authenticate('local'), (req,res) => {
    res.status(200).send("success");
    }
  );


router.get('/api/secret', 
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    res.status('200').send("access")
    }
    else{
      res.status('401').send('no access');
    }
  })

router.post('/api/todos', function (req,res) {
  if (req.isAuthenticated()) {
    var list = userTodo.find(u => u.id === req.user.id);
    if (list == undefined) {
      userTodo.push({
        "id": req.user.id,
        "todos": [
          req.body.todo
        ]
      })
      list = userTodo.find(u => u.id === req.user.id);
    }
    else {
      list.todos.push(req.body.todo)
    }
    
    res.send(JSON.stringify(list))
  }
  else {
    res.status(401).send("access denied")
  }
})

router.get('/api/todos/list', function(req, res) {
  res.send(userTodo)
})

module.exports = router;
