/**
 * institutions-response.js
 *
 * MSW fixture data for GET /institutions and GET /institutions/:id
 * Contains at least 3 institutions with representative resources.
 */

export const institutionsResponse = {
  institutions: [
    {
      id: 'lrz',
      name: 'LRZ',
      category: 'HPCQCaaS',
      shortDescription:
        "Leibniz Supercomputing Centre (LRZ) operates Germany's flagship HPC-integrated quantum computing facility.",
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
      id: 'iqm-vendor',
      name: 'IQM',
      category: 'QaaS',
      shortDescription:
        'IQM Quantum Computers is a European superconducting quantum hardware manufacturer and cloud provider.',
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
        'Walther-Meissner-Institut (WMI) is a leading German research institute developing superconducting quantum devices.',
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
  ],
};

export const institutionByIdResponse = (id) => {
  const institution = institutionsResponse.institutions.find((inst) => inst.id === id);
  if (!institution) return null;
  return { institution };
};
