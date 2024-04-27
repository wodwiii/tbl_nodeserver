const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const journalRoutes = require('./routes/journalRoute');
const authRoute = require('./routes/authRoute');
const cors = require('cors');

require('dotenv').config(); 
const app = express();
app.use(cors())
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/journals', journalRoutes);
app.use(authRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
