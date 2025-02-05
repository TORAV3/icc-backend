module.exports = (sequelize, DataTypes) => {
  const companyDetail = sequelize.define(
    "companyDetail",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name_company: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
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
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "company_details",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  companyDetail.associate = (models) => {
    companyDetail.belongsTo(models.user, { foreignKey: "companyId" });
  };

  return companyDetail;
};
