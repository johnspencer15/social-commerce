var express = require('express'),
    path = require('path'),
    router = express.Router(),
    User = require(path.join(__dirname, '/../models/user'));

router.get('/users', function(req, res) {
    if (!req.user) {
      res.sendFile(path.join(__dirname + '/../public/views/permissionError.html'));
    } else {
      res.sendFile(path.join(__dirname + '/../public/views/users.html'));  
    }
});

router.get('/getUsers', function(req, res) {
  if (!req.user) {
    res.sendFile(path.join(__dirname + '/../public/views/permissionError.html'));
  } else {
    User.find({ _id : { $ne : req.user._id }}, function(err, users) {
      if (err) {
        res.send({ status : 'error'});
      }
      res.send({ users : users, user : req.user });
    }); 
  }
});

router.get('/getFriends', function(req, res) {
  //array of friends
  var friends = [],
      i;
  
  if (!req.user) {
    res.sendFile(path.join(__dirname + '/../public/views/permissionError.html'));
  } else {
    User.find({ _id : { $ne : req.user._id }}, function(err, users) {
      if (err) {
        return res.send({ status : 'error'});
      }
      
      //loop through users and add friends to array
      for (i = 0; i < users.length; i++) {
        if (req.user.friends.indexOf(users[i].username) >= 0) {
          friends.push(users[i]);
        }
      }
      res.send({ friends : friends, user : req.user });
    }); 
  }
});

router.post('/addFriend', function(req, res) {
  if (!req.user) {
    res.sendFile(path.join(__dirname + '/../public/views/permissionError.html'));
  } else {
    User.findById(req.user._id, function(err, user) {
      if (err) {
        return res.send({ status : 'error'});
      }
      for (var i = 0; i < user.friends.length; i++) {
        if (user.friends[i] === req.body.id) {
          return res.send({ status : 'already friend' });
        }
      }
      user.friends.push(req.body.username);
      user.save(function(err) {
        if (err) {
          return res.send({ status : 'error'});
        }
        res.send({ status : 'success' });
      });
    });
  }
  
});

router.post('/unfriend', function(req, res) {
  if (!req.user) {
    return res.sendFile(path.join(__dirname + '/../public/views/permissionError.html'));
  }
  User.findById(req.user._id, function(err, user) {
    
    //index of friend we want to remove in user's friends list
    var indexOfFriend = user.friends.indexOf(req.body.username);
    
    if (err) {
      return res.send({ status : 'error'});
    }
    
    if (indexOfFriend < 0) {
      return res.send({ status : 'not friends'});
    }
    
    user.friends.splice(indexOfFriend, 1);
    
    user.save(function(err) {
      if (err) {
        return res.send({ status : 'error'});
      }
      res.send({ status : 'success' });
    });
  });
  
});

module.exports = router;
