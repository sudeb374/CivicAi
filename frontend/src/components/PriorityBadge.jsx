import React from 'react';

export default function PriorityBadge({ level, className = "" }) {
  const getBadgeStyles = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default: return 'text-green-700 bg-green-100 border-green-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyles(level)} ${className}`}>
      {level || 'Normal'}
    </span>
  );
}
