const { Sequelize } = require("sequelize");
const { pedsema } = require("../../models/index.model");
const fs = require("fs");
const path = require("path");

const {
  badRequestResponse,
  successCreatedResponse,
  internalServerErrorResponse,
  notfoundResponse,
  successResponse,
} = require("../../configs/response");

const getAllPedsemaController = async (req, res) => {
  const startTime = Date.now();
  try {
    const pedsemas = await pedsema.findAll();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, pedsemas, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getPedsemaByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const pedsemaData = await pedsema.findOne({ where: { id } });

    if (!pedsemaData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Pedsema tidak ditemukan", timeExecution);
    }

    const pedsemaPlain = pedsemaData.toJSON();

    const encodeFileToBase64 = (fileName, folderId) => {
      if (!fileName) return null;

      // File is directly inside 'pedulisesama' folder
      const filePath = path.join(
        __dirname,
        "../public/upload/pedulisesama",
        `thumbnail_${folderId}.png` // Use correct filename format
      );

      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return `data:image/${path
          .extname(fileName)
          .slice(1)};base64,${fileBuffer.toString("base64")}`;
      }
      return null;
    };

    pedsemaPlain.thumbnailBase64 = encodeFileToBase64(
      pedsemaPlain.thumbnail,
      id
    );

    const timeExecution = Date.now() - startTime;
    return successResponse(res, pedsemaPlain, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const postPedsemaController = async (req, res) => {
  const startTime = Date.now();

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") req.body[key] = null;
  });

  const { title, category, description, thumbnail, norek, status } = req.body;

  try {
    const pedsemaData = await pedsema.create({
      title,
      category,
      description,
      thumbnail: null,
      norek,
      status,
    });

    let thumbnailFilename = null;

    if (thumbnail) {
      const matches = thumbnail.match(/^data:(.+);base64,/);
      if (!matches || matches.length < 2) {
        return badRequestResponse(res, "Thumbnail file invalid");
      }

      const extension = matches[1].split("/")[1];
      thumbnailFilename = `thumbnail_${pedsemaData.id}.${extension}`;

      const uploadFolderPath = path.join(
        __dirname,
        "../public/upload/pedulisesama"
      );
      if (!fs.existsSync(uploadFolderPath)) {
        fs.mkdirSync(uploadFolderPath, { recursive: true });
      }

      const filePath = path.join(uploadFolderPath, thumbnailFilename);
      const base64Data = thumbnail.split(";base64,").pop();
      fs.writeFileSync(filePath, base64Data, { encoding: "base64" });

      await pedsemaData.update({ thumbnail: thumbnailFilename });
    }

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(
      res,
      "Peduli Sesama berhasil dibuat",
      timeExecution
    );
  } catch (error) {
    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updatePedsemaController = async (req, res) => {
  const startTime = Date.now();

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") req.body[key] = null;
  });

  const { title, category, description, thumbnail, norek } = req.body;
  const { id } = req.params;

  try {
    const pedsemaData = await pedsema.findOne({ where: { id } });

    if (!pedsemaData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(
        res,
        "Peduli Sesama tidak ditemukan",
        timeExecution
      );
    }

    if (thumbnail && thumbnail.startsWith("data:image")) {
      const oldFilename = pedsemaData.thumbnail || `thumbnail_${id}.png`;
      const filePath = path.join(
        __dirname,
        "../public/upload/pedulisesama",
        oldFilename
      );

      const base64Data = thumbnail.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      fs.writeFileSync(filePath, buffer);
    }

    pedsemaData.title = title;
    pedsemaData.category = category;
    pedsemaData.description = description;
    pedsemaData.norek = norek;

    await pedsemaData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      "Peduli Sesama berhasil diperbaharui",
      timeExecution
    );
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      const field = error.errors[0].path;
      const value = error.errors[0].value;
      const timeExecution = Date.now() - startTime;
      return badRequestResponse(
        res,
        `Data '${value}' pada '${field}' sudah terdaftar.`,
        timeExecution
      );
    }
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const deletePedsemaController = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;
  try {
    const pedsemaToDelete = await pedsema.findByPk(id);
    if (!pedsemaToDelete) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(
        res,
        "Peduli Sesama tidak ditemukan",
        timeExecution
      );
    }
    await pedsemaToDelete.destroy();
    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      "Peduli Sesama berhasil dihapus",
      timeExecution
    );
  } catch (error) {
    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getPedsemaPublishController = async (req, res) => {
  const startTime = Date.now();
  try {
    const pedsemaData = await pedsema.findAll({
      where: { status: "published" },
      attributes: [
        "id",
        "title",
        "category",
        "thumbnail",
        "status",
        "norek",
        "description",
      ],
    });

    if (!pedsemaData || pedsemaData.length === 0) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(
        res,
        "Tidak ada peduli sesama yang ditemukan",
        timeExecution
      );
    }

    const pedsemaArray = await Promise.all(
      pedsemaData.map(async (pedsemaItem) => {
        const pedsemaPlain = pedsemaItem.toJSON();

        pedsemaPlain.thumbnailBase64 = pedsemaPlain.thumbnail
          ? fs.existsSync(
              path.join(
                __dirname,
                "../public/upload/pedulisesama",
                pedsemaPlain.thumbnail
              )
            )
            ? `data:image/${path
                .extname(pedsemaPlain.thumbnail)
                .slice(1)};base64,${fs
                .readFileSync(
                  path.join(
                    __dirname,
                    "../public/upload/pedulisesama",
                    pedsemaPlain.thumbnail
                  )
                )
                .toString("base64")}`
            : null
          : null;

        return pedsemaPlain;
      })
    );

    const timeExecution = Date.now() - startTime;
    return successResponse(res, pedsemaArray, timeExecution);
  } catch (error) {
    console.error("Error fetching articles:", error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getPedsemaCountController = async (req, res) => {
  const startTime = Date.now();
  try {
    // Get total count
    const totalPedsema = await pedsema.count();

    // Get published count
    const publishedCount = await pedsema.count({
      where: { status: "published" },
    });

    // Get draft count
    const draftCount = await pedsema.count({ where: { status: "draft" } });

    const responseData = {
      total: totalPedsema,
      published: publishedCount,
      draft: draftCount,
    };

    const timeExecution = Date.now() - startTime;
    return successResponse(res, responseData, timeExecution);
  } catch (error) {
    console.error("Error fetching pedsema count:", error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updateStatusPedsemaByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { status } = req.body;

  try {
    const pedsemaData = await pedsema.findOne({
      where: {
        id,
      },
    });

    if (!pedsemaData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(
        res,
        "Peduli Sesama tidak ditemukan",
        timeExecution
      );
    }

    pedsemaData.status = status;

    await pedsemaData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      "Berhasil mengubah status Peduli Sesama",
      timeExecution
    );
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getAllPedsemaController,
  getPedsemaByIdController,
  postPedsemaController,
  updatePedsemaController,
  deletePedsemaController,
  getPedsemaPublishController,
  updateStatusPedsemaByIdController,
  getPedsemaCountController,
};
