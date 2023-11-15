# cred-server
Server for Credential Manager

•	Two servers are being maintained. One for authentication and the other for processing client requested.
•	The advantage of having two servers is that, based on the user’s velocity (number of users), the server’s elasticity can be obtained which would be independent of each other.
•	If the server which processes requests of client is overburdened while the authentication has a smooth flow of requests, then only one server can be scaled while the other remains the same reducing in cost involved.
•	 For local testing, authentication server is running at port 4000 while the server that processes the requests is configured to run on port 3003.
•	Bcrypt is used to create the SALT and hash the password to store in database, an extra level of security even if the database is compromised.
•	 JSON Web Token (JWT) is used to create a token and to authenticate it.
•	JWT tokens are being stored in a separate database.
•	Mongoose is used to structure the data stored in MongoDB.
