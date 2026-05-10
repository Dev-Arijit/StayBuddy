const User = require("../models/User");

// -------- TOGGLE WISHLIST --------

exports.toggleWishlist = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    const propertyId = req.params.id;

    const index = user.wishlist.indexOf(propertyId);

    if (index === -1) {
      user.wishlist.push(propertyId);
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();

    res.json({
      success: true,
      data: user.wishlist
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};


// -------- ADD RECENTLY VIEWED --------

exports.addRecentlyViewed = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    const propertyId = req.params.id;

    user.recentlyViewed = user.recentlyViewed.filter(
      p => p.toString() !== propertyId
    );

    user.recentlyViewed.unshift(propertyId);

    user.recentlyViewed = user.recentlyViewed.slice(0, 10);

    await user.save();

    res.json({
      success: true
    });

  } catch (err) {

    res.status(500).json({
      success: false
    });

  }
};


// -------- STUDENT DASHBOARD DATA --------

exports.getStudentDashboard = async (req, res) => {

  try {

    const user = await User.findById(req.user._id)
      .populate("wishlist")
      .populate("recentlyViewed");

    res.json({
      success: true,
      data: {
        wishlist: user.wishlist,
        recentlyViewed: user.recentlyViewed
      }
    });

  } catch (err) {

    res.status(500).json({
      success: false
    });

  }

};


// -------- UPDATE PROFILE --------

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is being changed to one that already exists
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};