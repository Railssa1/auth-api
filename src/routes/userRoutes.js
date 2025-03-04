const express = require("express")
const UserController = require("../controller/userController")

const router = express.Router();

router.post("/criar-usuario-mentor", UserController.registerMentor)
router.post("/criar-usuario-estudante", UserController.registerEstudante)
router.post("/login-estudante", UserController.loginEstudante)
router.post("/login-mentor", UserController.loginMentor)

module.exports = router;