export const NETWORK_PROVIDERS = [
  { id: 'mtn', name: 'MTN', color: '#FFCC00' },
  { id: 'airtel', name: 'Airtel', color: '#ED1C24' },
  { id: 'glo', name: 'Glo', color: '#00AA00' },
  { id: '9mobile', name: '9mobile', color: '#00A0E3' },
];

export const DATA_PLANS = [
  { id: '1', size: '500MB', duration: '30 days', price: 200 },
  { id: '2', size: '1GB', duration: '30 days', price: 350 },
  { id: '3', size: '2GB', duration: '30 days', price: 550 },
  { id: '4', size: '3GB', duration: '30 days', price: 750 },
  { id: '5', size: '5GB', duration: '30 days', price: 1000 },
  { id: '6', size: '10GB', duration: '30 days', price: 2000 },
];

export const ELECTRICITY_DISCOS = [
  { id: 'ikedc', name: 'Ikeja Electric (IKEDC)' },
  { id: 'ekedc', name: 'Eko Electric (EKEDC)' },
  { id: 'aedc', name: 'Abuja Electric (AEDC)' },
  { id: 'phedc', name: 'Port Harcourt Electric (PHEDC)' },
  { id: 'kedco', name: 'Kano Electric (KEDCO)' },
  { id: 'jedc', name: 'Jos Electric (JEDC)' },
];

export const CABLE_PROVIDERS = [
  { id: 'dstv', name: 'DStv' },
  { id: 'gotv', name: 'GOtv' },
  { id: 'startimes', name: 'StarTimes' },
];

export const CABLE_PACKAGES = {
  dstv: [
    { id: '1', name: 'DStv Compact', price: 12500 },
    { id: '2', name: 'DStv Compact Plus', price: 19100 },
    { id: '3', name: 'DStv Premium', price: 28500 },
  ],
  gotv: [
    { id: '1', name: 'GOtv Jolli', price: 3300 },
    { id: '2', name: 'GOtv Max', price: 5500 },
    { id: '3', name: 'GOtv Supa', price: 7500 },
  ],
  startimes: [
    { id: '1', name: 'Nova', price: 1500 },
    { id: '2', name: 'Basic', price: 2500 },
    { id: '3', name: 'Smart', price: 3800 },
  ],
};

export const EXAM_BODIES = [
  { id: 'waec', name: 'WAEC Scratch Card', price: 2500 },
  { id: 'neco', name: 'NECO Scratch Card', price: 1200 },
  { id: 'jamb', name: 'JAMB e-PIN', price: 5500 },
  { id: 'nabteb', name: 'NABTEB Scratch Card', price: 1500 },
];

export const SERVICE_TYPES = {
  airtime: {
    id: 'airtime',
    name: 'Airtime',
    icon: 'Smartphone',
    color: '#00A0E3',
  },
  data: {
    id: 'data',
    name: 'Data',
    icon: 'Wifi',
    color: '#00AA00',
  },
  electricity: {
    id: 'electricity',
    name: 'Electricity',
    icon: 'Zap',
    color: '#FFCC00',
  },
  cable: {
    id: 'cable',
    name: 'Cable TV',
    icon: 'Tv',
    color: '#ED1C24',
  },
  airtimeToCash: {
    id: 'airtimeToCash',
    name: 'Airtime to Cash',
    icon: 'Banknote',
    color: '#2E6F40',
  },
  education: {
    id: 'education',
    name: 'Education PINs',
    icon: 'GraduationCap',
    color: '#2ead4b',
  },
};
