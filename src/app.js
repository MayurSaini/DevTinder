const express = require('express');
const app = express();

app.use("/test",(req, res) => {
    res.send('Hello, World!');
});

app.use("/home", (req, res) => {
    res.send('Welcome to the home page!');
});
app.listen(7777, () => {
  console.log('Server is running on port 7777');
});