import ProBono from '../models/probono.model.js';
import User from '../models/user.model.js';

// Get all pro bono lawyers
export const getProBonoLawyers = async (req, res) => {
  try {
    const probonoLawyers = await ProBono.find({ isActive: true })
      .populate({
        path: 'lawyer',
        select: 'name email lawyerProfile'
      })
      .sort('-rating');

    res.status(200).json({
      status: 'success',
      data: { probonoLawyers }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get pro bono lawyer by ID
export const getProBonoLawyerById = async (req, res) => {
  try {
    const { id } = req.params;
    const probonoLawyer = await ProBono.findById(id)
      .populate('lawyer', 'name email');

    if (!probonoLawyer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Pro bono lawyer not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { probonoLawyer }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Create pro bono lawyer profile
export const createProBonoLawyer = async (req, res) => {
  try {
    const {
      experience,
      areasOfPractice,
      startingCharge,
      description,
      availability,
      languages,
      contactInfo,
      certifications
    } = req.body;

    // Check if user is a lawyer
    const user = await User.findById(req.user._id);
    if (user.role !== 'lawyer') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only lawyers can create pro bono profiles'
      });
    }

    // Check if lawyer already has a pro bono profile
    const existingProfile = await ProBono.findOne({ lawyer: req.user._id });
    if (existingProfile) {
      return res.status(400).json({
        status: 'fail',
        message: 'You already have a pro bono profile'
      });
    }

    const probonoLawyer = await ProBono.create({
      lawyer: req.user._id,
      experience,
      areasOfPractice,
      startingCharge,
      description,
      availability,
      languages,
      contactInfo,
      certifications
    });

    res.status(201).json({
      status: 'success',
      data: { probonoLawyer }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update pro bono lawyer profile
export const updateProBonoLawyer = async (req, res) => {
  try {
    const probonoLawyer = await ProBono.findOne({ lawyer: req.user._id });
    
    if (!probonoLawyer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Pro bono profile not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'lawyer' && key !== 'rating' && key !== 'totalRatings') {
        probonoLawyer[key] = req.body[key];
      }
    });

    await probonoLawyer.save();

    res.status(200).json({
      status: 'success',
      data: { probonoLawyer }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Delete pro bono lawyer profile
export const deleteProBonoLawyer = async (req, res) => {
  try {
    const probonoLawyer = await ProBono.findOne({ lawyer: req.user._id });
    
    if (!probonoLawyer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Pro bono profile not found'
      });
    }

    await ProBono.findByIdAndDelete(probonoLawyer._id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Rate a pro bono lawyer
export const rateLawyer = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'fail',
        message: 'Rating must be between 1 and 5'
      });
    }

    const probonoLawyer = await ProBono.findById(id);
    if (!probonoLawyer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Pro bono lawyer not found'
      });
    }

    // Update rating
    const newTotalRatings = probonoLawyer.totalRatings + 1;
    const newRating = (
      (probonoLawyer.rating * probonoLawyer.totalRatings + rating) /
      newTotalRatings
    );

    probonoLawyer.rating = newRating;
    probonoLawyer.totalRatings = newTotalRatings;
    await probonoLawyer.save();

    res.status(200).json({
      status: 'success',
      data: { probonoLawyer }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Search pro bono lawyers
export const searchProBonoLawyers = async (req, res) => {
  try {
    const { query } = req.query;
    const filters = {};

    if (query) {
      filters.$or = [
        { 'areasOfPractice': { $regex: query, $options: 'i' } },
        { 'languages': { $regex: query, $options: 'i' } },
        { 'description': { $regex: query, $options: 'i' } }
      ];
    }

    const probonoLawyers = await ProBono.find({ ...filters, isActive: true })
      .populate('lawyer', 'name email')
      .sort('-rating');

    res.status(200).json({
      status: 'success',
      data: { probonoLawyers }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};