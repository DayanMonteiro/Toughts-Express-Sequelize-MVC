const express = require("express");
const router = express.Router();
const ToughtController = require("../controllers/ToughtController");

// helpers - assim que importa função => require('../helpers/auth').checkAuth
const checkAuth = require("../helpers/auth").checkAuth;

// passa a função na rota dessa forma o checkAuth só permite acesso quando estiver logado
router.get("/add", checkAuth, ToughtController.createTought);
router.post("/add", checkAuth, ToughtController.createToughtSave);
router.get("/dashboard", checkAuth, ToughtController.dashboard);
router.get("/", ToughtController.showToughts);

module.exports = router;
