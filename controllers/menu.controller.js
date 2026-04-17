const Menu = require("../models/menu.model");
const { emitSocketEvent } = require("../socket");

const getMenu = async (req, res) => {
  const { available } = req.query;
  const query = {};
  if (available === "true") query.available = true;
  if (available === "false") query.available = false;
  const menu = await Menu.find(query);
  res.json(menu);
};

const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, available } = req.body;
    const newItem = new Menu({ name, category, price, available: available !== undefined ? available : true });
    await newItem.save();
    emitSocketEvent('dataCreated', 'menu', { id: newItem._id });
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Menu create error", err);
    res.status(500).json({ message: "Failed to create menu item", error: err.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const item = await Menu.findByIdAndUpdate(id, updates, { new: true });
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    emitSocketEvent('dataUpdated', 'menu', { id: item._id, updates });
    res.json(item);
  } catch (err) {
    console.error("Menu update error", err);
    res.status(500).json({ message: "Failed to update menu item", error: err.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Menu.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    emitSocketEvent('dataDeleted', 'menu', { id });
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    console.error("Menu delete error", err);
    res.status(500).json({ message: "Failed to delete menu item", error: err.message });
  }
};

module.exports = { getMenu, createMenuItem, updateMenuItem, deleteMenuItem };
