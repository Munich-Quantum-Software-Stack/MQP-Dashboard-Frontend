/**
 * institutionData.js
 *
 * Complete INSTITUTION_MANIFEST covering all HPCQCaaS and QaaS providers.
 * This acts as the Phase-1 frontend mock; Phase-2 replaces it via API
 * (see telemetryInstitutionService.js).
 *
 * IMPORTANT: This file is included in the browser bundle.
 * It must NOT contain credentials, internal IPs, or sensitive operational data.
 */

// ---------------------------------------------------------------------------
// Resource room-ID cross-references (existing telemetryService MOCK_ROOMS IDs)
// ---------------------------------------------------------------------------
// 'warm-lab'     → QExa20 (LRZ)
// 'cold-lab'     → Q5 (LRZ)
// 'compute-cube' → Q20 / WMI3 (LRZ)
// 'cloud'        → Cloud resources (LRZ)

/** @type {import('./types').INSTITUTION_MANIFEST_TYPE} */
export const INSTITUTION_MANIFEST = [
  // ------------------------------------------------------------------------
  // HPCQCaaS Providers
  // ------------------------------------------------------------------------
  {
    id: 'lrz',
    name: 'LRZ',
    category: 'HPCQCaaS',
    shortDescription:
      "Leibniz Supercomputing Centre (LRZ) operates Germany's flagship HPC-integrated quantum computing facility, providing seamless HPCQC workflows and live telemetry.",
    country: 'DE',
    logoFile: null,
    websiteUrl: 'https://www.lrz.de',
    brandColor: '#005B99',
    hasLRZRooms: true,
    resources: [
      {
        id: 'qexa20',
        name: 'QExa20',
        vendor: 'IQM',
        technology: 'Superconducting',
        qubits: 20,
        status: 'Online',
        isBeta: false,
        isPlaceholder: false,
        note: 'Production 20-qubit superconducting processor.',
        grafanaPanelRef: null,
        roomId: 'warm-lab',
      },
      {
        id: 'q5',
        name: 'Q5',
        vendor: 'IQM',
        technology: 'Superconducting',
        qubits: 5,
        status: 'Online',
        isBeta: false,
        isPlaceholder: false,
        note: '5-qubit development and research processor.',
        grafanaPanelRef: null,
        roomId: 'cold-lab',
      },
      {
        id: 'q20',
        name: 'Q20',
        vendor: 'IQM',
        technology: 'Superconducting',
        qubits: 20,
        status: 'Online',
        isBeta: false,
        isPlaceholder: false,
        note: 'High-fidelity 20-qubit processor.',
        grafanaPanelRef: null,
        roomId: 'compute-cube',
      },
      {
        id: 'wmi3',
        name: 'WMI3',
        vendor: 'WMI',
        technology: 'Superconducting',
        qubits: 3,
        status: 'Online',
        isBeta: false,
        isPlaceholder: false,
        note: '3-qubit research processor from Walther-Meissner-Institut.',
        grafanaPanelRef: null,
        roomId: 'compute-cube',
      },
      {
        id: 'muniqc-atoms20',
        name: 'MuniQC-Atoms20',
        vendor: 'MuniQC-Atoms',
        technology: 'Neutral Atoms',
        qubits: 20,
        status: 'Online',
        isBeta: false,
        isPlaceholder: false,
        note: 'Neutral-atom quantum processor developed by the MuniQC-Atoms consortium.',
        grafanaPanelRef: null,
        roomId: 'cloud',
      },
      {
        id: 'maqcs',
        name: 'MAQCS',
        vendor: 'PlanQC',
        technology: 'Neutral Atoms',
        qubits: null,
        status: 'Online',
        isBeta: false,
        isPlaceholder: false,
        note: 'Munich Atomic Quantum Computing System by PlanQC.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'aqt20',
        name: 'AQT20',
        vendor: 'AQT',
        technology: 'Trapped Ions',
        qubits: 20,
        status: 'Online',
        isBeta: false,
        isPlaceholder: false,
        note: '20-qubit trapped-ion processor from Alpine Quantum Technologies.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'qlm',
        name: 'QLM',
        vendor: 'Eviden',
        technology: 'Simulator',
        qubits: null,
        status: 'Online',
        isBeta: false,
        isPlaceholder: false,
        note: 'Quantum Learning Machine high-performance simulator by Eviden.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'eqe1',
        name: 'EQE1',
        vendor: 'IQM',
        technology: 'Superconducting',
        qubits: null,
        status: 'Online',
        isBeta: true,
        isPlaceholder: false,
        note: 'Early-access quantum evaluation system.',
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },

  {
    id: 'cineca',
    name: 'CINECA',
    category: 'HPCQCaaS',
    shortDescription:
      "CINECA is Italy's leading supercomputing centre, integrating quantum processors with the CINECA HPC ecosystem for hybrid HPC-QC workloads.",
    country: 'IT',
    logoFile: null,
    websiteUrl: 'https://www.cineca.it',
    brandColor: '#003087',
    hasLRZRooms: false,
    resources: [
      {
        id: 'cineca-iqm',
        name: 'IQM System',
        vendor: 'IQM',
        technology: 'Superconducting',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'IQM superconducting processor integrated with CINECA HPC.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'cineca-pasqal',
        name: 'PASQAL System',
        vendor: 'PASQAL',
        technology: 'Neutral Atoms',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'PASQAL neutral-atom processor at CINECA.',
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },

  {
    id: 'cesga',
    name: 'CESGA',
    category: 'HPCQCaaS',
    shortDescription:
      'Galician Supercomputing Centre (CESGA) offers quantum computing resources integrated with HPC systems in Spain.',
    country: 'ES',
    logoFile: null,
    websiteUrl: 'https://www.cesga.es',
    brandColor: '#D4002A',
    hasLRZRooms: false,
    resources: [
      {
        id: 'cesga-iqm',
        name: 'IQM System',
        vendor: 'IQM',
        technology: 'Superconducting',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'IQM superconducting processor at CESGA.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'cesga-qaptiva',
        name: 'QAPTIVA',
        vendor: 'Eviden',
        technology: 'Simulator',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'Eviden QAPTIVA quantum simulation platform at CESGA.',
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },

  {
    id: 'psnc',
    name: 'PSNC',
    category: 'HPCQCaaS',
    shortDescription:
      'Poznań Supercomputing and Networking Centre (PSNC) provides HPC-integrated quantum computing with a diverse multi-technology quantum stack.',
    country: 'PL',
    logoFile: null,
    websiteUrl: 'https://www.psnc.pl',
    brandColor: '#0072CE',
    hasLRZRooms: false,
    resources: [
      {
        id: 'psnc-iqm',
        name: 'IQM System',
        vendor: 'IQM',
        technology: 'Superconducting',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'IQM superconducting processor at PSNC.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'psnc-aqt',
        name: 'AQT System',
        vendor: 'AQT',
        technology: 'Trapped Ions',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'AQT trapped-ion processor at PSNC.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'psnc-orca',
        name: 'ORCA System',
        vendor: 'ORCA',
        technology: 'Photonic',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'ORCA photonic quantum processor at PSNC.',
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },

  {
    id: 'aws',
    name: 'AWS',
    category: 'HPCQCaaS',
    shortDescription:
      'Amazon Web Services Braket provides cloud access to multiple quantum hardware providers through a unified HPC-capable cloud platform.',
    country: 'US',
    logoFile: null,
    websiteUrl: 'https://aws.amazon.com/braket/',
    brandColor: '#FF9900',
    hasLRZRooms: false,
    resources: [
      {
        id: 'aws-iqm',
        name: 'IQM',
        vendor: 'IQM',
        technology: 'Superconducting',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'IQM superconducting processor via AWS Braket.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'aws-ionq',
        name: 'IonQ',
        vendor: 'IonQ',
        technology: 'Trapped Ions',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'IonQ trapped-ion processor via AWS Braket.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'aws-aqt',
        name: 'AQT',
        vendor: 'AQT',
        technology: 'Trapped Ions',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'AQT trapped-ion processor via AWS Braket.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'aws-quera',
        name: 'QuEra',
        vendor: 'QuEra',
        technology: 'Neutral Atoms',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'QuEra neutral-atom processor via AWS Braket.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'aws-rigetti',
        name: 'Rigetti',
        vendor: 'Rigetti',
        technology: 'Superconducting',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'Rigetti superconducting processor via AWS Braket.',
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },

  {
    id: 'dlr',
    name: 'DLR',
    category: 'HPCQCaaS',
    shortDescription:
      'German Aerospace Center (DLR) operates quantum computing resources targeting aerospace, materials simulation, and optimisation applications.',
    country: 'DE',
    logoFile: null,
    websiteUrl: 'https://www.dlr.de',
    brandColor: '#003087',
    hasLRZRooms: false,
    resources: [
      {
        id: 'dlr-planqc',
        name: 'PlanQC',
        vendor: 'PlanQC',
        technology: 'Neutral Atoms',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'PlanQC neutral-atom processor at DLR.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'dlr-eleqtron',
        name: 'Eleqtron',
        vendor: 'Eleqtron',
        technology: 'Trapped Ions',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'Eleqtron trapped-ion processor at DLR.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'dlr-xeedq',
        name: 'XeedQ',
        vendor: 'XeedQ',
        technology: 'Superconducting',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'XeedQ superconducting processor at DLR.',
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },

  {
    id: 'ibm',
    name: 'IBM',
    category: 'HPCQCaaS',
    shortDescription:
      'IBM Quantum provides cloud-accessible superconducting quantum processors, including the latest Eagle and Heron generation systems.',
    country: 'US',
    logoFile: null,
    websiteUrl: 'https://quantum.ibm.com',
    brandColor: '#0F62FE',
    hasLRZRooms: false,
    resources: [
      {
        id: 'ibm-system-1',
        name: 'System 1',
        vendor: 'IBM',
        technology: 'Superconducting',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'IBM Quantum System 1.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'ibm-system-2',
        name: 'System 2',
        vendor: 'IBM',
        technology: 'Superconducting',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: false,
        note: 'IBM Quantum System 2.',
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },

  // ------------------------------------------------------------------------
  // QaaS Providers
  // ------------------------------------------------------------------------
  {
    id: 'iqm-vendor',
    name: 'IQM',
    category: 'QaaS',
    shortDescription:
      'IQM Quantum Computers is a European superconducting quantum hardware manufacturer and cloud provider offering production-grade quantum processors.',
    country: 'FI',
    logoFile: 'IQM_logo.png',
    websiteUrl: 'https://www.meetiqm.com',
    brandColor: '#E63946',
    hasLRZRooms: false,
    resources: [
      {
        id: 'iqm-halocene',
        name: 'HALOCENE',
        vendor: 'IQM',
        technology: 'Superconducting',
        qubits: null,
        status: 'Online',
        isBeta: false,
        isPlaceholder: false,
        note: 'IQM HALOCENE superconducting quantum processor.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'iqm-radiance',
        name: 'RADIANCE',
        vendor: 'IQM',
        technology: 'Superconducting',
        qubits: null,
        status: 'Online',
        isBeta: false,
        isPlaceholder: false,
        note: 'IQM RADIANCE superconducting quantum processor.',
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'iqm-spark',
        name: 'SPARK',
        vendor: 'IQM',
        technology: 'Superconducting',
        qubits: null,
        status: 'Online',
        isBeta: false,
        isPlaceholder: false,
        note: 'IQM SPARK compact superconducting quantum processor.',
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },

  {
    id: 'wmi',
    name: 'WMI',
    category: 'QaaS',
    shortDescription:
      'Walther-Meissner-Institut (WMI) is a leading German research institute developing superconducting quantum devices and computing platforms.',
    country: 'DE',
    logoFile: 'wmi-logo.svg',
    websiteUrl: 'https://www.wmi.badw.de',
    brandColor: '#00843D',
    hasLRZRooms: false,
    resources: [
      {
        id: 'wmi-placeholder-1',
        name: 'Coming Soon',
        vendor: 'WMI',
        technology: 'Superconducting',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: true,
        note: null,
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'wmi-placeholder-2',
        name: 'Coming Soon',
        vendor: 'WMI',
        technology: 'Superconducting',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: true,
        note: null,
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },

  {
    id: 'planqc',
    name: 'PlanQC',
    category: 'QaaS',
    shortDescription:
      'PlanQC develops neutral-atom quantum computers based on the Munich Quantum Valley research ecosystem.',
    country: 'DE',
    logoFile: 'planqc_logo.png',
    websiteUrl: 'https://www.planqc.eu',
    brandColor: '#6B48FF',
    hasLRZRooms: false,
    resources: [
      {
        id: 'planqc-placeholder-1',
        name: 'Coming Soon',
        vendor: 'PlanQC',
        technology: 'Neutral Atoms',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: true,
        note: null,
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'planqc-placeholder-2',
        name: 'Coming Soon',
        vendor: 'PlanQC',
        technology: 'Neutral Atoms',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: true,
        note: null,
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },

  {
    id: 'aqt',
    name: 'AQT',
    category: 'QaaS',
    shortDescription:
      'Alpine Quantum Technologies (AQT) provides trapped-ion quantum processors with industry-leading gate fidelities.',
    country: 'AT',
    logoFile: 'Logo-AQT.png',
    websiteUrl: 'https://www.aqt.eu',
    brandColor: '#F5A623',
    hasLRZRooms: false,
    resources: [
      {
        id: 'aqt-placeholder-1',
        name: 'Coming Soon',
        vendor: 'AQT',
        technology: 'Trapped Ions',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: true,
        note: null,
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'aqt-placeholder-2',
        name: 'Coming Soon',
        vendor: 'AQT',
        technology: 'Trapped Ions',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: true,
        note: null,
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },

  {
    id: 'pasqal',
    name: 'PASQAL',
    category: 'QaaS',
    shortDescription:
      'PASQAL builds neutral-atom quantum processors based on arrays of individual atoms controlled with optical tweezers.',
    country: 'FR',
    logoFile: null,
    websiteUrl: 'https://www.pasqal.com',
    brandColor: '#7B2D8B',
    hasLRZRooms: false,
    resources: [
      {
        id: 'pasqal-placeholder-1',
        name: 'Coming Soon',
        vendor: 'PASQAL',
        technology: 'Neutral Atoms',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: true,
        note: null,
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'pasqal-placeholder-2',
        name: 'Coming Soon',
        vendor: 'PASQAL',
        technology: 'Neutral Atoms',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: true,
        note: null,
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },

  {
    id: 'quandela',
    name: 'QUANDELA',
    category: 'QaaS',
    shortDescription:
      'Quandela develops photonic quantum computing platforms using bright, single-photon emitters for scalable linear-optical quantum computation.',
    country: 'FR',
    logoFile: null,
    websiteUrl: 'https://quandela.com',
    brandColor: '#00B4D8',
    hasLRZRooms: false,
    resources: [
      {
        id: 'quandela-placeholder-1',
        name: 'Coming Soon',
        vendor: 'Quandela',
        technology: 'Photonic',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: true,
        note: null,
        grafanaPanelRef: null,
        roomId: null,
      },
      {
        id: 'quandela-placeholder-2',
        name: 'Coming Soon',
        vendor: 'Quandela',
        technology: 'Photonic',
        qubits: null,
        status: 'Unknown',
        isBeta: false,
        isPlaceholder: true,
        note: null,
        grafanaPanelRef: null,
        roomId: null,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Accessor functions
// ---------------------------------------------------------------------------

/**
 * Returns all institutions.
 * @returns {typeof INSTITUTION_MANIFEST}
 */
export function getInstitutions() {
  return INSTITUTION_MANIFEST;
}

/**
 * Returns a single institution by its stable URL slug.
 * @param {string} id
 * @returns {typeof INSTITUTION_MANIFEST[number]}
 * @throws {Error} if the institution is not found
 */
export function getInstitutionById(id) {
  const institution = INSTITUTION_MANIFEST.find((inst) => inst.id === id);
  if (!institution) {
    throw new Error(`Institution with id "${id}" not found.`);
  }
  return institution;
}

/**
 * Returns the resource array for a given institution.
 * @param {string} id
 * @returns {typeof INSTITUTION_MANIFEST[number]['resources']}
 */
export function getResourcesByInstitution(id) {
  return getInstitutionById(id).resources;
}
