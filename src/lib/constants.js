import { Map, Warehouse, Cog, FileSignature, Gem, Scroll } from 'lucide-react';

export const ASSET_CATEGORIES = {
  LAND: {
    id: 'LAND',
    label: 'Land & Real Estate',
    color: '#10b981', // Emerald
    bg: 'rgba(16, 185, 129, 0.1)',
    icon: Map,
    fields: [
      { id: 'location', label: 'Geolocation / Address', placeholder: 'e.g. 40.7128° N, 74.0060° W' },
      { id: 'area', label: 'Total Area (Sq Ft/Acres)', placeholder: 'e.g. 5,000 Sq Ft' },
      { id: 'zoning', label: 'Zoning Classification', placeholder: 'e.g. Residential R-3' }
    ]
  },
  WAREHOUSING: {
    id: 'WAREHOUSING',
    label: 'Warehousing & Logistics',
    color: '#3b82f6', // Blue
    bg: 'rgba(59, 130, 246, 0.1)',
    icon: Warehouse,
    fields: [
      { id: 'capacity', label: 'Storage Capacity', placeholder: 'e.g. 100,000 Cubic Ft' },
      { id: 'loadingDocks', label: 'Number of Loading Docks', placeholder: 'e.g. 12' },
      { id: 'security', label: 'Security Certification', placeholder: 'e.g. TAPA Level A' }
    ]
  },
  MACHINERY: {
    id: 'MACHINERY',
    label: 'Industrial Machinery',
    color: '#f59e0b', // Amber
    bg: 'rgba(245, 158, 11, 0.1)',
    icon: Cog,
    fields: [
      { id: 'manufacturer', label: 'Make & Manufacturer', placeholder: 'e.g. Caterpillar' },
      { id: 'serial', label: 'Serial Number', placeholder: 'e.g. CAT-992-XXXX' },
      { id: 'maintenance', label: 'Hours to Next Maintenance', placeholder: 'e.g. 450 Hours' }
    ]
  },
  IP: {
    id: 'IP',
    label: 'Intellectual Property',
    color: '#8b5cf6', // Violet
    bg: 'rgba(139, 92, 246, 0.1)',
    icon: FileSignature,
    fields: [
      { id: 'registryId', label: 'Registry / Patent ID', placeholder: 'e.g. US-PAT-2023-XXXX' },
      { id: 'expiry', label: 'IP Expiry Date', placeholder: 'e.g. 2045-12-31' },
      { id: 'jurisdiction', label: 'Filing Jurisdiction', placeholder: 'e.g. USPTO' }
    ]
  },
  ARTIFACTS: {
    id: 'ARTIFACTS',
    label: 'Rare Artifacts & Art',
    color: '#f43f5e', // Rose
    bg: 'rgba(244, 63, 94, 0.1)',
    icon: Gem,
    fields: [
      { id: 'origin', label: 'Era & Origin', placeholder: 'e.g. Ming Dynasty, China' },
      { id: 'authority', label: 'Validation Authority', placeholder: 'e.g. Sotheby\'s Verified' },
      { id: 'condition', label: 'Conservation Status', placeholder: 'e.g. Museum Grade' }
    ]
  },
  CONTRACTS: {
    id: 'CONTRACTS',
    label: 'Strategic Contracts',
    color: '#eab308', // Gold
    bg: 'rgba(234, 179, 8, 0.1)',
    icon: Scroll,
    fields: [
      { id: 'counterparty', label: 'Counterparty Entity', placeholder: 'e.g. Global Tech Corp' },
      { id: 'maturity', label: 'Contract Maturity', placeholder: 'e.g. 5 Years' },
      { id: 'penalty', label: 'Non-Performance Penalty', placeholder: 'e.g. 5% P.A. of Value' }
    ]
  }
};
