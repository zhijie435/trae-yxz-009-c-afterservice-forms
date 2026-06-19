<template>
  <div class="after-sales-detail">
    <div class="header">
      <van-nav-bar
        title="工单详情"
        left-text="返回"
        left-arrow
        @click-left="onBack"
      >
        <template #right>
          <van-icon name="service-o" size="20" @click="showServicePopup = true" />
        </template>
      </van-nav-bar>
    </div>

    <div v-if="loading" class="content">
      <div style="text-align: center; padding: 40px; color: #969799;">
        加载中...
      </div>
    </div>

    <div v-else-if="error" class="content">
      <div style="text-align: center; padding: 40px; color: #ee0a24;">
        加载失败：{{ error }}
      </div>
    </div>

    <div v-else-if="orderDetail" class="content">
      <div class="status-card">
        <div class="status-left">
          <div class="status-icon">
            <van-icon name="service-o" size="28" />
          </div>
          <div class="status-info">
            <div class="status-text" :style="{ color: orderDetail.statusColor }">
              {{ orderDetail.statusText }}
            </div>
            <div class="order-no">工单号：{{ orderDetail.orderNo }}</div>
          </div>
        </div>
        <div class="status-priority" :class="orderDetail.priority">
          {{ orderDetail.priorityText }}
        </div>
      </div>

      <div class="info-card">
        <div class="card-title">
          <span>工单信息</span>
          <van-tag size="medium" type="primary" plain round>
            {{ orderDetail.typeName }}
          </van-tag>
        </div>
        <div class="order-title">{{ orderDetail.title }}</div>
        <div class="order-description">{{ orderDetail.description }}</div>
        <div class="info-row">
          <span class="label">关联单号</span>
          <span class="value mono">{{ orderDetail.relatedOrderNo || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="label">房屋</span>
          <span class="value">{{ orderDetail.roomNumber }}</span>
        </div>
        <div class="info-row">
          <span class="label">提交时间</span>
          <span class="value">{{ orderDetail.createTime }}</span>
        </div>
        <div class="info-row" v-if="orderDetail.estimatedResolveTime">
          <span class="label">预计解决</span>
          <span class="value highlight">{{ orderDetail.estimatedResolveTime }}</span>
        </div>
      </div>

      <div class="info-card" v-if="orderDetail.handler && orderDetail.handler.name">
        <div class="card-title">处理人员</div>
        <div class="handler-info">
          <div class="handler-avatar">
            <van-icon name="user-o" size="24" />
          </div>
          <div class="handler-detail">
            <div class="handler-name">{{ orderDetail.handler.name }}</div>
            <div class="handler-role">{{ orderDetail.handler.role }}</div>
          </div>
          <van-button
            type="primary"
            size="small"
            icon="phone-o"
            @click="callHandler(orderDetail.handler.phone)"
          >
            联系
          </van-button>
        </div>
      </div>

      <div class="info-card">
        <div class="card-title">
          服务进度
          <van-tag size="medium" type="primary" plain round>
            {{ orderDetail.statusTracks.length }}个节点
          </van-tag>
        </div>
        <div class="timeline">
          <div
            v-for="(track, idx) in reversedTracks"
            :key="idx"
            class="timeline-item"
            :class="{ active: idx === 0, last: idx === reversedTracks.length - 1 }"
          >
            <div class="timeline-dot" :class="getTrackTypeClass(track.type)">
              <van-icon :name="getTrackIcon(track.status)" size="14" />
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-title">{{ track.statusText }}</span>
                <span class="timeline-time">{{ track.time }}</span>
              </div>
              <div class="timeline-desc">{{ track.description }}</div>
              <div class="timeline-operator">操作人：{{ track.operator }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="card-title">
          补充凭证
          <van-tag size="medium" type="warning" plain round>
            {{ vouchers.length }}张
          </van-tag>
        </div>
        <div class="voucher-grid">
          <div
            v-for="(voucher, idx) in vouchers"
            :key="voucher.id"
            class="voucher-item"
          >
            <img
              :src="voucher.url"
              class="voucher-image"
              @click="previewImage(vouchers.map(v => v.url), idx)"
            />
            <div class="voucher-name">{{ voucher.name }}</div>
            <div class="voucher-time">{{ voucher.uploadTime }}</div>
          </div>
          <div class="voucher-add" @click="handleAddVoucher">
            <van-icon name="photograph" size="24" color="#969799" />
            <span class="add-text">上传凭证</span>
          </div>
        </div>
        <div class="voucher-tip">
          <van-icon name="info-o" size="12" color="#969799" />
          <span>上传照片、视频等凭证，有助于更快解决问题</span>
        </div>
      </div>

      <div class="info-card" v-if="orderDetail.serviceRating">
        <div class="card-title">服务评价</div>
        <div class="rating-section">
          <div class="rating-stars">
            <van-rate v-model="serviceRating" readonly size="24" />
            <span class="rating-score">{{ serviceRating }}分</span>
          </div>
          <div class="rating-comment" v-if="orderDetail.comment">
            {{ orderDetail.comment }}
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-bar" v-if="orderDetail">
      <template v-if="orderDetail.status === 'completed' && !orderDetail.serviceRating">
        <van-button
          block
          type="warning"
          size="large"
          @click="showRatingPopup = true"
        >
          去评价
        </van-button>
      </template>
      <template v-else>
        <van-button
          block
          type="primary"
          size="large"
          icon="service-o"
          @click="showServicePopup = true"
        >
          联系客服
        </van-button>
      </template>
    </div>

    <van-popup v-model:show="showServicePopup" round position="bottom" :style="{ height: '70%' }">
      <div class="service-popup">
        <div class="popup-title">
          <span>联系客服</span>
          <van-icon name="close" size="20" @click="showServicePopup = false" />
        </div>

        <div class="service-options">
          <div class="service-item" @click="handleCallService">
            <div class="service-icon phone">
              <van-icon name="phone-o" size="24" />
            </div>
            <div class="service-content">
              <div class="service-name">客服电话</div>
              <div class="service-desc">{{ customerService.phone }} · {{ customerService.serviceTime }}</div>
            </div>
            <van-icon name="arrow" />
          </div>

          <div class="service-item" @click="handleOnlineService">
            <div class="service-icon chat">
              <van-icon name="chat-o" size="24" />
            </div>
            <div class="service-content">
              <div class="service-name">在线客服</div>
              <div class="service-desc">实时在线，快速响应</div>
            </div>
            <van-icon name="arrow" />
          </div>

          <div class="service-item" @click="handleWechatService">
            <div class="service-icon wechat">
              <van-icon name="wechat" size="24" />
            </div>
            <div class="service-content">
              <div class="service-name">微信客服</div>
              <div class="service-desc">微信号：{{ customerService.wechatService }}</div>
            </div>
            <van-icon name="arrow" />
          </div>
        </div>

        <div class="contact-form">
          <div class="form-title">快速留言</div>
          <van-field
            v-model="contactType"
            is-link
            readonly
            label="类型"
            :value="contactTypeText"
            placeholder="请选择类型"
            @click="showTypePicker = true"
          />
          <van-field
            v-model="contactContent"
            label="内容"
            type="textarea"
            rows="3"
            maxlength="200"
            placeholder="请描述您的问题"
            show-word-limit
          />
          <van-field
            v-model="contactPhone"
            label="联系电话"
            placeholder="请输入联系电话"
            type="tel"
          />
          <van-button
            block
            type="primary"
            size="large"
            :loading="submittingContact"
            @click="handleSubmitContact"
          >
            提交留言
          </van-button>
        </div>

        <div class="faq-section">
          <div class="faq-title">常见问题</div>
          <div
            v-for="(faq, idx) in customerService.faqs"
            :key="idx"
            class="faq-item"
          >
            <div class="faq-q">Q：{{ faq.q }}</div>
            <div class="faq-a">A：{{ faq.a }}</div>
          </div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model:show="showRatingPopup" round position="bottom" :style="{ height: '60%' }">
      <div class="rating-popup">
        <div class="popup-title">
          <span>服务评价</span>
          <van-icon name="close" size="20" @click="showRatingPopup = false" />
        </div>
        <div class="rating-form">
          <div class="rating-item">
            <span class="rating-label">服务评分</span>
            <van-rate v-model="serviceRating" size="32" />
          </div>
          <van-field
            v-model="ratingComment"
            type="textarea"
            rows="4"
            maxlength="200"
            placeholder="说说您的使用体验吧~"
            show-word-limit
          />
          <van-button
            block
            type="primary"
            size="large"
            :loading="submittingRating"
            :disabled="serviceRating === 0"
            @click="handleSubmitRating"
          >
            提交评价
          </van-button>
        </div>
      </div>
    </van-popup>

    <van-popup v-model:show="showTypePicker" round position="bottom">
      <van-picker
        :columns="contactTypeOptions"
        title="选择类型"
        @confirm="onTypeConfirm"
        @cancel="showTypePicker = false"
      />
    </van-popup>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      multiple
      style="display: none"
      @change="onFileChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  showToast,
  showConfirmDialog,
  showSuccessToast,
  showFailToast,
  ImagePreview
} from 'vant';
import {
  getAfterSalesDetail,
  uploadVoucher,
  getCustomerService,
  contactService,
  submitRating,
  uploadImage
} from '../api/afterSales';

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const error = ref('');
const orderDetail = ref(null);
const vouchers = ref([]);
const customerService = ref({
  phone: '',
  serviceTime: '',
  wechatService: '',
  faqs: [],
  contactTypes: []
});

const showServicePopup = ref(false);
const showRatingPopup = ref(false);
const showTypePicker = ref(false);
const fileInputRef = ref(null);

const contactType = ref('');
const contactContent = ref('');
const contactPhone = ref('');
const submittingContact = ref(false);

const serviceRating = ref(0);
const ratingComment = ref('');
const submittingRating = ref(false);

const contactTypeOptions = computed(() => {
  return customerService.value.contactTypes || [
    { text: '咨询', value: 'consult' },
    { text: '投诉', value: 'complaint' },
    { text: '紧急求助', value: 'urgent' },
    { text: '建议反馈', value: 'suggestion' }
  ];
});

const contactTypeText = computed(() => {
  const item = contactTypeOptions.value.find(o => o.value === contactType.value);
  return item ? item.text : '';
});

const reversedTracks = computed(() => {
  if (!orderDetail.value?.statusTracks) return [];
  return [...orderDetail.value.statusTracks].reverse();
});

const getTrackTypeClass = (type) => {
  const classMap = {
    system: 'system',
    customer_service: 'service',
    user: 'user'
  };
  return classMap[type] || 'system';
};

const getTrackIcon = (status) => {
  const iconMap = {
    submitted: 'checked',
    accepted: 'user-o',
    processing: 'clock-o',
    completed: 'success',
    rejected: 'close',
    voucher_added: 'photo-o',
    user_message: 'chat-o',
    rated: 'star-o'
  };
  return iconMap[status] || 'info-o';
};

const onBack = () => {
  router.back();
};

const fetchOrderDetail = async () => {
  loading.value = true;
  error.value = '';
  const orderId = route.query.orderId || 'AS20260615001';
  try {
    const res = await getAfterSalesDetail(orderId);
    if (res.data.code === 200) {
      orderDetail.value = res.data.data;
      vouchers.value = [...res.data.data.vouchers];
      if (res.data.data.serviceRating) {
        serviceRating.value = res.data.data.serviceRating;
      }
    } else {
      error.value = res.data.message || '获取工单详情失败';
    }
  } catch (e) {
    error.value = e.message || '网络错误';
    showFailToast('获取工单详情失败');
  } finally {
    loading.value = false;
  }
};

const fetchCustomerService = async () => {
  try {
    const res = await getCustomerService();
    if (res.data.code === 200) {
      customerService.value = res.data.data;
    }
  } catch (e) {
    console.error('获取客服信息失败', e);
  }
};

const callHandler = (phone) => {
  showConfirmDialog({
    title: '确认拨打',
    message: `是否拨打处理人员电话 ${phone}？`,
  }).then(() => {
    window.location.href = `tel:${phone}`;
  }).catch(() => {});
};

const previewImage = (images, index) => {
  ImagePreview({
    images,
    startPosition: index,
  });
};

const handleAddVoucher = () => {
  fileInputRef.value?.click();
};

const onFileChange = async (e) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const orderId = route.query.orderId || 'AS20260615001';

  for (const file of files) {
    try {
      const uploadRes = await uploadImage(file);
      const res = await uploadVoucher({
        orderId,
        type: 'image',
        url: uploadRes.url,
        name: file.name
      });
      if (res.data.code === 200) {
        vouchers.value.push(res.data.data.voucher);
        if (orderDetail.value) {
          orderDetail.value.statusTracks.push(res.data.data.statusTrack);
        }
        showSuccessToast('凭证上传成功');
      }
    } catch (err) {
      showFailToast('凭证上传失败');
    }
  }

  e.target.value = '';
};

const handleCallService = () => {
  showConfirmDialog({
    title: '拨打客服电话',
    message: `${customerService.value.phone}\n服务时间：${customerService.value.serviceTime}`,
  }).then(() => {
    window.location.href = `tel:${customerService.value.phone}`;
  }).catch(() => {});
};

const handleOnlineService = () => {
  showToast('正在连接在线客服...');
  setTimeout(() => {
    showToast('在线客服已就绪');
  }, 1000);
};

const handleWechatService = () => {
  showToast(`微信号：${customerService.value.wechatService}`);
};

const onTypeConfirm = (value) => {
  contactType.value = value[0].value;
  showTypePicker.value = false;
};

const handleSubmitContact = async () => {
  if (!contactType.value) {
    showToast('请选择联系类型');
    return;
  }
  if (!contactContent.value) {
    showToast('请输入内容');
    return;
  }
  if (!contactPhone.value) {
    showToast('请输入联系电话');
    return;
  }

  submittingContact.value = true;
  try {
    const res = await contactService({
      orderId: route.query.orderId,
      type: contactType.value,
      content: contactContent.value,
      contact: contactPhone.value
    });
    if (res.data.code === 200) {
      showSuccessToast(res.data.data.message);
      showServicePopup.value = false;
      contactType.value = '';
      contactContent.value = '';
      contactPhone.value = '';
      fetchOrderDetail();
    }
  } catch (e) {
    showFailToast('发送失败');
  } finally {
    submittingContact.value = false;
  }
};

const handleSubmitRating = async () => {
  if (serviceRating.value === 0) {
    showToast('请选择评分');
    return;
  }

  submittingRating.value = true;
  try {
    const res = await submitRating({
      orderId: route.query.orderId || 'AS20260615001',
      rating: serviceRating.value,
      comment: ratingComment.value
    });
    if (res.data.code === 200) {
      showSuccessToast('评价提交成功');
      showRatingPopup.value = false;
      if (orderDetail.value) {
        orderDetail.value.serviceRating = serviceRating.value;
        orderDetail.value.comment = ratingComment.value;
        orderDetail.value.statusTracks.push(res.data.data.statusTrack);
      }
    }
  } catch (e) {
    showFailToast('评价失败');
  } finally {
    submittingRating.value = false;
  }
};

onMounted(() => {
  fetchOrderDetail();
  fetchCustomerService();
});
</script>

<style scoped>
.after-sales-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(135deg, #1989fa, #07c160);
}

.header :deep(.van-nav-bar) {
  background: transparent;
}

.header :deep(.van-nav-bar__title),
.header :deep(.van-nav-bar__text),
.header :deep(.van-nav-bar .van-icon) {
  color: #fff;
}

.content {
  padding: 12px;
}

.status-card {
  background: linear-gradient(135deg, #1989fa, #07c160);
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #fff !important;
}

.order-no {
  font-size: 13px;
  opacity: 0.9;
}

.status-priority {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.2);
}

.status-priority.high {
  background: rgba(255, 77, 79, 0.8);
}

.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 8px;
  line-height: 1.4;
}

.order-description {
  font-size: 14px;
  color: #646566;
  line-height: 1.6;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f2f3f5;
}

.info-row {
  display: flex;
  padding: 8px 0;
  font-size: 14px;
}

.label {
  color: #969799;
  width: 80px;
  flex-shrink: 0;
}

.value {
  color: #323233;
  flex: 1;
}

.value.mono {
  font-family: monospace;
}

.value.highlight {
  color: #07c160;
  font-weight: 500;
}

.handler-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.handler-avatar {
  width: 48px;
  height: 48px;
  background: #f2f3f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #969799;
}

.handler-detail {
  flex: 1;
}

.handler-name {
  font-size: 15px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 2px;
}

.handler-role {
  font-size: 12px;
  color: #969799;
}

.timeline {
  position: relative;
  padding-left: 8px;
}

.timeline-item {
  display: flex;
  gap: 12px;
  padding-bottom: 20px;
  position: relative;
}

.timeline-item:not(.last)::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 32px;
  bottom: 0;
  width: 2px;
  background: #ebedf0;
}

.timeline-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  position: relative;
  z-index: 1;
}

.timeline-dot.system {
  background: linear-gradient(135deg, #1989fa, #07c160);
}

.timeline-dot.service {
  background: linear-gradient(135deg, #ff976a, #ff6b35);
}

.timeline-dot.user {
  background: linear-gradient(135deg, #7232dd, #a050ff);
}

.timeline-item.active .timeline-dot {
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.4);
}

.timeline-content {
  flex: 1;
  padding-top: 4px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.timeline-title {
  font-size: 14px;
  font-weight: 600;
  color: #323233;
}

.timeline-item.active .timeline-title {
  color: #1989fa;
}

.timeline-time {
  font-size: 12px;
  color: #969799;
}

.timeline-desc {
  font-size: 13px;
  color: #646566;
  line-height: 1.5;
  margin-bottom: 4px;
}

.timeline-operator {
  font-size: 12px;
  color: #c8c9cc;
}

.voucher-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.voucher-item {
  width: 90px;
}

.voucher-image {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 6px;
}

.voucher-name {
  font-size: 11px;
  color: #646566;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  margin-bottom: 2px;
}

.voucher-time {
  font-size: 10px;
  color: #c8c9cc;
  text-align: center;
}

.voucher-add {
  width: 90px;
  height: 90px;
  border: 1px dashed #dcdee0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s;
}

.voucher-add:active {
  background: #f0f0f0;
}

.add-text {
  font-size: 12px;
  color: #969799;
}

.voucher-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  font-size: 12px;
  color: #c8c9cc;
}

.rating-section {
  text-align: center;
  padding: 10px 0;
}

.rating-stars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.rating-score {
  font-size: 16px;
  color: #ff976a;
  font-weight: bold;
}

.rating-comment {
  margin-top: 10px;
  font-size: 14px;
  color: #646566;
  line-height: 1.5;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 16px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 50;
}

.service-popup {
  height: 100%;
  overflow-y: auto;
  padding: 0 16px 20px;
}

.popup-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  font-size: 16px;
  font-weight: bold;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
}

.service-options {
  margin-bottom: 16px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #f2f3f5;
}

.service-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.service-icon.phone {
  background: #1989fa;
}

.service-icon.chat {
  background: #07c160;
}

.service-icon.wechat {
  background: #07c160;
}

.service-content {
  flex: 1;
}

.service-name {
  font-size: 15px;
  color: #323233;
  margin-bottom: 2px;
}

.service-desc {
  font-size: 12px;
  color: #969799;
}

.contact-form {
  margin-bottom: 20px;
}

.form-title {
  font-size: 15px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 12px;
}

.faq-section {
  margin-top: 16px;
}

.faq-title {
  font-size: 15px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 12px;
}

.faq-item {
  padding: 10px 0;
  border-bottom: 1px solid #f2f3f5;
}

.faq-q {
  font-size: 14px;
  color: #323233;
  margin-bottom: 4px;
  font-weight: 500;
}

.faq-a {
  font-size: 13px;
  color: #646566;
  line-height: 1.5;
}

.rating-popup {
  height: 100%;
  overflow-y: auto;
  padding: 0 16px 20px;
}

.rating-form {
  padding-top: 10px;
}

.rating-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}

.rating-label {
  font-size: 15px;
  color: #323233;
}
</style>
