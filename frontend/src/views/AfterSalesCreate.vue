<template>
  <div class="page-container">
    <div class="header">
      <van-nav-bar
        title="提交售后"
        left-text="返回"
        left-arrow
        @click-left="onBack"
      />
    </div>

    <div class="form-content">
      <div class="section-card">
        <div class="section-title">
          <span>售后类型</span>
          <span class="required">*</span>
        </div>
        <div class="type-grid">
          <div
            v-for="type in typeList"
            :key="type.value"
            class="type-item"
            :class="{ active: selectedType === type.value }"
            @click="selectType(type)"
          >
            <div class="type-icon" :class="type.value">
              <van-icon :name="getTypeIcon(type.value)" size="24" />
            </div>
            <div class="type-name">{{ type.text }}</div>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-title">
          <span>问题标题</span>
          <span class="required">*</span>
        </div>
        <input
          v-model="title"
          class="form-input"
          type="text"
          placeholder="请简要描述您的问题"
          maxlength="50"
        />
        <div class="count-tip">{{ title.length }}/50</div>
      </div>

      <div class="section-card">
        <div class="section-title">
          <span>详细描述</span>
          <span class="required">*</span>
        </div>
        <textarea
          v-model="description"
          class="form-textarea"
          placeholder="请详细描述您遇到的问题，包括具体情况、发生时间等..."
          maxlength="500"
          rows="5"
        ></textarea>
        <div class="count-tip">{{ description.length }}/500</div>
      </div>

      <div class="section-card">
        <div class="section-title">
          <span>上传图片</span>
          <span class="upload-tip">最多9张</span>
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
            v-if="uploadedImages.length < 9"
            class="upload-add"
            @click="triggerUpload"
          >
            <van-icon name="photograph" size="28" color="#c8c9cc" />
            <span class="upload-text">上传图片</span>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            multiple
            class="file-input"
            @change="handleFileChange"
          />
        </div>
        <div class="upload-hint">
          <van-icon name="info-o" size="12" color="#969799" />
          <span>上传清晰的图片，有助于快速定位问题</span>
        </div>
      </div>

      <div class="section-card">
        <div class="section-title">
          <span>关联订单号</span>
          <span class="optional">选填</span>
        </div>
        <input
          v-model="relatedOrderNo"
          class="form-input"
          type="text"
          placeholder="如有相关订单，请填写订单号"
          maxlength="30"
        />
      </div>

      <div class="section-card">
        <div class="section-title">
          <span>联系信息</span>
          <span class="required">*</span>
        </div>
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
        </div>
      </div>

      <div class="notice-card">
        <div class="notice-title">
          <van-icon name="info-o" size="16" color="#1989fa" />
          <span>温馨提示</span>
        </div>
        <ul class="notice-list">
          <li>提交后，工作人员将在24小时内联系确认</li>
          <li>紧急问题请直接拨打客服热线：400-123-4567</li>
          <li>请保持手机畅通，以便工作人员联系您</li>
        </ul>
      </div>
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
        提交售后申请
      </van-button>
    </div>

    <van-popup v-model:show="showSuccessPopup" round position="center" :style="{ width: '85%', padding: '24px' }">
      <div class="success-popup">
        <div class="success-icon">
          <van-icon name="checked" size="56" color="#07c160" />
        </div>
        <div class="success-title">提交成功</div>
        <div class="success-desc">您的售后工单已提交，我们将尽快处理</div>
        <div class="success-info">
          <div class="info-item">
            <span class="info-label">工单号</span>
            <span class="info-value">{{ submitResult?.orderNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">受理时效</span>
            <span class="info-value highlight">{{ submitResult?.estimatedResponse }}</span>
          </div>
        </div>
        <div class="success-actions">
          <van-button type="default" size="large" @click="goToList">查看列表</van-button>
          <van-button type="primary" size="large" @click="goToDetail">查看详情</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { createAfterSales, uploadImage, getAfterSalesTypes } from '../api/afterSales';

const router = useRouter();

const typeList = ref([
  { value: 'repair', text: '维修售后' },
  { value: 'refund', text: '退款售后' },
  { value: 'invoice', text: '发票售后' },
  { value: 'renewal', text: '续租售后' },
  { value: 'termination', text: '退租售后' },
  { value: 'other', text: '其他问题' }
]);

const selectedType = ref('');
const title = ref('');
const description = ref('');
const uploadedImages = ref([]);
const relatedOrderNo = ref('');
const contactName = ref('');
const contactPhone = ref('');

const submitting = ref(false);
const submitResult = ref(null);
const showSuccessPopup = ref(false);
const fileInputRef = ref(null);

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

const canSubmit = computed(() => {
  return selectedType.value &&
    title.value.trim().length >= 2 &&
    description.value.trim().length >= 10 &&
    contactName.value &&
    /^1[3-9]\d{9}$/.test(contactPhone.value);
});

const selectType = (type) => {
  selectedType.value = type.value;
};

const triggerUpload = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const handleFileChange = async (e) => {
  const files = Array.from(e.target.files || []);
  const maxImages = 9;
  const remaining = maxImages - uploadedImages.value.length;

  if (files.length > remaining) {
    showToast(`最多还能上传${remaining}张`);
  }

  const filesToUpload = files.slice(0, remaining);

  for (const file of filesToUpload) {
    if (!file.type.startsWith('image/')) {
      showToast(`「${file.name}」格式不支持，仅支持图片文件`);
      continue;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast(`「${file.name}」超过10MB，请压缩后重新上传`);
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
        type: result.type || 'image'
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

const handleSubmit = async () => {
  if (!selectedType.value) {
    showToast('请选择售后类型');
    return;
  }
  if (title.value.trim().length < 2) {
    showToast('请输入问题标题（至少2个字符）');
    return;
  }
  if (description.value.trim().length < 10) {
    showToast('请详细描述问题（至少10个字符）');
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
    const selectedTypeInfo = typeList.value.find(t => t.value === selectedType.value);
    const res = await createAfterSales({
      type: selectedType.value,
      typeName: selectedTypeInfo?.text || '',
      title: title.value.trim(),
      description: description.value.trim(),
      relatedOrderNo: relatedOrderNo.value,
      images: uploadedImages.value.map(img => img.url),
      contactName: contactName.value,
      contactPhone: contactPhone.value
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

const onBack = () => {
  router.back();
};

const goToList = () => {
  showSuccessPopup.value = false;
  router.replace('/after-sales');
};

const goToDetail = () => {
  showSuccessPopup.value = false;
  router.replace({
    path: '/after-sales-detail',
    query: { orderId: submitResult.value?.orderId }
  });
};

const fetchTypes = async () => {
  try {
    const res = await getAfterSalesTypes();
    if (res.data.code === 200) {
      const types = res.data.data.types || [];
      if (types.length > 0) {
        typeList.value = types.filter(t => t.value !== 'all');
      }
    }
  } catch (e) {
    console.error('获取售后类型失败', e);
  }
};

onMounted(() => {
  fetchTypes();
});
</script>

<style scoped>
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

.form-content {
  padding-bottom: 100px;
}

.section-card {
  background: #fff;
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background: linear-gradient(180deg, #1989fa, #07c160);
  border-radius: 2px;
  margin-right: 8px;
}

.required {
  color: #ee0a24;
  margin-left: 4px;
  font-size: 14px;
}

.optional {
  color: #969799;
  margin-left: 4px;
  font-size: 12px;
  font-weight: normal;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.type-item {
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

.type-item.active {
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
  color: #969799;
}

.type-item.active .type-icon {
  color: #1989fa;
}

.type-icon.repair { background: #fff3e8; color: #ff976a; }
.type-icon.refund { background: #fff7e6; color: #ff976a; }
.type-icon.invoice { background: #f0e9ff; color: #7232dd; }
.type-icon.renewal { background: #e8f3ff; color: #1989fa; }
.type-icon.termination { background: #ffecec; color: #ee0a24; }
.type-icon.other { background: #f2f3f5; color: #646566; }

.type-name {
  font-size: 13px;
  color: #323233;
  text-align: center;
}

.form-input {
  width: 100%;
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

.form-textarea {
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

.form-textarea:focus {
  border-color: #1989fa;
}

.form-textarea::placeholder {
  color: #c8c9cc;
}

.count-tip {
  text-align: right;
  font-size: 12px;
  color: #c8c9cc;
  margin-top: 6px;
}

.upload-tip {
  font-size: 12px;
  color: #969799;
  font-weight: normal;
  margin-left: auto;
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

.success-info .info-label {
  color: #969799;
}

.success-info .info-value {
  color: #323233;
}

.success-info .info-value.highlight {
  color: #07c160;
  font-weight: 500;
}

.success-actions {
  display: flex;
  gap: 12px;
}

.success-actions .van-button {
  flex: 1;
  border-radius: 24px;
}
</style>
