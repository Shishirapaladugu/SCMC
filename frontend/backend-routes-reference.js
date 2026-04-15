/**
 * backend-routes-reference.js
 *
 * Drop-in Express route stubs showing exactly what the frontend expects.
 * Adapt these to your existing SCMC backend routes.
 * These are STUBS — replace the placeholder comments with your real logic.
 */

const express = require('express');
const router  = express.Router();

// ── Middleware (implement in your project) ────────────────────────────────────
// const { protect }    = require('../middleware/auth');       // verifies JWT, sets req.user
// const { authorityOnly } = require('../middleware/roles');   // checks req.user.role
// const upload         = require('../middleware/upload');      // multer config for image field

// ════════════════════════════════════════════════════════════════════════════
// AUTH  —  /api/auth/*
// ════════════════════════════════════════════════════════════════════════════

// POST /api/auth/register
router.post('/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  // 1. Hash password, create user in DB
  // 2. Sign JWT:  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  // 3. Return:
  res.json({ token: '<jwt>', user: { _id: '...', name, email, role } });
});

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // 1. Find user, verify password
  // 2. Sign JWT
  res.json({ token: '<jwt>', user: { _id: '...', name: 'Test User', email, role: 'citizen' } });
});

// POST /api/auth/logout
router.post('/auth/logout', (req, res) => res.sendStatus(200));

// GET /api/auth/me   (protected)
router.get('/auth/me', /* protect, */ async (req, res) => {
  // req.user is set by the protect middleware
  res.json({ user: req.user });
});


// ════════════════════════════════════════════════════════════════════════════
// COMPLAINTS  —  /api/complaints/*
// ════════════════════════════════════════════════════════════════════════════

// GET /api/complaints  (filterable + paginated)
router.get('/complaints', /* protect, authorityOnly, */ async (req, res) => {
  const { status, category, severity, duplicate, page = 1, limit = 20 } = req.query;

  // Build your DB query from these filters e.g. with Mongoose:
  // const filter = {};
  // if (status && status !== 'all')     filter.status   = status;
  // if (category && category !== 'all') filter.category = category;
  // if (severity && severity !== 'all') filter.severity = severity;
  // if (duplicate === 'true')           filter.isDuplicate = true;
  //
  // const total = await Complaint.countDocuments(filter);
  // const complaints = await Complaint.find(filter)
  //   .sort('-createdAt')
  //   .skip((page - 1) * limit)
  //   .limit(Number(limit));

  res.json({
    complaints: [],   // array of complaint objects
    pagination: { page: Number(page), limit: Number(limit), total: 0, pages: 0 },
  });
});

// GET /api/complaints/stats  (authority dashboard)
router.get('/complaints/stats', /* protect, authorityOnly, */ async (req, res) => {
  // Example Mongoose aggregation:
  // const [counts] = await Complaint.aggregate([
  //   { $group: { _id: null,
  //     total:       { $sum: 1 },
  //     pending:     { $sum: { $cond: [{ $eq: ['$status','pending'] }, 1, 0] } },
  //     inprogress:  { $sum: { $cond: [{ $eq: ['$status','inprogress'] }, 1, 0] } },
  //     completed:   { $sum: { $cond: [{ $eq: ['$status','completed'] }, 1, 0] } },
  //     highSeverity:{ $sum: { $cond: [{ $eq: ['$severity','high'] }, 1, 0] } },
  //     duplicates:  { $sum: { $cond: ['$isDuplicate', 1, 0] } },
  //   }}
  // ]);
  // const byCategory = await Complaint.aggregate([
  //   { $group: { _id: '$category', count: { $sum: 1 } } }
  // ]);

  res.json({
    total: 0, pending: 0, inprogress: 0, completed: 0,
    highSeverity: 0, duplicates: 0, avgResolutionDays: 0,
    byCategory: [
      { _id: 'Roads', count: 0 }, { _id: 'Garbage', count: 0 },
      { _id: 'Water', count: 0 }, { _id: 'Streetlights', count: 0 },
    ],
  });
});

// GET /api/complaints/my  (citizen's own reports)
router.get('/complaints/my', /* protect, */ async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  // const filter = { user: req.user._id };
  // if (status && status !== 'all') filter.status = status;
  // const complaints = await Complaint.find(filter).sort('-createdAt')...
  res.json({ complaints: [] });
});

// GET /api/complaints/:id
router.get('/complaints/:id', /* protect, */ async (req, res) => {
  // const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');
  // if (!complaint) return res.status(404).json({ message: 'Not found' });
  res.json({ complaint: {} });
});

// POST /api/complaints  (multipart/form-data)
router.post('/complaints', /* protect, upload.single('image'), */ async (req, res) => {
  const { title, description, category, location, severity } = req.body;
  // const imageUrl = req.file ? await uploadToS3(req.file) : null;
  //
  // 1. Call Gemini Vision API with imageUrl to get aiCategory + aiSeverity
  // 2. Run duplicate detection logic
  // 3. Save complaint:
  // const complaint = await Complaint.create({
  //   title, description, category: aiCategory || category,
  //   location, severity: aiSeverity || severity || 'medium',
  //   imageUrl, isDuplicate, duplicateOf,
  //   user: req.user._id,
  //   aiClassification: `${aiCategory} — ${aiSeverity} (${confidence}% confidence)`,
  //   statusUpdates: [{ message: 'Complaint received and logged', done: true }],
  // });

  res.status(201).json({ complaint: {}, message: 'Complaint submitted' });
});

// PATCH /api/complaints/:id/status
router.patch('/complaints/:id/status', /* protect, authorityOnly, */ async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'inprogress', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  // const complaint = await Complaint.findByIdAndUpdate(
  //   req.params.id,
  //   {
  //     status,
  //     $push: { statusUpdates: { message: `Status updated to ${status}`, done: true, createdAt: new Date() } }
  //   },
  //   { new: true }
  // );
  res.json({ complaint: {}, message: 'Status updated' });
});

// DELETE /api/complaints/:id  (admin only)
router.delete('/complaints/:id', /* protect, authorityOnly, */ async (req, res) => {
  // await Complaint.findByIdAndDelete(req.params.id);
  res.json({ message: 'Complaint deleted' });
});

module.exports = router;
