var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgresl',
  });
}else {
  sequelize = new Sequelize('','','', {
    host :'',
    dialect : 'mysql',
    port : 3306,

    define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true
   }
  });
}

var db = {};

// db.users = sequelize.import(__dirname + '/models/users.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
