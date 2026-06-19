const BASE = process.env.API_BASE || 'http://localhost:3000/api';
const ORIGIN = process.env.UPLOAD_ORIGIN || 'http://localhost:3000';

const results = [];

async function assertOk(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`\u2713 ${name}`);
  } catch (err) {
    results.push({ name, ok: false, error: err.message });
    console.log(`\u2717 ${name} -> ${err.message}`);
  }
}

async function getJson(pathname) {
  const res = await fetch(`${BASE}${pathname}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathname}`);
  return res.json();
}

async function postJson(pathname, body) {
  const res = await fetch(`${BASE}${pathname}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok || data.code !== 200) {
    throw new Error(data.message || `HTTP ${res.status} ${pathname}`);
  }
  return data;
}

async function main() {
  console.log(`验收目标服务: ${BASE}\n`);

  await assertOk('健康检查 /api/health', async () => {
    const data = await getJson('/health');
    if (data.status !== 'ok') throw new Error('服务状态异常');
  });

  await assertOk('报修信息 /repair/info', async () => {
    const data = await getJson('/repair/info');
    if (!data.data || !Array.isArray(data.data.faultTypes)) throw new Error('故障类型为空');
  });

  await assertOk('工单列表 /repair/orders', async () => {
    const data = await getJson('/repair/orders');
    if (!data.data || !Array.isArray(data.data.list)) throw new Error('工单列表为空');
  });

  await assertOk('工单详情 /repair/order-detail', async () => {
    const data = await getJson('/repair/order-detail?orderId=BX20260115001');
    if (!data.data || data.data.id !== 'BX20260115001') throw new Error('工单详情获取异常');
  });

  await assertOk('上传存储 /repair/upload-image', async () => {
    const form = new FormData();
    form.append('file', new Blob(['verify-png'], { type: 'image/png' }), 'verify.png');
    const res = await fetch(`${BASE}/repair/upload-image`, { method: 'POST', body: form });
    const data = await res.json();
    if (!res.ok || data.code !== 200) throw new Error(data.message || `HTTP ${res.status}`);
    const imgRes = await fetch(`${ORIGIN}${data.data.url}`, { method: 'HEAD' });
    if (!imgRes.ok) throw new Error(`上传文件无法访问 ${data.data.url}`);
  });

  await assertOk('工单回调 /repair/callback', async () => {
    const data = await postJson('/repair/callback', {
      orderId: 'BX20260115001',
      status: 'completed',
      operator: '验收脚本',
      description: '部署验收-回调测试'
    });
    if (!data.data.statusTrack) throw new Error('未返回状态轨迹');
  });

  await assertOk('工单验收 /repair/accept', async () => {
    const data = await postJson('/repair/accept', {
      orderId: 'BX20260220002',
      result: 'accepted',
      comment: '部署验收-验收通过'
    });
    if (data.data.result !== 'accepted') throw new Error('验收结果异常');
  });

  const failed = results.filter(r => !r.ok);
  console.log(`\n验收结果: ${results.length - failed.length}/${results.length} 通过`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error('验收脚本运行失败:', err.message);
  process.exit(1);
});
