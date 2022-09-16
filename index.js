if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require("express");
const app = express();
const Conn = require("./conn/conn");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const cors = require('cors');

const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');
var mongoose = require("mongoose");
var fs = require('fs');
var casal = require("./models/casal.js");

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



//ssssssssssss
/* Api to add Casais */
app.post("/add-casal", upload.any(), (req, res) => {
  try {
    if (req.files && req.body && req.body.name && req.body.desc && req.body.niverM &&
      req.body.niverH && req.body.tel) {

      let new_casal = new casal();
      new_casal.name = req.body.name;
      new_casal.desc = req.body.desc;
      new_casal.niverH = req.body.niverH;
      new_casal.image = req.files[0].filename;
      new_casal.niverM = req.body.niverM;
      new_casal.tel= req.body.tel
      new_casal.user_id = req.user.id;
      new_casal.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Casal adicionado com sucesso.'
          });
        }
      });

    } else {
      res.status(400).json({
        errorMessage: 'Adicione o parâmetro adequado primeiro!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Algo deu errado!',
      status: false
    });
  }
});

/* Api to update Casais */
app.post("/update-casal", upload.any(), (req, res) => {
  try {
    if (req.files && req.body && req.body.name && req.body.desc && req.body.niverH &&
      req.body.id && req.body.niverM && req.body.tel) {

      casal.findById(req.body.id, (err, new_casal) => {

        // if file already exist than remove it
        if (req.files && req.files[0] && req.files[0].filename && new_casal.image) {
          var path = `./uploads/${new_casal.image}`;
          fs.unlinkSync(path);
        }

        if (req.files && req.files[0] && req.files[0].filename) {
          new_casal.image = req.files[0].filename;
        }
        if (req.body.name) {
          new_casal.name = req.body.name;
        }
        if (req.body.desc) {
          new_casal.desc = req.body.desc;
        }
        if (req.body.niverH) {
          new_casal.niverH = req.body.niverH;
        }
        if (req.body.niverM) {
          new_casal.niverM = req.body.niverM;
        }
        if ( req.body.tel) {
          new_casal.tel = req.body.tel;
        }
      

        new_casal.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false
            });
          } else {
            res.status(200).json({
              status: true,
              title: 'Casal Atualizado com sucesso.'
            });
          }
        });

      });

    } else {
      res.status(400).json({
        errorMessage: 'Adicione o parâmetro adequado primeiro!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Algo deu errado!',
      status: false
    });
  }
});

/* Api to delete Casais */
app.post("/delete-casal", (req, res) => {
  try {
    if (req.body && req.body.id) {
      casal.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
        if (data.is_delete) {
          res.status(200).json({
            status: true,
            title: 'Casal deletado.'
          });
        } else {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Adicione o parâmetro adequado primeiro!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Algo deu errado!',
      status: false
    });
  }
});

/*Api to get and search casais with pagination and search by name*/
app.get("/get-casal", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      user_id: req.user.id
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        name: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    casal.find(query, { date: 1, name: 1, id: 1, desc: 1, niverH: 1, niverM: 1, tel: 1, image: 1 })
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        casal.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: 'Casal recuperado.',
                casais: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'Não ha Casais cadastrados!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Algo deu errado!',
      status: false
    });
  }

});

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
