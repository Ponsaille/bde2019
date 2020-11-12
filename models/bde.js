'use strict';
module.exports = (sequelize, DataTypes) => {
  const BDE = sequelize.define('BDE', {
    name: DataTypes.STRING,
    nbVotes: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    timestamps: true,
  });
  BDE.associate = function(models) {
    // associations can be defined here
  };
  return BDE;
};