<template>
  <div class="page-container">
    <div class="header">
      <div class="header-title">订单详情</div>
      <div class="header-subtitle">查看订单信息和操作入口</div>
    </div>

    <div v-if="order" class="section-card">
      <div class="order-status-header">
        <div class="order-no">{{ order.orderNo }}</div>
        <van-tag :color="order.statusColor" type="primary" size="medium">{{ order.statusText }}</van-tag>
      </div>
      <div class="contract-info">
        <div class="info-row">
          <span class="info-label">房屋</span>
          <span class="info-value">{{ order.roomNumber }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">租客</span>
          <span class="info-value">{{ order.tenantName }} · {{ order.tenantPhone }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">月租金</span>
          <span class="info-value price">{{ order.monthlyRent }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">物业费</span>
          <span class="info-value price">{{ order.propertyFee }}/月</span>
        </div>
        <div class="info-row">
          <span class="info-label">押金</span>
          <span class="info-value price">{{ order.deposit }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">合同期限</span>
          <span class="info-value">{{ order.startDate }} 至 {{ order.endDate }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">已缴月数</span>
          <span class="info-value">{{ order.paidMonths }} 个月</span>
        </div>
        <div class="info-row">
          <span class="info-label">累计缴费</span>
          <span class="info-value price">{{ order.totalPaid }}</span>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">快捷操作</div>
      <div class="action-grid">
        <div class="action-item" @click="goToRenewal">
          <div class="action-icon renewal">
            <van-icon name="replay" size="28" color="#fff" />
          </div>
          <div class="action-name">续租申请</div>
          <div v-if="order?.renewal?.status && order.renewal.status !== 'none'" class="action-status">
            <van-tag size="mini" :color="getRenewalStatusColor(order.renewal.status)">{{ order.renewal.statusText }}</van-tag>
          </div>
        </div>
        <div class="action-item" @click="goToTermination">
          <div class="action-icon termination">
            <van-icon name="log-out" size="28" color="#fff" />
          </div>
          <div class="action-name">退租申请</div>
          <div v-if="order?.termination?.status && order.termination.status !== 'none'" class="action-status">
            <van-tag size="mini" :color="getTerminationStatusColor(order.termination.status)">{{ order.termination.statusText }}</van-tag>
          </div>
        </div>
        <div class="action-item" @click="goToRepair">
          <div class="action-icon repair">
            <van-icon name="service-o" size="28" color="#fff" />
          </div>
          <div class="action-name">报修申请</div>
          <div class="action-status">
            <van-tag size="mini" type="primary">{{ order?.repairs?.length || 0 }} 笔</van-tag>
          </div>
        </div>
        <div class="action-item" @click="goToInvoice">
          <div class="action-icon invoice">
            <van-icon name="balance-list-o" size="28" color="#fff" />
          </div>
          <div class="action-name">发票申请</div>
          <div class="action-status">
            <van-tag size="mini" type="warning">开发票</van-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">
        <span>续租记录</span>
        <van-button size="mini" type="primary" plain @click="goToRenewal">申请续租</van-button>
      </div>
      <div v-if="order?.renewal?.status && order.renewal.status !== 'none'" class="status-record">
        <div class="status-step">
          <div class="step-dot active"></div>
          <div class="step-content">
            <div class="step-title">提交申请</div>
            <div class="step-time">{{ order.renewal.applicationTime }}</div>
          </div>
        </div>
        <div v-if="order.renewal.status === 'approved' || order.renewal.status === 'completed'" class="status-step">
          <div class="step-dot active"></div>
          <div class="step-content">
            <div class="step-title">审核通过</div>
            <div class="step-time">{{ order.renewal.approvedTime }}</div>
            <div v-if="order.renewal.newStartDate" class="step-detail">
              新租期：{{ order.renewal.newStartDate }} 至 {{ order.renewal.newEndDate }}
            </div>
            <div v-if="order.renewal.newMonthlyRent" class="step-detail">
              新月租：<span class="price">{{ order.renewal.newMonthlyRent }}</span>
              <span v-if="order.renewal.discount > 0" class="discount-tag">
                <van-tag type="danger" size="mini">优惠{{ order.renewal.discount }}%</van-tag>
              </span>
            </div>
          </div>
        </div>
        <div v-if="order.renewal.status === 'rejected'" class="status-step">
          <div class="step-dot rejected"></div>
          <div class="step-content">
            <div class="step-title">申请已拒绝</div>
          </div>
        </div>
        <div v-if="order.renewal.status === 'completed'" class="status-step">
          <div class="step-dot active"></div>
          <div class="step-content">
            <div class="step-title">续租完成</div>
          </div>
        </div>
        <div v-if="order.renewal.status === 'pending'" class="status-step">
          <div class="step-dot pending"></div>
          <div class="step-content">
            <div class="step-title">等待审核</div>
          </div>
        </div>
      </div>
      <div v-else class="empty-tip">
        <van-icon name="info-o" size="20" color="#969799" />
        <span>暂无续租记录</span>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">
        <span>退租记录</span>
        <van-button size="mini" type="danger" plain @click="goToTermination">申请退租</van-button>
      </div>
      <div v-if="order?.termination?.status && order.termination.status !== 'none'" class="status-record">
        <div class="status-step">
          <div class="step-dot active"></div>
          <div class="step-content">
            <div class="step-title">提交申请</div>
            <div class="step-time">{{ order.termination.applicationTime }}</div>
            <div v-if="order.termination.reason" class="step-detail">
              退租原因：{{ order.termination.reason }}
            </div>
          </div>
        </div>
        <div v-if="order.termination.status === 'approved' || order.termination.status === 'completed'" class="status-step">
          <div class="step-dot active"></div>
          <div class="step-content">
            <div class="step-title">审核通过</div>
            <div class="step-time">{{ order.termination.approvedTime }}</div>
            <div v-if="order.termination.moveOutDate" class="step-detail">
              搬离日期：{{ order.termination.moveOutDate }}
            </div>
            <div v-if="order.termination.refundAmount" class="step-detail">
              退款金额：<span class="price">{{ order.termination.refundAmount }}</span>
            </div>
          </div>
        </div>
        <div v-if="order.termination.status === 'rejected'" class="status-step">
          <div class="step-dot rejected"></div>
          <div class="step-content">
            <div class="step-title">申请已拒绝</div>
          </div>
        </div>
        <div v-if="order.termination.status === 'completed'" class="status-step">
          <div class="step-dot active"></div>
          <div class="step-content">
            <div class="step-title">退租完成</div>
          </div>
        </div>
        <div v-if="order.termination.status === 'pending'" class="status-step">
          <div class="step-dot pending"></div>
          <div class="step-content">
            <div class="step-title">等待审核</div>
          </div>
        </div>
      </div>
      <div v-else class="empty-tip">
        <van-icon name="info-o" size="20" color="#969799" />
        <span>暂无退租记录</span>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">
        <span>报修记录</span>
        <van-button size="mini" type="primary" plain @click="goToRepair">我要报修</van-button>
      </div>
      <div v-if="order?.repairs?.length > 0" class="repair-list">
        <div
          v-for="repair in order.repairs"
          :key="repair.id"
          class="repair-item"
        >
          <div class="repair-header">
            <span class="repair-id">{{ repair.id }}</span>
            <van-tag :color="repair.statusColor" size="medium">{{ repair.statusText }}</van-tag>
          </div>
          <div class="repair-info-row">
            <span class="repair-label">问题类型</span>
            <span class="repair-value">{{ repair.typeName }}</span>
          </div>
          <div class="repair-info-row">
            <span class="repair-label">提交时间</span>
            <span class="repair-value">{{ repair.submitTime }}</span>
          </div>
          <div v-if="repair.workerName" class="repair-info-row">
            <span class="repair-label">维修人员</span>
            <span class="repair-value">{{ repair.workerName }} · {{ repair.workerPhone }}</span>
          </div>
          <div v-if="repair.fee" class="repair-info-row">
            <span class="repair-label">维修费用</span>
            <span class="repair-value price">{{ repair.fee }}</span>
          </div>
          <div v-if="repair.comment" class="repair-info-row">
            <span class="repair-label">用户评价</span>
            <span class="repair-value">{{ repair.comment }}</span>
          </div>
        </div>
      </div>
      <div v-else class="empty-tip">
        <van-icon name="info-o" size="20" color="#969799" />
        <span>暂无报修记录</span>
      </div>
    </div>

    <div class="footer-bar">
      <div class="footer-actions">
        <van-button size="large" plain @click="showStatusModal = true" class="test-btn">
          模拟状态回写
        </van-button>
      </div>
    </div>

    <van-popup v-model:show="showStatusModal" round position="bottom" :style="{ padding: '20px' }">
      <div class="status-modal">
        <div class="modal-title">模拟状态回写测试</div>
        <div class="modal-section">
          <div class="modal-label">续租状态</div>
          <div class="modal-btns">
            <van-button
              v-for="s in renewalStatusOptions"
              :key="s.value"
              size="small"
              :type="order?.renewal?.status === s.value ? 'primary' : 'default'"
              @click="handleUpdateRenewalStatus(s.value)"
            >
              {{ s.label }}
            </van-button>
          </div>
        </div>
        <div class="modal-section">
          <div class="modal-label">退租状态</div>
          <div class="modal-btns">
            <van-button
              v-for="s in terminationStatusOptions"
              :key="s.value"
              size="small"
              :type="order?.termination?.status === s.value ? 'danger' : 'default'"
              @click="handleUpdateTerminationStatus(s.value)"
            >
              {{ s.label }}
            </van-button>
          </div>
        </div>
        <div class="modal-section" v-if="order?.repairs?.length > 0">
          <div class="modal-label">报修状态（选择报修单）</div>
          <div class="repair-select">
            <van-radio-group v-model="selectedRepairId">
              <div
                v-for="repair in order.repairs"
                :key="repair.id"
                class="repair-select-item"
              >
                <van-radio :name="repair.id" />
                <span>{{ repair.typeName }}</span>
              </div>
            </van-radio-group>
          </div>
          <div class="modal-btns">
            <van-button
              v-for="s in repairStatusOptions"
              :key="s.value"
              size="small"
              :type="order.repairs.find(r => r.id === selectedRepairId)?.status === s.value ? 'warning' : 'default'"
              :disabled="!selectedRepairId"
              @click="handleUpdateRepairStatus(s.value)"
            >
              {{ s.label }}
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast, showLoadingToast, closeToast } from 'vant';
import {
  getOrderDetail,
  updateRenewalStatus,
  updateTerminationStatus,
  updateRepairStatus
} from '../api/order';

const router = useRouter();
const route = useRoute();

const order = ref(null);
const showStatusModal = ref(false);
const selectedRepairId = ref(null);

const renewalStatusOptions = [
  { value: 'none', label: '未申请' },
  { value: 'pending', label: '审核中' },
  { value: 'approved', label: '已同意' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'completed', label: '已完成' }
];

const terminationStatusOptions = [
  { value: 'none', label: '未申请' },
  { value: 'pending', label: '审核中' },
  { value: 'approved', label: '已同意' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'completed', label: '已完成' }
];

const repairStatusOptions = [
  { value: 'pending', label: '待处理' },
  { value: 'in_progress', label: '处理中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
];

const getRenewalStatusColor = (status) => {
  const map = {
    pending: '#ff976a',
    approved: '#07c160',
    rejected: '#ee0a24',
    completed: '#1989fa'
  };
  return map[status] || '#969799';
};

const getTerminationStatusColor = (status) => {
  const map = {
    pending: '#ff976a',
    approved: '#07c160',
    rejected: '#ee0a24',
    completed: '#969799'
  };
  return map[status] || '#969799';
};

const goToRenewal = () => {
  router.push('/renewal');
};

const goToTermination = () => {
  router.push('/termination');
};

const goToRepair = () => {
  router.push('/repair');
};

const goToInvoice = () => {
  router.push('/invoice');
};

const fetchOrderDetail = async () => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  });

  try {
    const orderId = route.query.orderId || 'HT202601001';
    const res = await getOrderDetail(orderId);
    if (res.data.code === 200) {
      order.value = res.data.data;
      if (order.value.repairs && order.value.repairs.length > 0) {
        selectedRepairId.value = order.value.repairs[0].id;
      }
    } else {
      showToast(res.data.message || '加载失败');
    }
  } catch (error) {
    showToast('网络错误，请稍后重试');
  } finally {
    closeToast();
  }
};

const handleUpdateRenewalStatus = async (status) => {
  showLoadingToast({
    message: '更新中...',
    forbidClick: true,
    duration: 0
  });

  try {
    const res = await updateRenewalStatus({
      orderId: order.value.id,
      status,
      startDate: '2026-08-01',
      endDate: '2027-01-31',
      monthlyRent: 3500,
      discount: status === 'approved' || status === 'completed' ? 5 : 0
    });

    closeToast();

    if (res.data.code === 200) {
      order.value.renewal = res.data.data.renewal;
      showToast('续租状态更新成功');
    } else {
      showToast(res.data.message || '更新失败');
    }
  } catch (error) {
    closeToast();
    showToast('网络错误，请稍后重试');
  }
};

const handleUpdateTerminationStatus = async (status) => {
  showLoadingToast({
    message: '更新中...',
    forbidClick: true,
    duration: 0
  });

  try {
    const res = await updateTerminationStatus({
      orderId: order.value.id,
      status,
      moveOutDate: '2026-06-30',
      refundAmount: status === 'approved' || status === 'completed' ? 3500 : null,
      reason: '工作调动'
    });

    closeToast();

    if (res.data.code === 200) {
      order.value.termination = res.data.data.termination;
      if (res.data.data.status) {
        order.value.status = res.data.data.status;
        order.value.statusText = res.data.data.statusText;
      }
      showToast('退租状态更新成功');
    } else {
      showToast(res.data.message || '更新失败');
    }
  } catch (error) {
    closeToast();
    showToast('网络错误，请稍后重试');
  }
};

const handleUpdateRepairStatus = async (status) => {
  if (!selectedRepairId.value) {
    showToast('请选择报修单');
    return;
  }

  showLoadingToast({
    message: '更新中...',
    forbidClick: true,
    duration: 0
  });

  try {
    const res = await updateRepairStatus({
      orderId: order.value.id,
      repairId: selectedRepairId.value,
      status,
      workerName: '张师傅',
      workerPhone: '138****6666',
      fee: 200
    });

    closeToast();

    if (res.data.code === 200) {
      const idx = order.value.repairs.findIndex(r => r.id === selectedRepairId.value);
      if (idx !== -1) {
        order.value.repairs[idx] = res.data.data.repair;
      }
      showToast('报修状态更新成功');
    } else {
      showToast(res.data.message || '更新失败');
    }
  } catch (error) {
    closeToast();
    showToast('网络错误，请稍后重试');
  }
};

onMounted(() => {
  fetchOrderDetail();
});
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #1989fa, #07c160);
  padding: 40px 20px 30px;
  color: #fff;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 6px;
}

.header-subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.order-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebedf0;
}

.order-no {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.contract-info {
  background: #f7f8fa;
  border-radius: 8px;
  padding: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.info-label {
  color: #969799;
  font-size: 14px;
}

.info-value {
  color: #323233;
  font-size: 14px;
  max-width: 60%;
  text-align: right;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 4px;
  background: #fafafa;
  border-radius: 10px;
  transition: all 0.3s;
}

.action-item:active {
  transform: scale(0.96);
  background: #f0f0f0;
}

.action-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon.renewal {
  background: linear-gradient(135deg, #1989fa, #00a1ff);
}

.action-icon.termination {
  background: linear-gradient(135deg, #ee0a24, #ff6034);
}

.action-icon.repair {
  background: linear-gradient(135deg, #ff976a, #ff6b35);
}

.action-icon.invoice {
  background: linear-gradient(135deg, #7232dd, #a050ff);
}

.action-name {
  font-size: 13px;
  font-weight: 500;
  color: #323233;
}

.action-status {
  min-height: 20px;
}

.status-record {
  position: relative;
}

.status-step {
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  position: relative;
}

.status-step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 20px;
  bottom: 0;
  width: 2px;
  background: #ebedf0;
}

.step-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #07c160;
  flex-shrink: 0;
  margin-top: 2px;
  position: relative;
  z-index: 1;
}

.step-dot.pending {
  background: #ff976a;
}

.step-dot.rejected {
  background: #ee0a24;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 2px;
}

.step-time {
  font-size: 12px;
  color: #969799;
  margin-bottom: 4px;
}

.step-detail {
  font-size: 13px;
  color: #646566;
  line-height: 1.6;
}

.discount-tag {
  margin-left: 8px;
}

.repair-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.repair-item {
  padding: 12px;
  background: #f7f8fa;
  border-radius: 8px;
}

.repair-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebedf0;
}

.repair-id {
  font-size: 13px;
  font-weight: 500;
  color: #323233;
  font-family: monospace;
}

.repair-info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 4px 0;
  font-size: 13px;
}

.repair-label {
  color: #969799;
  flex-shrink: 0;
  margin-right: 12px;
}

.repair-value {
  color: #323233;
  text-align: right;
  max-width: 70%;
}

.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 30px 0;
  color: #969799;
  font-size: 14px;
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 16px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.test-btn {
  flex: 1;
  border-radius: 24px;
}

.status-modal {
  padding-bottom: env(safe-area-inset-bottom);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}

.modal-section {
  margin-bottom: 16px;
}

.modal-label {
  font-size: 14px;
  font-weight: 500;
  color: #646566;
  margin-bottom: 10px;
}

.modal-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.repair-select {
  margin-bottom: 12px;
  padding: 12px;
  background: #f7f8fa;
  border-radius: 8px;
}

.repair-select-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-size: 14px;
  color: #323233;
}
</style>
