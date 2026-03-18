const Event = require('../models/Event');

// GET /api/stats (auth required)
const getStats = async (req, res) => {
  try {
    // Run all aggregations in parallel for efficiency
    const [
      summaryResult,
      byCategoryResult,
      byTypeResult,
      top5RevenueResult,
      top5OccupancyResult
    ] = await Promise.all([
      // Summary: totalEvents, totalRevenue, totalTickets, occupancyRate
      Event.aggregate([
        {
          $group: {
            _id: null,
            totalEvents: { $sum: 1 },
            totalRevenue: { $sum: { $multiply: ['$prix', '$billetsVendus'] } },
            totalTickets: { $sum: '$billetsVendus' }
          }
        }
      ]),

      // byCategory: grouped by categorie → { name, value }
      Event.aggregate([
        {
          $group: {
            _id: '$categorie',
            value: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            value: 1
          }
        },
        { $sort: { name: 1 } }
      ]),

      // byType: grouped by type → { name, value }
      Event.aggregate([
        {
          $group: {
            _id: '$type',
            value: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            value: 1
          }
        },
        { $sort: { value: -1 } }
      ]),

      // top5Revenue: top 5 by (prix * billetsVendus) → { titre, value }
      Event.aggregate([
        {
          $addFields: {
            value: { $multiply: ['$prix', '$billetsVendus'] }
          }
        },
        { $sort: { value: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            titre: '$titre',
            value: 1
          }
        }
      ]),

      // top5Occupancy: top 5 events by occupancy % where capacite > 0 → { titre, value }
      Event.aggregate([
        {
          $match: { capacite: { $gt: 0 } }
        },
        {
          $addFields: {
            value: {
              $round: [
                { $multiply: [{ $divide: ['$billetsVendus', '$capacite'] }, 100] },
                1
              ]
            }
          }
        },
        { $sort: { value: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            titre: '$titre',
            value: 1
          }
        }
      ])
    ]);

    // Compute occupancyRate separately (average of per-event occupancy where capacite > 0)
    const occupancyAgg = await Event.aggregate([
      { $match: { capacite: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          avgOccupancy: {
            $avg: { $multiply: [{ $divide: ['$billetsVendus', '$capacite'] }, 100] }
          }
        }
      }
    ]);

    const summary = summaryResult[0] || { totalEvents: 0, totalRevenue: 0, totalTickets: 0 };
    const occupancyRate = occupancyAgg[0]
      ? Math.round(occupancyAgg[0].avgOccupancy * 10) / 10
      : 0;

    res.json({
      totalEvents: summary.totalEvents,
      totalRevenue: summary.totalRevenue,
      totalTickets: summary.totalTickets,
      occupancyRate,
      byCategory: byCategoryResult,
      byType: byTypeResult,
      top5Revenue: top5RevenueResult,
      top5Occupancy: top5OccupancyResult
    });
  } catch (error) {
    console.error('Erreur getStats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getStats };
