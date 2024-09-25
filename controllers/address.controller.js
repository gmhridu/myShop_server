const Address = require('../models/address.model')

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, zip, phone, notes } = req.body;

    if (!userId || !address || !city || !zip || !phone || !notes) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    };
    const newAddress = new Address({
      userId,
      address,
      city,
      zip,
      phone,
      notes
    });

    await newAddress.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: newAddress
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: 'Unauthorized Access',
      });
    };

    const address = await Address.find({ userId });
    if (!address) { 
      return res.status(404).json({
        success: false,
        message: 'No address found for this user',
      });
    };

    res.status(200).json({
      success: true,
      message: 'Addresses fetched successfully',
      data: address,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;
    if (!userId || !addressId) {
      return res.status(404).json({
        success: false,
        message: 'Unauthorized Access!',
      });
    };
    const address = await Address.findOneAndUpdate({
      userId,
      _id: addressId,
    }, formData, { new: true });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "No address found!",
      });
    };

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: address,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId ||!addressId) {
      return res.status(404).json({
        success: false,
        message: 'Unauthorized Access!',
      });
    };

    const address = await Address.findOneAndDelete({
      userId,
      _id: addressId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'No address found!',
      });
    };

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
};