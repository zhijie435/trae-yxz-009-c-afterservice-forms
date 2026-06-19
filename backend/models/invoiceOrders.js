const invoiceOrders = [
  {
    id: 'ZL202501010001',
    type: 'rent',
    typeName: '房租订单',
    roomNumber: 'A栋1203室',
    amount: 3500,
    period: '2026-01-01 至 2026-01-31',
    createTime: '2026-01-01 10:00:00',
    hasInvoice: false
  },
  {
    id: 'ZL202502010002',
    type: 'rent',
    typeName: '房租订单',
    roomNumber: 'A栋1203室',
    amount: 3500,
    period: '2026-02-01 至 2026-02-28',
    createTime: '2026-02-01 10:00:00',
    hasInvoice: false
  },
  {
    id: 'ZL202503010003',
    type: 'rent',
    typeName: '房租订单',
    roomNumber: 'A栋1203室',
    amount: 3500,
    period: '2026-03-01 至 2026-03-31',
    createTime: '2026-03-01 10:00:00',
    hasInvoice: true
  },
  {
    id: 'XZ202501150001',
    type: 'repair',
    typeName: '报修订单',
    roomNumber: 'A栋1203室',
    amount: 180,
    period: '空调维修',
    createTime: '2026-01-15 14:30:00',
    hasInvoice: false
  },
  {
    id: 'XZ202502200002',
    type: 'repair',
    typeName: '报修订单',
    roomNumber: 'A栋1203室',
    amount: 120,
    period: '水龙头更换',
    createTime: '2026-02-20 09:15:00',
    hasInvoice: false
  }
];

module.exports = invoiceOrders;
