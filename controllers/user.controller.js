const db = require("../models");
const config = require('../config/db.config')
const User = db.userModel;
const Op = db.Sequelize.Op;

const bcrypt = require('bcrypt');
const saltRounds = 10;
const secret = 'mysecretkey';
var jwt = require("jsonwebtoken");

// User signin
exports.signin = (req, res) => {
  console.log(req.body)
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      // var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (err) {
          return res.status(404).send({ message: "Somthing went wrong." });
        }
        var passwordIsValid = result;
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
  
        var token = jwt.sign({ id: user.id }, secret, {
          expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
          id: user.id,
          username: user.firstname,
          email: user.email,
          accessToken: token
        });

      });
   
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

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
        password: bcrypt.hashSync(req.body.password, saltRounds)
      };
      
      // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      //   console.log(err);
      //   users.password = hash;
      // });
      console.log(users);

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

// Retrieve all Users from the database with filter.
exports.findAllWithSearch = (req, res) => {
  const { page, size, search } = req.params;
  console.log(req.params);
  console.log(page,'=== '+ size )
  const { limit, offset } = getPagination(page, size);
  var condition = null;
if(search != 'undefined' ){
     condition =  { [Op.or]: [
      {firstname: { [Op.like]: `%${search}%` }},
      {lastname: { [Op.like]: `%${search}%` }},
      {email: { [Op.like]: `%${search}%` }}
     ]
    }
  }

console.log('condition', condition);
    User.findAndCountAll({ where: condition, limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Users."
        });
      });
  };

  // Find all  Users
exports.findAll = (req, res) => {
  const { page, size } = req.params;
  const { limit, offset } = getPagination(page, size);

    User.findAndCountAll({ limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
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
  console.log(id);
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


  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, users, totalPages, currentPage };
  };

  const getPagination = (page, size) => {
    const limit = size ? +size : 1;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };