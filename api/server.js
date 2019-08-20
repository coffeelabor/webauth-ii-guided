const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionsStore = require("connect-session-knex")(session);

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");
const knexConnection = require("../database/dbConfig.js");

const server = express();
const sessionOptions = {
  name: "fiftyfirstdates",
  secret: process.env.COOKIE_SECRET || "keep it secret", //for encryption
  cookie: {
    secure: process.env.COOKIE_SECURE || false, //in production should be true, false for development
    maxAge: 1000 * 60 * 60 * 24, //in miliseconds
    httpOnly: true //client JS has no access to the cookie
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionsStore({
    knex: knexConnection,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up", session: req.session });
});

module.exports = server;
