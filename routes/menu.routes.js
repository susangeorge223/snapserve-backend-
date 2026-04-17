const express = require("express");
const router = express.Router();

const { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } = require("../controllers/menu.controller");

router.get("/", getMenu);
router.post("/", createMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

module.exports = router;
