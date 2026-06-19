<template>
  <div class="page-container">
    <div class="header">
      <div class="header-title">租客服务中心</div>
      <div class="header-subtitle">一站式办理续租、退租、报修、发票</div>
    </div>

    <div class="quick-nav">
      <div class="nav-item" @click="goToRepair">
        <div class="nav-icon repair">
          <van-icon name="service-o" size="28" />
        </div>
        <div class="nav-text">我要报修</div>
      </div>
      <div class="nav-item" @click="goToAfterSales">
        <div class="nav-icon list">
          <van-icon name="orders-o" size="28" />
        </div>
        <div class="nav-text">工单进度</div>
      </div>
      <div class="nav-item" @click="goToTermination">
        <div class="nav-icon termination">
          <van-icon name="log-out" size="28" />
        </div>
        <div class="nav-text">申请退租</div>
      </div>
      <div class="nav-item" @click="goToInvoice">
        <div class="nav-icon invoice">
          <van-icon name="balance-list-o" size="28" />
        </div>
        <div class="nav-text">开具发票</div>
      </div>
    </div>

    <div class="section-title-main">
      <span class="title-bar"></span>
      <span class="title-text">续租申请</span>
    </div>

    <div v-if="currentContract" class="section-card">
      <div class="section-title">当前合同信息</div>
      <div class="contract-info">
        <div class="info-row">
          <span class="info-label">房屋</span>
          <span class="info-value">{{ currentContract.roomNumber }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">月租金</span>
          <span class="info-value price">{{ currentContract.monthlyRent }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">物业费</span>
          <span class="info-value price">{{ currentContract.propertyFee }}/月</span>
        </div>
        <div class="info-row">
          <span class="info-label">到期日期</span>
          <span class="info-value">{{ currentContract.contractEndDate }}</span>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">选择续租时长</div>
      <van-radio-group v-model="selectedDurationId" @change="handleDurationChange">
        <div class="duration-list">
          <div
            v-for="duration in durations"
            :key="duration.id"
            class="duration-item"
            :class="{ active: selectedDurationId === duration.id }"
          >
            <div class="duration-left">
              <div class="duration-label">{{ duration.label }}</div>
              <div v-if="duration.discount > 0" class="duration-tag">
                <van-tag type="danger" size="medium">优惠{{ (duration.discount * 100).toFixed(0) }}%</van-tag>
              </div>
            </div>
            <div class="duration-right">
              <div class="duration-price">
                <span class="price">{{ getDiscountedMonthlyPrice(duration) }}</span>
                <span class="price-unit">/月</span>
              </div>
              <van-radio :name="duration.id" />
            </div>
          </div>
        </div>
      </van-radio-group>
    </div>

    <div class="section-card">
      <div class="section-title">费用明细</div>
      <div v-if="feeBreakdown" class="fee-breakdown">
        <div class="fee-row">
          <span class="fee-label">租期</span>
          <span class="fee-value">{{ feeBreakdown.startDate }} 至 {{ feeBreakdown.endDate }}</span>
        </div>
        <div class="fee-row">
          <span class="fee-label">月租金</span>
          <span class="fee-value price">{{ feeBreakdown.monthlyRent }}</span>
        </div>
        <div class="fee-row">
          <span class="fee-label">租金 × {{ feeBreakdown.months }}个月</span>
          <span class="fee-value"><span class="original-price">¥{{ feeBreakdown.baseRent }}</span></span>
        </div>
        <div v-if="feeBreakdown.discount > 0" class="fee-row discount">
          <span class="fee-label">续租优惠 {{ feeBreakdown.discount }}%</span>
          <span class="fee-value">-¥{{ (feeBreakdown.baseRent - feeBreakdown.discountedRent).toFixed(2) }}</span>
        </div>
        <div class="fee-row">
          <span class="fee-label">物业费 × {{ feeBreakdown.months }}个月</span>
          <span class="fee-value price">{{ feeBreakdown.totalPropertyFee }}</span>
        </div>
        <div class="fee-row">
          <span class="fee-label">押金（1个月房租）</span>
          <span class="fee-value price">{{ feeBreakdown.deposit }}</span>
        </div>
        <div class="fee-divider"></div>
        <div class="fee-row total">
          <span class="fee-label">应付金额</span>
          <span class="fee-value price total-price">{{ feeBreakdown.totalAmount.toFixed(2) }}</span>
        </div>
      </div>
      <div v-else class="empty-tip">
        <van-icon name="info-o" size="20" color="#969799" />
        <span>请选择续租时长查看费用明细</span>
      </div>
    </div>

    <div class="footer-bar">
      <div class="footer-left">
        <div class="footer-label">合计应付</div>
        <div class="footer-price">
          <span class="price">{{ feeBreakdown ? feeBreakdown.totalAmount.toFixed(2) : '0.00' }}</span>
        </div>
      </div>
      <van-button
        type="primary"
        size="large"
        class="submit-btn"
        :disabled="!selectedDurationId || !feeBreakdown"
        @click="handleSubmit"
      >
        提交申请
      </van-button>
    </div>

    <van-popup
      v-model:show="showPaymentPopup"
      round
      position="bottom"
      :style="{ height: '60%', padding: '20px' }"
    >
      <div class="payment-popup">
        <div class="popup-title">选择支付方式</div>
        <div class="payment-methods">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            class="payment-method-item"
            :class="{ active: selectedPaymentMethod === method.id }"
            @click="selectedPaymentMethod = method.id"
          >
            <div class="method-left">
              <van-icon :name="method.icon" :size="28" :color="method.color" />
              <div class="method-info">
                <div class="method-name">{{ method.name }}</div>
                <div class="method-desc">{{ method.desc }}</div>
              </div>
            </div>
            <van-radio :name="method.id" v-model="selectedPaymentMethod" />
          </div>
        </div>
        <van-button
          type="primary"
          size="large"
          block
          class="confirm-pay-btn"
          :disabled="!selectedPaymentMethod"
          @click="confirmPayment"
          :loading="submitting"
        >
          确认支付 ¥{{ feeBreakdown ? feeBreakdown.totalAmount.toFixed(2) : '0.00' }}
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { getRentalDurations, calculateRentalFee, submitPayment } from '../api/rental';

const router = useRouter();

const durations = ref([]);
const currentContract = ref(null);
const selectedDurationId = ref(null);
const feeBreakdown = ref(null);
const showPaymentPopup = ref(false);
const selectedPaymentMethod = ref(null);
const submitting = ref(false);

const paymentMethods = [
  { id: 'wechat', name: '微信支付', desc: '推荐使用', icon: 'wechat', color: '#07c160' },
  { id: 'alipay', name: '支付宝', desc: '支持花呗', icon: 'alipay', color: '#1677ff' },
  { id: 'bank', name: '银行卡支付', desc: '储蓄卡/信用卡', icon: 'balance-o', color: '#ff976a' }
];

const goToRepair = () => {
  router.push('/repair');
};

const goToAfterSales = () => {
  router.push('/after-sales');
};

const goToTermination = () => {
  router.push('/termination');
};

const goToInvoice = () => {
  router.push('/invoice');
};

const getDiscountedMonthlyPrice = (duration) => {
  if (!currentContract.value) return '0';
  const discounted = currentContract.value.monthlyRent * (1 - duration.discount);
  return discounted.toFixed(2);
};

const handleDurationChange = () => {
  calculateFee();
};

const calculateFee = async () => {
  if (!selectedDurationId.value) return;
  
  try {
    const res = await calculateRentalFee({
      durationId: selectedDurationId.value,
      startDate: currentContract.value.contractEndDate
    });
    if (res.data.code === 200) {
      feeBreakdown.value = res.data.data;
    } else {
      showToast(res.data.message || '计算失败');
    }
  } catch (error) {
    showToast('网络错误，请稍后重试');
  }
};

const handleSubmit = () => {
  if (!selectedDurationId.value || !feeBreakdown.value) {
    showToast('请选择续租时长');
    return;
  }
  showPaymentPopup.value = true;
};

const confirmPayment = async () => {
  if (!selectedPaymentMethod.value) {
    showToast('请选择支付方式');
    return;
  }

  submitting.value = true;
  showLoadingToast({
    message: '提交中...',
    forbidClick: true,
    duration: 0
  });

  try {
    const res = await submitPayment({
      durationId: selectedDurationId.value,
      startDate: currentContract.value.contractEndDate,
      paymentMethod: selectedPaymentMethod.value,
      feeBreakdown: feeBreakdown.value
    });
    
    closeToast();
    
    if (res.data.code === 200) {
      localStorage.setItem('pendingOrder', JSON.stringify(res.data.data));
      router.push({
        path: '/payment',
        query: { orderId: res.data.data.orderId }
      });
    } else {
      showToast(res.data.message || '提交失败');
    }
  } catch (error) {
    closeToast();
    showToast('网络错误，请稍后重试');
  } finally {
    submitting.value = false;
    showPaymentPopup.value = false;
  }
};

const fetchDurations = async () => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  });

  try {
    const res = await getRentalDurations();
    if (res.data.code === 200) {
      durations.value = res.data.data.durations;
      currentContract.value = res.data.data.currentContract;
    } else {
      showToast(res.data.message || '加载失败');
    }
  } catch (error) {
    showToast('网络错误，请稍后重试');
  } finally {
    closeToast();
  }
};

onMounted(() => {
  fetchDurations();
});
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #1989fa, #07c160);
  padding: 40px 20px 30px;
  color: #fff;
}

.quick-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: #fff;
  padding: 20px 8px;
  margin: -16px 12px 0;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 10;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon.repair {
  background: linear-gradient(135deg, #ff976a, #ff6034);
  color: #fff;
}

.nav-icon.list {
  background: linear-gradient(135deg, #1989fa, #07c160);
  color: #fff;
}

.nav-icon.termination {
  background: linear-gradient(135deg, #ee0a24, #ff6034);
  color: #fff;
}

.nav-icon.invoice {
  background: linear-gradient(135deg, #7232dd, #be77ff);
  color: #fff;
}

.nav-text {
  font-size: 13px;
  color: #323233;
  font-weight: 500;
}

.section-title-main {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px 12px;
}

.section-title-main .title-bar {
  width: 4px;
  height: 18px;
  background: linear-gradient(180deg, #1989fa, #07c160);
  border-radius: 2px;
}

.section-title-main .title-text {
  font-size: 17px;
  font-weight: 600;
  color: #323233;
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
}

.duration-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.duration-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 2px solid #ebedf0;
  border-radius: 10px;
  transition: all 0.3s;
}

.duration-item.active {
  border-color: #1989fa;
  background: #e8f3ff;
}

.duration-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.duration-label {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.duration-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.duration-price {
  text-align: right;
}

.price-unit {
  color: #969799;
  font-size: 12px;
}

.fee-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fee-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.fee-label {
  color: #646566;
}

.fee-value {
  color: #323233;
}

.fee-row.discount .fee-label {
  color: #ee0a24;
}

.fee-row.discount .fee-value {
  color: #07c160;
}

.original-price {
  text-decoration: line-through;
  color: #969799;
}

.fee-divider {
  height: 1px;
  background: #ebedf0;
  margin: 4px 0;
}

.fee-row.total {
  padding-top: 8px;
}

.fee-row.total .fee-label {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.total-price {
  font-size: 24px;
}

.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 0;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.footer-left {
  flex: 1;
}

.footer-label {
  font-size: 12px;
  color: #969799;
  margin-bottom: 4px;
}

.footer-price {
  font-size: 20px;
}

.submit-btn {
  width: 140px;
  border-radius: 24px;
}

.payment-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}

.payment-methods {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-method-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 2px solid #ebedf0;
  border-radius: 10px;
}

.payment-method-item.active {
  border-color: #1989fa;
  background: #e8f3ff;
}

.method-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.method-name {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 2px;
}

.method-desc {
  font-size: 12px;
  color: #969799;
}

.confirm-pay-btn {
  border-radius: 24px;
  margin-top: 20px;
}
</style>
