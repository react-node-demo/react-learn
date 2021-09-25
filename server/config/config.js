const mongodb_username = "root";
const mongodb_password = "hxslove1996";
const mongodb_database = "library";

const MONGODB_LINK = `mongodb+srv://${mongodb_username}:${mongodb_password}@cluster0.qik6x.mongodb.net/${mongodb_database}?retryWrites=true&w=majority`;

const JWT_TOKEN_RULE = "token_secret";

const JWT_EXPIRES = 60;
const REFRESH_JWT_EXPIRES = 604800;

module.exports = { MONGODB_LINK, JWT_TOKEN_RULE, JWT_EXPIRES, REFRESH_JWT_EXPIRES };
