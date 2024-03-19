const Package = require('../models/Package');

const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPackage = async (req, res) => {
    const package = new Package(req.body);
    try {
        const newPackage = await package.save();
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updatePackage = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedPackage = await Package.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        res.json(updatedPackage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePackage = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPackage = await Package.findByIdAndDelete(id);

        if (!deletedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllPackages, createPackage, updatePackage, deletePackage };
