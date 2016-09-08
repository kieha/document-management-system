/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

const User = require('../models/user');
const Document = require('../models/document');

module.exports = {
  create: (req, res) => {
    const user = new User();
    user.username = req.body.username;
    user.name = { firstname: req.body.firstname, lastname: req.body.lastname };
    user.email = req.body.email;
    user.password = req.body.password;

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          res.status(409).send({ message: 'Duplicate user entry.' });
        } else {
          res.status(400).send({ message: 'Error creating user.' });
        }
      } else {
        res.status(201).send({
          message: 'User created successfully.',
          user,
        });
      }
    });
  },

  all: (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.status(400).send({ error: 'Could not fetch users.' });
      } else if (users.length === 0) {
        res.status(404).send({ error: 'No users to retrieve.' });
      } else {
        res.status(200).send(users);
      }
    });
  },

  find: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'Could not fetch user.' });
      } else {
        res.status(200).send(user);
      }
    });
  },

  update: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'User not found.' });
        return;
      }
      if (req.body.username) user.username = req.body.username;
      if (req.body.firstname) user.name.firstname = req.body.firstname;
      if (req.body.lastname) user.name.lastname = req.body.lastname;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;

      user.save((error) => {
        if (error) {
          if (error.code === 11000) {
            res.status(409).send({ error: 'Duplicate entry.' });
          } else {
            res.status(400).send({ error: 'Error updating user.' });
          }
        } else {
          res.status(200).send({ message: 'User updated successfully.' });
        }
      });
    });
  },

  delete: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'User not found.' });
        return;
      }
      user.remove((error) => {
        if (error) {
          res.status(400).send({ error: 'Could not delete user.' });
        } else {
          res.status(200).send({ message: 'User deleted successfully.' });
        }
      });
    });
  },

  getUserDocuments: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'User not found.' });
        return;
      }
      Document.find({ owner: user._id }, (error, documents) => {
        if (error) {
          res.status(400).send({ error: 'Could not fetch documents.' });
        } else if (documents.length === 0) {
          res.status(404).send({ error: 'No documents found.' });
        } else {
          res.status(200).send(documents);
        }
      });
    });
  },
};
