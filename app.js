require('dotenv').config(); // <-- ✅ load environment variables first

const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose-connection'); // this now gets the MONGODB_URI
const usersRouter = require('./routes/usersRouter');
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const index = require('./routes/index');
const expressSession = require('express-session');
const flash = require('connect-flash');

app.use(
  expressSession({
    secret: 'Zenevy',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", 'ejs');

app.use('/users', usersRouter);
app.use('/owners', ownersRouter);
app.use('/products', productsRouter);
app.use('/', index);

app.listen(3000, () => {
  console.log("✅ Server started on http://localhost:3000");
});
