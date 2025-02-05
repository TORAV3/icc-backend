module.exports = (sequelize, DataTypes) => {
  const artikel = sequelize.define(
    "artikel",
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
        type: DataTypes.TEXT,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      publishdate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("draft", "published", "archived"),
        allowNull: false,
        defaultValue: "draft",
      },
    },
    {
      tableName: "artikels",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return artikel;
};
