var express = require('express');
var cons = require('consolidate');
var app = express();
var path = require('path');
// passport
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');
var expressValidator = require('express-validator');
var util = require('util');
// nodemailer
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var flash = require('connect-flash');
var soap = require('soap');
var json2csv = require('json2csv');
var fs = require('fs');
// for mpesa
var prettyjson = require('prettyjson');
var options = {
  noColor: true
};

// cross origin resource(cors)
var cors = require('cors');
app.use(cors());
// soap service

// express middleware
var bodyParser = require('body-parser');
// include mongoose
var mongoose = require('mongoose');
var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/washiradb';
    // 'mongodb://heroku_l1ppn7j1:jmvhcquindesu04pje4d7vlf01@ds133388.mlab.com:33388/heroku_l1ppn7j1';
mongoose.connect(uristring, function(err, res) {
    if (err) {
        console.log('Error connecting to:', uristring);

    }
});
mongoose.Promise = global.Promise;
// express settings
app.set('port', (process.env.PORT || 8081));
app.engine('html', cons.liquid);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
// express middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {  
    
    maxAge   : 1000*60*60     
  }   
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
;

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
// Connect Flash
app.use(flash());
// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
// include routes
var taskRoutes = require('./routes/tasks');
app.use(taskRoutes);
var indexRoute = require('./routes/index');
app.use(indexRoute);
var accesorsRoute = require('./routes/accesors');
app.use(accesorsRoute);
var adminsRoute = require('./routes/admins');
app.use(adminsRoute);
var techniciansRoute = require('./routes/technicians');
app.use(techniciansRoute);
// passport config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.listen(app.get('port'),'0.0.0.0', function() {
    console.log('server running on http://127.0.0.1:%s', app.get('port'));
});
