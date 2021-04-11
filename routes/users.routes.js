module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/users", users.create);

  // Retrieve all users
  router.get("/users/:page/:size", users.findAll);

  // Retrieve all search result 
  router.get("/users/search/:page/:size/:search", users.findAllWithSearch);

  // Retrieve a single User with id 
  router.get("/users:id", users.findOne);

  // Update a User with id
  router.put("/users/:id", users.update);

  // Delete a User with id
  router.delete("/users/:id", users.delete);

  router.post("/auth/signin/", users.signin);

 app.use('/api', router);
};
