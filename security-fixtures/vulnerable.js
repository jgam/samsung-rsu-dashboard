/**
 * vulnerable-app.js
 *
 * ⚠️  INTENTIONALLY VULNERABLE — TEST FIXTURE ONLY  ⚠️
 *
 * Purpose: a single-file target for SAST tools (Semgrep, CodeQL, Snyk,
 * eslint-plugin-security), security training, and CI rule tuning.
 *
 * DO NOT deploy this. DO NOT copy patterns from it into real code.
 * Each finding is tagged with its CWE id so you can diff scanner output
 * against the expected list at the bottom of this file.
 */

const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const http = require('http');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// VULN 1 — CWE-798: Hardcoded credentials / secrets in source
// ---------------------------------------------------------------------------
const DB_PASSWORD = 'P@ssw0rd123!';
const JWT_SECRET = 'supersecret';
const AWS_ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE';
const AWS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: DB_PASSWORD,
  database: 'app',
});

// ---------------------------------------------------------------------------
// VULN 2 — CWE-89: SQL injection via string concatenation
// ---------------------------------------------------------------------------
app.get('/user', (req, res) => {
  const query = "SELECT * FROM users WHERE username = '" + req.query.name + "'";
  db.query(query, (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// VULN 2b — same, but via template literal (some rules miss this form)
app.get('/order/:id', (req, res) => {
  db.query(`SELECT * FROM orders WHERE id = ${req.params.id}`, (err, rows) => {
    res.json(rows);
  });
});

// ---------------------------------------------------------------------------
// VULN 3 — CWE-78: OS command injection
// ---------------------------------------------------------------------------
app.get('/ping', (req, res) => {
  exec('ping -c 1 ' + req.query.host, (err, stdout) => {
    res.type('text/plain').send(stdout);
  });
});

// ---------------------------------------------------------------------------
// VULN 4 — CWE-22: Path traversal (unsanitized path join)
// ---------------------------------------------------------------------------
app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.query.file);
  res.send(fs.readFileSync(filePath));
});

// ---------------------------------------------------------------------------
// VULN 5 — CWE-79: Reflected XSS (unescaped user input in HTML response)
// ---------------------------------------------------------------------------
app.get('/search', (req, res) => {
  res.send(`<html><body><h1>Results for ${req.query.q}</h1></body></html>`);
});

// ---------------------------------------------------------------------------
// VULN 6 — CWE-94: Code injection via eval / Function constructor
// ---------------------------------------------------------------------------
app.post('/calc', (req, res) => {
  // eslint-disable-next-line no-eval
  const result = eval(req.body.expression);
  res.json({ result });
});

app.post('/template', (req, res) => {
  const fn = new Function('data', 'return `' + req.body.tpl + '`');
  res.send(fn(req.body.data));
});

// ---------------------------------------------------------------------------
// VULN 7 — CWE-1321: Prototype pollution (recursive merge, no key guard)
// ---------------------------------------------------------------------------
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

app.post('/settings', (req, res) => {
  const config = {};
  merge(config, req.body);
  res.json(config);
});

// ---------------------------------------------------------------------------
// VULN 8 — CWE-327 / CWE-916: Weak hashing, unsalted, for passwords
// ---------------------------------------------------------------------------
function hashPassword(pw) {
  return crypto.createHash('md5').update(pw).digest('hex');
}

// VULN 8b — CWE-327: broken cipher with a static key/IV
function encrypt(text) {
  const cipher = crypto.createCipheriv('des-ede3-cbc', 'aaaaaaaaaaaaaaaaaaaaaaaa', 'bbbbbbbb');
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

// ---------------------------------------------------------------------------
// VULN 9 — CWE-338: Insecure randomness for a security token
// ---------------------------------------------------------------------------
function generateResetToken() {
  return Math.random().toString(36).substring(2);
}

// ---------------------------------------------------------------------------
// VULN 10 — CWE-347: JWT verified with algorithm confusion allowed
// ---------------------------------------------------------------------------
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256', 'none'] });
}

// VULN 10b — CWE-345: decode without verification, then trust the claims
app.get('/me', (req, res) => {
  const claims = jwt.decode(req.headers.authorization);
  res.json({ admin: claims.admin, user: claims.sub });
});

// ---------------------------------------------------------------------------
// VULN 11 — CWE-601: Open redirect
// ---------------------------------------------------------------------------
app.get('/redirect', (req, res) => {
  res.redirect(req.query.url);
});

// ---------------------------------------------------------------------------
// VULN 12 — CWE-918: SSRF (user-controlled outbound request URL)
// ---------------------------------------------------------------------------
app.get('/fetch', (req, res) => {
  http.get(req.query.target, (upstream) => {
    upstream.pipe(res);
  });
});

// ---------------------------------------------------------------------------
// VULN 13 — CWE-1333: ReDoS (catastrophic backtracking on user input)
// ---------------------------------------------------------------------------
app.post('/validate', (req, res) => {
  const emailish = /^([a-zA-Z0-9_.-]+)+@([a-zA-Z0-9_.-]+)+\.[a-z]{2,}$/;
  res.json({ valid: emailish.test(req.body.email) });
});

// VULN 13b — CWE-625: regex built from user input, unescaped
app.get('/grep', (req, res) => {
  const re = new RegExp(req.query.pattern);
  res.json({ match: re.test('sample corpus') });
});

// ---------------------------------------------------------------------------
// VULN 14 — CWE-306: Missing authentication on a sensitive operation
// ---------------------------------------------------------------------------
app.post('/admin/delete-user', (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.body.id], () => {
    res.json({ deleted: true });
  });
});

// ---------------------------------------------------------------------------
// VULN 15 — CWE-942: Overly permissive CORS with credentials
// ---------------------------------------------------------------------------
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// ---------------------------------------------------------------------------
// VULN 16 — CWE-1004 / CWE-614: Insecure cookie flags
// ---------------------------------------------------------------------------
app.get('/login', (req, res) => {
  res.cookie('session', generateResetToken(), { httpOnly: false, secure: false });
  res.send('ok');
});

// ---------------------------------------------------------------------------
// VULN 17 — CWE-209: Sensitive information in error response
// ---------------------------------------------------------------------------
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack, config: db.config });
});

// ---------------------------------------------------------------------------
// VULN 18 — CWE-117: Log injection (unsanitized input written to logs)
// ---------------------------------------------------------------------------
app.get('/track', (req, res) => {
  console.log('event received: ' + req.query.event);
  res.send('logged');
});

// ---------------------------------------------------------------------------
// VULN 19 — CWE-330: Timing-unsafe secret comparison
// ---------------------------------------------------------------------------
function checkApiKey(provided) {
  return provided === 'sk_live_9f8a7b6c5d4e3f2a1b0c';
}

// ---------------------------------------------------------------------------
// VULN 20 — CWE-502: Unsafe deserialization of untrusted input
// ---------------------------------------------------------------------------
app.post('/restore', (req, res) => {
  const state = eval('(' + req.body.serialized + ')');
  res.json(state);
});

module.exports = { app, hashPassword, encrypt, verifyToken, checkApiKey, merge };

/**
 * Expected findings (23 total across 20 numbered sections):
 *   CWE-798  hardcoded secrets            × 4
 *   CWE-89   SQL injection                × 2
 *   CWE-78   command injection            × 1
 *   CWE-22   path traversal               × 1
 *   CWE-79   reflected XSS                × 1
 *   CWE-94   code injection               × 2
 *   CWE-1321 prototype pollution          × 1
 *   CWE-327  weak crypto                  × 2
 *   CWE-916  unsalted password hash       × 1
 *   CWE-338  insecure randomness          × 1
 *   CWE-347  JWT alg confusion            × 1
 *   CWE-345  unverified JWT claims        × 1
 *   CWE-601  open redirect                × 1
 *   CWE-918  SSRF                         × 1
 *   CWE-1333 ReDoS                        × 1
 *   CWE-625  regex from user input        × 1
 *   CWE-306  missing authn                × 1
 *   CWE-942  permissive CORS              × 1
 *   CWE-1004 insecure cookie flags        × 1
 *   CWE-209  verbose error disclosure     × 1
 *   CWE-117  log injection                × 1
 *   CWE-330  timing-unsafe comparison     × 1
 *   CWE-502  unsafe deserialization       × 1
 */
