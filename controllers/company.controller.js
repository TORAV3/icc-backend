const { company } = require("../models/index.model");
const {
  internalServerErrorResponse,
  successResponse,
  notfoundResponse,
} = require("../configs/response");

const getAllCompanyController = async (req, res) => {
  const startTime = Date.now();
  try {
    const companies = await company.findAll();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, companies, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

const getCompanyByIdController = async (req, res) => {
  const startTime = Date.now();

  const { id } = req.params;

  try {
    const companies = await company.findOne({
      where: {
        id,
      },
    });

    if (!companies) {
      const timeExecution = Date.now() - startTime;
      return notfoundResponse(res, "Perusahaan tidak ditemukan", timeExecution);
    }

    const companyPlain = companies.toJSON();

    const timeExecution = Date.now() - startTime;
    return successResponse(res, companyPlain, timeExecution);
  } catch (error) {
    console.log(error);
    const timeExecution = Date.now() - startTime;
    return internalServerErrorResponse(res, timeExecution);
  }
};

module.exports = {
  getAllCompanyController,
  getCompanyByIdController,
};
