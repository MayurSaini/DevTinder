const express = require('express');
const app = express();

//this will only handle get call to /profile
app.get("/profile", (req, res) => {
    res.send("Profile info fetched")
})

app.post("/profile", (req, res) => {
    res.send("Profile updated successfully")
})

app.delete("/profile", (req, res) => {
    res.send("Profile updated successfully")
})
app.use("/test",(req, res) => {
    res.send('Hello, World!');
});

app.use("/home", (req, res) => {
    res.send('Welcome to the home page!');
});
app.listen(4321, () => {
  console.log('Server is running on port 7777');
});