const express = require("express");
const { validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models/index.model");

const { errorValidationResponse } = require("./configs/response");

const {
  validateRegisterUser,
  validateRegisterCompany,
  validateLogin,
} = require("./validators/auth.validator");

const {
  registerUserController,
  registerCompanyController,
  loginController,
} = require("./controllers/auth.controller");

const {
  getAllUserController,
  getUserByIdController,
} = require("./controllers/user.controller");

const {
  getAllCompanyController,
  getCompanyByIdController,
} = require("./controllers/company.controller");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const allowedOrigins = ["http://127.0.0.1:5173", "http://localhost:5173"];

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

// login
router.post("/login", validateLogin, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  loginController(req, res, startTime);
});

// register user
router.post("/register/user", validateRegisterUser, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  registerUserController(req, res, startTime);
});

// get all user
router.get("/user", getAllUserController);

// get user by id
router.get("/user/:id", getUserByIdController);

// register perusahaan
router.post("/register/perusahaan", validateRegisterCompany, (req, res) => {
  const startTime = Date.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const timeExecution = Date.now() - startTime;

    return errorValidationResponse(res, errors, timeExecution);
  }

  registerCompanyController(req, res, startTime);
});

// get all perusahaan
router.get("/perusahaan", getAllCompanyController);

// get user perusahaan id
router.get("/perusahaan/:id", getCompanyByIdController);

app.use("/icc/api", router);

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
