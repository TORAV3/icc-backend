const { body } = require("express-validator");

const validateRegisterUser = [
  body("fullname")
    .isLength({ max: 60 })
    .withMessage("Nama lengkap tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama lengkap tidak boleh kosong"),
  body("email")
    .isLength({ max: 60 })
    .withMessage("Email tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Email tidak boleh kosong"),
  body("phone")
    .isLength({ max: 14 })
    .withMessage("Nomor telepon tidak boleh lebih dari 14 karakter.")
    .trim()
    .notEmpty()
    .withMessage("No. telp tidak boleh kosong"),
  body("password").trim().notEmpty().withMessage("Password tidak boleh kosong"),
  body("program_type")
    .notEmpty()
    .withMessage("Jenis Program tidak boleh kosong"),
  body("address_indo")
    .notEmpty()
    .withMessage("Alamat Indonesia tidak boleh kosong"),
  body("address_japan")
    .notEmpty()
    .withMessage("Alamat Jepang tidak boleh kosong"),
  body("company_name")
    .isLength({ max: 60 })
    .withMessage("Nama perusahaan tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama perusahaan tidak boleh kosong"),
  body("address_company")
    .notEmpty()
    .withMessage("Alamat perusahaan tidak boleh kosong"),
  body("association_name")
    .isLength({ max: 60 })
    .withMessage("Nama asosiasi tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama asosiasi tidak boleh kosong"),
  body("address_association")
    .notEmpty()
    .withMessage("Alamat asosiasi tidak boleh kosong"),
  body("career_history")
    .notEmpty()
    .withMessage("Riwayat karir tidak boleh kosong"),
  body("rejected")
    .isLength({ max: 10 })
    .withMessage("Status penolakan tidak boleh lebih dari 10 karakter."),
  body("rejected_detail")
    .isLength({ max: 60 })
    .withMessage("Detail penolakan tidak boleh lebih dari 60 karakter."),
  body("work_field")
    .isLength({ max: 60 })
    .withMessage("Bidang kerja tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Bidang kerja tidak boleh kosong"),
  body("contract_period")
    .isLength({ max: 60 })
    .withMessage("Periode kontrak tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Periode kontrak tidak boleh kosong"),
  body("my_number")
    .isLength({ max: 60 })
    .withMessage("Nomor saya tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nomor saya tidak boleh kosong"),
  body("upload_file").notEmpty().withMessage("Upload file tidak boleh kosong"),
  body("ktp").notEmpty().withMessage("KTP tidak boleh kosong"),
  body("zairyoukado").notEmpty().withMessage("Zairyoukado tidak boleh kosong"),
  body("ijazah").notEmpty().withMessage("Ijazah tidak boleh kosong"),
  body("certificate").notEmpty().withMessage("Sertifikat tidak boleh kosong"),
  body("certificate_field")
    .notEmpty()
    .withMessage("Bidang sertifikat tidak boleh kosong"),
  body("cv").notEmpty().withMessage("CV tidak boleh kosong"),
  body("immigration_passport")
    .notEmpty()
    .withMessage("Paspor imigrasi tidak boleh kosong"),
  body("latest_passport")
    .notEmpty()
    .withMessage("Paspor terbaru tidak boleh kosong"),
  body("photograph").notEmpty().withMessage("Pas Foto tidak boleh kosong"),
];

const validateRegisterCompany = [
  body("email")
    .isLength({ max: 60 })
    .withMessage("Email tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Email tidak boleh kosong")
    .isEmail()
    .withMessage("Format email tidak valid."),
  body("password").trim().notEmpty().withMessage("Password tidak boleh kosong"),
  body("address_company")
    .notEmpty()
    .withMessage("Alamat perusahaan tidak boleh kosong")
    .isLength({ max: 255 })
    .withMessage("Alamat perusahaan tidak boleh lebih dari 255 karakter."),
  body("country")
    .isLength({ max: 20 })
    .withMessage("Negara tidak boleh lebih dari 20 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Negara tidak boleh kosong"),
  body("pic_name")
    .isLength({ max: 60 })
    .withMessage("Nama PIC tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nama PIC tidak boleh kosong"),
  body("pic_number")
    .isLength({ max: 20 })
    .withMessage("Nomor PIC tidak boleh lebih dari 20 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Nomor PIC tidak boleh kosong"),
  body("business_sector")
    .isLength({ max: 20 })
    .withMessage("Sektor bisnis tidak boleh lebih dari 20 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Sektor bisnis tidak boleh kosong"),
];

const validateLogin = [
  body("email")
    .isLength({ max: 60 })
    .withMessage("Email tidak boleh lebih dari 60 karakter.")
    .trim()
    .notEmpty()
    .withMessage("Email tidak boleh kosong"),
  body("password").trim().notEmpty().withMessage("Password tidak boleh kosong"),
];

module.exports = {
  validateRegisterUser,
  validateRegisterCompany,
  validateLogin,
};
