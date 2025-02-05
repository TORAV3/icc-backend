const { Sequelize } = require("sequelize");
const { artikel } = require("../../models/index.model");
const fs = require("fs");
const path = require("path");

const {
  badRequestResponse,
  successCreatedResponse,
  internalServerErrorResponse,
  notfoundResponse,
  successResponse,
} = require("../../configs/response");

const getAllArtikelController = async (req, res) => {
  const startTime = Date.now();
  try {
    const artikels = await artikel.findAll();
    const timeExecution = Date.now() - startTime;
    return successResponse(res, artikels, timeExecution);
  } catch (error) {
    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getArtikelByIdController = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;
  try {
    const artikelData = await artikel.findOne({ where: { id } });
    if (!artikelData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Artikel tidak ditemukan", timeExecution);
    }

    const artikelPlain = artikelData.toJSON();
    artikelPlain.thumbnailBase64 = artikelPlain.thumbnail
      ? fs.existsSync(
          path.join(
            __dirname,
            "../public/upload/artikels",
            artikelPlain.thumbnail
          )
        )
        ? `data:image/${path
            .extname(artikelPlain.thumbnail)
            .slice(1)};base64,${fs
            .readFileSync(
              path.join(
                __dirname,
                "../public/upload/artikels",
                artikelPlain.thumbnail
              )
            )
            .toString("base64")}`
        : null
      : null;

    const timeExecution = Date.now() - startTime;
    return successResponse(res, artikelPlain, timeExecution);
  } catch (error) {
    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getArtikelPublishController = async (req, res) => {
  const startTime = Date.now();
  try {
    const artikelData = await artikel.findAll({
      where: { status: "published" },
      attributes: [
        "id",
        "title",
        "category",
        "thumbnail",
        "status",
        "publishdate",
        "description",
      ], // Ambil hanya kolom yang diperlukan
    });

    if (!artikelData || artikelData.length === 0) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(
        res,
        "Tidak ada artikel yang ditemukan",
        timeExecution
      );
    }

    const artikelArray = await Promise.all(
      artikelData.map(async (artikelItem) => {
        const artikelPlain = artikelItem.toJSON();

        artikelPlain.thumbnailBase64 = artikelPlain.thumbnail
          ? fs.existsSync(
              path.join(
                __dirname,
                "../public/upload/artikels",
                artikelPlain.thumbnail
              )
            )
            ? `data:image/${path
                .extname(artikelPlain.thumbnail)
                .slice(1)};base64,${fs
                .readFileSync(
                  path.join(
                    __dirname,
                    "../public/upload/artikels",
                    artikelPlain.thumbnail
                  )
                )
                .toString("base64")}`
            : null
          : null;

        return artikelPlain;
      })
    );

    const timeExecution = Date.now() - startTime;
    return successResponse(res, artikelArray, timeExecution);
  } catch (error) {
    console.error("Error fetching articles:", error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const postArtikelController = async (req, res) => {
  const startTime = Date.now();
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") req.body[key] = null;
  });

  const { title, category, description, thumbnail, publishdate, status } =
    req.body;
  try {
    const artikelData = await artikel.create({
      title,
      category,
      description,
      thumbnail: null,
      publishdate,
      status,
    });

    if (thumbnail) {
      const matches = thumbnail.match(/^data:(.+);base64,/);
      if (!matches || matches.length < 2) {
        return badRequestResponse(res, "Thumbnail file invalid");
      }

      const extension = matches[1].split("/")[1];
      const thumbnailFilename = `thumbnail_${artikelData.id}.${extension}`;
      const uploadFolderPath = path.join(
        __dirname,
        "../public/upload/artikels"
      );
      if (!fs.existsSync(uploadFolderPath)) {
        fs.mkdirSync(uploadFolderPath, { recursive: true });
      }

      const filePath = path.join(uploadFolderPath, thumbnailFilename);
      const base64Data = thumbnail.split(";base64,").pop();
      fs.writeFileSync(filePath, base64Data, { encoding: "base64" });

      await artikelData.update({ thumbnail: thumbnailFilename });
    }

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(
      res,
      "Artikel berhasil dibuat",
      timeExecution
    );
  } catch (error) {
    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updateArtikelController = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") req.body[key] = null;
  });

  const { title, category, description, thumbnail, publishdate, status } =
    req.body;
  try {
    const artikelData = await artikel.findOne({ where: { id } });
    if (!artikelData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Artikel tidak ditemukan", timeExecution);
    }

    if (thumbnail && thumbnail.startsWith("data:image")) {
      const oldFilename = artikelData.thumbnail || `thumbnail_${id}.png`;
      const filePath = path.join(
        __dirname,
        "../public/upload/artikels",
        oldFilename
      );
      const base64Data = thumbnail.replace(/^data:image\/\w+;base64,/, "");
      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
    }

    await artikelData.update({
      title,
      category,
      description,
      publishdate,
      status,
    });
    const timeExecution = Date.now() - startTime;
    return successResponse(res, "Artikel berhasil diperbaharui", timeExecution);
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      const timeExecution = Date.now() - startTime;
      return badRequestResponse(
        res,
        `Data '${error.errors[0].value}' pada '${error.errors[0].path}' sudah terdaftar.`,
        timeExecution
      );
    }
    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const deleteArtikelController = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;
  try {
    const artikelToDelete = await artikel.findByPk(id);
    if (!artikelToDelete) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Artikel tidak ditemukan", timeExecution);
    }
    await artikelToDelete.destroy();
    const timeExecution = Date.now() - startTime;
    return successResponse(res, "Artikel berhasil dihapus", timeExecution);
  } catch (error) {
    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updateStatusArtikelByIdController = async (req, res, startTime) => {
  const { id } = req.params;

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { status } = req.body;

  try {
    const artikelData = await artikel.findOne({
      where: {
        id,
      },
    });

    if (!artikelData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Artikel tidak ditemukan", timeExecution);
    }

    artikelData.status = status;

    await artikelData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(
      res,
      "Berhasil mengubah status artikel",
      timeExecution
    );
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getArtikelCountController = async (req, res) => {
  const startTime = Date.now();
  try {
    // Get total count
    const totalCount = await artikel.count();

    // Get published count
    const publishedCount = await artikel.count({
      where: { status: "published" },
    });

    // Get draft count
    const draftCount = await artikel.count({ where: { status: "draft" } });

    const responseData = {
      total: totalCount,
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

module.exports = {
  getAllArtikelController,
  getArtikelByIdController,
  postArtikelController,
  updateArtikelController,
  deleteArtikelController,
  updateStatusArtikelByIdController,
  getArtikelPublishController,
  getArtikelCountController,
};
