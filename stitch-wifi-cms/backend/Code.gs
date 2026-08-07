/**
 * Stitch WiFi CMS — Backend Google Apps Script (Web App).
 *
 * Frontend: stitch-wifi-cms (React). Semua request POST JSON
 * dengan Content-Type "text/plain;charset=utf-8" (Apps Script tidak
 * mendukung CORS preflight). Respons selalu JSON string.
 *
 * Action yang didukung:
 *   ping, login, register, getAll, create_pelanggan, addPelanggan,
 *   hapus_pelanggan, add_tagihan, bayar, kirim_wa, forgot_password,
 *   update_profil, ubah_password, add_pengingat, update_pengingat,
 *   save_settings
 */

/**
 * Isi dengan ID Spreadsheet jika script bersifat STANDALONE.
 * Kosongkan ('') jika script di-bind ke Spreadsheet (container-bound),
 * maka otomatis memakai Spreadsheet aktif.
 */
const SS_ID = '';

const HEADERS = {
  Pengguna: ['id', 'nama', 'email', 'password', 'role', 'aktif'],
  Pelanggan: ['id', 'nama', 'whatsapp', 'paket', 'area', 'alamat', 'status', 'tgl_register'],
  Paket: ['id', 'nama', 'kecepatan', 'harga'],
  Tagihan: ['id', 'no_invoice', 'id_pelanggan', 'periode', 'nominal', 'jatuh_tempo', 'status', 'tgl_dibuat'],
  Pembayaran: ['id', 'no_trx', 'id_tagihan', 'id_pelanggan', 'nominal', 'metode', 'tgl', 'status', 'petugas'],
  Transaksi: ['id', 'keterangan', 'tipe', 'nominal', 'petugas', 'tgl'],
  Pengingat: ['id', 'nama', 'wa', 'paket', 'nominal', 'jatuh_tempo', 'status'],
  Profil: ['key', 'value'],
};

/* ────────────────────────── Entry Point ────────────────────────── */

function doPost(e) {
  try {
    const body = e && e.postData ? e.postData.contents : '{}';
    const payload = JSON.parse(body);
    const action = String(payload.action || '');
    ensureSheets_();
    seedIfEmpty_();

    let result;
    switch (action) {
      case 'ping':
        result = { ok: true, message: 'pong' };
        break;
      case 'login':
        result = handleLogin_(payload);
        break;
      case 'register':
        result = handleRegister_(payload);
        break;
      case 'getAll':
        result = handleGetAll_();
        break;
      case 'create_pelanggan':
      case 'addPelanggan':
        result = handleCreatePelanggan_(payload);
        break;
      case 'hapus_pelanggan':
        result = handleHapusPelanggan_(payload);
        break;
      case 'add_tagihan':
        result = handleAddTagihan_(payload);
        break;
      case 'bayar':
        result = handleBayar_(payload);
        break;
      case 'kirim_wa':
        result = handleKirimWa_(payload);
        break;
      case 'forgot_password':
        result = handleForgotPassword_(payload);
        break;
      case 'update_profil':
        result = handleUpdateProfil_(payload);
        break;
      case 'ubah_password':
        result = handleUbahPassword_(payload);
        break;
      case 'add_pengingat':
        result = handleAddPengingat_(payload);
        break;
      case 'update_pengingat':
        result = handleUpdatePengingat_(payload);
        break;
      case 'save_settings':
        result = handleSaveSettings_(payload);
        break;
      default:
        result = { ok: false, error: 'Aksi tidak dikenal: ' + action };
    }
    return respond_(result);
  } catch (err) {
    return respond_({ ok: false, error: String((err && err.message) || err) });
  }
}

function doGet() {
  return respond_({ ok: true, message: 'Stitch WiFi CMS Backend siap. Gunakan POST dengan field action.' });
}

function respond_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ────────────────────────── Handler Aksi ────────────────────────── */

function handleLogin_(p) {
  const email = String(p.email || '').trim().toLowerCase();
  const username = String(p.username || '').trim().toLowerCase();
  const password = String(p.password || '');
  const users = readSheet_('Pengguna');
  const u = users.find(x =>
    String(x.aktif) !== 'N' &&
    (String(x.email || '').toLowerCase() === email || String(x.nama || '').toLowerCase() === username)
  );
  if (!u || String(u.password) !== password) {
    return { ok: false, error: 'Email atau password salah' };
  }
  return { ok: true, user: { id: u.id, nama: u.nama, email: u.email, role: u.role, aktif: u.aktif } };
}

function handleRegister_(p) {
  const email = String(p.email || '').trim().toLowerCase();
  if (!p.name || !email || !p.password) {
    return { ok: false, error: 'Data registrasi tidak lengkap' };
  }
  const users = readSheet_('Pengguna');
  if (users.some(u => String(u.email || '').toLowerCase() === email)) {
    return { ok: false, error: 'Email sudah terdaftar' };
  }
  const id = 'USR-' + Date.now();
  appendRow_('Pengguna', {
    id,
    nama: String(p.name),
    email,
    password: String(p.password),
    role: 'Administrator',
    aktif: 'Y',
  });
  return { ok: true, user: { id, nama: String(p.name), email, role: 'Administrator', aktif: 'Y' } };
}

function handleGetAll_() {
  const pengguna = readSheet_('Pengguna').map(({ password, ...rest }) => rest);
  return {
    ok: true,
    data: {
      pelanggan: readSheet_('Pelanggan'),
      paket: readSheet_('Paket'),
      tagihan: readSheet_('Tagihan'),
      pembayaran: readSheet_('Pembayaran'),
      transaksi: readSheet_('Transaksi'),
      pengingat: readSheet_('Pengingat'),
      profil: readSheet_('Profil'),
      pengguna,
    },
  };
}

function handleCreatePelanggan_(p) {
  if (!p.nama) return { ok: false, error: 'Nama pelanggan wajib diisi' };
  const id = 'ISP-' + Date.now();
  appendRow_('Pelanggan', {
    id,
    nama: String(p.nama),
    whatsapp: p.whatsapp || '',
    paket: p.paket || '',
    area: p.area || '',
    alamat: p.alamat || '',
    status: p.status || 'Aktif',
    tgl_register: p.tgl_register || today_(),
  });
  return { ok: true, id, message: 'Pelanggan berhasil ditambahkan' };
}

function handleHapusPelanggan_(p) {
  if (!p.id) return { ok: false, error: 'ID pelanggan wajib diisi' };
  const ok = deleteRowById_('Pelanggan', p.id);
  return ok
    ? { ok: true, message: 'Pelanggan berhasil dihapus' }
    : { ok: false, error: 'Pelanggan tidak ditemukan' };
}

function handleAddTagihan_(p) {
  if (!p.id_pelanggan || !p.periode) {
    return { ok: false, error: 'id_pelanggan dan periode wajib diisi' };
  }
  const id = 'TGH-' + Date.now();
  const no_invoice = p.no_invoice || 'INV-' + Date.now();
  appendRow_('Tagihan', {
    id,
    no_invoice,
    id_pelanggan: String(p.id_pelanggan),
    periode: String(p.periode),
    nominal: String(p.nominal || 0),
    jatuh_tempo: p.jatuh_tempo || '',
    status: p.status || 'Belum Dibayar',
    tgl_dibuat: today_(),
  });
  return { ok: true, id, no_invoice, message: 'Tagihan berhasil dibuat' };
}

function handleBayar_(p) {
  const rows = readSheet_('Tagihan');
  const t = rows.find(x =>
    (p.no_invoice && String(x.no_invoice) === String(p.no_invoice)) ||
    (p.id && String(x.id) === String(p.id))
  );
  if (!t) return { ok: false, error: 'Tagihan tidak ditemukan' };
  if (String(t.status) === 'Lunas') return { ok: true, message: 'Tagihan sudah lunas' };

  t.status = 'Lunas';
  writeSheet_('Tagihan', rows);

  const tanggal = today_();
  const nominal = t.nominal;
  appendRow_('Pembayaran', {
    id: 'PMB-' + Date.now(),
    no_trx: 'TRX-' + Date.now(),
    id_tagihan: t.id,
    id_pelanggan: t.id_pelanggan,
    nominal,
    metode: p.metode || 'Transfer Bank',
    tgl: tanggal,
    status: 'Lunas',
    petugas: p.petugas || 'Admin',
  });
  appendRow_('Transaksi', {
    id: 'TRX-' + Date.now(),
    keterangan: 'Pembayaran tagihan ' + t.no_invoice,
    tipe: 'Pemasukan',
    nominal,
    petugas: p.petugas || 'Admin',
    tgl: tanggal,
  });
  return { ok: true, message: 'Tagihan berhasil ditandai lunas' };
}

function handleKirimWa_(p) {
  appendLog_('WA ke ' + (p.wa || '?') + ' :: ' + (p.pesan || ''));
  return { ok: true, message: 'Pesan tercatat, siap dikirim via WhatsApp' };
}

function handleForgotPassword_(p) {
  const email = String(p.email || '').trim().toLowerCase();
  const rows = readSheet_('Pengguna');
  const u = rows.find(x => String(x.email || '').toLowerCase() === email);
  if (!u) return { ok: false, error: 'Email tidak ditemukan' };
  u.password = 'password123';
  writeSheet_('Pengguna', rows);
  return { ok: true, message: 'Password berhasil direset ke password123' };
}

const PROFILE_KEYS = ['company', 'email', 'phone', 'address', 'currency', 'language', 'timezone'];

function handleUpdateProfil_(p) {
  for (const k of PROFILE_KEYS) {
    if (p[k] !== undefined && p[k] !== null) setProfil_(k, String(p[k]));
  }
  return { ok: true, message: 'Profil berhasil disimpan' };
}

function handleUbahPassword_(p) {
  const email = String(p.email || '').trim().toLowerCase();
  const rows = readSheet_('Pengguna');
  const u = rows.find(x => String(x.email || '').toLowerCase() === email);
  if (!u) return { ok: false, error: 'Pengguna tidak ditemukan' };
  if (String(u.password) !== String(p.current || '')) {
    return { ok: false, error: 'Password saat ini salah' };
  }
  u.password = String(p.newPassword || '');
  writeSheet_('Pengguna', rows);
  return { ok: true, message: 'Password berhasil diubah' };
}

function handleAddPengingat_(p) {
  appendRow_('Pengingat', {
    id: 'PNG-' + Date.now(),
    nama: p.name || p.nama || '',
    wa: p.wa || p.whatsapp || '',
    paket: p.pkg || p.paket || '',
    nominal: p.amount || p.nominal || '',
    jatuh_tempo: p.due || p.jatuh_tempo || '',
    status: p.status || 'Pending',
  });
  return { ok: true, message: 'Pengingat berhasil disimpan' };
}

function handleUpdatePengingat_(p) {
  const rows = readSheet_('Pengingat');
  const idx = rows.findIndex(r => String(r.nama) === String(p.nama || p.name || ''));
  if (idx === -1) return { ok: false, error: 'Pengingat tidak ditemukan' };
  if (p.status !== undefined && p.status !== null) rows[idx].status = String(p.status);
  writeSheet_('Pengingat', rows);
  return { ok: true, message: 'Status pengingat diperbarui' };
}

const SETTINGS_PROFIL_MAP = {
  invoicePrefix: 'invoice_prefix',
  dueDays: 'due_days',
  lateFee: 'late_fee',
  autoReminder: 'auto_reminder',
  waApi: 'wa_api',
  waTemplate: 'wa_template',
  smtpHost: 'smtp_host',
  smtpPort: 'smtp_port',
  backupAuto: 'backup_auto',
  backupFreq: 'backup_freq',
};

function handleSaveSettings_(p) {
  const s = p.settings || {};
  const general = s.general || {};
  for (const k of PROFILE_KEYS) {
    if (general[k] !== undefined && general[k] !== null) setProfil_(k, String(general[k]));
  }
  for (const [field, key] of Object.entries(SETTINGS_PROFIL_MAP)) {
    if (s[field] !== undefined && s[field] !== null) setProfil_(key, String(s[field]));
  }
  return { ok: true, message: 'Pengaturan berhasil disimpan' };
}

/* ────────────────────────── Util Data Sheet ────────────────────────── */

function getSpreadsheet_() {
  return SS_ID ? SpreadsheetApp.openById(SS_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet_(name) {
  return getSpreadsheet_().getSheetByName(name);
}

function ensureSheets_() {
  const ss = getSpreadsheet_();
  Object.entries(HEADERS).forEach(([name, headers]) => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  });
}

function readSheet_(name) {
  const sheet = getSheet_(name);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const row = {};
    let empty = true;
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[i][j];
      if (values[i][j] !== '' && values[i][j] !== null && values[i][j] !== undefined) empty = false;
    }
    if (!empty) rows.push(row);
  }
  return rows;
}

function appendRow_(name, obj) {
  const headers = HEADERS[name];
  const sheet = getSheet_(name);
  const row = headers.map(h => (obj[h] !== undefined && obj[h] !== null ? obj[h] : ''));
  sheet.appendRow(row);
}

function writeSheet_(name, rows) {
  const headers = HEADERS[name];
  const sheet = getSheet_(name);
  sheet.clearContents();
  if (!rows.length) {
    sheet.appendRow(headers);
    return;
  }
  const values = [headers].concat(
    rows.map(r => headers.map(h => (r[h] !== undefined && r[h] !== null ? r[h] : '')))
  );
  sheet.getRange(1, 1, values.length, headers.length).setValues(values);
}

function deleteRowById_(name, id) {
  const rows = readSheet_(name);
  const idx = rows.findIndex(r => String(r.id) === String(id));
  if (idx === -1) return false;
  rows.splice(idx, 1);
  writeSheet_(name, rows);
  return true;
}

function setProfil_(key, value) {
  const rows = readSheet_('Profil');
  const idx = rows.findIndex(r => r.key === key);
  if (idx >= 0) rows[idx].value = value;
  else rows.push({ key, value });
  writeSheet_('Profil', rows);
}

function appendLog_(text) {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName('Log');
  if (!sheet) sheet = ss.insertSheet('Log');
  sheet.appendRow([new Date().toISOString(), text]);
}

function today_() {
  return Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd MMM yyyy');
}

/* ────────────────────────── Seed Data Awal ────────────────────────── */

function seedIfEmpty_() {
  if (!readSheet_('Pengguna').length) {
    appendRow_('Pengguna', { id: 'ADM-001', nama: 'Admin Utama', email: 'admin@mdnetwork.co.id', password: 'admin123', role: 'Super Administrator', aktif: 'Y' });
    appendRow_('Pengguna', { id: 'KSR-001', nama: 'Budi Kasir', email: 'kasir@mdnetwork.co.id', password: 'kasir123', role: 'Kasir', aktif: 'Y' });
    appendRow_('Pengguna', { id: 'TKN-001', nama: 'Rian Teknisi', email: 'teknisi@mdnetwork.co.id', password: 'teknisi123', role: 'Teknisi', aktif: 'Y' });
  }
  if (!readSheet_('Paket').length) {
    appendRow_('Paket', { id: 'PKG-001', nama: 'WiFi Basic (10 Mbps)', kecepatan: '10 Mbps', harga: '150000' });
    appendRow_('Paket', { id: 'PKG-002', nama: 'WiFi Family (20 Mbps)', kecepatan: '20 Mbps', harga: '150000' });
    appendRow_('Paket', { id: 'PKG-003', nama: 'WiFi Pro (50 Mbps)', kecepatan: '50 Mbps', harga: '350000' });
    appendRow_('Paket', { id: 'PKG-004', nama: 'Ultra-Net (100 Mbps)', kecepatan: '100 Mbps', harga: '500000' });
  }
  if (!readSheet_('Pelanggan').length) seedPelanggan_();
  if (!readSheet_('Profil').length) {
    setProfil_('company', 'MD_Network');
    setProfil_('email', 'admin@mdnetwork.co.id');
    setProfil_('phone', '081234567890');
    setProfil_('address', 'Jl. Raya Internet No. 45, Jakarta Pusat');
    setProfil_('currency', 'IDR');
    setProfil_('language', 'id');
    setProfil_('timezone', 'WIB');
    setProfil_('invoice_prefix', 'INV');
    setProfil_('due_days', '7');
    setProfil_('late_fee', '2');
    setProfil_('auto_reminder', 'true');
  }
}

function seedPelanggan_() {
  const d = (id, nama, whatsapp, paket, area, alamat, status, tgl) =>
    appendRow_('Pelanggan', { id, nama, whatsapp, paket, area, alamat, status, tgl_register: tgl });

  d('ISP-001', 'Ahmad Subarjo', '08123456789', 'WiFi Family (20 Mbps)', 'Pusat', 'Jl. Merdeka No. 12, Jakarta Pusat', 'Aktif', '15 Jan 2023');
  d('ISP-002', 'Siti Wahyuni', '08198765432', 'WiFi Pro (50 Mbps)', 'Utara', 'Jl. Sudirman No. 45, Jakarta Utara', 'Belum Bayar', '20 Feb 2023');
  d('ISP-003', 'Bambang Pamungkas', '08112233445', 'WiFi Basic (10 Mbps)', 'Selatan', 'Jl. Gatot Subroto No. 8, Jakarta Selatan', 'Jatuh Tempo', '05 Mar 2023');
  d('ISP-004', 'Rian Hidayat', '08155667788', 'WiFi Pro (50 Mbps)', 'Utara', 'Jl. Kelapa Gading No. 3, Jakarta Utara', 'Belum Bayar', '10 Apr 2023');
  d('ISP-005', 'Dewi Sartika', '08144556677', 'Ultra-Net (100 Mbps)', 'Pusat', 'Jl. Thamrin No. 21, Jakarta Pusat', 'Nunggak', '01 Feb 2023');
  d('ISP-006', 'Farhan Malik', '08122334455', 'WiFi Basic (10 Mbps)', 'Selatan', 'Jl. Kuningan No. 7, Jakarta Selatan', 'Tidak Aktif', '01 Jan 2023');

  const t = (no, cust, periode, nominal, jatuh, status) => {
    const id = 'TGH-' + no;
    appendRow_('Tagihan', { id, no_invoice: no, id_pelanggan: cust, periode, nominal: String(nominal), jatuh_tempo: jatuh, status, tgl_dibuat: today_() });
    return id;
  };

  const tgh1 = t('INV-20251001', 'ISP-001', 'Okt 2025', 150000, '10 Okt 2025', 'Lunas');
  t('INV-20251002', 'ISP-002', 'Okt 2025', 350000, '10 Okt 2025', 'Belum Dibayar');
  t('INV-20251003', 'ISP-003', 'Okt 2025', 150000, '10 Okt 2025', 'Jatuh Tempo');
  t('INV-20251004', 'ISP-004', 'Okt 2025', 350000, '10 Okt 2025', 'Belum Dibayar');
  t('INV-20251005', 'ISP-005', 'Okt 2025', 500000, '10 Okt 2025', 'Nunggak');

  appendRow_('Pembayaran', { id: 'PMB-001', no_trx: 'TRX-20251001', id_tagihan: tgh1, id_pelanggan: 'ISP-001', nominal: '150000', metode: 'Transfer Bank', tgl: today_(), status: 'Lunas', petugas: 'Admin' });
  appendRow_('Transaksi', { id: 'TRX-20251001', keterangan: 'Pembayaran tagihan INV-20251001', tipe: 'Pemasukan', nominal: '150000', petugas: 'Admin', tgl: today_() });
}
