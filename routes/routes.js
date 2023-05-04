const express = require('express');
const multer = require('multer');
const User = require('../models/users');
const fs = require('fs');

const router = express.Router();

// Image Upload
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads');
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
	},
});
var upload = multer({
	storage: storage,
}).single('image');

// Insert User into database router
router.post('/add-user', upload, async (req, res) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		image: req.file.filename,
	});
	user.save().then(() => {
		res.render('addUsers', {
			message: 'user added successfully',
			title: 'Add Users',
		});
	});
});

// Get User router
router.get('/', (req, res) => {
	User.find()
		.then((users) => {
			res.render('index', {
				title: 'Home Page',
				users: users,
			});
		})
		.catch((error) => {
			res.json({ message: error.message });
		});
});

router.get('/add-user', (req, res) => {
	res.render('addUsers', { title: 'Add Users' });
});

// Edit User Route
router.get('/edit/:id', async (req, res) => {
	let id = req.params.id;
	try {
		const userDetails = await User.findById(id);
		if (userDetails) {
			res.render('editUser', {
				title: 'Edit User',
				user: userDetails,
			});
		}
	} catch (error) {
		console.log(error);
	}
});
module.exports = router;

// Update User Route
router.post('/update/:id', upload, (req, res) => {
	let id = req.params.id;
	let newImage = '';

	if (req.file) {
		newImage = req.file.filename;
		try {
			fs.unlinkSync('./uploads/' + req.body.old_image);
		} catch (error) {
			console.log(error);
		}
	} else {
		newImage = req.body.old_image;
	}

	const updatedUser = async (id) => {
		try {
			const updatedResult = await User.findByIdAndUpdate(
				id,
				{
					name: req.body.name,
					email: req.body.email,
					phone: req.body.phone,
					image: newImage,
				},
				{
					new: true,
				}
			);
			if (updatedResult) {
				res.render('editUser', {
					message: 'user updated successfully',
					title: 'Edit User',
					user: updatedResult,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
	updatedUser(id);
});

// Delete User Route
router.get('/delete/:id', async (req, res) => {
	let id = req.params.id;
	const deleteDetails = await User.findByIdAndRemove(id);
	if (deleteDetails?.image) {
		try {
			fs.unlinkSync('./uploads/' + deleteDetails?.image);
			res.redirect('/');
		} catch (error) {
			console.log(error);
		}
	}
});
