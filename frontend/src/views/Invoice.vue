<template>
  <div class="page-container">
    <div class="header">
      <div class="header-title">发票申请</div>
      <div class="header-subtitle">选择订单并填写发票信息</div>
    </div>

    <div class="section-card">
      <div class="section-title">
        <span>选择订单</span>
        <span class="select-all" @click="toggleSelectAll">
          {{ isAllSelected ? '取消全选' : '全选' }}
        </span>
      </div>
      <div v-if="orders.length > 0" class="order-list">
        <div
          v-for="order in orders"
          :key="order.id"
          class="order-item"
          :class="{ active: selectedOrderIds.includes(order.id) }"
          @click="toggleOrder(order.id)"
        >
          <div class="order-left">
            <van-checkbox
              :model-value="selectedOrderIds.includes(order.id)"
              shape="square"
              @click.stop
            />
          </div>
          <div class="order-content">
            <div class="order-header">
              <van-tag type="primary" size="mini">{{ order.typeName }}</van-tag>
              <span class="order-id">{{ order.id }}</span>
            </div>
            <div class="order-info">{{ order.roomNumber }} · {{ order.period }}</div>
            <div class="order-time">{{ order.createTime }}</div>
          </div>
          <div class="order-right">
            <span class="order-amount price">{{ order.amount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      <div v-else class="empty-tip">
        <van-icon name="orders-o" size="40" color="#dcdee0" />
        <span>暂无可开票的订单</span>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">发票类型</div>
      <van-radio-group v-model="invoiceType">
        <div class="invoice-type-list">
          <div
            class="invoice-type-item"
            :class="{ active: invoiceType === 'personal' }"
            @click="invoiceType = 'personal'"
          >
            <div class="type-left">
              <van-icon name="user-o" size="24" :color="invoiceType === 'personal' ? '#1989fa' : '#969799'" />
              <div class="type-info">
                <div class="type-name">个人</div>
                <div class="type-desc">开具个人抬头发票</div>
              </div>
            </div>
            <van-radio name="personal" />
          </div>
          <div
            class="invoice-type-item"
            :class="{ active: invoiceType === 'company' }"
            @click="invoiceType = 'company'"
          >
            <div class="type-left">
              <van-icon name="business-o" size="24" :color="invoiceType === 'company' ? '#1989fa' : '#969799'" />
              <div class="type-info">
                <div class="type-name">企业单位</div>
                <div class="type-desc">开具企业抬头发票，需填写税号</div>
              </div>
            </div>
            <van-radio name="company" />
          </div>
        </div>
      </van-radio-group>
    </div>

    <div class="section-card">
      <div class="section-title">发票抬头</div>
      <van-cell-group inset class="form-group">
        <van-field
          v-model="invoiceTitle"
          placeholder="请输入发票抬头"
          label="抬头名称"
          :border="false"
        />
        <van-field
          v-if="invoiceType === 'company'"
          v-model="taxNumber"
          placeholder="请输入纳税人识别号"
          label="税号"
          :border="false"
        />
      </van-cell-group>
      <div v-if="savedTitles.length > 0" class="saved-titles">
        <div class="saved-titles-label">常用抬头</div>
        <div class="title-list">
          <div
            v-for="title in savedTitles"
            :key="title.id"
            class="title-item"
            @click="selectSavedTitle(title)"
          >
            <div class="title-name">{{ title.title }}</div>
            <div v-if="title.taxNumber" class="title-tax">{{ title.taxNumber }}</div>
            <van-tag v-if="title.isDefault" type="success" size="mini" round>默认</van-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">收件地址</div>
      <div v-if="addresses.length > 0" class="address-list">
        <div
          v-for="address in addresses"
          :key="address.id"
          class="address-item"
          :class="{ active: selectedAddressId === address.id }"
          @click="selectedAddressId = address.id"
        >
          <div class="address-left">
            <van-radio :name="address.id" v-model="selectedAddressId" />
          </div>
          <div class="address-content">
            <div class="address-header">
              <span class="address-name">{{ address.name }}</span>
              <span class="address-phone">{{ address.phone }}</span>
              <van-tag v-if="address.isDefault" type="success" size="mini" round>默认</van-tag>
            </div>
            <div class="address-detail">
              {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-tip">
        <van-icon name="location-o" size="40" color="#dcdee0" />
        <span>暂无收件地址</span>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">备注</div>
      <van-field
        v-model="remark"
        type="textarea"
        placeholder="选填，请输入备注信息"
        :autosize="{ maxHeight: 120 }"
        show-word-limit
        maxlength="200"
        :border="false"
      />
    </div>

    <div class="footer-bar">
      <div class="footer-left">
        <div class="footer-label">开票金额</div>
        <div class="footer-price">
          <span class="price">{{ totalAmount.toFixed(2) }}</span>
        </div>
      </div>
      <van-button
        type="primary"
        size="large"
        class="submit-btn"
        :disabled="!canSubmit || submitting"
        @click="handleSubmit"
        :loading="submitting"
      >
        提交申请
      </van-button>
    </div>

    <van-popup
      v-model:show="showSuccessPopup"
      round
      position="bottom"
      :style="{ height: '70%', padding: '20px' }"
    >
      <div v-if="invoiceResult" class="success-popup">
        <div class="success-icon">
          <van-icon name="checked" size="48" color="#07c160" />
        </div>
        <div class="success-title">提交成功</div>
        <div class="success-subtitle">{{ invoiceResult.expectedDelivery }}</div>

        <div class="invoice-info-card">
          <div class="info-row">
            <span class="info-label">发票编号</span>
            <span class="info-value">{{ invoiceResult.invoiceId }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">发票类型</span>
            <span class="info-value">{{ invoiceResult.invoiceType === 'personal' ? '个人' : '企业' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">发票抬头</span>
            <span class="info-value">{{ invoiceResult.invoiceTitle }}</span>
          </div>
          <div v-if="invoiceResult.taxNumber" class="info-row">
            <span class="info-label">税号</span>
            <span class="info-value">{{ invoiceResult.taxNumber }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">开票金额</span>
            <span class="info-value price">{{ invoiceResult.totalAmount.toFixed(2) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">订单数量</span>
            <span class="info-value">{{ invoiceResult.orderCount }} 笔</span>
          </div>
          <div class="info-divider"></div>
          <div class="info-row">
            <span class="info-label">收件人</span>
            <span class="info-value">{{ invoiceResult.address.name }} {{ invoiceResult.address.phone }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">收件地址</span>
            <span class="info-value address">{{ invoiceResult.address.fullAddress }}</span>
          </div>
          <div class="info-divider"></div>
          <div class="info-row">
            <span class="info-label">申请时间</span>
            <span class="info-value">{{ invoiceResult.createTime }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">当前状态</span>
            <van-tag type="warning" size="medium">{{ invoiceResult.statusName }}</van-tag>
          </div>
        </div>

        <van-button
          type="primary"
          size="large"
          block
          class="confirm-btn"
          @click="showSuccessPopup = false"
        >
          我知道了
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { showToast, showLoadingToast, closeToast } from 'vant';
import {
  getInvoiceOrders,
  getInvoiceTitles,
  getAddressList,
  submitInvoiceApplication
} from '../api/invoice';

const orders = ref([]);
const selectedOrderIds = ref([]);
const invoiceType = ref('personal');
const invoiceTitle = ref('');
const taxNumber = ref('');
const savedTitles = ref([]);
const addresses = ref([]);
const selectedAddressId = ref(null);
const remark = ref('');
const submitting = ref(false);
const showSuccessPopup = ref(false);
const invoiceResult = ref(null);

const isAllSelected = computed(() => {
  return orders.value.length > 0 && selectedOrderIds.value.length === orders.value.length;
});

const totalAmount = computed(() => {
  return orders.value
    .filter(order => selectedOrderIds.value.includes(order.id))
    .reduce((sum, order) => sum + order.amount, 0);
});

const canSubmit = computed(() => {
  return (
    selectedOrderIds.value.length > 0 &&
    invoiceTitle.value.trim() !== '' &&
    selectedAddressId.value !== null &&
    (invoiceType.value === 'personal' || taxNumber.value.trim() !== '')
  );
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedOrderIds.value = [];
  } else {
    selectedOrderIds.value = orders.value.map(order => order.id);
  }
};

const toggleOrder = (orderId) => {
  const index = selectedOrderIds.value.indexOf(orderId);
  if (index > -1) {
    selectedOrderIds.value.splice(index, 1);
  } else {
    selectedOrderIds.value.push(orderId);
  }
};

const selectSavedTitle = (title) => {
  invoiceType.value = title.type;
  invoiceTitle.value = title.title;
  taxNumber.value = title.taxNumber || '';
};

const handleSubmit = async () => {
  if (selectedOrderIds.value.length === 0) {
    showToast('请选择需要开票的订单');
    return;
  }
  if (!invoiceTitle.value.trim()) {
    showToast('请填写发票抬头');
    return;
  }
  if (invoiceType.value === 'company' && !taxNumber.value.trim()) {
    showToast('请填写纳税人识别号');
    return;
  }
  if (!selectedAddressId.value) {
    showToast('请选择收件地址');
    return;
  }

  submitting.value = true;
  showLoadingToast({
    message: '提交中...',
    forbidClick: true,
    duration: 0
  });

  try {
    const res = await submitInvoiceApplication({
      orderIds: selectedOrderIds.value,
      invoiceType: invoiceType.value,
      invoiceTitle: invoiceTitle.value.trim(),
      taxNumber: taxNumber.value.trim(),
      addressId: selectedAddressId.value,
      remark: remark.value.trim()
    });

    closeToast();

    if (res.data.code === 200) {
      invoiceResult.value = res.data.data;
      showSuccessPopup.value = true;
    } else {
      showToast(res.data.message || '提交失败');
    }
  } catch (error) {
    closeToast();
    showToast('网络错误，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

const fetchData = async () => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  });

  try {
    const [ordersRes, titlesRes, addressesRes] = await Promise.all([
      getInvoiceOrders(),
      getInvoiceTitles(),
      getAddressList()
    ]);

    if (ordersRes.data.code === 200) {
      orders.value = ordersRes.data.data.orders;
    }
    if (titlesRes.data.code === 200) {
      savedTitles.value = titlesRes.data.data.titles;
      const defaultTitle = savedTitles.value.find(t => t.isDefault);
      if (defaultTitle) {
        selectSavedTitle(defaultTitle);
      }
    }
    if (addressesRes.data.code === 200) {
      addresses.value = addressesRes.data.data.addresses;
      const defaultAddr = addresses.value.find(a => a.isDefault);
      if (defaultAddr) {
        selectedAddressId.value = defaultAddr.id;
      }
    }
  } catch (error) {
    showToast('网络错误，请稍后重试');
  } finally {
    closeToast();
  }
};

onMounted(() => {
  fetchData();
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

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-all {
  font-size: 14px;
  color: #1989fa;
  font-weight: 500;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 2px solid #ebedf0;
  border-radius: 10px;
  transition: all 0.3s;
}

.order-item.active {
  border-color: #1989fa;
  background: #e8f3ff;
}

.order-left {
  margin-right: 10px;
}

.order-content {
  flex: 1;
  min-width: 0;
}

.order-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.order-id {
  font-size: 12px;
  color: #969799;
}

.order-info {
  font-size: 14px;
  color: #323233;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-time {
  font-size: 12px;
  color: #969799;
}

.order-right {
  margin-left: 10px;
}

.order-amount {
  font-size: 18px;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 0;
  color: #969799;
  font-size: 14px;
}

.invoice-type-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.invoice-type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 2px solid #ebedf0;
  border-radius: 10px;
  transition: all 0.3s;
}

.invoice-type-item.active {
  border-color: #1989fa;
  background: #e8f3ff;
}

.type-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-name {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 2px;
}

.type-desc {
  font-size: 12px;
  color: #969799;
}

.form-group {
  background: #f7f8fa !important;
  border-radius: 8px;
  margin-bottom: 12px;
}

.saved-titles {
  margin-top: 12px;
}

.saved-titles-label {
  font-size: 13px;
  color: #969799;
  margin-bottom: 8px;
}

.title-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f7f8fa;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.3s;
}

.title-item:active {
  border-color: #1989fa;
  background: #e8f3ff;
}

.title-name {
  font-size: 14px;
  color: #323233;
  font-weight: 500;
  flex: 1;
}

.title-tax {
  font-size: 12px;
  color: #969799;
  width: 100%;
  margin-top: 2px;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.address-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border: 2px solid #ebedf0;
  border-radius: 10px;
  transition: all 0.3s;
}

.address-item.active {
  border-color: #1989fa;
  background: #e8f3ff;
}

.address-left {
  margin-right: 10px;
  padding-top: 2px;
}

.address-content {
  flex: 1;
  min-width: 0;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.address-name {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
}

.address-phone {
  font-size: 14px;
  color: #646566;
}

.address-detail {
  font-size: 13px;
  color: #646566;
  line-height: 1.5;
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

.success-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #e8f8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.success-title {
  font-size: 20px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
}

.success-subtitle {
  font-size: 13px;
  color: #969799;
  margin-bottom: 20px;
}

.invoice-info-card {
  width: 100%;
  background: #f7f8fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  flex: 1;
  overflow-y: auto;
}

.invoice-info-card .info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  font-size: 14px;
}

.invoice-info-card .info-label {
  color: #969799;
  flex-shrink: 0;
  margin-right: 12px;
}

.invoice-info-card .info-value {
  color: #323233;
  text-align: right;
  max-width: 200px;
  word-break: break-all;
}

.invoice-info-card .info-value.address {
  line-height: 1.5;
}

.info-divider {
  height: 1px;
  background: #ebedf0;
  margin: 4px 0;
}

.confirm-btn {
  border-radius: 24px;
}
</style>
