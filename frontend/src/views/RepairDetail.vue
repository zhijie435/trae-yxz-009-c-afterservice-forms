<template>
  <div class="repair-detail">
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
            <van-icon name="wrench-o" size="28" />
          </div>
          <div class="status-info">
            <div class="status-text" :style="{ color: orderDetail.statusColor }">
              {{ orderDetail.statusText }}
            </div>
            <div class="order-no">工单号：{{ orderDetail.orderNo }}</div>
          </div>
        </div>
        <div class="status-time">
          {{ orderDetail.createTime }}
        </div>
      </div>

      <div class="info-card">
        <div class="card-title">维修信息</div>
        <div class="info-row">
          <span class="label">故障类型</span>
          <span class="value">{{ orderDetail.typeName }} - {{ orderDetail.subTypeName }}</span>
        </div>
        <div class="info-row">
          <span class="label">房屋地址</span>
          <span class="value">{{ orderDetail.roomNumber }}</span>
        </div>
        <div class="info-row">
          <span class="label">预约时间</span>
          <span class="value">{{ orderDetail.appointmentTime }}</span>
        </div>
        <div class="info-row desc-row">
          <span class="label">故障描述</span>
          <span class="value">{{ orderDetail.description }}</span>
        </div>
        <div class="image-list" v-if="orderDetail.images && orderDetail.images.length">
          <img
            v-for="(img, idx) in orderDetail.images"
            :key="idx"
            :src="img"
            class="repair-image"
            @click="previewImage(orderDetail.images, idx)"
          />
        </div>
      </div>

      <div class="info-card" v-if="orderDetail.worker && orderDetail.worker.name">
        <div class="card-title">维修人员</div>
        <div class="worker-info">
          <div class="worker-avatar">
            <van-icon name="user-o" size="24" />
          </div>
          <div class="worker-detail">
            <div class="worker-name">{{ orderDetail.worker.name }}</div>
            <div class="worker-skill">{{ orderDetail.worker.skill }}</div>
          </div>
          <van-button
            type="primary"
            size="small"
            icon="phone-o"
            @click="callWorker(orderDetail.worker.phone)"
          >
            联系
          </van-button>
        </div>
      </div>

      <div class="info-card" v-if="orderDetail.fee && orderDetail.status === 'completed'">
        <div class="card-title">
          费用明细
          <span class="fee-total">共 ¥{{ orderDetail.fee }}</span>
        </div>
        <div
          v-for="(item, idx) in orderDetail.feeDetail"
          :key="idx"
          class="fee-item"
        >
          <span>{{ item.name }}</span>
          <span class="fee-amount">¥{{ item.amount }}</span>
        </div>
        <div class="guarantee-tip">
          <van-icon name="shield-o" color="#07c160" />
          <span> 质保期{{ orderDetail.guaranteeDays }}天，非人为损坏免费返修</span>
        </div>
      </div>

      <div class="info-card">
        <div class="card-title">
          服务进度
          <van-tag
            size="medium"
            type="primary"
            plain
            round
          >
            {{ orderDetail.statusTracks.length }}个节点
          </van-tag>
        </div>
        <van-steps direction="vertical" :active="orderDetail.statusTracks.length - 1">
          <van-step
            v-for="(track, idx) in orderDetail.statusTracks"
            :key="idx"
          >
            <template #title>
              <div class="step-title">
                <span>{{ track.statusText }}</span>
                <span class="step-time">{{ track.time }}</span>
              </div>
            </template>
            <template #description>
              <div class="step-desc">
                <div>{{ track.description }}</div>
                <div class="step-operator">操作人：{{ track.operator }}</div>
              </div>
            </template>
          </van-step>
        </van-steps>
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
            <img :src="voucher.url" class="voucher-image" @click="previewImage(vouchers.map(v => v.url), idx)" />
            <div class="voucher-name">{{ voucher.name }}</div>
          </div>
          <div class="voucher-add" @click="handleAddVoucher">
            <van-icon name="photograph" size="24" color="#969799" />
            <span class="add-text">上传凭证</span>
          </div>
        </div>
        <div class="voucher-tip">
          上传照片、视频等凭证，有助于维修人员更快定位问题
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
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast, showConfirmDialog, showSuccessToast, showFailToast, ImagePreview } from 'vant';
import {
  getRepairOrderDetail,
  uploadVoucher,
  getCustomerService,
  contactService,
  submitRating,
  uploadImage
} from '../api/repair';

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
  faqs: []
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

const contactTypeOptions = [
  { text: '咨询', value: 'consult' },
  { text: '投诉', value: 'complaint' },
  { text: '紧急求助', value: 'urgent' }
];

const contactTypeText = computed(() => {
  const item = contactTypeOptions.find(o => o.value === contactType.value);
  return item ? item.text : '';
});

const onBack = () => {
  router.back();
};

const fetchOrderDetail = async () => {
  loading.value = true;
  error.value = '';
  const orderId = route.query.orderId || 'BX20260115001';
  try {
    const res = await getRepairOrderDetail(orderId);
    if (res.data.code === 200) {
      orderDetail.value = res.data.data;
      vouchers.value = [...res.data.data.vouchers];
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

const callWorker = (phone) => {
  showConfirmDialog({
    title: '确认拨打',
    message: `是否拨打维修人员电话 ${phone}？`,
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

  const orderId = route.query.orderId || 'BX20260115001';

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
      orderId: route.query.orderId || 'BX20260115001',
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
.repair-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 60px;
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

.status-time {
  font-size: 12px;
  opacity: 0.8;
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

.fee-total {
  font-size: 14px;
  color: #ff976a;
  font-weight: normal;
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

.desc-row .value {
  line-height: 1.5;
}

.image-list {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.repair-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.worker-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.worker-avatar {
  width: 48px;
  height: 48px;
  background: #f2f3f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #969799;
}

.worker-detail {
  flex: 1;
}

.worker-name {
  font-size: 15px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 2px;
}

.worker-skill {
  font-size: 12px;
  color: #969799;
}

.fee-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: #646566;
}

.fee-amount {
  color: #323233;
}

.guarantee-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #07c160;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f2f3f5;
}

.step-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-time {
  font-size: 12px;
  color: #969799;
  font-weight: normal;
}

.step-desc {
  font-size: 13px;
  color: #646566;
}

.step-operator {
  margin-top: 4px;
  color: #969799;
  font-size: 12px;
}

.voucher-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.voucher-item {
  width: 80px;
}

.voucher-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 4px;
}

.voucher-name {
  font-size: 11px;
  color: #969799;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.voucher-add {
  width: 80px;
  height: 80px;
  border: 1px dashed #dcdee0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.add-text {
  font-size: 12px;
  color: #969799;
}

.voucher-tip {
  margin-top: 8px;
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
