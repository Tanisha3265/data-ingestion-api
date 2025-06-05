const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { addIngestionRequest, getIngestionStatus } = require('./store');
const { enqueueIngestion } = require('./queueManager');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Data Ingestion API. Use POST /ingest and GET /status/:id');
});

app.post('/ingest', (req, res) => {
  const { ids, priority } = req.body;
  const ingestion_id = uuidv4();
  const created_time = Date.now();

  addIngestionRequest(ingestion_id, ids, priority, created_time);
  enqueueIngestion(ingestion_id, ids, priority, created_time);

  res.json({ ingestion_id });
});

app.get('/status/:id', (req, res) => {
  const ingestion_id = req.params.id;
  const status = getIngestionStatus(ingestion_id);

  if (!status) return res.status(404).json({ error: 'Ingestion ID not found' });

  res.json(status);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
