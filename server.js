* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  background: #0D1526;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
  color: #F2F5F9;
  overflow: hidden;
}

.hidden { display: none !important; }

.c-coral { color: #FF6B47; }
.c-white { color: #F2F5F9; }

.wordmark { font-size: 22px; font-weight: 800; letter-spacing: 1.5px; }
.wordmark.small { font-size: 17px; }

/* ---------- Écran d'authentification ---------- */
.auth-screen {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 360px;
  background: #0F1B2D;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 18px;
  padding: 32px 24px;
  text-align: center;
}

.auth-sub { color: #8A97AC; font-size: 13.5px; margin: 8px 0 24px; }

.auth-tabs {
  display: flex;
  background: #16213A;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 20px;
}

.auth-tab {
  flex: 1;
  padding: 9px 0;
  background: transparent;
  border: none;
  color: #8A97AC;
  font-size: 13.5px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
}

.auth-tab.active { background: #FF6B47; color: #1A0E08; }

.auth-form { display: flex; flex-direction: column; gap: 12px; }

.auth-form input {
  background: #16213A;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 12px 14px;
  color: #F2F5F9;
  font-size: 14.5px;
  outline: none;
}

.auth-form input:focus { border-color: #2EE6C5; }

.phone-row { display: flex; gap: 8px; }
.phone-row input { flex: 1; min-width: 0; }

.country-select {
  background: #16213A;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 12px 6px;
  color: #F2F5F9;
  font-size: 13px;
  outline: none;
  max-width: 118px;
}

.btn-primary {
  background: #FF6B47;
  border: none;
  border-radius: 10px;
  padding: 12px 0;
  color: #1A0E08;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
}

.auth-error { color: #FF6B47; font-size: 12.5px; min-height: 16px; }

/* ---------- Application ---------- */
.app { display: flex; flex-direction: column; height: 100vh; }
.app-body { flex: 1; display: flex; min-height: 0; }

.filter-tabs {
  display: flex;
  gap: 8px;
  padding: 2px 14px 12px;
  overflow-x: auto;
}

.filter-tab {
  background: #16213A;
  border: none;
  border-radius: 20px;
  padding: 7px 14px;
  color: #97A3B8;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-tab.active { background: #2EE6C5; color: #0D1526; }

.bottom-nav {
  display: flex;
  border-top: 1px solid rgba(255,255,255,0.08);
  background: #0F1B2D;
  flex-shrink: 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  flex: 1;
  background: transparent;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 0 6px;
  color: #5C6B84;
  cursor: pointer;
}

.nav-item.active { color: #2EE6C5; }
.nav-icon { font-size: 19px; }
.nav-label { font-size: 10.5px; font-weight: 600; }
.nav-avatar { width: 22px; height: 22px; font-size: 9px; }

.sidebar {
  display: flex;
  flex-direction: column;
  width: 360px;
  border-right: 1px solid rgba(255,255,255,0.06);
  background: #0F1B2D;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px 14px;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #97A3B8;
  font-size: 17px;
  cursor: pointer;
  padding: 6px;
}

.search-wrap { margin: 0 14px 10px; }

.search-wrap input {
  width: 100%;
  background: #16213A;
  border: none;
  border-radius: 10px;
  padding: 9px 12px;
  color: #F2F5F9;
  font-size: 14px;
  outline: none;
}

.header-actions { display: flex; gap: 4px; }

.avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.avatar-lg { width: 84px; height: 84px; font-size: 26px; margin: 0 auto; }

.contact-list { flex: 1; overflow-y: auto; padding: 0 8px 12px; }

.contact-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.contact-row:hover, .contact-row.active { background: #1E2A47; }

.fav-star {
  flex-shrink: 0;
  font-size: 16px;
  color: #5C6B84;
  padding: 4px;
  cursor: pointer;
}
.fav-star.active { color: #F5B942; }

.row-bottom { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 2px; }

.unread-badge {
  background: #FF6B47;
  color: #1A0E08;
  font-size: 11px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  flex-shrink: 0;
}

.avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #0D1526; font-weight: 700; font-size: 14px;
  flex-shrink: 0;
}

.contact-meta { flex: 1; min-width: 0; }
.row-top { display: flex; justify-content: space-between; align-items: baseline; }
.row-name { color: #F2F5F9; font-size: 14.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.row-time { color: #5C6B84; font-size: 11.5px; margin-left: 8px; flex-shrink: 0; }
.row-preview { color: #8A97AC; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0; }
.row-preview.unread { color: #F2F5F9; font-weight: 600; }

.chat-pane { flex: 1; display: flex; flex-direction: column; min-width: 0; }

.empty-state { flex: 1; display: flex; align-items: center; justify-content: center; color: #97A3B8; font-size: 14px; }

.chat-view { flex: 1; display: flex; flex-direction: column; height: 100%; }

.chat-header {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: #0F1B2D;
}

.back-btn { display: none; }

.chat-status { font-size: 12px; color: #5C6B84; }

.messages { flex: 1; overflow-y: auto; padding: 18px 16px; display: flex; flex-direction: column; gap: 8px; }

.bubble-wrap { display: flex; width: 100%; }
.bubble-wrap.me { justify-content: flex-end; }
.bubble-wrap.them { justify-content: flex-start; }

.bubble {
  max-width: 72%;
  padding: 9px 12px;
  border-radius: 16px;
  font-size: 14.5px;
  line-height: 1.4;
}

.bubble.me { background: #FF6B47; color: #1A0E08; border-bottom-right-radius: 3px; }
.bubble.them { background: #1E2A47; color: #F2F5F9; border-bottom-left-radius: 3px; }

.bubble-time { display: block; font-size: 10.5px; opacity: 0.7; margin-top: 4px; text-align: right; }

.composer {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
  background: #0F1B2D;
}

.composer input {
  flex: 1;
  background: #16213A;
  border: none;
  border-radius: 20px;
  padding: 11px 14px;
  color: #F2F5F9;
  font-size: 14.5px;
  outline: none;
}

.send-btn {
  background: #FF6B47;
  border: none;
  width: 38px; height: 38px;
  border-radius: 50%;
  color: #1A0E08;
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;
}

.attach-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  flex-shrink: 0;
  color: #8A97AC;
}

.msg-media-image {
  display: block;
  max-width: 100%;
  max-height: 260px;
  border-radius: 12px;
  margin-bottom: 6px;
  object-fit: cover;
}

.msg-media-video {
  display: block;
  max-width: 100%;
  max-height: 260px;
  border-radius: 12px;
  margin-bottom: 6px;
}

.msg-media-doc {
  display: block;
  background: rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 6px;
  color: inherit;
  text-decoration: none;
  font-size: 13.5px;
  word-break: break-all;
}

/* ---------- Fenêtre modale ---------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 380px;
  background: #0F1B2D;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 22px;
}

.modal-card h3 { font-size: 16px; margin-bottom: 14px; }

.modal-card input {
  width: 100%;
  background: #16213A;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 11px 13px;
  color: #F2F5F9;
  font-size: 14px;
  outline: none;
  margin-bottom: 14px;
}

.modal-label { font-size: 12.5px; color: #8A97AC; margin-bottom: 8px; }

.group-members-list {
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.member-check {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.member-check:hover { background: #16213A; }

.modal-actions { display: flex; gap: 10px; margin-top: 10px; }

.btn-secondary {
  flex: 1;
  background: #16213A;
  border: none;
  border-radius: 10px;
  padding: 11px 0;
  color: #F2F5F9;
  font-size: 14px;
  cursor: pointer;
}

.modal-actions .btn-primary { flex: 1; margin-top: 0; }

.profile-card { text-align: center; }

.profile-avatar-btn {
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-bottom: 14px;
}

.avatar-edit-badge {
  position: absolute;
  bottom: 0; right: 0;
  background: #16213A;
  border-radius: 50%;
  padding: 4px 6px;
  font-size: 12px;
}

.profile-name { font-size: 17px; font-weight: 700; margin-bottom: 4px; }
.profile-phone { color: #8A97AC; font-size: 13.5px; margin-bottom: 20px; }
.profile-logout { color: #FF6B47; margin-bottom: 8px; }
.soon-text { color: #8A97AC; font-size: 14px; margin-bottom: 4px; }

@media (max-width: 820px) {
  .sidebar { width: 100%; }
  .app.show-chat .sidebar { display: none; }
  .app.show-chat .bottom-nav { display: none; }
  .app:not(.show-chat) .chat-pane { display: none; }
  .back-btn { display: inline-block; }
          }
  
