const express = require('express');
const connectDB = require("./config/database");
// const User = require("./models/user")
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
// app.use(cors({
//   origin: "", // add frontend url
//   credentials: true
// }))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }))
app.use(express.json());
app.use(cookieParser())

const authRouter= require('./routes/authRoute');
const profileRouter = require('./routes/profileRoute');
const requestRouter = require('./routes/requestRoute');
const userRouter = require('./routes/userRoute');

app.use('/', authRouter)
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter)

connectDB().then(() => {
  console.log("Database connect established...");
  app.listen(4321, () => {
    console.log('Server is running on port 4321');
  });
})
  .catch((err) => {
    console.error("database can not be established", err);

  })
