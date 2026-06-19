const orders = [
  {
    id: 'HT202601001',
    orderNo: 'HT202601001',
    type: 'rent',
    typeName: '租房合同',
    status: 'active',
    statusText: '租赁中',
    statusColor: '#07c160',
    roomNumber: 'A栋1203室',
    tenantName: '张三',
    tenantPhone: '138****8888',
    monthlyRent: 3500,
    propertyFee: 200,
    deposit: 3500,
    startDate: '2025-08-01',
    endDate: '2026-07-31',
    paidMonths: 11,
    totalPaid: 38500,
    createTime: '2025-07-25 14:30:00',
    renewal: {
      status: 'none',
      statusText: '未申请',
      applicationTime: null,
      approvedTime: null,
      newStartDate: null,
      newEndDate: null,
      newMonthlyRent: null,
      discount: 0
    },
    termination: {
      status: 'none',
      statusText: '未申请',
      applicationTime: null,
      approvedTime: null,
      moveOutDate: null,
      refundAmount: null,
      reason: null
    },
    repairs: [
      {
        id: 'BX20260115001',
        typeName: '空调维修',
        status: 'completed',
        statusText: '已完成',
        statusColor: '#07c160',
        submitTime: '2026-01-15 14:30:00',
        workerName: '李师傅',
        workerPhone: '139****1234',
        fee: 180,
        comment: '维修及时，服务很好'
      },
      {
        id: 'BX20260220002',
        typeName: '水龙头更换',
        status: 'in_progress',
        statusText: '处理中',
        statusColor: '#ff976a',
        submitTime: '2026-02-20 09:15:00',
        workerName: '王师傅',
        workerPhone: '138****5678',
        fee: 120,
        comment: null
      }
    ]
  }
];

module.exports = orders;
