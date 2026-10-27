const express = require('express');
require("dotenv").config();
require("./utils/cronJob")
const connectDB = require("./config/database");
// const User = require("./models/user")
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://www.twingle.live",
      "https://www.twingle.live",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser())

const authRouter= require('./routes/authRoute');
const profileRouter = require('./routes/profileRoute');
const requestRouter = require('./routes/requestRoute');
const userRouter = require('./routes/userRoute');
const paymentRouter = require('./routes/paymentRoute')
const chatRouter = require('./routes/chatRouter');
const http = require('http');
const initializeSocket = require('./utils/socket');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', paymentRouter);
app.use('/', chatRouter);

const server = http.createServer(app);
initializeSocket(server);
connectDB().then(() => {
  console.log("Database connect established...");
  // instead app.listen we made it server.listen this is for socket
  server.listen(4321, () => {
    console.log('Server is running on port 4321');
  });
})
  .catch((err) => {
    console.error("database can not be established", err);

  })
