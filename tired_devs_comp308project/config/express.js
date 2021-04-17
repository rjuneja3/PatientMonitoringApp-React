// Load the module dependencies
const config = require('./config');
const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Define the Express configuration method
module.exports = function () {
    // Create a new Express application instance
    const app = express();

    // Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    // Use the 'body-parser' and 'method-override' middleware functions
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
    });

    app.use(cors());
    app.use(methodOverride());// use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
    //handle the use of PUT or DELETE methods
    //override with POST having ?_method=DELETE or
    // ?_method=PUT
    app.use(methodOverride(('_method')));

    // Configure the 'session' middleware
    app.use(session({
        //a session is uninitialized when it is new but not modified
        //force a session that is "uninitialized" to be saved to the store
        saveUninitialized: true,
        //forces the session to be saved back to the session store
        //even if the session was never modified during the request
        resave: true,
        secret: config.sessionSecret // secret used to sign the session ID cookie
    }));

    // Set the application view engine and 'views' folder
    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    //app.use(flash());
    // app.use(passport.initialize()); //bootstrapping the passport module
    // app.use(passport.session); // keep track of user session
    
    // Load the 'index' routing file
    require('../app/routes/users.server.routes.js')(app);

    require('../app/routes/dailyReport.server.routes.js')(app);
    require('../app/routes/emergencyAlert.server.routes.js')(app);
    require('../app/routes/dailyTips.server.routes.js')(app);
    require('../app/routes/ai.server.routes.js')(app);

    // Configure static file serving
    app.use(express.static('./public'));
    // app.use('/css',express.static(__dirname +'/css'));

    // Return the Express application instance
    return app;
};