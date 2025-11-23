const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const multer = require("multer");//this packeg for uplaod image

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/scholarships", studentController.getAllScholarships);
router.post("/apply", studentController.applyScholarship);
router.get("/getDetails/:studentId", studentController.getStudentDetails);
router.put(
  "/update/:studentId",
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "id_proof", maxCount: 1 },
    { name: "address_proof", maxCount: 1 },
    { name: "marksheet", maxCount: 1 },
    { name: "income_proof", maxCount: 1 },
  ]),
  studentController.updateStudentDetails
);


// Apply scholarship route with type and studentId
router.put(
  "/apply_scholarship/:type/:studentId",
  upload.fields([
    { name: "marksheet_file", maxCount: 1 }, // for Merit
    { name: "income_certificate", maxCount: 1 }, // for Need-based
    { name: "sports_certificate", maxCount: 1 }, // for Sports
    { name: "category_certificate", maxCount: 1 }, // for Special Scheme
    { name: "disability_certificate", maxCount: 1 }, // for Special Scheme
  ]),
  studentController.applyScholarshipByType
);

router.get("/getScholarship/:type/:studentId", studentController.getScholarship);
router.get("/:studentId/scholarship-count", studentController.getScholarshipCount);
router.get("/:studentId/track-status", studentController.trackScholarship);
router.get("/getFeeConcession/:studentId", studentController.getFeeConcession);

router.put(
  "/apply_fee_concessiom/:studentId",
  upload.fields([
    { name: "supporting_doc", maxCount: 1 }, // for supporting_doc
  ]),
  studentController.applyFeeConcession
);



module.exports = router;
