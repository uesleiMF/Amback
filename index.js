if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require("express");
const app = express();
const cors = require("cors");
const conn = require("./conn/conn");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const produtosRoutes = require('./routes/produtos');




// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/produtos", produtosRoutes);


//ssssssssssss


const db_url = process.env.DB_URL;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_data = process.env.DB_DATA;

conn(db_url, db_user, db_pass, db_data);

// inicializar o servidor http em alguma porta para podermos acessar ele.
const port = 3001;
app.listen(process.env.PORT || port, () => {
  console.log(`O servidor esta rodando na porta ${port}`);
})
