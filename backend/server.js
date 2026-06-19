const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const rentalRoutes = require('./routes/rental');
const terminationRoutes = require('./routes/termination');
const repairRoutes = require('./routes/repair');
const invoiceRoutes = require('./routes/invoice');
const orderRoutes = require('./routes/order');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '110mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/rental', rentalRoutes);
app.use('/api/termination', terminationRoutes);
app.use('/api/repair', repairRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/order', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行正常' });
});

app.use((err, req, res, next) => {
  if (err) {
    let message = err.message || '请求处理失败';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = '文件大小超过 100MB 限制';
    }
    return res.status(400).json({
      code: 400,
      message
    });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`后端服务运行在 http://localhost:${PORT}`);
});
