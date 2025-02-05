module.exports = (sequelize, DataTypes) => {
  const aduan = sequelize.define(
    "aduan",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      category: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT, // For long text
        allowNull: false, // Field cannot be null
      },
    },
    {
      tableName: "aduans",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return aduan;
};
