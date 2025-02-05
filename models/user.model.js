module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: "register",
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "roles",
          key: "id",
        },
      },
      type: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      activeStatus: {
        type: DataTypes.STRING(1),
        allowNull: true,
        defaultValue: "1",
      },
    },
    {
      tableName: "users",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  user.associate = (models) => {
    user.hasOne(models.userDetail, { foreignKey: "userId" });
    user.hasOne(models.companyDetail, { foreignKey: "companyId" });
    user.belongsTo(models.role, { foreignKey: "roleId" });
    user.hasOne(models.access, { foreignKey: "userId" });
  };

  return user;
};
