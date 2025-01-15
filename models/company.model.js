module.exports = (sequelize, DataTypes) => {
  const company = sequelize.define(
    "company",
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
      address_company: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      pic_name: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      pic_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      business_sector: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      tableName: "companies",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return company;
};
