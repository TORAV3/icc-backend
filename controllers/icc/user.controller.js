const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const { user, userDetail, companyDetail } = require("../../models/index.model");
const {
  internalServerErrorResponse,
  successResponse,
  notfoundResponse,
  successCreatedResponse,
  badRequestResponse,
} = require("../../configs/response");

const getAllPesertaUserController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { status } = req.query;

    let users;

    if (
      status === "reviewed" ||
      status === "revisi" ||
      status === "register" ||
      status === "approve" ||
      status === "reject"
    ) {
      users = await user.findAll({
        where: {
          type: "peserta",
          status,
        },
        include: [
          {
            model: userDetail,
          },
        ],
      });
    } else {
      users = await user.findAll({
        where: {
          type: "peserta",
        },
        include: [
          {
            model: userDetail,
          },
        ],
      });
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(res, users, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getPesertaCountController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { status } = req.query;

    let whereCondition = { type: "peserta" };
    if (status) {
      whereCondition.status = status;
    }

    const total = await user.count({ where: whereCondition });

    const register = await user.count({
      where: { type: "peserta", status: "register" },
    });
    const approve = await user.count({
      where: { type: "peserta", status: "approve" },
    });
    const reject = await user.count({
      where: { type: "peserta", status: "reject" },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      { total, register, approve, reject },
      timeExecution
    );
  } catch (error) {
    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getAllInternalUserController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { status } = req.query;

    let users;

    if (status === "all") {
      users = await user.findAll({
        where: {
          type: "internal",
        },
        include: ["role"],
      });
    } else {
      users = await user.findAll({
        where: {
          type: "internal",
          activeStatus: status,
        },
        include: ["role"],
      });
    }

    const timeExecution = Date.now() - startTime;
    return successResponse(res, users, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getInternalCountController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { status } = req.query;

    let whereCondition = { type: "internal" };
    if (status) {
      whereCondition.status = status;
    }

    const total = await user.count({ where: whereCondition });

    const active = await user.count({
      where: { type: "internal", activeStatus: "1" },
    });
    const inactive = await user.count({
      where: { type: "internal", activeStatus: "0" },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, { total, active, inactive }, timeExecution);
  } catch (error) {
    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getAllCompanyUserController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { status } = req.query;

    let users;

    users = await user.findAll({
      where: {
        type: "perusahaan",
      },
      include: [
        {
          model: companyDetail,
        },
      ],
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, users, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getCompanyCountController = async (req, res) => {
  const startTime = Date.now();
  try {
    const { status } = req.query;

    let whereCondition = { type: "perusahaan" };
    if (status) {
      whereCondition.status = status;
    }

    const total = await user.count({ where: whereCondition });

    const active = await user.count({
      where: { type: "perusahaan", activeStatus: "1" },
    });
    const inactive = await user.count({
      where: { type: "perusahaan", activeStatus: "0" },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, { total, active, inactive }, timeExecution);
  } catch (error) {
    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getPesertaUserByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
      include: [
        {
          model: userDetail,
        },
      ],
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "User tidak ditemukan", timeExecution);
    }

    const userPlain = userData.toJSON();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, userPlain, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getInternalUserByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
      include: ["role", "access"],
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

const getCompanyUserByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
      include: [
        {
          model: companyDetail,
        },
      ],
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

const updateInternalUserController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { email, roleId, muser, usaccess } = req.body;

  const { id } = req.params;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
      include: ["access"],
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data user tidak ditemukan", timeExecution);
    }

    userData.email = email;
    userData.roleId = roleId;

    await userData.save();

    userData.access.muser = muser;
    userData.access.usaccess = usaccess;

    await userData.access.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "User berhasil diperbaharui", timeExecution);
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

    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updateStatusInternalUserController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { status } = req.body;

  const { id } = req.params;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data user tidak ditemukan", timeExecution);
    }

    userData.activeStatus = status;

    await userData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      "Status user berhasil diperbaharui",
      timeExecution
    );
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const deleteInternalUserByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data user tidak ditemukan", timeExecution);
    }

    const userDelete = await user.destroy({
      where: {
        id,
      },
    });

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "User berhasil dihapus", timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updateStatusUserByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { status } = req.body;

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
    });

    if (!userData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data user tidak ditemukan", timeExecution);
    }

    userData.status = status;

    await userData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "Berhasil mengubah status user", timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getAllPesertaUserController,
  getPesertaCountController,
  getAllInternalUserController,
  getInternalCountController,
  getAllCompanyUserController,
  getCompanyCountController,
  getPesertaUserByIdController,
  getInternalUserByIdController,
  getCompanyUserByIdController,
  updateInternalUserController,
  updateStatusInternalUserController,
  deleteInternalUserByIdController,
  updateStatusUserByIdController,
};
