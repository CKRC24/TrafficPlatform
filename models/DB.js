var Sequelize = require('sequelize');

var db = new Sequelize('Test', 'root', 'ab2289114');
var Beacon = db.define('beacon', {
    UUID: {
        type: Sequelize.BIGINT,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    Major: Sequelize.INTEGER,
    Minor: Sequelize.INTEGER,
    Battery: Sequelize.INTEGER,
    Type: Sequelize.STRING,
    location: Sequelize.STRING
});
var User = db.define('User', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isUnique: function(value, next) {
                User.find({
                    where: {
                        password: value
                    }
                }).done(function(user) {
                    if (user) {
                        return next("Password used, please change")
                    }
                    next();
                });
            }
        }
    }
});

module.exports.db = db;
module.exports.Beacon = Beacon;
module.exports.User = User;
