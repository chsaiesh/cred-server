const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const app = express();

const urlEncodedParser = bodyParser.urlencoded({ extended: false }); // for parsing application/x-www-form-urlencoded
app.use(urlEncodedParser);

// Allowed headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    next();
});

// Convert req.body data to json
app.use(bodyParser.json());

// MIDDLEWARES
const employeeRoute = require('./routes/employees');
app.use('/employees', employeeRoute);
const feedbackRoute = require('./routes/feedback');
app.use('/feedback', feedbackRoute);

// Connect to MongoDB
mongoose.connect(
    process.env.FEEDBACK_DB,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => {
        console.log('Connected to DB');
    }
);


//Server is listening on the PORT---
// If PORT 3003 is not available, use PORT 3005 as the backyup port
const port = process.env.DATA_PORT || 3005;
app.listen(port);
console.log('Server is running on PORT: ', port);