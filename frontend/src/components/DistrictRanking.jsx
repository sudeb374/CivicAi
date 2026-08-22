import React from 'react';
import PriorityBadge from './PriorityBadge';

export default function DistrictRanking({ hotspots }) {
  // Aggregate mock hotspots by district to show a ranking
  const districtStats = hotspots.reduce((acc, spot) => {
    if (!acc[spot.district]) {
      acc[spot.district] = { district: spot.district, requests: 0, highestScore: 0, highestPriority: 'Low' };
    }
    acc[spot.district].requests += spot.requests || 1;
    if (spot.score > acc[spot.district].highestScore) {
      acc[spot.district].highestScore = spot.score;
      acc[spot.district].highestPriority = spot.priority;
    }
    return acc;
  }, {});

  const sortedDistricts = Object.values(districtStats).sort((a, b) => b.requests - a.requests);

  if (sortedDistricts.length === 0) {
    return <div className="text-sm text-gray-500 p-4 text-center">No district data available.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">District Rankings</h3>
      <ul className="divide-y divide-gray-100">
        {sortedDistricts.map((d, idx) => (
          <li key={d.district} className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-gray-400 w-4">{idx + 1}.</span>
              <span className="font-medium text-gray-900">{d.district}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{d.requests} requests</span>
              <PriorityBadge level={d.highestPriority} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
