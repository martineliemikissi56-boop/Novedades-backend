// Novedades — serveur backend
// API d'authentification, de contacts, de messages + temps réel via Socket.io
// Base de données SQLite embarquée : aucun serveur de base de données à installer.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");
const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ---------- Base de données ----------
const db = new Database(path.join(__dirname, "novedades.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_color TEXT DEFAULT '#FF6B47',
    avatar_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    status TEXT DEFAULT 'sent',
    type TEXT DEFAULT 'text',
    media_data TEXT,
    file_name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    avatar_color TEXT DEFAULT '#2EE6C5',
    created_by INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS group_members (
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS group_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    type TEXT DEFAULT 'text',
    media_data TEXT,
    file_name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  );
`);

// Migrations : ajoute les colonnes si la base existait déjà avant cette mise à jour
const migrations = [
  "ALTER TABLE users ADD COLUMN avatar_url TEXT",
  "ALTER TABLE messages ADD COLUMN type TEXT DEFAULT 'text'",
  "ALTER TABLE messages ADD COLUMN media_data TEXT",
  "ALTER TABLE messages ADD COLUMN file_name TEXT",
  "ALTER TABLE group_messages ADD COLUMN type TEXT DEFAULT 'text'",
  "ALTER TABLE group_messages ADD COLUMN media_data TEXT",
  "ALTER TABLE group_messages ADD COLUMN file_name TEXT",
];
migrations.forEach((sql) => {
  try {
    db.exec(sql);
  } catch (e) {
    // la colonne existe déjà, rien à faire
  }
});

// ---------- Authentification ----------
function signToken(user) {
  return jwt.sign({ id: user.id, name: user.name, phone: user.phone }, JWT_SECRET, {
    expiresIn: "30d",
  });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Non authentifié" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: "Session invalide, reconnectez-vous" });
  }
}

app.post("/api/auth/register", (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ error: "Nom, téléphone et mot de passe requis" });
  }
  const existing = db.prepare("SELECT id FROM users WHERE phone = ?").get(phone);
  if (existing) return res.status(409).json({ error: "Ce numéro est déjà utilisé" });

  const colors = ["#FF6B47", "#2EE6C5", "#8B7CF6", "#F5B942"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (name, phone, password_hash, avatar_color) VALUES (?, ?, ?, ?)")
    .run(name, phone, hash, color);

  const user = { id: info.lastInsertRowid, name, phone };
  res.json({ token: signToken(user), user });
});

app.post("/api/auth/login", (req, res) => {
  const { phone, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Numéro ou mot de passe incorrect" });
  }
  res.json({
    token: signToken(user),
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      avatar_color: user.avatar_color,
      avatar_url: user.avatar_url,
    },
  });
});

// Mettre à jour son propre profil (photo de profil)
app.patch("/api/me", authMiddleware, (req, res) => {
  const { avatar_url } = req.body;
  db.prepare("UPDATE users SET avatar_url = ? WHERE id = ?").run(avatar_url || null, req.user.id);
  const user = db.prepare("SELECT id, name, phone, avatar_color, avatar_url FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

// ---------- Contacts ----------
app.get("/api/contacts", authMiddleware, (req, res) => {
  const contacts = db
    .prepare("SELECT id, name, phone, avatar_color, avatar_url FROM users WHERE id != ?")
    .all(req.user.id);
  res.json(contacts);
});

// ---------- Groupes ----------
app.get("/api/groups", authMiddleware, (req, res) => {
  const groups = db
    .prepare(
      `SELECT g.* FROM groups g
       JOIN group_members gm ON gm.group_id = g.id
       WHERE gm.user_id = ?`
    )
    .all(req.user.id);
  res.json(groups);
});

app.post("/api/groups", authMiddleware, (req, res) => {
  const { name, memberIds } = req.body;
  if (!name || !Array.isArray(memberIds) || memberIds.length === 0) {
    return res.status(400).json({ error: "Nom du groupe et au moins un membre requis" });
  }
  const colors = ["#FF6B47", "#2EE6C5", "#8B7CF6", "#F5B942"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const info = db
    .prepare("INSERT INTO groups (name, avatar_color, created_by) VALUES (?, ?, ?)")
    .run(name.trim(), color, req.user.id);
  const groupId = info.lastInsertRowid;

  const addMember = db.prepare("INSERT OR IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)");
  addMember.run(groupId, req.user.id);
  memberIds.forEach((id) => addMember.run(groupId, id));

  const group = db.prepare("SELECT * FROM groups WHERE id = ?").get(groupId);
  res.json(group);
});

app.get("/api/groups/:groupId/messages", authMiddleware, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM group_messages WHERE group_id = ? ORDER BY created_at ASC")
    .all(req.params.groupId);
  res.json(rows);
});

app.post("/api/groups/:groupId/messages", authMiddleware, (req, res) => {
  const { text, type, media, fileName } = req.body;
  const groupId = req.params.groupId;
  const isMedia = type && type !== "text" && media;
  if (!isMedia && (!text || !text.trim())) {
    return res.status(400).json({ error: "Message vide" });
  }

  const info = db
    .prepare(
      "INSERT INTO group_messages (group_id, sender_id, text, type, media_data, file_name) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(groupId, req.user.id, (text || "").trim(), type || "text", media || null, fileName || null);
  const message = db.prepare("SELECT * FROM group_messages WHERE id = ?").get(info.lastInsertRowid);

  const members = db
    .prepare("SELECT user_id FROM group_members WHERE group_id = ? AND user_id != ?")
    .all(groupId, req.user.id);
  members.forEach(({ user_id }) => {
    const socketId = onlineUsers.get(String(user_id));
    if (socketId) io.to(socketId).emit("group:message", { ...message, group_id: Number(groupId) });
  });

  res.json(message);
});

// ---------- Messages ----------
app.get("/api/messages/:contactId", authMiddleware, (req, res) => {
  const { contactId } = req.params;
  const rows = db
    .prepare(
      `SELECT * FROM messages
       WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`
    )
    .all(req.user.id, contactId, contactId, req.user.id);
  res.json(rows);
});

app.post("/api/messages", authMiddleware, (req, res) => {
  const { receiverId, text, type, media, fileName } = req.body;
  const isMedia = type && type !== "text" && media;
  if (!receiverId || (!isMedia && (!text || !text.trim()))) {
    return res.status(400).json({ error: "Message vide" });
  }
  const info = db
    .prepare(
      "INSERT INTO messages (sender_id, receiver_id, text, type, media_data, file_name) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(req.user.id, receiverId, (text || "").trim(), type || "text", media || null, fileName || null);

  const message = db.prepare("SELECT * FROM messages WHERE id = ?").get(info.lastInsertRowid);

  // Livraison en temps réel si le destinataire est connecté
  const receiverSocket = onlineUsers.get(String(receiverId));
  if (receiverSocket) {
    io.to(receiverSocket).emit("message:new", message);
  }
  res.json(message);
});

// ---------- Temps réel (présence + messages) ----------
const onlineUsers = new Map(); // userId -> socketId

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    socket.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    next(new Error("Authentification socket invalide"));
  }
});

io.on("connection", (socket) => {
  const userId = String(socket.user.id);
  onlineUsers.set(userId, socket.id);
  io.emit("presence:update", { userId, online: true });

  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    io.emit("presence:update", { userId, online: false });
  });
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

server.listen(PORT, () => {
  console.log(`Novedades backend en écoute sur le port ${PORT}`);
});
    
