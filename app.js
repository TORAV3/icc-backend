const express = require("express");
const { validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models/index.model");

const { errorValidationResponse } = require("./configs/response");

const verifyToken = require("./middlewares/authMiddleware");

const {
  validateRegister,
  validateLogin,
} = require("./validators/auth.validator");

const {
  registerUserController,
  registerCompanyController,
  loginController,
  getLoginDataController,
} = require("./controllers/icc/auth.controller");

const {
  getAllPesertaUserController,
  getPesertaCountController,
  getAllInternalUserController,
  getInternalCountController,
  getAllCompanyUserController,
  getCompanyCountController,
  getPesertaUserByIdController,
  getInternalUserByIdController,
  getCompanyUserByIdController,
  updateStatusInternalUserController,
  updateInternalUserController,
  deleteInternalUserByIdController,
  updateStatusUserByIdController,
} = require("./controllers/icc/user.controller");

const { getAllRoleController } = require("./controllers/icc/role.controller");

const {
  getAlFAQController,
  postFAQController,
  getFAQByIdController,
  updateFAQController,
  deleteFAQController,
} = require("./controllers/icc/faq.controller");

const {
  getAllArtikelController,
  getArtikelByIdController,
  getArtikelPublishController,
  postArtikelController,
  updateArtikelController,
  deleteArtikelController,
  updateStatusArtikelByIdController,
  getArtikelCountController,
} = require("./controllers/icc/artikel.controller");

const {
  getAllPedsemaController,
  postPedsemaController,
  getPedsemaByIdController,
  updatePedsemaController,
  deletePedsemaController,
  getPedsemaPublishController,
  updateStatusPedsemaByIdController,
  getPedsemaCountController,
} = require("./controllers/icc/pedsema.controller");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const allowedOrigins = ["http://127.0.0.1:3001", "http://localhost:3001"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const router = express.Router();

// register peserta
router.post("/icc/register/peserta", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    console.log("Validation errors:", errors.array());
    return errorValidationResponse(res, errors, timeExecution);
  }

  registerUserController(req, res, startTime);
});

// register perusahaan
router.post("/icc/register/perusahaan", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    console.log("Validation errors:", errors.array());
    return errorValidationResponse(res, errors, timeExecution);
  }

  registerCompanyController(req, res, startTime);
});

// login
router.post("/icc/login", validateLogin, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  loginController(req, res, startTime);
});

// login data
router.get("/icc/login/data", verifyToken, getLoginDataController);

// get faq
router.get("/icc/faq", getAlFAQController);

// get faq by id
router.get("/icc/faq/:id", getFAQByIdController);

// post faq
router.post("/icc/faq/tambah", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  postFAQController(req, res, startTime);
});

//edit update faq
router.put("/icc/faq/edit/:id", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateFAQController(req, res, startTime);
});

// delete faq by id
router.delete("/icc/faq/delete/:id", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  deleteFAQController(req, res, startTime);
});

// get pedma
router.get("/icc/pedulisesama", getAllPedsemaController);

router.get("/icc/pedulisesama/count", getPedsemaCountController);

// get pedma publish
router.get("/icc/pedulisesama/publish", getPedsemaPublishController);

// get pedma by id
router.get("/icc/pedulisesama/:id", getPedsemaByIdController);

// post pedma
router.post("/icc/pedulisesama/tambah", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  postPedsemaController(req, res, startTime);
});

//edit update pedma
router.put("/icc/pedulisesama/edit/:id", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updatePedsemaController(req, res, startTime);
});

// delete pedma by id
router.delete("/icc/pedulisesama/delete/:id", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  deletePedsemaController(req, res, startTime);
});

router.put("/icc/pedulisesama/status/:id", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateStatusPedsemaByIdController(req, res, startTime);
});

// get artikel
router.get("/icc/artikel", getAllArtikelController);

router.get("/icc/artikel/count", getArtikelCountController);

// get artikel
router.get("/icc/artikel/publish", getArtikelPublishController);

// get artikel by id
router.get("/icc/artikel/:id", getArtikelByIdController);

// post artikel
router.post("/icc/artikel/tambah", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  postArtikelController(req, res, startTime);
});

//edit artikel pedma
router.put("/icc/artikel/edit/:id", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateArtikelController(req, res, startTime);
});

// delete artikel by id
router.delete("/icc/artikel/delete/:id", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  deleteArtikelController(req, res, startTime);
});

router.put("/icc/artikel/status/:id", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateStatusArtikelByIdController(req, res, startTime);
});

// user
router.get("/icc/user/peserta", getAllPesertaUserController);
router.get("/icc/user/internal", getAllInternalUserController);
router.get("/icc/user/perusahaan", getAllCompanyUserController);

router.get("/icc/user/peserta/count", getPesertaCountController);
router.get("/icc/user/internal/count", getInternalCountController);
router.get("/icc/user/perusahaan/count", getCompanyCountController);

router.get("/icc/user/peserta/detail/:id", getPesertaUserByIdController);
router.get("/icc/user/internal/detail/:id", getInternalUserByIdController);
router.get("/icc/user/perusahaan/detail/:id", getCompanyUserByIdController);

router.put("/icc/user/internal/edit/:id", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateInternalUserController(req, res, startTime);
});
router.put("/icc/user/internal/edit/status/:id", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateStatusInternalUserController(req, res, startTime);
});

router.delete(
  "/icc/user/internal/delete/:id",
  deleteInternalUserByIdController
);

router.put("/icc/user/status/:id", (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  updateStatusUserByIdController(req, res, startTime);
});

//role
router.get("/icc/role", getAllRoleController);

app.use("/api", router);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
