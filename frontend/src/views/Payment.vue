<template>
  <div class="page-container">
    <div class="payment-header">
      <van-icon name="scan" size="24" color="#fff" />
      <div class="header-title">支付订单</div>
    </div>

    <div v-if="orderInfo" class="order-card">
      <div class="order-room">
        <van-icon name="home-o" size="18" color="#1989fa" />
        <span>{{ orderInfo.roomNumber }}</span>
      </div>
      <div class="order-duration">
        租期：{{ orderInfo.startDate }} 至 {{ orderInfo.endDate }}（{{ orderInfo.months }}个月）
      </div>
      <div class="order-id">订单号：{{ orderInfo.orderId }}</div>
    </div>

    <div class="amount-card">
      <div class="amount-label">支付金额</div>
      <div class="amount-value">
        <span class="currency">¥</span>
        <span class="amount">{{ orderInfo ? orderInfo.totalAmount.toFixed(2) : '0.00' }}</span>
      </div>
      <div class="pay-method">
        <van-icon :name="getPayMethodIcon(orderInfo?.paymentMethod)" :size="16" :color="getPayMethodColor(orderInfo?.paymentMethod)" />
        <span>{{ getPayMethodName(orderInfo?.paymentMethod) }}</span>
      </div>
    </div>

    <div class="qrcode-card">
      <div class="qrcode-title">请使用{{ getPayMethodName(orderInfo?.paymentMethod) }}扫码支付</div>
      <div class="qrcode-wrapper">
        <img v-if="orderInfo?.qrCodeUrl" :src="orderInfo.qrCodeUrl" alt="支付二维码" class="qrcode-img" />
        <div v-else class="qrcode-placeholder">
          <van-icon name="photo-o" size="48" color="#dcdee0" />
        </div>
      </div>
      <div class="qrcode-tip">二维码有效期</div>
      <div class="countdown-wrapper">
        <van-count-down
          v-if="orderInfo?.expireTime"
          :time="countdownTime"
          format="mm:ss"
          @finish="handleCountdownFinish"
        >
          <template #default="timeData">
            <span class="countdown-value">{{ timeData.minutes }}:{{ timeData.seconds < 10 ? '0' + timeData.seconds : timeData.seconds }}</span>
          </template>
        </van-count-down>
      </div>
    </div>

    <div class="tips-card">
      <div class="tips-title">
        <van-icon name="info-o" size="16" color="#ff976a" />
        <span>支付说明</span>
      </div>
      <ul class="tips-list">
        <li>请在有效期内完成支付，超时后订单将自动取消</li>
        <li>支付成功后，新合同将立即生效</li>
        <li>如需发票，请在支付完成后前往"我的-发票"申请</li>
        <li>如有问题请联系客服：400-123-4567</li>
      </ul>
    </div>

    <div class="footer-bar">
      <van-button type="default" size="large" class="cancel-btn" @click="handleCancel">取消支付</van-button>
      <van-button type="primary" size="large" class="success-btn" @click="handleMockPaySuccess" :loading="mocking">模拟支付成功</van-button>
    </div>

    <van-popup v-model:show="showSuccessPopup" round position="center" :style="{ width: '80%', padding: '24px' }">
      <div class="success-popup">
        <div class="success-icon">
          <van-icon name="checked" size="48" color="#07c160" />
        </div>
        <div class="success-title">支付成功</div>
        <div class="success-desc">您的续租申请已提交成功</div>
        <div class="success-info">
          <div class="info-item">
            <span class="info-label">订单号</span>
            <span class="info-value">{{ orderInfo?.orderId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">支付金额</span>
            <span class="info-value price">{{ orderInfo?.totalAmount.toFixed(2) }}</span>
          </div>
        </div>
        <van-button type="primary" size="large" block class="back-btn" @click="goBack">返回首页</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showConfirmDialog, showLoadingToast, closeToast } from 'vant';
import { confirmRenewalPayment } from '../api/rental';

const route = useRoute();
const router = useRouter();

const orderInfo = ref(null);
const countdownTime = ref(0);
const showSuccessPopup = ref(false);
const mocking = ref(false);

const mockOrderData = {
  orderId: route.query.orderId || 'ZL' + Date.now(),
  roomNumber: 'A栋1203室',
  duration: '12个月',
  months: 12,
  startDate: '2026-07-31',
  endDate: '2027-07-30',
  totalAmount: 43220.00,
  paymentMethod: route.query.method || 'wechat',
  paymentStatus: 'pending',
  expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${route.query.orderId || 'ZL' + Date.now()}`
};

const getPayMethodName = (method) => {
  const map = {
    wechat: '微信支付',
    alipay: '支付宝',
    bank: '银行卡支付'
  };
  return map[method] || '微信支付';
};

const getPayMethodIcon = (method) => {
  const map = {
    wechat: 'wechat',
    alipay: 'alipay',
    bank: 'balance-o'
  };
  return map[method] || 'wechat';
};

const getPayMethodColor = (method) => {
  const map = {
    wechat: '#07c160',
    alipay: '#1677ff',
    bank: '#ff976a'
  };
  return map[method] || '#07c160';
};

const handleCountdownFinish = () => {
  showConfirmDialog({
    title: '支付超时',
    message: '订单已超时，请重新提交续租申请',
    confirmButtonText: '重新申请',
    cancelButtonText: '返回首页'
  }).then(() => {
    router.replace('/renewal');
  }).catch(() => {
    router.replace('/renewal');
  });
};

const handleCancel = () => {
  showConfirmDialog({
    title: '确认取消',
    message: '取消后订单将关闭，确定要取消吗？',
    confirmButtonText: '确认取消',
    cancelButtonText: '继续支付'
  }).then(() => {
    router.replace('/renewal');
  }).catch(() => {
    // 用户点击继续支付
  });
};

const handleMockPaySuccess = async () => {
  mocking.value = true;
  showLoadingToast({
    message: '支付中...',
    forbidClick: true,
    duration: 0
  });

  try {
    if (orderInfo.value && orderInfo.value.orderId && orderInfo.value.orderId.startsWith('ZL')) {
      await confirmRenewalPayment({
        orderId: orderInfo.value.orderId
      });
    }

    setTimeout(() => {
      closeToast();
      mocking.value = false;
      showSuccessPopup.value = true;
    }, 1500);
  } catch (error) {
    closeToast();
    mocking.value = false;
    showToast('支付失败，请稍后重试');
  }
};

const goBack = () => {
  router.replace('/renewal');
};

const initOrder = () => {
  const savedOrder = localStorage.getItem('pendingOrder');
  if (savedOrder) {
    try {
      orderInfo.value = JSON.parse(savedOrder);
    } catch (e) {
      orderInfo.value = mockOrderData;
    }
  } else {
    orderInfo.value = mockOrderData;
  }

  if (orderInfo.value.expireTime) {
    const expireDate = new Date(orderInfo.value.expireTime);
    countdownTime.value = expireDate.getTime() - Date.now();
  }
};

onMounted(() => {
  initOrder();
});
</script>

<style scoped>
.payment-header {
  background: linear-gradient(135deg, #1989fa, #07c160);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.order-card {
  background: #fff;
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.order-room {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 8px;
}

.order-duration {
  font-size: 14px;
  color: #646566;
  margin-bottom: 8px;
}

.order-id {
  font-size: 12px;
  color: #969799;
}

.amount-card {
  background: linear-gradient(135deg, #e8f3ff, #e8fff3);
  margin: 12px;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
}

.amount-label {
  font-size: 14px;
  color: #646566;
  margin-bottom: 8px;
}

.amount-value {
  margin-bottom: 12px;
}

.currency {
  font-size: 20px;
  color: #ee0a24;
  font-weight: 600;
  margin-right: 4px;
}

.amount {
  font-size: 36px;
  color: #ee0a24;
  font-weight: 700;
}

.pay-method {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.8);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  color: #646566;
}

.qrcode-card {
  background: #fff;
  margin: 12px;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.qrcode-title {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 20px;
}

.qrcode-wrapper {
  width: 200px;
  height: 200px;
  margin: 0 auto 16px;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.qrcode-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qrcode-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.qrcode-tip {
  font-size: 14px;
  color: #969799;
  margin-bottom: 8px;
}

.countdown-wrapper {
  display: flex;
  justify-content: center;
}

.countdown-value {
  font-size: 24px;
  font-weight: 600;
  color: #ee0a24;
  font-family: 'DIN Alternate', sans-serif;
}

.tips-card {
  background: #fff;
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 12px;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  font-size: 13px;
  color: #646566;
  line-height: 1.8;
  padding-left: 16px;
  position: relative;
}

.tips-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #969799;
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.cancel-btn {
  flex: 1;
  border-radius: 24px;
}

.success-btn {
  flex: 2;
  border-radius: 24px;
}

.success-popup {
  text-align: center;
}

.success-icon {
  margin-bottom: 16px;
}

.success-title {
  font-size: 20px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 8px;
}

.success-desc {
  font-size: 14px;
  color: #646566;
  margin-bottom: 20px;
}

.success-info {
  background: #f7f8fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.info-label {
  color: #969799;
}

.info-value {
  color: #323233;
}

.back-btn {
  border-radius: 24px;
}
</style>
