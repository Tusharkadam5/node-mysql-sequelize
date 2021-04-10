const db = require("../models");
const User = db.userModel;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.firstname) {
        res.status(400).send({
          message: "firstName can not be empty!"
        });
        return;
      }
    
      // Create a User
      const users = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password:req.body.password
      };
    
      // Save User in the database
      User.create(users)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    const firstName = req.query.firstname;
    var condition = firstName ? { title: { [Op.like]: `%${firstName}%` } } : null;

    User.findAndCountAll({
       // where: condition,
        limit: 2,
        offset: 0
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Users."
        });
      });
  };

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    User.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
  };

// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    User.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with id=" + id
        });
      });
  };

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    User.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
  };


// Find all published Users
exports.findAllWithSearch = (req, res) => {
   var condition = firstName ? { title: { [Op.like]: `%${firstName}%` } } : null;

       // where: condition,
   User.findAll({
        where: condition,
        limit: 2,
        offset: 0
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Users."
        });
      });
  };