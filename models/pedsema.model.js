module.exports = (sequelize, DataTypes) => {
  const ips = sequelize.define(
    "pedsema",
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
      norek: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("draft", "published", "archived"),
        allowNull: true,
        defaultValue: "draft",
      },
    },
    {
      tableName: "pedsemas",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return ips;
};
