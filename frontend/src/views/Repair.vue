<template>
  <div class="page-container">
    <div class="header">
      <div class="header-title">报修申请</div>
      <div class="header-subtitle">请选择故障类型并描述问题</div>
    </div>

    <div v-if="info" class="section-card">
      <div class="section-title">房屋信息</div>
      <div class="room-info">
        <div class="info-row">
          <span class="info-label">房屋</span>
          <span class="info-value">{{ info.currentContract.roomNumber }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">租客</span>
          <span class="info-value">{{ info.currentContract.tenantName }}</span>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">故障类型</div>
      <div class="fault-type-grid">
        <div
          v-for="type in info?.faultTypes || []"
          :key="type.id"
          class="fault-type-item"
          :class="{ active: selectedFaultType?.id === type.id }"
          @click="selectFaultType(type)"
        >
          <div class="type-icon">
            <span class="type-emoji">{{ iconMap[type.id] || '🔧' }}</span>
          </div>
          <div class="type-name">{{ type.name }}</div>
        </div>
      </div>

      <div v-if="selectedFaultType" class="sub-type-list">
        <div class="sub-type-title">具体问题</div>
        <div class="sub-type-items">
          <div
            v-for="sub in selectedFaultType.subTypes"
            :key="sub.id"
            class="sub-type-item"
            :class="{ active: selectedSubType?.id === sub.id }"
            @click="selectSubType(sub)"
          >
            <span>{{ sub.name }}</span>
            <van-icon v-if="selectedSubType?.id === sub.id" name="success" size="16" color="#07c160" />
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">
        <span>故障描述</span>
        <span class="desc-count">{{ description.length }}/500</span>
      </div>
      <textarea
        v-model="description"
        class="desc-textarea"
        placeholder="请详细描述故障情况，包括具体位置、发生时间等，方便维修人员提前准备..."
        maxlength="500"
        rows="4"
      ></textarea>
    </div>

    <div class="section-card">
      <div class="section-title">
        <span>上传图片/视频</span>
        <span class="upload-tip">最多{{ info?.maxImages || 9 }}张</span>
      </div>
      <div class="upload-grid">
        <div
          v-for="(img, index) in uploadedImages"
          :key="index"
          class="upload-item"
        >
          <img :src="img.url" :alt="img.name" class="upload-img" />
          <div class="upload-remove" @click="removeImage(index)">
            <van-icon name="cross" size="14" color="#fff" />
          </div>
        </div>
        <div
          v-if="uploadedImages.length < (info?.maxImages || 9)"
          class="upload-add"
          @click="triggerUpload"
        >
          <van-icon name="photograph" size="28" color="#c8c9cc" />
          <span class="upload-text">上传图片</span>
        </div>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*,video/*"
          multiple
          class="file-input"
          @change="handleFileChange"
        />
      </div>
      <div class="upload-hint">
        <van-icon name="info-o" size="12" color="#969799" />
        <span>上传清晰的图片或短视频，有助于快速定位问题</span>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">联系信息</div>
      <div class="contact-form">
        <div class="form-item">
          <label class="form-label">联系人</label>
          <input
            v-model="contactName"
            class="form-input"
            type="text"
            placeholder="请输入联系人姓名"
            maxlength="20"
          />
        </div>
        <div class="form-item">
          <label class="form-label">手机号</label>
          <input
            v-model="contactPhone"
            class="form-input"
            type="tel"
            placeholder="请输入联系手机号"
            maxlength="11"
          />
        </div>
        <div class="form-item" @click="showTimePicker = true">
          <label class="form-label">上门时间</label>
          <div class="form-input picker-value" :class="{ placeholder: !appointmentTime }">
            {{ appointmentTime || '请选择期望上门时间（选填）' }}
            <van-icon name="arrow" color="#969799" />
          </div>
        </div>
      </div>
    </div>

    <div class="notice-card">
      <div class="notice-title">
        <van-icon name="info-o" size="16" color="#1989fa" />
        <span>温馨提示</span>
      </div>
      <ul class="notice-list">
        <li>报修提交后，工作人员将在24小时内联系确认</li>
        <li>非人为损坏的维修服务免费，人为损坏需自行承担费用</li>
        <li>紧急情况请拨打维修热线：400-123-4567</li>
      </ul>
    </div>

    <div class="footer-bar">
      <van-button
        type="primary"
        size="large"
        class="submit-btn"
        :disabled="!canSubmit"
        @click="handleSubmit"
        :loading="submitting"
      >
        提交工单
      </van-button>
    </div>

    <van-popup v-model:show="showTimePicker" round position="bottom" :style="{ padding: '20px' }">
      <div class="time-picker-popup">
        <div class="popup-header">
          <span class="popup-cancel" @click="showTimePicker = false">取消</span>
          <span class="popup-title">选择上门时间</span>
          <span class="popup-confirm" @click="confirmTime">确定</span>
        </div>
        <div class="time-options">
          <div
            v-for="time in timeOptions"
            :key="time.value"
            class="time-option"
            :class="{ active: tempTime === time.value }"
            @click="tempTime = time.value"
          >
            {{ time.label }}
          </div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model:show="showSuccessPopup" round position="center" :style="{ width: '85%', padding: '24px' }">
      <div class="success-popup">
        <div class="success-icon">
          <van-icon name="checked" size="56" color="#07c160" />
        </div>
        <div class="success-title">提交成功</div>
        <div class="success-desc">您的报修工单已提交，工作人员将尽快处理</div>
        <div class="success-info">
          <div class="info-item">
            <span class="info-label">工单号</span>
            <span class="info-value">{{ submitResult?.orderId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">故障类型</span>
            <span class="info-value">{{ submitResult?.faultTypeName }} - {{ submitResult?.faultSubTypeName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">预计上门</span>
            <span class="info-value highlight">{{ submitResult?.estimatedArrivalTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">维修费用</span>
            <span class="info-value">{{ submitResult?.serviceFee }}</span>
          </div>
        </div>
        <van-button type="primary" size="large" block class="back-btn" @click="goBack">完成</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { getRepairInfo, submitRepair, uploadImage } from '../api/repair';

const router = useRouter();

const info = ref(null);
const selectedFaultType = ref(null);
const selectedSubType = ref(null);
const description = ref('');
const uploadedImages = ref([]);
const contactName = ref('');
const contactPhone = ref('');
const appointmentTime = ref('');

const showTimePicker = ref(false);
const showSuccessPopup = ref(false);
const submitting = ref(false);
const submitResult = ref(null);
const fileInputRef = ref(null);
const tempTime = ref('');

const iconMap = {
  1: '💧',
  2: '📺',
  3: '🔒',
  4: '🏠',
  5: '🔧'
};

const timeOptions = [
  { label: '工作日 09:00-12:00', value: 'workday_morning' },
  { label: '工作日 14:00-18:00', value: 'workday_afternoon' },
  { label: '周末 09:00-12:00', value: 'weekend_morning' },
  { label: '周末 14:00-18:00', value: 'weekend_afternoon' },
  { label: '全天均可', value: 'anytime' }
];

const canSubmit = computed(() => {
  return selectedFaultType.value && selectedSubType.value &&
    description.value.trim().length >= 5 &&
    contactName.value && /^1[3-9]\d{9}$/.test(contactPhone.value);
});

const selectFaultType = (type) => {
  selectedFaultType.value = type;
  selectedSubType.value = null;
};

const selectSubType = (sub) => {
  selectedSubType.value = sub;
};

const triggerUpload = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const handleFileChange = async (e) => {
  const files = Array.from(e.target.files || []);
  const maxImages = info.value?.maxImages || 9;
  const remaining = maxImages - uploadedImages.value.length;

  if (files.length > remaining) {
    showToast(`最多还能上传${remaining}张`);
  }

  const filesToUpload = files.slice(0, remaining);

  for (const file of filesToUpload) {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      showToast(`「${file.name}」格式不支持，仅支持图片和视频文件`);
      continue;
    }
    if (file.type.startsWith('image/') && file.size > 10 * 1024 * 1024) {
      showToast(`「${file.name}」超过10MB，请压缩后重新上传`);
      continue;
    }
    if (file.type.startsWith('video/') && file.size > 100 * 1024 * 1024) {
      showToast(`「${file.name}」超过100MB，请压缩后重新上传`);
      continue;
    }
    if (!file.size || file.size <= 0) {
      showToast(`「${file.name}」为空文件或已损坏，请重新选择`);
      continue;
    }

    showLoadingToast({ message: `上传中 (${file.name})...`, forbidClick: true, duration: 0 });

    try {
      const result = await uploadImage(file);
      uploadedImages.value.push({
        url: result.url,
        name: file.name,
        type: result.type || (file.type.startsWith('video/') ? 'video' : 'image')
      });
    } catch (err) {
      const errorMsg = err && err.message ? err.message : '上传失败';
      showToast({
        message: `「${file.name}」${errorMsg}`,
        duration: 3500
      });
    } finally {
      closeToast();
    }
  }

  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1);
};

const confirmTime = () => {
  const selected = timeOptions.find(t => t.value === tempTime.value);
  if (selected) {
    appointmentTime.value = selected.label;
  }
  showTimePicker.value = false;
};

const handleSubmit = async () => {
  if (!selectedFaultType.value || !selectedSubType.value) {
    showToast('请选择故障类型');
    return;
  }
  if (description.value.trim().length < 5) {
    showToast('请详细描述故障问题（至少5个字符）');
    return;
  }
  if (!contactName.value) {
    showToast('请输入联系人姓名');
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(contactPhone.value)) {
    showToast('请输入正确的手机号');
    return;
  }

  submitting.value = true;
  showLoadingToast({
    message: '提交中...',
    forbidClick: true,
    duration: 0
  });

  try {
    const res = await submitRepair({
      faultTypeId: selectedFaultType.value.id,
      faultSubTypeId: selectedSubType.value.id,
      faultTypeName: selectedFaultType.value.name,
      faultSubTypeName: selectedSubType.value.name,
      description: description.value.trim(),
      images: uploadedImages.value.map(img => img.url),
      contactName: contactName.value,
      contactPhone: contactPhone.value,
      appointmentTime: appointmentTime.value
    });

    closeToast();

    if (res.data.code === 200) {
      submitResult.value = res.data.data;
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

const goBack = () => {
  showSuccessPopup.value = false;
  router.replace('/renewal');
};

const fetchInfo = async () => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  });

  try {
    const res = await getRepairInfo();
    if (res.data.code === 200) {
      info.value = res.data.data;
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
  fetchInfo();
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

.room-info {
  background: #f0f9ff;
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

.fault-type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.fault-type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  background: #f7f8fa;
  border-radius: 10px;
  border: 2px solid transparent;
  transition: all 0.3s;
  cursor: pointer;
}

.fault-type-item.active {
  background: #e8f3ff;
  border-color: #1989fa;
}

.type-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.type-emoji {
  font-size: 24px;
  line-height: 1;
}

.type-name {
  font-size: 13px;
  color: #323233;
  text-align: center;
}

.sub-type-list {
  padding-top: 12px;
  border-top: 1px solid #ebedf0;
}

.sub-type-title {
  font-size: 14px;
  color: #646566;
  margin-bottom: 10px;
  font-weight: 500;
}

.sub-type-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sub-type-item {
  padding: 8px 14px;
  background: #f7f8fa;
  border-radius: 16px;
  font-size: 13px;
  color: #646566;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid transparent;
  transition: all 0.3s;
  cursor: pointer;
}

.sub-type-item.active {
  background: #e8fff3;
  color: #07c160;
  border-color: #07c160;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.desc-count {
  font-size: 12px;
  color: #c8c9cc;
  font-weight: normal;
}

.desc-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  font-size: 14px;
  color: #323233;
  background: #fff;
  outline: none;
  resize: none;
  font-family: inherit;
  line-height: 1.6;
  transition: border-color 0.3s;
}

.desc-textarea:focus {
  border-color: #1989fa;
}

.desc-textarea::placeholder {
  color: #c8c9cc;
}

.upload-tip {
  font-size: 12px;
  color: #969799;
  font-weight: normal;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 10px;
}

.upload-item {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f7f8fa;
}

.upload-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-add {
  width: 100%;
  aspect-ratio: 1;
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

.upload-add:active {
  background: #f0f0f0;
}

.upload-text {
  font-size: 12px;
  color: #969799;
}

.file-input {
  display: none;
}

.upload-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #969799;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: #646566;
  font-weight: 500;
}

.form-input {
  height: 44px;
  padding: 0 12px;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  font-size: 14px;
  color: #323233;
  background: #fff;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #1989fa;
}

.form-input::placeholder {
  color: #c8c9cc;
}

.picker-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.picker-value.placeholder {
  color: #c8c9cc;
}

.notice-card {
  background: #f0f9ff;
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #d6ecff;
}

.notice-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #1989fa;
  margin-bottom: 10px;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-list li {
  font-size: 12px;
  color: #646566;
  line-height: 1.8;
  padding-left: 14px;
  position: relative;
}

.notice-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #1989fa;
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

.submit-btn {
  border-radius: 24px;
  background: linear-gradient(90deg, #1989fa, #07c160);
  border: none;
}

.time-picker-popup {
  padding-bottom: env(safe-area-inset-bottom);
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0 16px;
}

.popup-cancel {
  font-size: 14px;
  color: #969799;
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.popup-confirm {
  font-size: 14px;
  color: #1989fa;
  font-weight: 500;
}

.time-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.time-option {
  padding: 14px 16px;
  background: #f7f8fa;
  border-radius: 10px;
  font-size: 15px;
  color: #323233;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.time-option.active {
  background: #e8f3ff;
  border-color: #1989fa;
  color: #1989fa;
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
  text-align: left;
}

.success-info .info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.success-info .info-value.highlight {
  color: #07c160;
  font-weight: 500;
}

.back-btn {
  border-radius: 24px;
  background: linear-gradient(90deg, #1989fa, #07c160);
  border: none;
}
</style>
