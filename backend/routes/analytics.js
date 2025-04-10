const express = require('express');
const Incident = require('../models/Incident');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Get overall stats
    const stats = await Incident.aggregate([
      {
        $group: {
          _id: null,
          totalIncidents: { $sum: 1 },
          activeComplaints: {
            $sum: {
              $cond: [
                { $in: ['$status', ['Open', 'Under Investigation']] },
                1,
                0,
              ],
            },
          },
          resolvedIssues: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0],
            },
          },
          avgResolutionTime: { $avg: '$resolutionTime' },
        },
      },
    ]);

    // Get pending complaints
    const pendingComplaints = await Incident.countDocuments({
      status: { $in: ['Open', 'Under Investigation'] }
    });

    // Get quality score and total reviews
    const reviewsData = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgQualityScore: { $avg: '$quality' },
          avgHygieneScore: { $avg: '$hygiene' },
        },
      },
    ]);

    // Get recent incidents (last 5)
    const recentIncidents = await Incident.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('reportedBy', 'username');

    // Get category performance
    const categoryPerformance = await Incident.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          resolved: 1,
          performance: {
            $multiply: [{ $divide: ['$resolved', '$total'] }, 100],
          },
        },
      },
      {
        $sort: { performance: -1 }
      }
    ]);

    // Get top performers (companies with highest resolution rates)
    const topPerformers = await Incident.aggregate([
      {
        $group: {
          _id: '$company',
          total: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          company: '$_id',
          total: 1,
          resolved: 1,
          resolutionRate: {
            $multiply: [{ $divide: ['$resolved', '$total'] }, 100],
          },
        },
      },
      { $sort: { resolutionRate: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      stats: stats[0] || {},
      pendingComplaints,
      reviews: reviewsData[0] || {},
      recentIncidents: recentIncidents || [],
      categoryPerformance: categoryPerformance || [],
      topPerformers: topPerformers || []
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get trend analysis
router.get('/trends', auth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await Incident.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
      {
        $project: {
          date: '$_id.date',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Fill in missing dates with zero counts
    const allDates = [];
    const startDate = new Date(thirtyDaysAgo);
    const endDate = new Date();

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      allDates.push(date.toISOString().split('T')[0]);
    }

    const filledTrends = allDates.map(date => {
      const trend = trends.find(t => t.date === date);
      return {
        date,
        count: trend ? trend.count : 0
      };
    });

    res.json(filledTrends);
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get most reported products
router.get('/most-reported-products', auth, async (req, res) => {
  try {
    const reportedProducts = await Incident.aggregate([
      {
        $group: {
          _id: {
            name: '$productName',
            category: '$category'
          },
          complaintCount: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id.name',
          category: '$_id.category',
          complaintCount: 1,
          _id: 0
        }
      },
      { $sort: { complaintCount: -1 } },
      { $limit: 5 }
    ]);

    res.json(reportedProducts);
  } catch (error) {
    console.error('Most reported products error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get most active users
router.get('/most-active-users', auth, async (req, res) => {
  try {
    const activeUsers = await Incident.aggregate([
      {
        $group: {
          _id: '$reportedBy',
          complaintCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.username',
          complaintCount: 1,
          _id: 0
        }
      },
      { $sort: { complaintCount: -1 } },
      { $limit: 5 }
    ]);

    res.json(activeUsers);
  } catch (error) {
    console.error('Most active users error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get complaint categories
router.get('/complaint-categories', auth, async (req, res) => {
  try {
    const categories = await Incident.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(categories);
  } catch (error) {
    console.error('Complaint categories error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
