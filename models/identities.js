'use strict';
module.exports = (sequelize, DataTypes) => {
  const Identities = sequelize.define('Identities', {
    ip: DataTypes.STRING,
    lastVote: DataTypes.DATE,
    lastMessage: DataTypes.DATE
  }, {});
  Identities.associate = function(models) {
    // associations can be defined here
  };
  return Identities;
};