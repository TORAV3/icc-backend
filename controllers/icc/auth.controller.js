const { Sequelize } = require("sequelize");
const { sequelize } = require("../../models/index.model");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  badRequestResponse,
  successCreatedResponse,
  internalServerErrorResponse,
  notfoundResponse,
  successResponse,
} = require("../../configs/response");
const { user } = require("../../models/index.model");
const { userDetail } = require("../../models/index.model");
const { companyDetail } = require("../../models/index.model");

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
    type,
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
    interest_field,
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

    const result = await sequelize.transaction(async (t) => {
      const userCreated = await user.create(
        {
          email,
          phone,
          password: hashedPassword,
          type,
        },
        { transaction: t }
      );

      // Use userCreated.id instead of userId from req.body
      const userFolderPath = path.join(
        __dirname,
        "../public/upload",
        userCreated.id.toString()
      );
      if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath, { recursive: true });
      }

      let arrFilename = [];
      const saveBase64ToFile = (base64String, fileName) => {
        if (!base64String) return;
        const matches = base64String.match(/^data:(.+);base64,/);
        if (!matches || matches.length < 2) {
          return badRequestResponse(res, "File invalid");
        }
        const extension = matches[1].split("/")[1];
        const filePath = path.join(userFolderPath, `${fileName}.${extension}`);
        arrFilename.push(`${fileName}.${extension}`);
        const base64Data = base64String.split(";base64,").pop();
        fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
      };

      saveBase64ToFile(upload_file, `upload_file_${userCreated.id}`);
      saveBase64ToFile(ktp, `ktp_${userCreated.id}`);
      saveBase64ToFile(zairyoukado, `zairyoukado_${userCreated.id}`);
      saveBase64ToFile(ijazah, `ijazah_${userCreated.id}`);
      saveBase64ToFile(certificate, `certificate_${userCreated.id}`);
      saveBase64ToFile(
        certificate_field,
        `certificate_field_${userCreated.id}`
      );
      saveBase64ToFile(cv, `cv_${userCreated.id}`);
      saveBase64ToFile(
        immigration_passport,
        `immigration_passport_${userCreated.id}`
      );
      saveBase64ToFile(latest_passport, `latest_passport_${userCreated.id}`);
      saveBase64ToFile(photograph, `photograph_${userCreated.id}`);

      await userDetail.create(
        {
          fullname,
          phone,
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
          interest_field,
          contract_period,
          my_number,
          upload_file: arrFilename[0],
          ktp: arrFilename[1],
          zairyoukado: arrFilename[2],
          ijazah: arrFilename[3],
          certificate: arrFilename[4],
          certificate_field: arrFilename[5],
          cv: arrFilename[6],
          immigration_passport: arrFilename[7],
          latest_passport: arrFilename[8],
          photograph: arrFilename[9],
          userId: userCreated.id,
        },
        { transaction: t }
      );

      return userCreated;
    });

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(
      res,
      "Proses pendaftaran peserta berhasil",
      timeExecution
    );
  } catch (error) {
    try {
      // Ensure we only delete the folder if userCreated exists
      if (result?.id) {
        const userFolderPath = path.join(
          __dirname,
          "../public/upload",
          result.id.toString()
        );
        if (fs.existsSync(userFolderPath)) {
          fs.rmSync(userFolderPath, { recursive: true, force: true });
        }
      }
    } catch (folderDeletionError) {
      console.error("Failed to delete folder:", folderDeletionError);
    }

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

    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      const [field] = error.fields;
      const value = error.value;

      let fieldName;
      switch (field) {
        case "userId":
          fieldName = "ID User";
          break;
        default:
          fieldName = field;
          break;
      }
      const timeExecution = Date.now() - startTime;
      return badRequestResponse(
        res,
        `Data '${value}' pada '${fieldName}' belum terdaftar.`,
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
    name_company,
    email,
    password,
    type,
    address_company,
    country,
    pic_name,
    pic_number,
    business_sector,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sequelize.transaction(async (t) => {
      const companyCreated = await user.create(
        {
          email,
          password: hashedPassword,
          type,
        },
        { transaction: t }
      );

      await companyDetail.create(
        {
          name_company,
          address_company,
          country,
          pic_name,
          pic_number,
          business_sector,
          companyId: companyCreated.id,
        },
        { transaction: t }
      );

      return companyCreated;
    });

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(
      res,
      "Proses pendaftaran perusahaan berhasil",
      timeExecution
    );
  } catch (error) {
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

const getLoginDataController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.userLoginData;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
      include: ["userDetail", "companyDetail", "role", "access"],
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "User tidak ditemukan", timeExecution);
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(res, userData, timeExecution);
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
  getLoginDataController,
};
