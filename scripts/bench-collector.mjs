// Receives the results of the example's /bench screen (one JSON object per
// request) and prints them. Usage: node scripts/bench-collector.mjs
import { createServer } from 'node:http';

createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    console.log(body);
    res.end('ok');
  });
}).listen(8099, () => console.log('Waiting for /bench results on :8099'));
