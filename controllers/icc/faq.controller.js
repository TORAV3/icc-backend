const { Sequelize } = require("sequelize");
const { faq } = require("../../models/index.model");
const {
  badRequestResponse,
  successCreatedResponse,
  internalServerErrorResponse,
  notfoundResponse,
  successResponse,
} = require("../../configs/response");

const getAlFAQController = async (req, res) => {
  const startTime = Date.now();
  try {
    const faqs = await faq.findAll();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, faqs, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getFAQByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const faqs = await faq.findOne({
      where: {
        id,
      },
    });

    if (!faqs) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "FAQ tidak ditemukan", timeExecution);
    }

    const faqPlain = faqs.toJSON();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, faqPlain, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const postFAQController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { title, description } = req.body;

  try {
    const faqCreated = await faq.create({
      title,
      description,
    });

    const timeExecution = Date.now() - startTime;
    return successCreatedResponse(res, "FAQ berhasil dibuat", timeExecution);
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      let fieldName;
      const field = error.errors[0].path;
      switch (field) {
        case "title":
          fieldName = "Title";
          break;
        default:
          fieldName = field;
          break;
      }
      const value = error.errors[0].value;
      const timeExecution = Date.now() - startTime;
      return badRequestResponse(
        res,
        `Data '${value}' for '${fieldName}' is already registered.`,
        timeExecution
      );
    }

    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const updateFAQController = async (req, res, startTime) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      req.body[key] = null;
    }
  });

  const { title, description } = req.body;

  const { id } = req.params;

  try {
    const faqData = await faq.findOne({
      where: {
        id,
      },
    });

    if (!faqData) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Data user tidak ditemukan", timeExecution);
    }

    faqData.title = title;
    faqData.description = description;

    await faqData.save();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "FAQ berhasil diperbaharui", timeExecution);
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      let fieldName;
      const field = error.errors[0].path;
      switch (field) {
        case "title":
          fieldName = "Judul";
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

const deleteFAQController = async (req, res, startTime) => {
  const { id } = req.params;

  try {
    const faqToDelete = await faq.findByPk(id);

    if (!faqToDelete) {
      const timeExecution = Date.now() - startTime;
      return notFoundResponse(res, "FAQ tidak ditemukan", timeExecution);
    }

    await faqToDelete.destroy();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, "FAQ berhasil dihapus", timeExecution);
  } catch (error) {
    console.error(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getAlFAQController,
  postFAQController,
  getFAQByIdController,
  updateFAQController,
  deleteFAQController,
};
