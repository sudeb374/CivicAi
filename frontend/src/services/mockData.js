export const mockDashboardStats = {
  totalComplaints: 1245,
  resolved: 890,
  pending: 355,
  criticalHotspots: 12,
  averageResolutionTime: "4.2 days",
};

export const mockCategoryDistribution = [
  { name: 'Roads & Infra', value: 400 },
  { name: 'Water & Sanitation', value: 300 },
  { name: 'Electricity', value: 300 },
  { name: 'Public Transport', value: 200 },
  { name: 'Other', value: 45 },
];

export const mockHotspots = [
  { id: 1, lat: 28.6139, lng: 77.2090, priority: 'Critical', category: 'Water & Sanitation', score: 95, district: 'Central Delhi', requests: 42, title: "Severe Water Shortage" },
  { id: 2, lat: 28.5355, lng: 77.3910, priority: 'High', category: 'Roads & Infra', score: 82, district: 'Noida', requests: 28, title: "Major Potholes" },
  { id: 3, lat: 28.4595, lng: 77.0266, priority: 'Medium', category: 'Electricity', score: 65, district: 'Gurugram', requests: 15, title: "Frequent Power Cuts" },
  { id: 4, lat: 28.6692, lng: 77.4538, priority: 'Low', category: 'Water & Sanitation', score: 35, district: 'Ghaziabad', requests: 5, title: "Minor Pipe Leak" },
  { id: 5, lat: 28.7041, lng: 77.1025, priority: 'Critical', category: 'Public Transport', score: 90, district: 'North Delhi', requests: 38, title: "Bus Stop Damaged" }
];

export const mockPriorityList = [
  {
    id: "PR-1029",
    category: "Water & Sanitation",
    district: "Central Delhi",
    location: "Sector 4, Rohini",
    score: 95,
    level: "Critical",
    reason: "High citizen demand (0.40) + Severe infrastructure gap (0.30) + High population impact (0.20) + High urgency (0.10)",
    date: "2023-10-25"
  },
  {
    id: "PR-1030",
    category: "Roads & Infra",
    district: "Noida",
    location: "MG Road, Phase 2",
    score: 82,
    level: "High",
    reason: "High citizen demand (0.40) + Moderate infra gap (0.30)",
    date: "2023-10-24"
  },
  {
    id: "PR-1031",
    category: "Electricity",
    district: "Gurugram",
    location: "DLF Phase 3",
    score: 65,
    level: "Medium",
    reason: "Moderate demand + localized impact",
    date: "2023-10-24"
  }
];

export const mockDistricts = [
  "Central Delhi", "North Delhi", "South Delhi", "Noida", "Gurugram", "Ghaziabad"
];

export const mockCategories = [
  "Roads & Infra", "Water & Sanitation", "Electricity", "Public Transport", "Other"
];

export const mockInsights = [
  { id: 1, text: "Water-related complaints are increasing by 15% in Central Delhi.", type: "trend" },
  { id: 2, text: "Road infrastructure has consistently high citizen demand across all districts.", type: "demand" },
  { id: 3, text: "Public transport issues are heavily concentrated in North Delhi.", type: "anomaly" }
];

export const analyzeComplaintMock = async (text) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const textLower = text.toLowerCase();
  
  let category = "other";
  if (textLower.includes("water") || textLower.includes("pipe") || textLower.includes("paani")) category = "Water & Sanitation";
  if (textLower.includes("road") || textLower.includes("pothole") || textLower.includes("sadak")) category = "Roads & Infra";
  if (textLower.includes("electric") || textLower.includes("power") || textLower.includes("light") || textLower.includes("bijli")) category = "Electricity";

  let urgency = "Medium";
  if (textLower.includes("urgent") || textLower.includes("immediately") || textLower.includes("danger")) urgency = "High";
  if (textLower.includes("whenever") || textLower.includes("minor")) urgency = "Low";

  return {
    language: textLower.includes("paani") || textLower.includes("sadak") || textLower.includes("bijli") ? "hi" : "en",
    category,
    urgency,
    summary: text.length > 50 ? text.substring(0, 47) + '...' : text,
    seasonal: textLower.includes("rain") || textLower.includes("monsoon")
  };
};
