const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

if (!fs.existsSync(distPath)) {
  app.use((req, res) => {
    res.status(503).send('The production build is missing. Run `npm run build` before starting the server.');
  });
} else {
  app.use(express.static(distPath));

  // SPA fallback: serve index.html for all non-file routes
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  // Handle 404 from static middleware — pass to SPA fallback
  app.use((err, req, res, next) => {
    if (err && err.status === 404) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next(err);
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
