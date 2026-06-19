<template>
  <div class="page-container">
    <div class="header">
      <div class="header-title">退租申请</div>
      <div class="header-subtitle">请选择退租时间并填写收件信息</div>
    </div>

    <div v-if="info" class="section-card">
      <div class="section-title">当前合同信息</div>
      <div class="contract-info">
        <div class="info-row">
          <span class="info-label">房屋</span>
          <span class="info-value">{{ info.currentContract.roomNumber }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">租期</span>
          <span class="info-value">{{ info.currentContract.contractStartDate }} 至 {{ info.currentContract.contractEndDate }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">剩余天数</span>
          <span class="info-value">
            <van-tag :type="info.daysRemaining > 30 ? 'primary' : 'warning'" size="medium">
              剩余 {{ info.daysRemaining }} 天
            </van-tag>
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">可退押金</span>
          <span class="info-value price">{{ info.depositRefundable }}</span>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">选择退租时间</div>
      <div class="move-out-field" @click="showCalendar = true">
        <div class="field-label">退租搬离日期</div>
        <div class="field-value" :class="{ placeholder: !moveOutDate }">
          {{ moveOutDate || '请选择退租搬离日期' }}
          <van-icon name="arrow" color="#969799" />
        </div>
      </div>
      <div class="date-tip">
        <van-icon name="info-o" size="14" color="#ff976a" />
        <span>需提前 {{ info?.noticePeriod || 7 }} 天申请，最早可搬离日期 {{ info?.earliestMoveOutDate }}</span>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">收件地址</div>
      <div class="address-form">
        <div class="form-item">
          <label class="form-label">收件人</label>
          <input
            v-model="receiverName"
            class="form-input"
            type="text"
            placeholder="请输入收件人姓名"
            maxlength="20"
          />
        </div>
        <div class="form-item">
          <label class="form-label">手机号</label>
          <input
            v-model="receiverPhone"
            class="form-input"
            type="tel"
            placeholder="请输入收件人手机号"
            maxlength="11"
          />
        </div>
        <div class="form-item" @click="showAreaPicker = true">
          <label class="form-label">所在地区</label>
          <div class="form-input picker-value" :class="{ placeholder: !areaText }">
            {{ areaText || '请选择所在地区' }}
            <van-icon name="arrow" color="#969799" />
          </div>
        </div>
        <div class="form-item textarea-item">
          <label class="form-label">详细地址</label>
          <textarea
            v-model="receiverAddress"
            class="form-textarea"
            placeholder="请输入详细地址（街道、门牌号等）"
            rows="2"
            maxlength="100"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">快递单号</div>
      <div class="form-item">
        <label class="form-label">物流单号</label>
        <input
          v-model="expressNumber"
          class="form-input"
          type="text"
          placeholder="如有钥匙归还快递，请填写单号（选填）"
          maxlength="50"
        />
      </div>
      <div class="form-item" style="margin-top: 12px;">
        <label class="form-label">备注</label>
        <textarea
          v-model="remark"
          class="form-textarea"
          placeholder="如有其他说明，请填写（选填）"
          rows="2"
          maxlength="200"
        ></textarea>
      </div>
    </div>

    <div class="notice-card">
      <div class="notice-title">
        <van-icon name="warning-o" size="16" color="#ff976a" />
        <span>退租须知</span>
      </div>
      <ul class="notice-list">
        <li>退租申请提交后，工作人员将在3个工作日内审核</li>
        <li>搬离前请确保房屋及设施完好，清洁到位</li>
        <li>押金将在搬离验收合格后15个工作日内原路退还</li>
        <li>如有欠费（水电费等）将从押金中扣除</li>
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
        提交退租申请
      </van-button>
    </div>

    <van-calendar
      v-model:show="showCalendar"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onCalendarConfirm"
      color="#1989fa"
      :default-date="defaultCalendarDate"
    />

    <van-popup v-model:show="showAreaPicker" round position="bottom">
      <van-picker
        :columns="areaColumns"
        @confirm="onAreaConfirm"
        @cancel="showAreaPicker = false"
        title="选择所在地区"
        :columns-field-names="{ text: 'name', value: 'code', children: 'children' }"
      />
    </van-popup>

    <van-popup v-model:show="showSuccessPopup" round position="center" :style="{ width: '85%', padding: '24px' }">
      <div class="success-popup">
        <div class="success-icon">
          <van-icon name="checked" size="56" color="#07c160" />
        </div>
        <div class="success-title">提交成功</div>
        <div class="success-desc">您的退租申请已提交，请耐心等待审核</div>
        <div class="success-info">
          <div class="info-item">
            <span class="info-label">申请单号</span>
            <span class="info-value">{{ submitResult?.orderId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">退租日期</span>
            <span class="info-value">{{ submitResult?.moveOutDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">预计退款</span>
            <span class="info-value price">{{ submitResult?.depositRefundable }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">预计到账</span>
            <span class="info-value">{{ submitResult?.estimatedRefundDate }}</span>
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
import { getTerminationInfo, submitTermination } from '../api/termination';

const router = useRouter();

const info = ref(null);
const moveOutDate = ref('');
const receiverName = ref('');
const receiverPhone = ref('');
const areaText = ref('');
const areaCode = ref('');
const receiverAddress = ref('');
const expressNumber = ref('');
const remark = ref('');

const showCalendar = ref(false);
const showAreaPicker = ref(false);
const showSuccessPopup = ref(false);
const submitting = ref(false);
const submitResult = ref(null);

const minDate = computed(() => {
  if (!info.value) return new Date();
  return new Date(info.value.earliestMoveOutDate);
});

const maxDate = computed(() => {
  if (!info.value) return new Date();
  return new Date(info.value.latestMoveOutDate);
});

const defaultCalendarDate = computed(() => {
  if (moveOutDate.value) return new Date(moveOutDate.value);
  return minDate.value;
});

const canSubmit = computed(() => {
  return moveOutDate.value && receiverName.value && receiverPhone.value && areaText.value && receiverAddress.value;
});

const areaColumns = [
  {
    name: '北京市',
    code: '110000',
    children: [
      { name: '北京市', code: '110100', children: [
        { name: '东城区', code: '110101' },
        { name: '西城区', code: '110102' },
        { name: '朝阳区', code: '110105' },
        { name: '海淀区', code: '110108' }
      ]}
    ]
  },
  {
    name: '上海市',
    code: '310000',
    children: [
      { name: '上海市', code: '310100', children: [
        { name: '黄浦区', code: '310101' },
        { name: '徐汇区', code: '310104' },
        { name: '浦东新区', code: '310115' },
        { name: '闵行区', code: '310112' }
      ]}
    ]
  },
  {
    name: '广东省',
    code: '440000',
    children: [
      { name: '广州市', code: '440100', children: [
        { name: '天河区', code: '440106' },
        { name: '海珠区', code: '440105' },
        { name: '越秀区', code: '440104' }
      ]},
      { name: '深圳市', code: '440300', children: [
        { name: '南山区', code: '440305' },
        { name: '福田区', code: '440304' },
        { name: '宝安区', code: '440306' }
      ]}
    ]
  },
  {
    name: '浙江省',
    code: '330000',
    children: [
      { name: '杭州市', code: '330100', children: [
        { name: '西湖区', code: '330106' },
        { name: '拱墅区', code: '330105' },
        { name: '滨江区', code: '330108' }
      ]}
    ]
  }
];

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const onCalendarConfirm = (date) => {
  moveOutDate.value = formatDate(date);
  showCalendar.value = false;
};

const onAreaConfirm = ({ selectedOptions }) => {
  areaText.value = selectedOptions.map(item => item.name).join(' ');
  areaCode.value = selectedOptions[selectedOptions.length - 1].code;
  showAreaPicker.value = false;
};

const validatePhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone);
};

const handleSubmit = async () => {
  if (!moveOutDate.value) {
    showToast('请选择退租时间');
    return;
  }
  if (!receiverName.value) {
    showToast('请输入收件人姓名');
    return;
  }
  if (!receiverPhone.value) {
    showToast('请输入收件人手机号');
    return;
  }
  if (!validatePhone(receiverPhone.value)) {
    showToast('收件人手机号格式不正确');
    return;
  }
  if (!areaText.value) {
    showToast('请选择所在地区');
    return;
  }
  if (!receiverAddress.value) {
    showToast('请输入详细地址');
    return;
  }

  submitting.value = true;
  showLoadingToast({
    message: '提交中...',
    forbidClick: true,
    duration: 0
  });

  try {
    const res = await submitTermination({
      moveOutDate: moveOutDate.value,
      receiverName: receiverName.value,
      receiverPhone: receiverPhone.value,
      receiverAddress: `${areaText.value} ${receiverAddress.value}`,
      expressNumber: expressNumber.value,
      remark: remark.value
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
    const res = await getTerminationInfo();
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
  background: linear-gradient(135deg, #ff976a, #ee0a24);
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

.contract-info {
  background: #fff7f5;
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

.move-out-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f7f8fa;
  border-radius: 8px;
  cursor: pointer;
}

.field-label {
  font-size: 15px;
  color: #323233;
  font-weight: 500;
}

.field-value {
  font-size: 15px;
  color: #323233;
  display: flex;
  align-items: center;
  gap: 6px;
}

.field-value.placeholder {
  color: #c8c9cc;
}

.date-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 12px;
  color: #ff976a;
}

.address-form {
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

.form-textarea {
  padding: 10px 12px;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  font-size: 14px;
  color: #323233;
  background: #fff;
  outline: none;
  resize: none;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-textarea:focus {
  border-color: #1989fa;
}

.form-textarea::placeholder {
  color: #c8c9cc;
}

.notice-card {
  background: #fff7f5;
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #ffe1d6;
}

.notice-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #ff976a;
  margin-bottom: 10px;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-list li {
  font-size: 12px;
  color: #969799;
  line-height: 1.8;
  padding-left: 14px;
  position: relative;
}

.notice-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #ff976a;
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
  background: linear-gradient(90deg, #ff976a, #ee0a24);
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

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.back-btn {
  border-radius: 24px;
  background: linear-gradient(90deg, #ff976a, #ee0a24);
  border: none;
}
</style>
