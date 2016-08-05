var setupController = require('./controller/setupController')
var tweetController = require('./controller/tweetController')
var sentiment = require('sentiment')

var Twitter = require('twitter-node-client').Twitter;
var allTweets = []
var config = {
        "consumerKey": "PLB75vi64MBbhmIWFkDh54M2U",
        "consumerSecret": "FBHGfnXo87WE7v8ze1dmJMBJhaP1yTk5EzESCHCtwZRwG8Knug",
        "accessToken": "88664413-ud8au0VYumtsiFqssDMz6r9TSTgouEIuvMOgoW5rq",
        "accessTokenSecret": "zqQLumMTogo2rQDzJB7saHEM6yXrfgxzOASfnqx99xpKP",
        "callBackUrl": "http://localhost:9090/auth/twitter/callback"
}

var twitter = new Twitter(config);
var searchData;

module.exports = function(app, passport) {
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        setupController.isSetupDone(req.user, function(setupData){
            searchData = setupData
            if(setupData && setupData.length > 0){
                res.render('profile.ejs', { user : req.user, setupData:  setupData });
            }else{
                res.render('setup.ejs', { user : req.user, setupData:  setupData });
            }
        })
    });

    app.post('/search', isLoggedIn, function(req, res) {
        var searchString = ''
        searchData.forEach(function(searchTerm){
            searchString += searchTerm.search+','
        })
        var searchObj = {'q':searchString, 'count': 100, 'result_type': 'recent', 'lang': 'en'}
        if(req.body.max_id && req.body.max_id != ""){
            searchObj.max_id = req.body.max_id
        }
        searchString = searchString.substr(0, searchString.length-1)
        twitter.getSearch(searchObj, function(){}, function(data){
            statuses = JSON.parse(data).statuses
            if(statuses){
                statuses.forEach(function(status){
                    status.sentiment = sentiment(status.text)
                    allTweets.push(status)
                })
            }
            res.send({statuses: statuses, data: data});
        });
    });

    app.post('/saveTweet', isLoggedIn, function(req, res){
        var tweet;
        //console.log(allTweets)
        allTweets.forEach(function(t){
            console.log(t.id_str)
            console.log(req.body)
            if(t.id_str === req.body.id){
                tweet = t;
            }
        })
        console.log(tweet)
        tweetController.saveTweet(tweet, function(){
            res.send(req.body)    
        })
    })

    app.get('/setup', isLoggedIn, function(req, res) {
        setupController.isSetupDone(req.user, function(setupData){
            res.render('setup.ejs', { user : req.user, setupData:  setupData });
        });
    });

    app.get('/saved', isLoggedIn, function(req, res) {
        res.render('saved.ejs', { user : req.user});
    });

    app.get('/getSavedTweets', isLoggedIn, function(req, res) {
        tweetController.getTweets(function(tweets){
            res.send({tweets : tweets });
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    app.get('/setup', isLoggedIn, function(req, res) {
        res.render('setup.ejs', {
            user : req.user
        });
    });

    app.post('/saveSetup', function(req, res){
        setupController.saveSetup({username: req.user.twitter.username, value: req.body.value}, function(data){
            res.send(data);
        })
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}