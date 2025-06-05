const { updateBatchStatus, getAllBatches } = require('./store');
const { simulateExternalAPI } = require('./processor');

function enqueueIngestion(ingestion_id, ids, priority, created_time) {
  // No-op; processing is handled in batchRunner
}

const PRIORITY_ORDER = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

function sortQueue() {
  return getAllBatches().sort((a, b) => {
    if (PRIORITY_ORDER[b.priority] !== PRIORITY_ORDER[a.priority]) {
      return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    }
    return a.created_time - b.created_time;
  });
}

async function processBatch(ingestion_id, batch) {
  const { batch_id, ids } = batch;
  updateBatchStatus(ingestion_id, batch_id, 'triggered');

  const promises = ids.map((id) => simulateExternalAPI(id));
  await Promise.all(promises);

  updateBatchStatus(ingestion_id, batch_id, 'completed');
}

async function batchRunner() {
  const sorted = sortQueue();
  if (sorted.length === 0) return;

  const job = sorted[0];
  await processBatch(job.ingestion_id, job.batch);
}

setInterval(batchRunner, 5000);

module.exports = {
  enqueueIngestion,
};