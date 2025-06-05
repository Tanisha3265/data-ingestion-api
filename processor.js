function simulateExternalAPI(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, data: 'processed' });
    }, 1000);
  });
}

module.exports = {
  simulateExternalAPI,
};