const express = require("express")
const UserController = require("../controller/userController")

const router = express.Router();

router.post("/criar-usuario", UserController.register)
router.post("/login", UserController.login)

module.exports = router;