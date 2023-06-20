require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const employeeFeedbackSchema = require('./models/Employees');
const accessTokensSchema = require('./models/accessTokens');
const bodyParser = require('body-parser');

const urlEncodedParser = bodyParser.urlencoded({ extended: false }); // for parsing application/x-www-form-urlencoded
app.use(urlEncodedParser);

// Allowed headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    next();
});

//Convert req.body data to json
app.use(bodyParser.json());

// to handle the logout request from client
app.delete('/logout', async (req, res) => {
    try {
        const deleteToken = await accessTokensSchema.deleteOne({
            token: req.body.token
        });
        res.json(deleteToken);
    } catch (err) {
        res.json({ message: err });
    }
});

//Check if the given credentials are correct or not to login the employee
app.post('/login', async (req, res) => {
    const employee = await employeeFeedbackSchema.find({
        userName: req.body.userName
    });
    console.log('check ', employee);
    if (employee.length) {
        try {
            if (await bcrypt.compare(req.body.password, employee[0].password)) {
                const username = req.body.username;
                const user = { name: username };
                const accessToken = generateAccessToken(user);
                // const refreshToken = jwt.sign(user, process.env.SECRET_REFRESH_TOKEN);
                // refreshTokens.push(refreshToken);
                const pushTokenSchema = new accessTokensSchema({
                    token: accessToken
                });
                try {
                    pushTokenSchema.save();
                    res.json({
                        invalid: false,
                        message: 'Login successful!',
                        accessToken: accessToken,
                        employee: {
                            userName: employee[0].userName,
                            userType: employee[0].userType,
                            displayName: employee[0].displayName,
                            employeeID: employee[0].employeeID,
                            taggedRepotees: employee[0].taggedRepotees
                        }
                    });
                } catch (err) {
                    res.json({
                        invalid: true,
                        message: err
                    });
                }
            } else {
                res.json({
                    invalid: true,
                    message: 'Invalid password'
                })
            }

        } catch (err) {
            res.json({
                invalid: true,
                message: err
            });
        }
    } else {
        res.json({
            invalid: true,
            message: 'User not found'
        })
    }
});

// When the page refreshes or a page is opened in new tab, check if the user token is still valid
app.post('/logincheck', async (req, res) => {
    jwt.verify(req.body.token, process.env.SECRET_ACCESS_TOKEN, async (err, user) => {
        try {
            // Check if the token is available in the database
            findToken = await accessTokensSchema.find({ token: req.body.token });
            if (findToken.length === 0) {
                return res.status(403).json({
                    invalid: true,
                    message: 'Session expired'
                });
            } 
            if (err && err.expiredAt) {
                // Delete the token that is already expired from the database
                try {
                    const deleteToken = await accessTokensSchema.deleteOne({ token: req.body.token });
                    return res.status(403).json({ invalid: true, message: 'Session expired' });
                } catch (err) {
                    return res.json({ invalid: true, message: err });
                }
            }
            try {
                const userData = await employeeFeedbackSchema.find({
                    userName: req.body.user
                }).select("-password -__v");
                res.json({
                    invalid: false,
                    employee: userData
                });
            } catch (err) {
                res.json({ message: err });
            }
        } catch (err) {
            return res.json({ message: err });
        }
    });
})

// Generate a new access token and set an expiration time to it
function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1000s' });
}

// Connect to the mongoDB
mongoose.connect(
    process.env.FEEDBACK_DB,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => {
        console.log('Connected to DB');
    }
);

//Server is listening on the PORT---
// If PORT 4000 is not available, use 4005 as the backup PORT
const port = process.env.AUTH_PORT || 4005;
app.listen(port);
console.log('Server is running on PORT: ', port);