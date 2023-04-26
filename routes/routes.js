const express = require('express');
const router = express.Router();

// Get
router.get('/', (req, res) => {
	res.render('index', { title: 'Home Page' });
});
router.get('/add-user', (req, res) => {
	res.render('addUsers', { title: 'Add Users' });
});

module.exports = router;
