if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require("express");
const app = express();
const Conn = require("./conn/conn");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const casaisRoutes = require("./routes/casais");
const cors = require('cors');

var multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');
var mongoose = require("mongoose");
var fs = require('fs');


var dir = './uploads';
var upload = multer({
  storage: multer.diskStorage({

    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
});


// middlewares
app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));
app.use(express.json());


// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/casais", casaisRoutes);



const db_url = process.env.DB_URL;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_data = process.env.DB_DATA;

Conn(db_url, db_user, db_pass, db_data);

// inicializar o servidor http em alguma porta para podermos acessar ele.
const port = 3001;
app.listen(process.env.PORT || port, () => {
  console.log(`O servidor esta rodando na porta ${port}`);
})
