// const Sequelize = require('sequelize');
// module.exports = function(sequelize, DataTypes) {
//   return sequelize.define('Users', {
//     id: {
//       autoIncrement: true,
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     username: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//       unique: "Users_username_key"
//     },
//     password: {
//       type: DataTypes.STRING(255),
//       allowNull: false
//     }
//   }, {
//     sequelize,
//     tableName: 'Users',
//     schema: 'public',
//     timestamps: true,
//     indexes: [
//       {
//         name: "Users_pkey",
//         unique: true,
//         fields: [
//           { name: "id" },
//         ]
//       },
//       {
//         name: "Users_username_key",
//         unique: true,
//         fields: [
//           { name: "username" },
//         ]
//       },
//     ]
//   });

//   return Users; // Ensure you return the model so it can be used elsewhere
// };


const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Users = sequelize.define('Users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "Users_username_key"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Users',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "Users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "Users_username_key",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
    ]
  });

  return Users;
};
