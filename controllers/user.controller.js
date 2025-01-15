const fs = require("fs");
const path = require("path");
const { user } = require("../models/index.model");
const {
  internalServerErrorResponse,
  successResponse,
  notfoundResponse,
} = require("../configs/response");

const getAllUserController = async (req, res) => {
  const startTime = Date.now();
  try {
    const users = await user.findAll();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, users, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getUserByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const users = await user.findOne({
      where: {
        id,
      },
    });

    if (!users) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "User tidak ditemukan", timeExecution);
    }

    const userPlain = users.toJSON();

    const encodeFileToBase64 = (fileName, folderId) => {
      if (!fileName) return null;
      const userFolderPath = path.join(
        __dirname,
        "../public/upload",
        folderId.toString()
      );
      const filePath = path.join(userFolderPath, fileName);

      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return `data:image/${path
          .extname(fileName)
          .slice(1)};base64,${fileBuffer.toString("base64")}`;
      }
      return null;
    };

    const timeExecution = Date.now() - startTime;
    return successResponse(res, userPlain, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getAllUserController,
  getUserByIdController,
};
