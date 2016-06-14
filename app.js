/**
 * Created by chowmean on 6/13/16.
 */

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/practo_assign');

var User     = require('./database');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


app.use( function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Origin");
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET, OPTIONS");
    next();
});



router.route('/users')

// create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        var user = new User();      // create a new instance of the Bear model
        user.name = req.body.name;
        user.email = req.body.email;



        // save the bear and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });

    })


    .get(function(req, res) {
    User.find(function(err, bears) {
        if (err)
            res.send(err);

        res.json(bears);
    });
    })




router.route('/users/:name')

// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        User.findOne({name:req.params.name}, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })

    .put(function(req, res) {
        User.findOne({_id:req.params.name}, function(err, user) {

            if (err)
            {
                res.send(err);
            }

            user.name = req.body.name;  // update the bears info
            user.email=req.body.email;
            // save the bear
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            });

        });
    })

    .delete(function(req, res) {

         User.findOne({name: req.params.name},function(err,user){
         if(user){
         User.remove({
             name: req.params.name
             }, function(err, user) {
             if (err)
             res.send(err);
             console.log('here');
             res.json({ message: 'Successfully deleted' });
             });

         }
         else{
             console.log('here');
             res.json({ message: 'User does not exist' });
             }
         });

         });








app.use('/api', router);




// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server Listening on' + port);




