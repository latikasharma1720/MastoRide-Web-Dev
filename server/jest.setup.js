const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGO_URL = mongoUri;
    console.log('✅ MongoDB Memory Server started at:', mongoUri);
  } catch (err) {
    console.error('Failed to start MongoDB Memory Server in jest.setup.js', err);
    throw err;
  }
})();

// Attempt graceful stop when the worker exits
process.on('exit', async () => {
  if (mongoServer) {
    try {
      await mongoServer.stop();
      console.log('✅ MongoDB Memory Server stopped');
    } catch (e) {
      // ignore
    }
  }
});
