import Inventory from "../models/Inventory.js";

const postInventory = async (req, res) => {
  try {
    // Set default values for missing fields
    const { name, category, quantity, price, threshold } = req.body;
    const inventory = new Inventory({
      name,
      category,
      quantity: quantity || 0, // Default to 0 if not provided
      price: price !== undefined ? price : 0, // Default to 0 if price is undefined
      threshold: threshold || 0, // Default to 0 if not provided
    });

    await inventory.save();
    res.status(201).json({ message: "Inventory created successfully", item: inventory });
  } catch (err) {
    res.status(500).json({ message: "Error creating inventory", error: err });
  }
};


const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ message: "Error fetching inventory", error: err });
  }
};

const putInventory = async (req, res) => {
  try {
    const id = req.params.id;
    const inventory = await Inventory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Inventory updated successfully", inventory });
  } catch (err) {
    res.status(500).json({ message: "Error updating inventory", error: err });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const id = req.params.id;
    await Inventory.findByIdAndDelete(id);
    res.status(200).json({ message: "Inventory deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting inventory", error: err });
  }
};

export { postInventory, getInventory, putInventory , deleteInventory};
