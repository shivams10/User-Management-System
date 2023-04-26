const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
	session({
		secret: 'my secret key',
		saveUninitialized: true,
		resave: false,
	})
);
app.use((req, res, next) => {
	res.locals.message = req.session.message;
	delete req.session.message;
	next();
});

// set template engine
app.set('view engine', 'ejs');

// route prefix
app.use('', require('./routes/routes'));

module.exports = app;
