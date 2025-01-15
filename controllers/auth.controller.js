const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  badRequestResponse,
  successCreatedResponse,
  internalServerErrorResponse,
  notfoundResponse,
  successResponse,
} = require("../configs/response");
const { user } = require("../models/index.model");
const { company } = require("../models/index.model");

const registerUserController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const {
    fullname,
    email,
    phone,
    password,
    program_type,
    address_indo,
    address_japan,
    company_name,
    address_company,
    association_name,
    address_association,
    career_history,
    rejected,
    rejected_detail,
    work_field,
    contract_period,
    my_number,
    upload_file,
    ktp,
    zairyoukado,
    ijazah,
    certificate,
    certificate_field,
    cv,
    immigration_passport,
    latest_passport,
    photograph,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userCreated = await user.create({
      fullname,
      email,
      phone,
      password: hashedPassword,
      program_type,
      address_indo,
      address_japan,
      company_name,
      address_company,
      association_name,
      address_association,
      career_history,
      rejected,
      rejected_detail,
      work_field,
      contract_period,
      my_number,
      upload_file,
      ktp,
      zairyoukado,
      ijazah,
      certificate,
      certificate_field,
      cv,
      immigration_passport,
      latest_passport,
      photograph,
    });

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(
      res,
      "Proses pendaftaran berhasil",
      timeExecution
    );
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      let fieldName;
      const field = error.errors[0].path;
      switch (field) {
        case "fullname":
          fieldName = "Nama Lengkap";
          break;
        case "email":
          fieldName = "Email";
          break;
        case "phone":
          fieldName = "No. Telp";
          break;
        default:
          fieldName = field;
          break;
      }
      const value = error.errors[0].value;
      const timeExecution = Date.now() - startTime;
      return badRequestResponse(
        res,
        `Data '${value}' pada '${fieldName}' sudah terdaftar.`,
        timeExecution
      );
    }

    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const registerCompanyController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const {
    email,
    password,
    address_company,
    country,
    pic_name,
    pic_number,
    business_sector,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await company.create({
      email,
      password: hashedPassword,
      address_company,
      country,
      pic_name,
      pic_number,
      business_sector,
    });

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(
      res,
      "Proses pendaftaran perusahaan berhasil",
      timeExecution
    );
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      let fieldName;
      const field = error.errors[0].path;
      switch (field) {
        case "email":
          fieldName = "Email";
          break;
        default:
          fieldName = field;
          break;
      }
      const value = error.errors[0].value;
      const timeExecution = Date.now() - startTime;
      return badRequestResponse(
        res,
        `Data '${value}' pada '${fieldName}' sudah terdaftar.`,
        timeExecution
      );
    }

    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const loginController = async (req, res, startTime) => {
  const { email, password } = req.body;

  try {
    const userData = await user.findOne({
      where: {
        email,
      },
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Akun belum terdaftar", timeExecution);
    }

    if (!bcrypt.compare(password, userData.password)) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Akun belum terdaftar", timeExecution);
    }

    const token = jwt.sign(
      {
        id: userData.id,
      },
      process.env.JWTSECRET,
      {
        expiresIn: "1h",
      }
    );

    const timeExecution = Date.now() - startTime;
    return successResponse(res, token, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  registerUserController,
  registerCompanyController,
  loginController,
};
