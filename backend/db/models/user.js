"use strict";
const { Validator } = require("sequelize");
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [3, 30],
					isNotEmail(value) {
						if (Validator.isEmail(value)) {
							throw new Error("Cannot be an email.");
						}
					},
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [3, 256],
				},
			},
			hashedPassword: {
				type: DataTypes.STRING.BINARY,
				allowNull: false,
				validate: {
					len: [60, 60],
				},
			},
		},
    {
      
     /*  For example, 
     User.scope('currentUser').findByPk(id) 
     will find a User by the specified id and return 
     only the User fields that the currentUser model scope allows. */
      
			defaultScope: {
				attributes: {
					exclude: ["hashedPassword", "email", "createdAt", "updatedAt"],
				},
			},
			scopes: {
				currentUser: {
					attributes: { exclude: ["hashedPassword"] },
				},
				loginUser: {
					attributes: {},
				},
			},
		}
	);
	User.associate = function (models) {
		User.hasMany(models.Comment, { foreignKey:'userId'});
		User.hasMany(models.AnswerComment, { foreignKey:'userId'});
  };
  
User.prototype.toSafeObject = function () {
	// remember, this cannot be an arrow function
	//model file that will return an object with the User instance information that is safe to save to a JWT.
	const { id, username, email } = this; // context will be the User instance
	return { id, username, email };
};

  User.prototype.validatePassword = function (password) {
    //accept a password string and return true 
    //if there is a match with the User instance's hashedPassword, otherwise return false.
		return bcrypt.compareSync(password, this.hashedPassword.toString());
};

  //USER STATIC METHODS

  User.getCurrentUserById = async function (id) {
		//accept an id and return a User with that id using the currentUser scope.
		return await User.scope("currentUser").findByPk(id);
  };
  User.login = async function ({ credential, password }) {
		const { Op } = require("sequelize");
		const user = await User.scope("loginUser").findOne({
			where: {
				[Op.or]: {
					username: credential,
					email: credential,
				},
			},
		});
		if (user && user.validatePassword(password)) {
			return await User.scope("currentUser").findByPk(user.id);
		}
  };
  
  User.signup = async function ({ username, email, password }) {
    /* an object with a username, email and password key. 
    Hash the password using bcryptjs package's hashSync method. 
    Create a User with the username, email, and hashedPassword. 
    Return the created user with the currentUser scope. */
		const hashedPassword = bcrypt.hashSync(password);
		const user = await User.create({
			username,
			email,
			hashedPassword,
		});
		return await User.scope("currentUser").findByPk(user.id);
  };
  


	return User;
};
