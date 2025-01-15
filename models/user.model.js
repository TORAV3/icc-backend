module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fullname: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(14),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      program_type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      address_indo: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      address_japan: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      company_name: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      address_company: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      association_name: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      address_association: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      career_history: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rejected: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      rejected_detail: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      work_field: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      contract_period: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      my_number: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      upload_file: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      upload_file: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      ktp: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      zairyoukado: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      ijazah: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      certificate: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      certificate: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      certificate_field: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      cv: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      immigration_passport: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      latest_passport: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      photograph: {
        type: DataTypes.STRING(60),
        allowNull: false,
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

  return user;
};
