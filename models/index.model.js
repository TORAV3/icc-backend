const Sequelize = require("sequelize");
const config = require("../configs/database");

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);

const user = require("./user.model")(sequelize, Sequelize);
const userDetail = require("./userDetail.model")(sequelize, Sequelize);
const companyDetail = require("./companyDetail.model")(sequelize, Sequelize);
const access = require("./access.model")(sequelize, Sequelize);
const role = require("./role.model")(sequelize, Sequelize);
const faq = require("./faq.model")(sequelize, Sequelize);
const pedsema = require("./pedsema.model")(sequelize, Sequelize);
const aduan = require("./aduan.model")(sequelize, Sequelize);
const artikel = require("./artikel.model")(sequelize, Sequelize);

user.associate({ userDetail, companyDetail, role, access });
userDetail.associate({ user });
companyDetail.associate({ user });
access.associate({ user });
role.associate({ user });

module.exports = {
  sequelize,
  user,
  userDetail,
  companyDetail,
  access,
  role,
  faq,
  pedsema,
  aduan,
  artikel,
};
