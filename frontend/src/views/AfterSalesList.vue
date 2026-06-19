<template>
  <div class="page-container">
    <div class="header">
      <div class="header-title">售后工单</div>
      <div class="header-subtitle">跟踪您的售后申请处理进度</div>
    </div>

    <div class="filter-section">
      <van-tabs
        v-model:active="activeStatus"
        sticky
        swipeable
        :offset-top="0"
        @change="onStatusChange"
      >
        <van-tab
          v-for="status in statusList"
          :key="status.value"
          :title="status.text"
          :name="status.value"
        />
      </van-tabs>
    </div>

    <div class="type-filter">
      <van-dropdown-menu>
        <van-dropdown-item v-model="activeType" :options="typeList" @change="onTypeChange" />
      </van-dropdown-menu>
    </div>

    <div class="search-section">
      <van-search
        v-model="keyword"
        shape="round"
        placeholder="搜索工单编号、标题"
        @search="onSearch"
        @clear="onSearch"
      />
    </div>

    <div class="order-list" v-if="orderList.length > 0">
      <div
        v-for="order in orderList"
        :key="order.id"
        class="order-card"
        @click="goToDetail(order.id)"
      >
        <div class="card-header">
          <div class="order-type-tag" :class="order.type">
            <van-icon :name="getTypeIcon(order.type)" size="14" />
            <span>{{ order.typeName }}</span>
          </div>
          <van-tag :color="order.statusColor" size="medium" round>
            {{ order.statusText }}
          </van-tag>
        </div>

        <div class="order-title">{{ order.title }}</div>
        <div class="order-desc">{{ order.description }}</div>

        <div class="order-info">
          <div class="info-item">
            <span class="info-label">工单号</span>
            <span class="info-value mono">{{ order.orderNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">提交时间</span>
            <span class="info-value">{{ order.createTime }}</span>
          </div>
          <div class="info-item" v-if="order.handlerName">
            <span class="info-label">处理人</span>
            <span class="info-value">{{ order.handlerName }}</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="voucher-info" v-if="order.voucherCount > 0">
            <van-icon name="photo-o" size="12" color="#969799" />
            <span>{{ order.voucherCount }} 张凭证</span>
          </div>
          <div class="priority-tag" :class="order.priority" v-if="order.priority === 'high'">
            <van-icon name="warning-o" size="12" />
            <span>{{ order.priorityText }}</span>
          </div>
          <van-icon name="arrow" size="14" color="#c8c9cc" />
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="empty-section">
      <van-empty description="暂无售后工单" />
      <van-button type="primary" size="small" @click="goToCreate">提交售后申请</van-button>
    </div>

    <div v-if="loading" class="loading-section">
      <van-loading type="spinner" size="32px">加载中...</van-loading>
    </div>

    <div class="fab-btn" @click="goToCreate">
      <van-icon name="plus" size="24" color="#fff" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { getAfterSalesList, getAfterSalesTypes } from '../api/afterSales';

const router = useRouter();

const orderList = ref([]);
const loading = ref(false);
const keyword = ref('');
const activeStatus = ref('all');
const activeType = ref('all');

const statusList = ref([
  { value: 'all', text: '全部' },
  { value: 'pending', text: '待处理' },
  { value: 'processing', text: '处理中' },
  { value: 'completed', text: '已完成' },
  { value: 'rejected', text: '已驳回' }
]);

const typeList = ref([
  { text: '全部类型', value: 'all' },
  { text: '维修售后', value: 'repair' },
  { text: '退款售后', value: 'refund' },
  { text: '发票售后', value: 'invoice' },
  { text: '续租售后', value: 'renewal' },
  { text: '退租售后', value: 'termination' },
  { text: '其他问题', value: 'other' }
]);

const getTypeIcon = (type) => {
  const iconMap = {
    repair: 'service-o',
    refund: 'gold-coin-o',
    invoice: 'balance-list-o',
    renewal: 'replay',
    termination: 'log-out',
    other: 'info-o'
  };
  return iconMap[type] || 'info-o';
};

const fetchOrderList = async () => {
  loading.value = true;
  try {
    const res = await getAfterSalesList({
      status: activeStatus.value,
      type: activeType.value,
      keyword: keyword.value,
      page: 1,
      pageSize: 20
    });
    if (res.data.code === 200) {
      orderList.value = res.data.data.list;
    } else {
      showToast(res.data.message || '获取工单列表失败');
    }
  } catch (error) {
    showToast('网络错误，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const onStatusChange = () => {
  fetchOrderList();
};

const onTypeChange = () => {
  fetchOrderList();
};

const onSearch = () => {
  fetchOrderList();
};

const goToDetail = (orderId) => {
  router.push({
    path: '/after-sales-detail',
    query: { orderId }
  });
};

const goToCreate = () => {
  router.push('/after-sales-create');
};

onMounted(() => {
  fetchOrderList();
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

.filter-section {
  background: #fff;
}

.filter-section :deep(.van-tabs__nav) {
  background: #fff;
}

.filter-section :deep(.van-tab--active) {
  color: #1989fa;
}

.filter-section :deep(.van-tabs__line) {
  background: linear-gradient(90deg, #1989fa, #07c160);
}

.type-filter {
  background: #fff;
  border-top: 1px solid #ebedf0;
}

.search-section {
  padding: 12px;
  background: #f7f8fa;
}

.order-list {
  padding: 12px;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
}

.order-card:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-type-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.order-type-tag.repair {
  background: #fff3e8;
  color: #ff976a;
}

.order-type-tag.refund {
  background: #fff7e6;
  color: #ff976a;
}

.order-type-tag.invoice {
  background: #f0e9ff;
  color: #7232dd;
}

.order-type-tag.renewal {
  background: #e8f3ff;
  color: #1989fa;
}

.order-type-tag.termination {
  background: #ffecec;
  color: #ee0a24;
}

.order-type-tag.other {
  background: #f2f3f5;
  color: #646566;
}

.order-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 6px;
  line-height: 1.4;
}

.order-desc {
  font-size: 13px;
  color: #646566;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.order-info {
  background: #f7f8fa;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.info-label {
  font-size: 12px;
  color: #969799;
}

.info-value {
  font-size: 12px;
  color: #323233;
}

.info-value.mono {
  font-family: monospace;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #ebedf0;
}

.voucher-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #969799;
}

.priority-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  margin-right: auto;
  margin-left: 8px;
}

.priority-tag.high {
  background: #ffecec;
  color: #ee0a24;
}

.empty-section {
  text-align: center;
  padding: 60px 20px;
}

.empty-section .van-button {
  margin-top: 20px;
  border-radius: 20px;
}

.loading-section {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.fab-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1989fa, #07c160);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(25, 137, 250, 0.4);
  z-index: 100;
  transition: all 0.3s;
}

.fab-btn:active {
  transform: scale(0.9);
}
</style>
