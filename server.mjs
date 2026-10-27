import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 8096);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

// Shared in-memory MMO state for connected browser tabs/clients
const connectedPeers = new Map();
const globalAnnouncements = [
  {
    id: 'ann-init-1',
    ts: Date.now() - 120000,
    type: 'milestone',
    text: '[World] Precision has reached Level 118 as an Elementalist!'
  },
  {
    id: 'ann-init-2',
    ts: Date.now() - 60000,
    type: 'drop',
    text: '[World] SeaSnailLover discovered a rare Wood Golem Card (1/649) in Namu Forest!'
  }
];

function prunePeers() {
  const cutoff = Date.now() - 12000;
  for (const [id, peer] of connectedPeers.entries()) {
    if (peer.updatedAt < cutoff) {
      connectedPeers.delete(id);
    }
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

export function createUnwrittenServer() {
  return http.createServer((req, res) => {
    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === '/api/mmo/heartbeat' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        if (body.length > 64 * 1024) req.destroy();
      });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          prunePeers();
          if (data.clientId) {
            connectedPeers.set(String(data.clientId), {
              clientId: String(data.clientId),
              name: String(data.name || 'Castaway'),
              guild: String(data.guild || 'Wanderers'),
              guildIcon: String(data.guildIcon || 'sprout'),
              classId: String(data.classId || 'castaway'),
              classTier: Number(data.classTier || 1),
              level: Number(data.level || 1),
              zoneId: String(data.zoneId || 'driftwood_shores'),
              x: Number(data.x || 240),
              y: Number(data.y || 520),
              facing: Number(data.facing || 1),
              animState: String(data.animState || 'idle'),
              hatId: data.hatId || null,
              weaponId: data.weaponId || null,
              petId: data.petId || null,
              stats: data.stats || {},
              updatedAt: Date.now()
            });
          }
          if (Array.isArray(data.announcements)) {
            for (const msg of data.announcements) {
              if (msg && msg.text) {
                globalAnnouncements.push({
                  id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  ts: Date.now(),
                  type: msg.type || 'milestone',
                  text: String(msg.text).slice(0, 180)
                });
              }
            }
            while (globalAnnouncements.length > 30) {
              globalAnnouncements.shift();
            }
          }
          const peers = [];
          for (const [id, peer] of connectedPeers.entries()) {
            if (id !== data.clientId) peers.push(peer);
          }
          sendJson(res, 200, {
            ok: true,
            peers,
            announcements: globalAnnouncements.slice(-12),
            onlineCount: connectedPeers.size
          });
        } catch (err) {
          sendJson(res, 400, { ok: false, error: err.message });
        }
      });
      return;
    }

    if (pathname === '/api/health') {
      prunePeers();
      sendJson(res, 200, { ok: true, game: 'Unwritten World', peers: connectedPeers.size });
      return;
    }

    if (pathname === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }

    const relPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const safePath = path.normalize(path.join(__dirname, relPath));
    if (!safePath.startsWith(__dirname)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(safePath, (err, stat) => {
      if (err || !stat.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }
      const ext = path.extname(safePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(safePath).pipe(res);
    });
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const server = createUnwrittenServer();
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`Unwritten World MMORPG server listening on http://127.0.0.1:${PORT}`);
  });
}
