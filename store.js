const { v4: uuidv4 } = require('uuid');

const ingestions = new Map();

function addIngestionRequest(ingestion_id, ids, priority, created_time) {
  const batches = [];
  for (let i = 0; i < ids.length; i += 3) {
    const batch = {
      batch_id: uuidv4(),
      ids: ids.slice(i, i + 3),
      status: 'yet_to_start',
    };
    batches.push(batch);
  }

  ingestions.set(ingestion_id, {
    ingestion_id,
    priority,
    created_time,
    status: 'yet_to_start',
    batches,
  });
}

function getIngestionStatus(ingestion_id) {
  const record = ingestions.get(ingestion_id);
  if (!record) return null;

  const statuses = record.batches.map((b) => b.status);
  if (statuses.every((s) => s === 'yet_to_start')) {
    record.status = 'yet_to_start';
  } else if (statuses.every((s) => s === 'completed')) {
    record.status = 'completed';
  } else {
    record.status = 'triggered';
  }

  return {
    ingestion_id,
    status: record.status,
    batches: record.batches,
  };
}

function updateBatchStatus(ingestion_id, batch_id, newStatus) {
  const record = ingestions.get(ingestion_id);
  if (!record) return;
  const batch = record.batches.find((b) => b.batch_id === batch_id);
  if (batch) batch.status = newStatus;
}

function getAllBatches() {
  return [...ingestions.entries()].flatMap(([ingestion_id, { batches, priority, created_time }]) =>
    batches
      .filter((b) => b.status === 'yet_to_start')
      .map((b) => ({
        ingestion_id,
        batch: b,
        priority,
        created_time,
      }))
  );
}

module.exports = {
  addIngestionRequest,
  getIngestionStatus,
  updateBatchStatus,
  getAllBatches,
};