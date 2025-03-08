const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/ingest', (req, res) => {
  const { documentId } = req.body;
  console.log(`Processing document ${documentId}`);

  if (Math.random() > 0.2) {
    return res.json({ success: true, message: `Ingestion started for document ${documentId}` });
  } else {
    return res.status(500).json({ success: false, message: 'Ingestion failed' });
  }
});

app.listen(3001, () => console.log('Mock service running on port 3001'));
