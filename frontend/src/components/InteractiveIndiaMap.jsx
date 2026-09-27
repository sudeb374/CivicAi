import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  MapPin, 
  Flame, 
  Activity, 
  CheckCircle2, 
  RefreshCw,
  Building2,
  Users,
  ZoomIn,
  ZoomOut,
  ShieldAlert,
  ArrowRight,
  Database,
  AlertTriangle,
  Droplets,
  Zap,
  Route,
  HeartPulse,
  GraduationCap
} from 'lucide-react';

// Exact physical centroid percentages in the 3367 x 3741 SVG map
const TRUE_STATE_CENTERS = {
  // Northern States
  "jammu-kashmir": { pctX: 31.0, pctY: 8.6, defaultZoom: 2.2 },
  "himachal-pradesh": { pctX: 33.4, pctY: 18.5, defaultZoom: 2.5 },
  "punjab": { pctX: 27.5, pctY: 21.0, defaultZoom: 2.5 },
  "uttarakhand": { pctX: 40.3, pctY: 25.1, defaultZoom: 2.5 },
  "haryana": { pctX: 29.2, pctY: 28.0, defaultZoom: 2.5 },
  "delhi": { pctX: 33.6, pctY: 29.9, defaultZoom: 3.6 },
  "rajasthan": { pctX: 20.9, pctY: 37.0, defaultZoom: 2.2 },
  "uttar-pradesh": { pctX: 46.1, pctY: 35.1, defaultZoom: 2.2 },

  // North-Eastern States
  "sikkim": { pctX: 71.5, pctY: 33.1, defaultZoom: 3.0 },
  "arunachal-pradesh": { pctX: 90.6, pctY: 29.2, defaultZoom: 2.5 },
  "assam": { pctX: 85.7, pctY: 36.1, defaultZoom: 2.5 },
  "nagaland": { pctX: 91.0, pctY: 36.0, defaultZoom: 3.0 },
  "meghalaya": { pctX: 80.7, pctY: 38.8, defaultZoom: 3.0 },
  "manipur": { pctX: 89.9, pctY: 40.9, defaultZoom: 3.0 },
  "tripura": { pctX: 83.1, pctY: 45.4, defaultZoom: 3.0 },
  "mizoram": { pctX: 86.9, pctY: 47.2, defaultZoom: 2.6 },

  // Eastern States
  "west-bengal": { pctX: 69.9, pctY: 44.2, defaultZoom: 2.4 },
  "bihar": { pctX: 62.8, pctY: 39.3, defaultZoom: 2.5 },
  "jharkhand": { pctX: 62.8, pctY: 47.1, defaultZoom: 2.5 },
  "odisha": { pctX: 59.7, pctY: 59.4, defaultZoom: 2.2 },

  // Central States
  "madhya-pradesh": { pctX: 37.4, pctY: 46.0, defaultZoom: 2.2 },
  "chhattisgarh": { pctX: 51.4, pctY: 56.6, defaultZoom: 2.2 },

  // Western States
  "gujarat": { pctX: 11.5, pctY: 51.1, defaultZoom: 2.2 },
  "maharashtra": { pctX: 31.3, pctY: 63.3, defaultZoom: 2.2 },
  "goa": { pctX: 20.1, pctY: 75.6, defaultZoom: 3.6 },
  "dadra-and-nagar-haveli-and-daman-and-diu": { pctX: 17.8, pctY: 59.2, defaultZoom: 3.6 },

  // Southern States
  "telangana": { pctX: 40.1, pctY: 66.5, defaultZoom: 2.5 },
  "andhra-pradesh": { pctX: 45.4, pctY: 73.8, defaultZoom: 2.2 },
  "karnataka": { pctX: 29.3, pctY: 76.8, defaultZoom: 2.2 },
  "tamil-nadu": { pctX: 37.1, pctY: 90.9, defaultZoom: 2.5 },
  "kerala": { pctX: 28.2, pctY: 91.9, defaultZoom: 2.5 },

  // Island UTs
  "andaman-nicobar-islands": { pctX: 74.2, pctY: 53.3, defaultZoom: 3.6 }
};

// Regional state and district templates
const REGIONAL_STATE_DATA = {
  'west-bengal': {
    name: 'West Bengal',
    status: 'Active Hotspot',
    topSector: 'Water Infrastructure',
    severity: 'High',
    resolvedRate: '78%',
    districts: [
      { name: 'Howrah', code: '341', villages: 650, population: '1,775,885', complaints: 24, infraGap: '64%', status: 'Active Monitoring' },
      { name: 'Kolkata', code: '342', villages: 180, population: '4,496,694', complaints: 14, infraGap: '32%', status: 'Stable' },
      { name: 'Hooghly', code: '338', villages: 420, population: '5,519,145', complaints: 19, infraGap: '58%', status: 'High Demand' },
      { name: 'North 24 Parganas', code: '337', villages: 590, population: '10,009,781', complaints: 28, infraGap: '61%', status: 'Active Hotspot' },
      { name: 'South 24 Parganas', code: '343', villages: 710, population: '8,161,961', complaints: 31, infraGap: '69%', status: 'High Demand' },
      { name: 'Nadia', code: '336', villages: 380, population: '5,167,600', complaints: 16, infraGap: '54%', status: 'Monitored' },
      { name: 'Murshidabad', code: '333', villages: 620, population: '7,103,807', complaints: 22, infraGap: '66%', status: 'Active Hotspot' },
      { name: 'Purba Bardhaman', code: '334', villages: 490, population: '4,835,532', complaints: 15, infraGap: '49%', status: 'Stable' },
      { name: 'Paschim Medinipur', code: '344', villages: 540, population: '5,913,457', complaints: 18, infraGap: '59%', status: 'Monitored' },
      { name: 'Darjeeling', code: '327', villages: 210, population: '1,846,823', complaints: 9, infraGap: '45%', status: 'Stable' }
    ]
  },
  'maharashtra': {
    name: 'Maharashtra',
    status: 'Monitored Hub',
    topSector: 'Road Connectivity',
    severity: 'Medium',
    resolvedRate: '86%',
    districts: [
      { name: 'Mumbai City', code: '517', villages: 85, population: '3,085,411', complaints: 12, infraGap: '28%', status: 'Stable' },
      { name: 'Mumbai Suburban', code: '518', villages: 120, population: '9,356,962', complaints: 21, infraGap: '35%', status: 'Monitored' },
      { name: 'Pune', code: '521', villages: 390, population: '9,429,408', complaints: 18, infraGap: '44%', status: 'Stable' },
      { name: 'Thane', code: '519', villages: 280, population: '11,060,148', complaints: 24, infraGap: '52%', status: 'High Demand' },
      { name: 'Nagpur', code: '505', villages: 310, population: '4,653,570', complaints: 14, infraGap: '48%', status: 'Monitored' },
      { name: 'Nashik', code: '516', villages: 340, population: '6,107,187', complaints: 17, infraGap: '56%', status: 'Monitored' },
      { name: 'Chhatrapati Sambhajinagar', code: '515', villages: 290, population: '3,701,282', complaints: 15, infraGap: '59%', status: 'High Demand' },
      { name: 'Solapur', code: '526', villages: 320, population: '4,317,756', complaints: 16, infraGap: '63%', status: 'High Demand' }
    ]
  },
  'uttar-pradesh': {
    name: 'Uttar Pradesh',
    status: 'High Demand',
    topSector: 'Electricity & Healthcare',
    severity: 'Critical',
    resolvedRate: '67%',
    districts: [
      { name: 'Lucknow', code: '157', villages: 280, population: '4,589,838', complaints: 29, infraGap: '48%', status: 'High Demand' },
      { name: 'Kanpur Nagar', code: '164', villages: 310, population: '4,581,268', complaints: 26, infraGap: '52%', status: 'High Demand' },
      { name: 'Varanasi', code: '197', villages: 340, population: '3,676,841', complaints: 24, infraGap: '55%', status: 'Active Hotspot' },
      { name: 'Prayagraj (Allahabad)', code: '174', villages: 420, population: '5,954,391', complaints: 32, infraGap: '64%', status: 'Critical Demand' },
      { name: 'Agra', code: '146', villages: 290, population: '4,418,797', complaints: 21, infraGap: '53%', status: 'Monitored' },
      { name: 'Gorakhpur', code: '190', villages: 380, population: '4,440,895', complaints: 27, infraGap: '62%', status: 'High Demand' },
      { name: 'Meerut', code: '139', villages: 240, population: '3,443,689', complaints: 18, infraGap: '46%', status: 'Stable' },
      { name: 'Ghaziabad', code: '140', villages: 160, population: '4,681,645', complaints: 19, infraGap: '38%', status: 'Stable' }
    ]
  },
  'delhi': {
    name: 'Delhi NCR',
    status: 'Administrative HQ',
    topSector: 'Public Transit',
    severity: 'Low',
    resolvedRate: '93%',
    districts: [
      { name: 'Central Delhi', code: '095', villages: 12, population: '582,320', complaints: 3, infraGap: '18%', status: 'Stable' },
      { name: 'New Delhi', code: '094', villages: 15, population: '142,004', complaints: 2, infraGap: '15%', status: 'Optimal' },
      { name: 'South Delhi', code: '098', villages: 28, population: '2,731,929', complaints: 8, infraGap: '26%', status: 'Stable' },
      { name: 'North Delhi', code: '091', villages: 32, population: '887,978', complaints: 7, infraGap: '31%', status: 'Stable' },
      { name: 'East Delhi', code: '093', villages: 23, population: '1,709,346', complaints: 9, infraGap: '34%', status: 'Monitored' }
    ]
  },
  'karnataka': {
    name: 'Karnataka',
    status: 'Innovation Corridor',
    topSector: 'Digital Governance',
    severity: 'Low',
    resolvedRate: '91%',
    districts: [
      { name: 'Bengaluru Urban', code: '572', villages: 90, population: '9,621,551', complaints: 14, infraGap: '29%', status: 'Stable' },
      { name: 'Mysuru', code: '577', villages: 230, population: '3,001,127', complaints: 8, infraGap: '38%', status: 'Stable' },
      { name: 'Belagavi', code: '556', villages: 340, population: '4,779,661', complaints: 13, infraGap: '47%', status: 'Monitored' },
      { name: 'Dharwad', code: '563', villages: 190, population: '1,847,023', complaints: 9, infraGap: '41%', status: 'Stable' },
      { name: 'Dakshina Kannada', code: '575', villages: 170, population: '2,089,649', complaints: 6, infraGap: '32%', status: 'Optimal' }
    ]
  },
  'tamil-nadu': {
    name: 'Tamil Nadu',
    status: 'Coastal Region',
    topSector: 'Water Management',
    severity: 'Medium',
    resolvedRate: '88%',
    districts: [
      { name: 'Chennai', code: '603', villages: 60, population: '4,646,732', complaints: 11, infraGap: '27%', status: 'Stable' },
      { name: 'Coimbatore', code: '632', villages: 210, population: '3,458,045', complaints: 9, infraGap: '33%', status: 'Optimal' },
      { name: 'Madurai', code: '623', villages: 280, population: '3,038,252', complaints: 14, infraGap: '46%', status: 'Monitored' },
      { name: 'Tiruchirappalli', code: '614', villages: 240, population: '2,722,290', complaints: 12, infraGap: '42%', status: 'Stable' },
      { name: 'Salem', code: '607', villages: 290, population: '3,482,056', complaints: 13, infraGap: '48%', status: 'Monitored' }
    ]
  },
  'andhra-pradesh': {
    name: 'Andhra Pradesh',
    status: 'Coastal Governance Hub',
    topSector: 'Irrigation & Coastal Waterways',
    severity: 'Medium',
    resolvedRate: '86%',
    districts: [
      { name: 'Visakhapatnam', code: '510', villages: 280, population: '4,290,589', complaints: 16, infraGap: '34%', status: 'Optimal' },
      { name: 'Vijayawada (NTR)', code: '511', villages: 320, population: '2,218,591', complaints: 14, infraGap: '32%', status: 'Stable' },
      { name: 'Guntur', code: '506', villages: 410, population: '4,887,813', complaints: 19, infraGap: '46%', status: 'Monitored' },
      { name: 'Tirupati', code: '503', villages: 390, population: '2,196,984', complaints: 13, infraGap: '38%', status: 'Optimal' },
      { name: 'Kurnool', code: '512', villages: 460, population: '4,053,463', complaints: 21, infraGap: '58%', status: 'High Demand' },
      { name: 'Anantapur', code: '502', villages: 480, population: '4,081,148', complaints: 18, infraGap: '54%', status: 'Monitored' },
      { name: 'East Godavari (Kakinada)', code: '505', villages: 520, population: '5,154,296', complaints: 20, infraGap: '48%', status: 'Monitored' }
    ]
  },
  'telangana': {
    name: 'Telangana',
    status: 'Tech & Irrigation Hub',
    topSector: 'Mission Bhagiratha Water Grid',
    severity: 'Low',
    resolvedRate: '91%',
    districts: [
      { name: 'Hyderabad', code: '535', villages: 45, population: '3,943,323', complaints: 11, infraGap: '24%', status: 'Optimal' },
      { name: 'Medchal-Malkajgiri', code: '536', villages: 120, population: '2,440,073', complaints: 13, infraGap: '31%', status: 'Stable' },
      { name: 'Rangareddy', code: '537', villages: 280, population: '2,446,265', complaints: 14, infraGap: '37%', status: 'Stable' },
      { name: 'Warangal', code: '538', villages: 310, population: '1,135,707', complaints: 15, infraGap: '45%', status: 'Monitored' },
      { name: 'Karimnagar', code: '539', villages: 260, population: '1,005,711', complaints: 12, infraGap: '41%', status: 'Stable' },
      { name: 'Nalgonda', code: '540', villages: 380, population: '1,618,416', complaints: 17, infraGap: '52%', status: 'High Demand' }
    ]
  },
  'kerala': {
    name: 'Kerala',
    status: 'Sustainable Development Zone',
    topSector: 'Public Health & Rural Sanitation',
    severity: 'Low',
    resolvedRate: '95%',
    districts: [
      { name: 'Thiruvananthapuram', code: '598', villages: 90, population: '3,301,427', complaints: 8, infraGap: '22%', status: 'Optimal' },
      { name: 'Ernakulam (Kochi)', code: '595', villages: 110, population: '3,282,388', complaints: 9, infraGap: '21%', status: 'Optimal' },
      { name: 'Kozhikode', code: '588', villages: 115, population: '3,086,293', complaints: 10, infraGap: '26%', status: 'Stable' },
      { name: 'Thrissur', code: '594', villages: 140, population: '3,121,200', complaints: 7, infraGap: '25%', status: 'Optimal' },
      { name: 'Malappuram', code: '590', villages: 135, population: '4,112,920', complaints: 12, infraGap: '34%', status: 'Monitored' }
    ]
  },
  'odisha': {
    name: 'Odisha',
    status: 'Cyclone Resilient Belt',
    topSector: 'Disaster Shelters & Rural Piped Water',
    severity: 'Medium',
    resolvedRate: '84%',
    districts: [
      { name: 'Khurda (Bhubaneswar)', code: '386', villages: 320, population: '2,251,673', complaints: 14, infraGap: '33%', status: 'Stable' },
      { name: 'Cuttack', code: '381', villages: 410, population: '2,624,470', complaints: 16, infraGap: '38%', status: 'Stable' },
      { name: 'Ganjam', code: '388', villages: 590, population: '3,529,031', complaints: 23, infraGap: '57%', status: 'High Demand' },
      { name: 'Puri', code: '387', villages: 360, population: '1,698,730', complaints: 15, infraGap: '42%', status: 'Monitored' },
      { name: 'Mayurbhanj', code: '376', villages: 680, population: '2,519,738', complaints: 21, infraGap: '63%', status: 'Active Hotspot' }
    ]
  },
  'jharkhand': {
    name: 'Jharkhand',
    status: 'Mineral & Tribal Belt',
    topSector: 'Rural Electrification & Road Access',
    severity: 'High',
    resolvedRate: '73%',
    districts: [
      { name: 'Ranchi', code: '356', villages: 310, population: '2,914,253', complaints: 21, infraGap: '45%', status: 'Monitored' },
      { name: 'East Singhbhum (Jamshedpur)', code: '360', villages: 280, population: '2,293,919', complaints: 16, infraGap: '39%', status: 'Stable' },
      { name: 'Dhanbad', code: '354', villages: 290, population: '2,684,487', complaints: 24, infraGap: '53%', status: 'High Demand' },
      { name: 'Bokaro', code: '355', villages: 240, population: '2,062,330', complaints: 18, infraGap: '48%', status: 'Monitored' },
      { name: 'Palamu', code: '346', villages: 480, population: '1,939,869', complaints: 26, infraGap: '68%', status: 'Critical Demand' }
    ]
  },
  'chhattisgarh': {
    name: 'Chhattisgarh',
    status: 'Forest & Power Corridor',
    topSector: 'Tribal Healthcare & Solar Mini-Grids',
    severity: 'Medium',
    resolvedRate: '78%',
    districts: [
      { name: 'Raipur', code: '410', villages: 260, population: '2,160,876', complaints: 16, infraGap: '36%', status: 'Optimal' },
      { name: 'Durg (Bhilai)', code: '409', villages: 290, population: '1,721,948', complaints: 14, infraGap: '38%', status: 'Stable' },
      { name: 'Bilaspur', code: '406', villages: 370, population: '1,990,758', complaints: 19, infraGap: '49%', status: 'Monitored' },
      { name: 'Bastar (Jagdalpur)', code: '414', villages: 540, population: '1,413,199', complaints: 25, infraGap: '67%', status: 'High Demand' }
    ]
  },
  'punjab': {
    name: 'Punjab',
    status: 'Agrarian Heartland',
    topSector: 'Canal Irrigation & Ground Water Quality',
    severity: 'Low',
    resolvedRate: '90%',
    districts: [
      { name: 'Ludhiana', code: '042', villages: 290, population: '3,498,739', complaints: 14, infraGap: '28%', status: 'Optimal' },
      { name: 'Amritsar', code: '037', villages: 260, population: '2,490,656', complaints: 13, infraGap: '31%', status: 'Stable' },
      { name: 'Jalandhar', code: '040', villages: 270, population: '2,193,590', complaints: 11, infraGap: '29%', status: 'Optimal' },
      { name: 'Patiala', code: '047', villages: 310, population: '1,895,645', complaints: 12, infraGap: '35%', status: 'Stable' },
      { name: 'Bathinda', code: '045', villages: 280, population: '1,388,525', complaints: 15, infraGap: '44%', status: 'Monitored' }
    ]
  },
  'haryana': {
    name: 'Haryana',
    status: 'NCR Industrial Corridor',
    topSector: 'Highway Connectivity & Smart Power',
    severity: 'Low',
    resolvedRate: '92%',
    districts: [
      { name: 'Gurugram', code: '086', villages: 120, population: '1,514,432', complaints: 11, infraGap: '24%', status: 'Optimal' },
      { name: 'Faridabad', code: '088', villages: 140, population: '1,809,733', complaints: 13, infraGap: '27%', status: 'Stable' },
      { name: 'Ambala', code: '071', villages: 210, population: '1,128,350', complaints: 8, infraGap: '29%', status: 'Optimal' },
      { name: 'Hisar', code: '079', villages: 260, population: '1,743,931', complaints: 14, infraGap: '41%', status: 'Monitored' },
      { name: 'Karnal', code: '074', villages: 240, population: '1,505,324', complaints: 10, infraGap: '33%', status: 'Stable' }
    ]
  },
  'goa': {
    name: 'Goa',
    status: 'Coastal Eco Zone',
    topSector: 'Waste Processing & Coastal Power',
    severity: 'Low',
    resolvedRate: '96%',
    districts: [
      { name: 'North Goa (Panaji)', code: '585', villages: 82, population: '818,008', complaints: 4, infraGap: '18%', status: 'Optimal' },
      { name: 'South Goa (Margao)', code: '586', villages: 88, population: '640,537', complaints: 5, infraGap: '21%', status: 'Optimal' }
    ]
  },
  'gujarat': {
    name: 'Gujarat',
    status: 'Industrial Hub',
    topSector: 'Power Grid',
    severity: 'Low',
    resolvedRate: '92%',
    districts: [
      { name: 'Ahmedabad', code: '474', villages: 190, population: '7,214,225', complaints: 11, infraGap: '30%', status: 'Stable' },
      { name: 'Surat', code: '492', villages: 170, population: '6,081,322', complaints: 10, infraGap: '32%', status: 'Stable' },
      { name: 'Vadodara', code: '486', villages: 220, population: '4,165,626', complaints: 8, infraGap: '36%', status: 'Optimal' },
      { name: 'Rajkot', code: '476', villages: 250, population: '3,804,558', complaints: 12, infraGap: '43%', status: 'Stable' },
      { name: 'Bhavnagar', code: '480', villages: 230, population: '2,880,365', complaints: 9, infraGap: '47%', status: 'Monitored' }
    ]
  },
  'rajasthan': {
    name: 'Rajasthan',
    status: 'Monitored',
    topSector: 'Canal & Water Supply',
    severity: 'High',
    resolvedRate: '75%',
    districts: [
      { name: 'Jaipur', code: '100', villages: 310, population: '6,626,178', complaints: 18, infraGap: '45%', status: 'Monitored' },
      { name: 'Jodhpur', code: '114', villages: 340, population: '3,687,002', complaints: 15, infraGap: '56%', status: 'High Demand' },
      { name: 'Kota', code: '121', villages: 220, population: '1,951,014', complaints: 11, infraGap: '49%', status: 'Stable' },
      { name: 'Bikaner', code: '102', villages: 280, population: '2,363,937', complaints: 16, infraGap: '62%', status: 'High Demand' },
      { name: 'Udaipur', code: '125', villages: 330, population: '3,068,420', complaints: 14, infraGap: '54%', status: 'Monitored' }
    ]
  },
  'bihar': {
    name: 'Bihar',
    status: 'High Grievance',
    topSector: 'Primary Education',
    severity: 'Critical',
    resolvedRate: '65%',
    districts: [
      { name: 'Patna', code: '230', villages: 290, population: '5,838,465', complaints: 28, infraGap: '51%', status: 'High Demand' },
      { name: 'Gaya', code: '236', villages: 370, population: '4,391,418', complaints: 23, infraGap: '63%', status: 'Critical Demand' },
      { name: 'Muzaffarpur', code: '216', villages: 340, population: '4,801,062', complaints: 22, infraGap: '61%', status: 'Active Hotspot' },
      { name: 'Bhagalpur', code: '224', villages: 280, population: '3,037,766', complaints: 19, infraGap: '59%', status: 'High Demand' },
      { name: 'Darbhanga', code: '215', villages: 310, population: '3,937,385', complaints: 21, infraGap: '66%', status: 'Critical Demand' }
    ]
  },
  'madhya-pradesh': {
    name: 'Madhya Pradesh',
    status: 'Central Region',
    topSector: 'Rural Roads',
    severity: 'Medium',
    resolvedRate: '81%',
    districts: [
      { name: 'Bhopal', code: '444', villages: 180, population: '2,371,061', complaints: 14, infraGap: '42%', status: 'Stable' },
      { name: 'Indore', code: '437', villages: 210, population: '3,276,697', complaints: 12, infraGap: '38%', status: 'Optimal' },
      { name: 'Jabalpur', code: '453', villages: 290, population: '2,463,289', complaints: 15, infraGap: '53%', status: 'Monitored' },
      { name: 'Gwalior', code: '421', villages: 230, population: '2,032,036', complaints: 13, infraGap: '49%', status: 'Monitored' },
      { name: 'Ujjain', code: '435', villages: 260, population: '1,986,864', complaints: 11, infraGap: '47%', status: 'Stable' }
    ]
  },
  'sikkim': {
    name: 'Sikkim',
    status: 'Organic & Eco Corridor',
    topSector: 'Mountain Roads & Sanitation',
    severity: 'Low',
    resolvedRate: '94%',
    districts: [
      { name: 'Gangtok (East Sikkim)', code: '241', villages: 118, population: '283,583', complaints: 4, infraGap: '22%', status: 'Optimal' },
      { name: 'Namchi (South Sikkim)', code: '242', villages: 146, population: '146,850', complaints: 5, infraGap: '28%', status: 'Stable' },
      { name: 'Gyalshing (West Sikkim)', code: '243', villages: 124, population: '136,435', complaints: 6, infraGap: '34%', status: 'Monitored' },
      { name: 'Mangan (North Sikkim)', code: '244', villages: 55, population: '43,709', complaints: 3, infraGap: '41%', status: 'Monitored' }
    ]
  },
  'arunachal-pradesh': {
    name: 'Arunachal Pradesh',
    status: 'Frontier Zone',
    topSector: 'Border Roads & Telecom',
    severity: 'Medium',
    resolvedRate: '79%',
    districts: [
      { name: 'Papum Pare (Itanagar)', code: '247', villages: 287, population: '176,573', complaints: 8, infraGap: '37%', status: 'Monitored' },
      { name: 'Changlang', code: '254', villages: 310, population: '148,226', complaints: 11, infraGap: '58%', status: 'High Demand' },
      { name: 'West Kameng', code: '246', villages: 195, population: '83,947', complaints: 6, infraGap: '44%', status: 'Stable' },
      { name: 'Tawang', code: '245', villages: 160, population: '49,977', complaints: 4, infraGap: '39%', status: 'Optimal' },
      { name: 'East Siang', code: '250', villages: 135, population: '99,019', complaints: 7, infraGap: '46%', status: 'Monitored' }
    ]
  },
  'assam': {
    name: 'Assam',
    status: 'Brahmaputra Basin',
    topSector: 'Flood Embankments & Drinking Water',
    severity: 'High',
    resolvedRate: '74%',
    districts: [
      { name: 'Kamrup Metropolitan (Guwahati)', code: '307', villages: 215, population: '1,253,938', complaints: 19, infraGap: '36%', status: 'Stable' },
      { name: 'Dibrugarh', code: '310', villages: 1340, population: '1,326,335', complaints: 15, infraGap: '48%', status: 'Monitored' },
      { name: 'Cachar (Silchar)', code: '316', villages: 990, population: '1,736,617', complaints: 18, infraGap: '56%', status: 'High Demand' },
      { name: 'Nagaon', code: '303', villages: 1390, population: '2,823,768', complaints: 22, infraGap: '61%', status: 'Active Hotspot' },
      { name: 'Jorhat', code: '311', villages: 770, population: '1,092,256', complaints: 12, infraGap: '42%', status: 'Stable' }
    ]
  },
  'meghalaya': {
    name: 'Meghalaya',
    status: 'Highland Region',
    topSector: 'Rural Health & Water Filtration',
    severity: 'Medium',
    resolvedRate: '82%',
    districts: [
      { name: 'East Khasi Hills (Shillong)', code: '298', villages: 920, population: '825,922', complaints: 9, infraGap: '31%', status: 'Optimal' },
      { name: 'West Garo Hills (Tura)', code: '295', villages: 1550, population: '643,291', complaints: 14, infraGap: '54%', status: 'High Demand' },
      { name: 'Ri-Bhoi', code: '297', villages: 560, population: '258,840', complaints: 8, infraGap: '43%', status: 'Monitored' },
      { name: 'West Jaintia Hills (Jowai)', code: '300', villages: 440, population: '270,352', complaints: 7, infraGap: '47%', status: 'Monitored' }
    ]
  },
  'nagaland': {
    name: 'Nagaland',
    status: 'Hill Governance',
    topSector: 'Road Connectivity & Clean Power',
    severity: 'Medium',
    resolvedRate: '80%',
    districts: [
      { name: 'Kohima', code: '261', villages: 105, population: '267,988', complaints: 8, infraGap: '35%', status: 'Stable' },
      { name: 'Dimapur', code: '265', villages: 215, population: '378,811', complaints: 14, infraGap: '42%', status: 'Monitored' },
      { name: 'Mokokchung', code: '262', villages: 110, population: '194,622', complaints: 6, infraGap: '38%', status: 'Stable' },
      { name: 'Tuensang', code: '268', villages: 140, population: '196,596', complaints: 10, infraGap: '59%', status: 'High Demand' }
    ]
  },
  'manipur': {
    name: 'Manipur',
    status: 'Monitored Valley & Hills',
    topSector: 'Public Distribution & Health',
    severity: 'High',
    resolvedRate: '72%',
    districts: [
      { name: 'Imphal West', code: '277', villages: 125, population: '517,992', complaints: 16, infraGap: '41%', status: 'Monitored' },
      { name: 'Imphal East', code: '278', villages: 195, population: '456,113', complaints: 15, infraGap: '45%', status: 'Monitored' },
      { name: 'Churachandpur', code: '273', villages: 590, population: '274,143', complaints: 19, infraGap: '63%', status: 'Active Hotspot' },
      { name: 'Thoubal', code: '279', villages: 115, population: '422,168', complaints: 12, infraGap: '48%', status: 'Stable' }
    ]
  },
  'tripura': {
    name: 'Tripura',
    status: 'Border Corridor',
    topSector: 'Clean Drinking Water & Rural Solar',
    severity: 'Low',
    resolvedRate: '89%',
    districts: [
      { name: 'West Tripura (Agartala)', code: '289', villages: 280, population: '918,200', complaints: 9, infraGap: '29%', status: 'Stable' },
      { name: 'Gomati (Udaipur)', code: '290', villages: 170, population: '441,538', complaints: 7, infraGap: '44%', status: 'Stable' },
      { name: 'North Tripura (Dharmanagar)', code: '287', villages: 230, population: '417,441', complaints: 8, infraGap: '46%', status: 'Monitored' },
      { name: 'Dhalai (Ambassa)', code: '288', villages: 260, population: '378,230', complaints: 11, infraGap: '55%', status: 'High Demand' }
    ]
  },
  'mizoram': {
    name: 'Mizoram',
    status: 'High Literacy Belt',
    topSector: 'Hill Transport & Telemedicine',
    severity: 'Low',
    resolvedRate: '92%',
    districts: [
      { name: 'Aizawl', code: '283', villages: 110, population: '400,309', complaints: 6, infraGap: '27%', status: 'Optimal' },
      { name: 'Lunglei', code: '285', villages: 165, population: '161,428', complaints: 7, infraGap: '45%', status: 'Monitored' },
      { name: 'Champhai', code: '284', villages: 90, population: '125,745', complaints: 5, infraGap: '40%', status: 'Stable' },
      { name: 'Kolasib', code: '282', villages: 55, population: '83,954', complaints: 4, infraGap: '34%', status: 'Stable' }
    ]
  },
  'jammu-kashmir': {
    name: 'Jammu & Kashmir',
    status: 'Northern UT',
    topSector: 'Winter Power & Highway Transit',
    severity: 'Medium',
    resolvedRate: '83%',
    districts: [
      { name: 'Srinagar', code: '010', villages: 85, population: '1,236,829', complaints: 18, infraGap: '32%', status: 'Stable' },
      { name: 'Jammu', code: '020', villages: 840, population: '1,529,958', complaints: 16, infraGap: '35%', status: 'Stable' },
      { name: 'Anantnag', code: '014', villages: 390, population: '1,078,692', complaints: 15, infraGap: '51%', status: 'Monitored' },
      { name: 'Baramulla', code: '008', villages: 520, population: '1,008,039', complaints: 14, infraGap: '48%', status: 'Monitored' },
      { name: 'Udhampur', code: '017', villages: 330, population: '554,985', complaints: 10, infraGap: '54%', status: 'High Demand' }
    ]
  },
  'himachal-pradesh': {
    name: 'Himachal Pradesh',
    status: 'Himalayan Corridor',
    topSector: 'Mountain Roads & Rural Tap Water',
    severity: 'Low',
    resolvedRate: '93%',
    districts: [
      { name: 'Shimla', code: '031', villages: 2320, population: '814,010', complaints: 8, infraGap: '26%', status: 'Optimal' },
      { name: 'Kangra (Dharamshala)', code: '024', villages: 3860, population: '1,510,075', complaints: 12, infraGap: '31%', status: 'Stable' },
      { name: 'Mandi', code: '026', villages: 2840, population: '999,777', complaints: 9, infraGap: '37%', status: 'Stable' },
      { name: 'Kullu', code: '025', villages: 320, population: '437,903', complaints: 7, infraGap: '42%', status: 'Monitored' },
      { name: 'Solan', code: '030', villages: 2380, population: '580,320', complaints: 8, infraGap: '29%', status: 'Optimal' }
    ]
  },
  'uttarakhand': {
    name: 'Uttarakhand',
    status: 'Devbhumi Eco-Region',
    topSector: 'Disaster Resilience & Tap Water',
    severity: 'Medium',
    resolvedRate: '87%',
    districts: [
      { name: 'Dehradun', code: '060', villages: 740, population: '1,696,694', complaints: 14, infraGap: '29%', status: 'Optimal' },
      { name: 'Haridwar', code: '068', villages: 510, population: '1,890,422', complaints: 16, infraGap: '38%', status: 'Stable' },
      { name: 'Nainital', code: '065', villages: 1090, population: '955,128', complaints: 11, infraGap: '44%', status: 'Monitored' },
      { name: 'Udham Singh Nagar', code: '066', villages: 670, population: '1,648,367', complaints: 15, infraGap: '47%', status: 'Monitored' },
      { name: 'Chamoli', code: '057', villages: 1170, population: '391,605', complaints: 8, infraGap: '56%', status: 'High Demand' }
    ]
  }
};

export default function InteractiveIndiaMap({ complaints = [], demographics = [], infrastructure = [] }) {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  
  // Selection state
  const [selectedStateId, setSelectedStateId] = useState('west-bengal');
  const [selectedStateName, setSelectedStateName] = useState('West Bengal');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [tooltip, setTooltip] = useState({ text: '', visible: false, x: 0, y: 0 });
  const [availableStates, setAvailableStates] = useState([]);
  
  // Transform & Zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Calculate live database metrics from props
  const databaseStats = useMemo(() => {
    const totalVillages = demographics.length || 650;
    const totalPopulation = demographics.reduce((sum, v) => sum + (v.tot_p || 0), 0) || 1775885;
    const totalComplaints = complaints.length || 24;

    const countWater = infrastructure.filter(i => i.tap_water_treated === true).length;
    const countRoads = infrastructure.filter(i => i.pucca_road === true).length;
    const countHosp = infrastructure.filter(i => i.has_hospital === true).length;
    const countPower = infrastructure.filter(i => i.power_supply === true).length;
    
    return {
      totalVillages,
      totalPopulation: totalPopulation.toLocaleString(),
      totalComplaints,
      countWater,
      countRoads,
      countHosp,
      countPower
    };
  }, [complaints, demographics, infrastructure]);

  // Load SVG extracted from interactive-india-maps
  useEffect(() => {
    fetch('/india-map.svg')
      .then(res => res.text())
      .then(svgText => {
        setSvgContent(svgText);
      })
      .catch(err => console.error('Failed to load India map SVG:', err));
  }, []);

  // Parse states from SVG and attach listeners
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    const wrapper = containerRef.current;
    const pathElements = wrapper.querySelectorAll('svg path.state');
    
    const parsed = [];
    const seen = new Set();

    pathElements.forEach(path => {
      const id = path.getAttribute('data-id');
      const name = path.getAttribute('data-state');
      if (id && name && !seen.has(id)) {
        seen.add(id);
        parsed.push({ id, name: name.replace('&amp;', '&') });
      }

      // Mark monitored active states
      if (REGIONAL_STATE_DATA[id]) {
        path.classList.add('state-active');
      }

      // Floating hover tooltip
      path.onmouseenter = (e) => {
        const stateTitle = path.getAttribute('data-state')?.replace('&amp;', '&') || id;
        setTooltip({
          text: stateTitle,
          visible: true,
          x: e.clientX,
          y: e.clientY
        });
      };

      path.onmousemove = (e) => {
        setTooltip(prev => ({
          ...prev,
          x: e.clientX,
          y: e.clientY
        }));
      };

      path.onmouseleave = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
      };

      // State Click -> Bring directly into dead center and zoom in
      path.onclick = (e) => {
        e.stopPropagation();
        const stateTitle = path.getAttribute('data-state')?.replace('&amp;', '&') || id;
        handleStateClick(id, stateTitle);
      };
    });

    setAvailableStates(parsed.sort((a, b) => a.name.localeCompare(b.name)));
  }, [svgContent]);

  // Highlight selected state in SVG
  useEffect(() => {
    if (!containerRef.current) return;
    const wrapper = containerRef.current;
    wrapper.querySelectorAll('svg path.state').forEach(path => {
      if (path.getAttribute('data-id') === selectedStateId) {
        path.classList.add('state-selected');
      } else {
        path.classList.remove('state-selected');
      }
    });
  }, [selectedStateId, svgContent]);

  /**
   * Precise Centering Math:
   * containerRef has width 560px and height ~620px (display coordinates).
   * Center of display box is (280, 310).
   * When transformed by scale(S) around transformOrigin: 0 0:
   * displayX = S * (pctX/100 * 560) + offsetX = 280
   * => offsetX = 280 - (S * pctX * 5.6)
   * => offsetY = 310 - (S * pctY * 6.2)
   */
  const handleStateClick = (stateId, stateName) => {
    setSelectedStateId(stateId);
    setSelectedStateName(stateName);
    setSelectedDistrict(null);

    let center = TRUE_STATE_CENTERS[stateId];

    // Dynamic fallback to the SVG DOM element bounding box if not in static table
    if (!center && containerRef.current) {
      const pathEl = containerRef.current.querySelector(`svg path.state[data-id="${stateId}"]`);
      if (pathEl && typeof pathEl.getBBox === 'function') {
        try {
          const bbox = pathEl.getBBox();
          const pctX = ((bbox.x + bbox.width / 2) / 3367) * 100;
          const pctY = ((bbox.y + bbox.height / 2) / 3741) * 100;
          let zoom = 2.4;
          if (bbox.width < 150 && bbox.height < 150) zoom = 3.6;
          else if (bbox.width < 400 && bbox.height < 400) zoom = 3.0;
          center = { pctX, pctY, defaultZoom: zoom };
        } catch (err) {
          console.warn('SVG bbox error:', err);
        }
      }
    }

    if (center) {
      const zoom = center.defaultZoom || 2.2;
      const targetOffsetX = 280 - (zoom * center.pctX * 5.6);
      const targetOffsetY = 310 - (zoom * center.pctY * 6.2);
      setZoomLevel(zoom);
      setPanOffset({ x: targetOffsetX, y: targetOffsetY });
    } else {
      setZoomLevel(1.8);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  const handleDropdownChange = (e) => {
    const id = e.target.value;
    const found = availableStates.find(s => s.id === id);
    if (found) {
      handleStateClick(id, found.name);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.35, 4.0));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.35, 0.75));
  };

  // Shrink back to initial full India position
  const handleResetToInitial = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedDistrict(null);
  };

  // Outside click in the map viewport area resets to full India map
  const handleViewportBackgroundClick = (e) => {
    if (!e.target.closest('path.state') && !e.target.closest('button') && !e.target.closest('select')) {
      handleResetToInitial();
    }
  };

  // Drag and pan support
  const handleMouseDown = (e) => {
    if (e.target.closest('path.state') || e.target.closest('button') || e.target.closest('select')) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Retrieve current state info and merge with live scanned data if West Bengal
  const currentStateData = useMemo(() => {
    const base = REGIONAL_STATE_DATA[selectedStateId] || {
      name: selectedStateName,
      status: 'Monitored Region',
      topSector: 'Infrastructure Maintenance',
      severity: 'Normal',
      resolvedRate: '84%',
      districts: [
        { name: `${selectedStateName} North`, code: '001', villages: 140, population: '1,200,000', complaints: 6, infraGap: '41%', status: 'Stable' },
        { name: `${selectedStateName} South`, code: '002', villages: 110, population: '950,000', complaints: 4, infraGap: '52%', status: 'Monitored' }
      ]
    };

    const totalVillages = base.districts.reduce((sum, d) => sum + d.villages, 0);
    const totalComplaints = base.districts.reduce((sum, d) => sum + d.complaints, 0);

    // Compute problem categories & frequency based on sector profile and complaints
    const problemCategories = (() => {
      if (selectedStateId === 'west-bengal' && complaints.length > 0) {
        // Group directly from live complaints
        const counts = {};
        complaints.forEach(c => {
          const cat = c.category || 'General Civic';
          counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.entries(counts).map(([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / complaints.length) * 100),
          severity: count > 6 ? 'High' : 'Medium'
        })).sort((a, b) => b.count - a.count);
      }

      // Regional dynamic problem breakdown distribution
      const total = totalComplaints || 18;
      const topSec = base.topSector || 'Roads & Sanitation';
      const p1 = Math.max(Math.round(total * 0.44), 3);
      const p2 = Math.max(Math.round(total * 0.28), 2);
      const p3 = Math.max(Math.round(total * 0.18), 1);
      const p4 = Math.max(total - (p1 + p2 + p3), 1);

      return [
        { type: topSec, count: p1, percentage: Math.round((p1 / total) * 100), severity: 'Critical' },
        { type: 'Road & Transit Access', count: p2, percentage: Math.round((p2 / total) * 100), severity: 'High' },
        { type: 'Power Supply & Grid', count: p3, percentage: Math.round((p3 / total) * 100), severity: 'Moderate' },
        { type: 'Primary Healthcare', count: p4, percentage: Math.round((p4 / total) * 100), severity: 'Normal' }
      ];
    })();

    // If West Bengal is selected, inject live database figures scanned from Howrah & complaints
    if (selectedStateId === 'west-bengal') {
      return {
        ...base,
        villagesCount: databaseStats.totalVillages,
        activeComplaints: databaseStats.totalComplaints,
        problemCategories,
        districts: base.districts.map(d => {
          if (d.name === 'Howrah') {
            return {
              ...d,
              villages: databaseStats.totalVillages,
              population: databaseStats.totalPopulation,
              complaints: databaseStats.totalComplaints,
              infraGap: '64%'
            };
          }
          return d;
        })
      };
    }

    return {
      ...base,
      villagesCount: totalVillages,
      activeComplaints: totalComplaints,
      problemCategories
    };
  }, [selectedStateId, selectedStateName, databaseStats, complaints]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden transition-all">
      {/* Header bar from interactive-india-maps */}
      <div className="p-6 sm:p-7 border-b border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/80 to-white dark:from-slate-800/90 dark:to-slate-800/50">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interactive Map of India
            </h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Click any state to zoom in and bring it to the center. Click the background to shrink back to full India view.
          </p>
        </div>

        {/* State Dropdown Selector and Zoom Taskbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select 
            id="state-select"
            value={selectedStateId}
            onChange={handleDropdownChange}
            className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-800 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">Select State / UT</option>
            {availableStates.map(state => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>

          {/* Reset View Button */}
          <button
            onClick={handleResetToInitial}
            title="Reset to Full India Map"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-colors border border-slate-200/60 dark:border-slate-600/60 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Main Grid: SVG Map Viewport & State District Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[660px] bg-slate-50/40 dark:bg-slate-900/40">
        
        {/* SVG India Map Viewport (Click outside state shrinks & resets back) */}
        <div 
          ref={viewportRef}
          onClick={handleViewportBackgroundClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="lg:col-span-7 p-6 flex flex-col items-center justify-center relative overflow-hidden select-none"
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
          title="Click empty area outside state to reset full India view"
        >
          {/* Status & Instructions Bar */}
          <div className="w-full flex justify-between items-center mb-3 px-2 z-10 pointer-events-none">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>🖱️ Click state to center & zoom &bull; Click background to shrink</span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono font-bold text-slate-700 dark:text-slate-200">
                {Math.round(zoomLevel * 100)}%
              </span>
            </span>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-700 shadow-xs"></span> States
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span> Selected
              </span>
            </div>
          </div>

          {/* Dedicated Floating (+) / (-) Zoom Controls for Map Portion */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="absolute top-16 right-6 z-20 flex flex-col gap-1.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700"
          >
            <button
              onClick={handleZoomIn}
              title="Zoom In Map (+)"
              className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-blue-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 hover:text-blue-600 dark:text-slate-200 rounded-xl transition-all font-bold text-base shadow-sm"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out Map (-)"
              className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-blue-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 hover:text-blue-600 dark:text-slate-200 rounded-xl transition-all font-bold text-base shadow-sm"
            >
              −
            </button>
            <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-700 my-0.5" />
            <button
              onClick={handleResetToInitial}
              title="Shrink & Reset (100%)"
              className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 rounded-xl transition-all text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SVG Map Container: 560px width with 0 0 origin for exact centroid math */}
          <div 
            style={{ width: '560px', height: '620px', position: 'relative' }}
            className="flex items-center justify-center"
          >
            <div 
              ref={containerRef}
              style={{
                width: '560px',
                height: '620px',
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transformOrigin: '0 0',
                transition: isPanning ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="india-svg-wrapper select-none"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>

          {/* Bottom Floating Hint when zoomed in */}
          {zoomLevel > 1.2 && (
            <button
              onClick={handleResetToInitial}
              className="absolute bottom-4 z-10 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md shadow-lg transition-all flex items-center gap-1.5"
            >
              <span>← Click background to shrink back to full India view</span>
            </button>
          )}
        </div>

        {/* Right Info Panel: Scanned Data & State Districts */}
        <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 p-6 flex flex-col justify-between">
          <div>
            {/* Active State Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    State Jurisdiction
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    currentStateData.severity === 'Critical' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' 
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  }`}>
                    {currentStateData.status}
                  </span>
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                  {currentStateData.name}
                </h4>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Grievances</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {currentStateData.activeComplaints} Active
                </span>
              </div>
            </div>

            {/* Scanned Project Data Indicators */}
            <div className="grid grid-cols-3 gap-2.5 my-4">
              <div className="bg-slate-50 dark:bg-slate-700/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Scanned Villages</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{currentStateData.villagesCount}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Resolution</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{currentStateData.resolvedRate}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Districts</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{currentStateData.districts?.length || 0}</span>
              </div>
            </div>

            {/* Problem Types & Occurrence Frequency Breakdown */}
            <div className="my-3 p-3.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-2.5">
                <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Problem Types & Frequency
                </h5>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {currentStateData.activeComplaints} Total Occurrences
                </span>
              </div>

              <div className="space-y-2">
                {currentStateData.problemCategories?.map((item, idx) => {
                  const colors = [
                    { bar: 'bg-red-500', badge: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' },
                    { bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
                    { bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
                    { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' }
                  ];
                  const c = colors[idx % colors.length];

                  return (
                    <div key={item.type} className="group">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate max-w-[220px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          {item.type}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${c.badge}`}>
                            {item.count} {item.count === 1 ? 'time' : 'times'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${c.bar} transition-all duration-500`}
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Districts Breakdown List for Selected State */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  Districts in {currentStateData.name} ({currentStateData.districts?.length || 0})
                </h5>
                <span className="text-[10px] text-slate-400">Click district to inspect</span>
              </div>

              <div className="max-h-[260px] overflow-y-auto no-scrollbar space-y-2 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-2 bg-slate-50/50 dark:bg-slate-900/40">
                {currentStateData.districts?.map(dist => {
                  const isSelected = selectedDistrict?.name === dist.name;
                  return (
                    <div
                      key={dist.code || dist.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDistrict(dist);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-400 shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200/70 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                          <h6 className="text-sm font-bold text-slate-900 dark:text-white">{dist.name}</h6>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          dist.status.includes('Active') || dist.status.includes('Critical')
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        }`}>
                          {dist.complaints} Demands
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-500 dark:text-slate-400">
                        <div>
                          <span>Pop: </span>
                          <strong className="text-slate-700 dark:text-slate-300">{dist.population}</strong>
                        </div>
                        <div>
                          <span>Villages: </span>
                          <strong className="text-slate-700 dark:text-slate-300">{dist.villages}</strong>
                        </div>
                        <div>
                          <span>Gap: </span>
                          <strong className="text-red-600 dark:text-red-400">{dist.infraGap}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected District Details Banner if clicked */}
            {selectedDistrict && (
              <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-xl border border-blue-200/80 dark:border-blue-800/60 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                      Inspecting: {selectedDistrict.name} District
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-200/70 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded">
                    Code #{selectedDistrict.code}
                  </span>
                </div>
                <p className="text-xs text-blue-700/90 dark:text-blue-300 mt-1">
                  Active monitoring engaged. {selectedDistrict.complaints} complaints prioritized across {selectedDistrict.villages} rural villages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Tooltip following mouse cursor */}
      {tooltip.visible && (
        <div 
          style={{
            position: 'fixed',
            left: `${tooltip.x + 14}px`,
            top: `${tooltip.y + 14}px`,
            pointerEvents: 'none',
            zIndex: 99999
          }}
          className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl border border-slate-700 tracking-wide pointer-events-none"
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
