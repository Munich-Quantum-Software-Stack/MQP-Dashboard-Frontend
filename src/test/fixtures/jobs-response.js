export const jobsResponse = {
  totaljob_nr: 12,
  jobs: [
    {
      id: '2024-11-01-000123',
      status: 'COMPLETED',
      executed_resource: 'qexa20',
      target_specification: 'qexa20',
      token_usage: 1,
      timestamp_submitted: '2024-11-01T09:12:43Z',
      timestamp_completed: '2024-11-01T09:14:02Z',
      result_available: true,
    },
    {
      id: '2024-11-01-000124',
      status: 'RUNNING',
      executed_resource: 'qlm',
      target_specification: 'qlm',
      token_usage: 1,
      timestamp_submitted: '2024-11-02T07:31:09Z',
      timestamp_completed: null,
      result_available: false,
    },
    {
      id: '2024-11-02-000201',
      status: 'PENDING',
      executed_resource: 'aqt20',
      target_specification: 'aqt20',
      token_usage: 1,
      timestamp_submitted: '2024-11-02T12:44:55Z',
      timestamp_completed: null,
      result_available: false,
    },
  ],
};

export const jobDetailResponse = {
  job: {
    id: '2024-11-01-000123',
    status: 'COMPLETED',
    note: 'Short GHZ calibration',
    shots: 1024,
    circuit_format: 'OPENQASM',
    executed_resource: 'qexa20',
    target_specification: 'qexa20',
    token_usage: 1,
    timestamp_submitted: '2024-11-01T09:12:43Z',
    timestamp_completed: '2024-11-01T09:14:02Z',
    result: {
      counts: {
        '000': 512,
        '001': 128,
        '010': 96,
        '011': 92,
        100: 72,
        101: 64,
        110: 40,
        111: 20,
      },
    },
    circuit: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];',
    executed_circuit: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];',
  },
};
