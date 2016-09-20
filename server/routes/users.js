const Users = require('../controllers/users');

module.exports = (router) => {
  router.route('/users')
    .get(Users.all);

  router.route('/users/:user_id')
   .get(Users.find)
   .put(Users.update)
   .delete(Users.delete);

  router.get('/users/:user_id/documents', Users.getUserDocuments);
};
