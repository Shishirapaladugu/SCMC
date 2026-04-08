import Complaint from '../models/Complaint.js';
import cloudinary from '../config/cloudinary.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// Function to call ML API
async function classifyImage(imagePath) {
  const form = new FormData();
  form.append('image', fs.createReadStream(imagePath));

  const response = await axios.post('http://127.0.0.1:5001/predict', form, {
    headers: form.getHeaders(),
  });

  return response.data.category;
}

// Map category to department
function getDepartment(category) {
  switch (category) {
    case 'garbage':
      return 'Sanitation';
    case 'pothole':
      return 'Roads';
    case 'streetlight':
      return 'Electricity';
    case 'IllegalParking':
      return 'Traffic';
    default:
      return 'General';
  }
}

// Map category to priority
function getPriority(category) {
  if (category === 'pothole' || category === 'IllegalParking') return 'High';
  return 'Medium';
}

// Create complaint
export const createComplaint = async (req, res) => {
  try {
    const { city, state, address, image } = req.body;

    // Validate required fields
    if (!city || !state || !address) {
      return res.status(400).json({ message: 'City, state, and address are required.' });
    }

    let imageUrl;
    let tempImagePath;

    if (image) {
      try {
        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;

        // Save locally temporarily to send to ML API
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        tempImagePath = `temp_${Date.now()}.jpg`;
        fs.writeFileSync(tempImagePath, buffer);

      } catch (err) {
        return res.status(500).json({ message: 'Image upload to Cloudinary failed.', error: err.message });
      }
    }

    // Call ML API if image exists
    let category = 'General';
    if (tempImagePath) {
      category = await classifyImage(tempImagePath);
      fs.unlinkSync(tempImagePath); // Delete temporary file
    }

    const department = getDepartment(category);
    const priority = getPriority(category);

    const newComplaint = await Complaint.create({
      user: req.user._id,
      city,
      state,
      address,
      imageUrl,
      category,
      department,
      priority,
      status: 'New',
    });

    res.status(201).json({
      message: 'Complaint submitted successfully.',
      complaint: newComplaint,
    });

  } catch (error) {
    console.error('Error while creating complaint:', error);
    res.status(500).json({ message: 'Server error while submitting complaint.' });
  }
};

// Get all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'email');
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Failed to fetch complaints.' });
  }
};

// Get logged-in user's complaints
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({ message: 'Failed to fetch your complaints.' });
  }
};

// Update complaint status
export const updateComplaintStatus = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { status } = req.body;

    if (!['New', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    res.status(200).json({
      message: 'Complaint status updated.',
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Failed to update status.' });
  }
};