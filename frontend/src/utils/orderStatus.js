export const STATUS_MAPS = {
  renewal: {
    none: { status: 'none', statusText: '未申请' },
    pending: { status: 'pending', statusText: '审核中' },
    approved: { status: 'approved', statusText: '已同意' },
    rejected: { status: 'rejected', statusText: '已拒绝' },
    completed: { status: 'completed', statusText: '已完成' }
  },
  termination: {
    none: { status: 'none', statusText: '未申请' },
    pending: { status: 'pending', statusText: '审核中' },
    approved: { status: 'approved', statusText: '已同意' },
    rejected: { status: 'rejected', statusText: '已拒绝' },
    completed: { status: 'completed', statusText: '已完成' }
  },
  repair: {
    pending: { status: 'pending', statusText: '待处理', statusColor: '#ff976a' },
    in_progress: { status: 'in_progress', statusText: '处理中', statusColor: '#ff976a' },
    completed: { status: 'completed', statusText: '已完成', statusColor: '#07c160' },
    cancelled: { status: 'cancelled', statusText: '已取消', statusColor: '#969799' }
  },
  invoice: {
    pending: { status: 'pending', statusText: '待开票' },
    processing: { status: 'processing', statusText: '开票中' },
    completed: { status: 'completed', statusText: '已开票' },
    shipped: { status: 'shipped', statusText: '已寄出' },
    rejected: { status: 'rejected', statusText: '已拒绝' }
  }
};

export const STATUS_COLORS = {
  renewal: {
    pending: '#ff976a',
    approved: '#07c160',
    rejected: '#ee0a24',
    completed: '#1989fa'
  },
  termination: {
    pending: '#ff976a',
    approved: '#07c160',
    rejected: '#ee0a24',
    completed: '#969799'
  }
};

export const STATUS_OPTIONS = {
  renewal: [
    { value: 'none', label: '未申请' },
    { value: 'pending', label: '审核中' },
    { value: 'approved', label: '已同意' },
    { value: 'rejected', label: '已拒绝' },
    { value: 'completed', label: '已完成' }
  ],
  termination: [
    { value: 'none', label: '未申请' },
    { value: 'pending', label: '审核中' },
    { value: 'approved', label: '已同意' },
    { value: 'rejected', label: '已拒绝' },
    { value: 'completed', label: '已完成' }
  ],
  repair: [
    { value: 'pending', label: '待处理' },
    { value: 'in_progress', label: '处理中' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' }
  ],
  invoice: [
    { value: 'pending', label: '待开票' },
    { value: 'processing', label: '开票中' },
    { value: 'completed', label: '已开票' },
    { value: 'shipped', label: '已寄出' },
    { value: 'rejected', label: '已拒绝' }
  ]
};

export const getStatusInfo = (type, status) => {
  const map = STATUS_MAPS[type];
  if (!map) return null;
  return map[status] || map.none || map.pending || null;
};

export const getStatusColor = (type, status) => {
  const colors = STATUS_COLORS[type];
  if (!colors) return '#969799';
  return colors[status] || '#969799';
};

export const getStatusText = (type, status) => {
  const info = getStatusInfo(type, status);
  return info ? info.statusText : status;
};

export const getStatusOptions = (type) => {
  return STATUS_OPTIONS[type] || [];
};
