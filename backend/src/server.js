const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(cors({
  origin: [process.env.CORS_ORIGIN || 'https://minimartcircle.vercel.app/',"http://localhost:5173", ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
