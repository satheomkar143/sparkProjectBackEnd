var express = require("express");
var router = express.Router();
var User = require("../models/user");
var AdmissionForm = require("../models/admissionForm");
var Security = require("../models/security");
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const security = require("../models/security");
const multer = require("multer");

router.post("/register", function (req, res, next) {
  var user = new User({
    email: req.body.email,
    username: req.body.username,
    password: User.hashPassword(req.body.password),
    mobile: req.body.mobile,
    creation_dt: Date.now(),
  });

  let promise = user.save();

  promise.then(function (doc) {
    return res.status(201).json(doc);
  });

  promise.catch(function (err) {
    return res.status(501).json({ message: "Error registering user." });
  });
});

router.post("/login", function (req, res, next) {
  let promise = User.findOne({ email: req.body.email }).exec();
  promise.then(function (doc) {
    if (doc) {
      if (doc.isValid(req.body.password)) {
        try {
          if (security.isValid(GeneralOTP, req.body.otp)) {
            let promise = Security.findOne({ userName: "omkar" }).exec();
            promise.then(function (doc) {
              if (doc) {
                if (Security.isValid(doc.SecurityCode, req.body.securityCode)) {
                  let token = jwt.sign({ email: doc.email }, "secret");
                  return res.status(200).json(token);
                } else {
                  return res
                    .status(501)
                    .json({ message: " enter correct security code" });
                }
              } else {
                return res
                  .status(501)
                  .json({ message: " enter correct security code" });
              }
            });
          } else {
            return res.status(501).json({ message: " enter correct otp" });
          }
        } catch (error) {
          return res.status(501).json({ message: " please enter correct otp" });
        }
      } else {
        return res.status(501).json({ message: " Invalid Credentials" });
      }
    } else {
      return res.status(501).json({ message: "User email is not registered." });
    }
  });

  promise.catch(function (err) {
    return res.status(501).json({ message: "Some internal error", err });
  });
});

router.get("/email", verifyToken, function (req, res, next) {
  return res.status(200).json(decodedToken.email);
});

var decodedToken = "";
function verifyToken(req, res, next) {
  let token = req.query.token;

  jwt.verify(JSON.parse(token), "secret", function (err, tokendata) {
    if (err) {
      return res.status(400).json({ message: " Unauthorized request" });
    } else {
      next();
    }
  });
}

router.post("/sendmail", (req, res) => {
  let user = req.body;
  sendMail(user, (info) => {
    res.send(info);
  });
});

function randomOTP(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
var GeneralOTP;

const saveOTP = (OTP) => {
  let HashOTP = Security.hashPassword(OTP.toString());
  GeneralOTP = HashOTP;
  let promise = Security.update(
    { userName: "omkar" },
    { $set: { OTP: HashOTP } }
  ).exec();
  promise.then(function (doc) {
    if (doc) {
      console.log("user data", doc);
    } else {
      console.log("User otp is not registered.");
    }
  });

  promise.catch(function (err) {
    console.log("Some internal error in otp fetch", err);
  });
};

const getSecurityCode = (userSecurity) => {
  let promise = Security.findOne({ userName: "omkar" }).exec();
  promise.then(function (doc) {
    if (doc) {
      if (Security.isValid(doc.SecurityCode, userSecurity)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });

  promise.catch(function (err) {
    console.log("Some internal error in security fetch", err);
  });
};

async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "satheomkar143@gmail.com",
      pass: "nktypmeslnxfgwyj",
    },
  });

  var generatedOTP = randomOTP(182973, 973468);
  saveOTP(generatedOTP);

  let mailOptions = {
    from: '"Spark Institute, Pune', // sender address
    to: user.email, // list of receivers
    subject: "OTP for successfully login ", // Subject line
    html: `<h1>${user.name}</h1><br>
    <h4>To complete the process, please enter below One Time Password:</h4><br>
    <h3>OTP: ${generatedOTP}</h3><br>
    <h4>(This OTP is valid for next 15 minutes.)</h4>`,
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}

router.post("/security", function (req, res, next) {
  var user = new Security({
    OTP: Security.hashPassword(req.body.OTP),
    SecurityCode: Security.hashPassword(req.body.SecurityCode),
    userName: req.body.name,
  });

  let promise = user.save();

  promise.then(function (doc) {
    return res.status(201).json(doc);
  });

  promise.catch(function (err) {
    return res.status(501).json({ message: "Error registering user." });
  });
});

router.post("/admissionForm", function (req, res, next) {
  var admissionForm = new AdmissionForm({
    studentId: req.body.studentId,
    admissionDate: req.body.admissionDate,
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    DOB: req.body.DOB,
    gender: req.body.gender,
    currentState: req.body.currentState,
    currentDistrict: req.body.currentDistrict,
    currentCity: req.body.currentCity,
    permanentState: req.body.permanentState,
    permanentDistrict: req.body.permanentDistrict,
    permanentCity: req.body.permanentCity,
    personalNumber: req.body.personalNumber,
    parentNumber: req.body.parentNumber,
    email: req.body.email,
    degree: req.body.degree,
    stream: req.body.stream,
    percentage: req.body.percentage,
    collegeName: req.body.collegeName,
    university: req.body.university,
    passOutYear: req.body.passOutYear,
    backlogs: req.body.backlogs,
    underGraduated: req.body.underGraduated,
    highestQualification: req.body.highestQualification,
    sscPercentage: req.body.sscPercentage,
    hscPercentage: req.body.hscPercentage,
    anyOtherCourses: req.body.anyOtherCourses,
    course: req.body.course,
    feesAllowed: req.body.feesAllowed,
    studentProfilePhoto: req.body.studentProfilePhoto,
  });

  let promise = admissionForm.save();

  promise.then(function (doc) {
    return res.status(201).json(doc);
  });

  promise.catch(function (err) {
    return res
      .status(501)
      .json({ message: "Error in save admission form in server." });
  });
});

router.get("/initialFetch", function (req, res, next) {
  let promise = AdmissionForm.find({}).limit(10).sort({admissionDate: -1}).exec();
  promise.then(function (doc) {
    if (doc) {
      return res.status(200).json(doc);
    } else {
      return res
        .status(501)
        .json({ message: "Error in fetch initial data in server." });
    }
  });

  promise.catch(function (err) {
    return res
      .status(501)
      .json({ message: "Some internal error in security fetch" });
  });
});

router.post("/studentFilter", function (req, res, next) {
  studentData = {
    startDate: req.body.startDate,
    EndDate: req.body.EndDate,
    StudentID: req.body.StudentID,
    name: req.body.name,
    contactNumber: req.body.contactNumber,
    gender: req.body.gender,
    address: req.body.address,
    course: req.body.course,
    degree: req.body.degree,
    college: req.body.college,
    stream: req.body.stream,
    percentage: req.body.percentage,
    university: req.body.university,
    city: req.body.city,
    passOutYear: req.body.passOutYear,
  };

  let promise = AdmissionForm.find({
    $and: [
      {
        admissionDate: {
          $gte: studentData.startDate,
          $lte: studentData.EndDate,
        },
      },
      {
        studentId: { $regex: new RegExp(`.*${studentData.StudentID}.*`, "i") },
      },
      {
        $or: [
          { firstName: { $regex: new RegExp(`.*${studentData.name}.*`, "i") } },
          { lastName: { $regex: new RegExp(`.*${studentData.name}.*`, "i") } },
        ],
      },
      {
        personalNumber: {
          $regex: new RegExp(`.*${studentData.contactNumber}.*`, "i"),
        },
      },
      { gender: { $regex: new RegExp(`^${studentData.gender}.*`, "i") } },
      {
        $or: [
          {
            permanentState: {
              $regex: new RegExp(`.*${studentData.address}.*`, "i"),
            },
          },
          {
            permanentDistrict: {
              $regex: new RegExp(`.*${studentData.address}.*`, "i"),
            },
          },
          {
            permanentCity: {
              $regex: new RegExp(`.*${studentData.address}.*`, "i"),
            },
          },
        ],
      },
      { course: { $regex: new RegExp(`.*${studentData.course}.*`, "i") } },
      { degree: { $regex: new RegExp(`.*${studentData.degree}.*`, "i") } },
      {
        collegeName: { $regex: new RegExp(`.*${studentData.college}.*`, "i") },
      },
      { stream: { $regex: new RegExp(`.*${studentData.stream}.*`, "i") } },
      { percentage: { $gte: studentData.startDate } },
      {
        university: {
          $regex: new RegExp(`.*${studentData.university}.*`, "i"),
        },
      },
      {
        passOutYear: {
          $regex: new RegExp(`^${studentData.passOutYear}.*`, "i"),
        },
      },
    ],
  }).exec();
  promise.then(function (doc) {
    if (doc.length !== 0) {
      return res.status(200).json(doc);
    } else {
      return res
        .status(501)
        .json({ message: "Error in fetch initial data in server." });
    }
  });

  promise.catch(function (err) {
    return res
      .status(501)
      .json({ message: "Some internal error in security fetch" });
  });
});

router.post("/deleteStudent", function (req, res, next) {
  const id = new require("mongodb").ObjectId(req.body.id);

  let promise = AdmissionForm.deleteOne({ _id: id }).exec();

  promise.then(function (doc) {
    return res.status(201).json(doc);
  });

  promise.catch(function (err) {
    return res.status(501).json({ message: "Error registering user.", err });
  });
});

router.post("/updateStudent", function (req, res, next) {
  // const id = new require('mongodb').ObjectId(req.body.id);
  const id = req.body.id;

  let promise = AdmissionForm.updateOne({ _id: id }, { $set: req.body }).exec();

  promise.then(function (doc) {
    return res.status(201).json(doc);
  });

  promise.catch(function (err) {
    return res.status(501).json({ message: "Error registering user.", err });
  });
});

router.post("/getStudent", function (req, res, next) {
  const id = req.body.id;

  let promise = AdmissionForm.findOne({ _id: id }).exec();

  promise.then(function (doc) {
    return res.status(201).json(doc);
  });

  promise.catch(function (err) {
    return res.status(501).json({ message: "Error registering user.", err });
  });
});

router.get("/getStudentID", function (req, res, next) {
  let promise = Security.findOne({ userName: "omkar" }).exec();
  promise.then(function (doc) {
    if (doc) {
      const { counter, prevMonth } = doc;
      parseData = { counter: counter, prevMonth: prevMonth };

      return res.status(200).json(parseData);
    } else {
      return res
        .status(501)
        .json({ message: "Error in fetch student id from server." });
    }
  });

  promise.catch(function (err) {
    return res
      .status(501)
      .json({ message: "Some internal error in security fetch" });
  });
});

router.post("/changeMonth", function (req, res, next) {
  const month = req.body.month;

  let promise = Security.updateOne(
    { userName: "omkar" },
    { $set: { counter: "1", prevMonth: month } }
  ).exec();

  promise.then(function (doc) {
    return res.status(201).json(doc);
  });

  promise.catch(function (err) {
    return res
      .status(501)
      .json({ message: "Error updating counter user.", err });
  });
});

router.get("/increaseCounter", function (req, res, next) {
  let promise = Security.findOne({ userName: "omkar" }).exec();
  promise.then(function (doc) {
    if (doc) {
      let { counter } = doc;

      counter = parseInt(counter);
      counter++;

      let promiseTwo = Security.updateOne(
        { userName: "omkar" },
        { $set: { counter: counter } }
      ).exec();

      promiseTwo.then(function (doc) {
        return res.status(201).json(doc);
      });

      promiseTwo.catch(function (err) {
        return res
          .status(501)
          .json({ message: "Error updating counter user.", err });
      });
    } else {
      return res
        .status(501)
        .json({ message: "Error in fetch student id from server." });
    }
  });

  promise.catch(function (err) {
    return res
      .status(501)
      .json({ message: "Some internal error in security fetch" });
  });
});

router.get("/changeOTP", function (req, res, next) {
  var generatedOTP = randomOTP(182973, 973468);
  saveOTP(generatedOTP);
});

router.post("/sendSocialLinkMail", (req, res) => {
  let user = req.body;
  sendSocialLinkMail(user, (info) => {
    res.send(info);
  });
});

async function sendSocialLinkMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "satheomkar143@gmail.com",
      pass: "nktypmeslnxfgwyj",
    },
  });

  let mailOptions = {
    from: 'Spark Institute, Pune', // sender address
    to: user.email, // list of receivers
    subject: "Spark Institute Social Links", // Subject line
    html: `<h1>${user.name}</h1><br>
    <h4>Thank you for join the SPARK IT institute, pune</h4><br>
    <h4>Follow us to get updated with SPARK Institute.</h4><br>

    <h3>Facebook:</h3>
    <h4>https://www.facebook.com/SPARK.IT.Training</h4><br>

    <h3>Twitter:</h3>
    <h4>https://twitter.com/spark3e</h4><br>

    <h3>Instagram:</h3>
    <h4>https://www.instagram.com/sparkpune/</h4><br>
    
    <h3>LinkedIn:</h3>
    <h4>https://www.linkedin.com/company/spark-it-training-institute/</h4><br>
  
    `
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}

// --------------file upload---------------
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, 'studentsProfilePhoto')
  },
  filename: (req, file, callBack) => {
      callBack(null, file.originalname)
  }
})

const upload = multer({ storage: storage })
// let upload = multer({ dest: 'studentsProfilePhoto/' })

router.post('/saveStudentPhoto', upload.single('file'), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(file);
})





module.exports = router;
