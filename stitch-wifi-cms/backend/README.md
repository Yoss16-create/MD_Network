# Backend Stitch WiFi CMS (Google Apps Script)

Backend REST sederhana untuk `stitch-wifi-cms`, disimpan di **Google Spreadsheet**.
Semua data (pengguna, pelanggan, paket, tagihan, pembayaran, transaksi,
pengingat, pengaturan) tersimpan per-sheet.

## Cara Deploy

### Opsi A — Manual (tanpa alat tambahan)

1. Buka <https://script.google.com> → **New project**.
2. Ganti nama proyek (mis. `stitch-wifi-backend`).
3. Hapus isi `Code.gs` bawaan, lalu **salin-tempel isi** `backend/Code.gs`.
4. (Wajib) Buat satu Spreadsheet baru di Google Drive. Salin **ID Spreadsheet**
   (bagian URL antara `/d/` dan `/edit`), lalu isi konstanta `SS_ID` di paling
   atas `Code.gs`.
5. Klik **Deploy → New deployment** → pilih type **Web app**.
   - Description: `v1`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
   - Klik **Deploy**, lalu **izinkan** permission ketika diminta.
6. Salin **URL Web app** (berakhiran `/exec`) ke `.env` frontend:
   ```
   VITE_API_URL=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
   ```
7. Deploy ulang Web app setiap kali `Code.gs` diubah (Deploy → Manage
   deployments → Edit → **New version**).

### Opsi B — pakai `clasp` (CLI)

```bash
npm i -g @google/clasp
clasp login
clasp create --type standalone --title "stitch-wifi-backend"
# buat Spreadsheet, catat ID-nya, isi SS_ID di Code.gs
cp appsscript.json Code.gs <folder-clasp>/
cd <folder-clasp>
clasp push
clasp deploy --description "v1"
```

Ambil deployment URL dari `clasp deployments` dan pasang ke `.env` frontend.

## Action yang Didukung

| Action            | Payload (contoh)                                              | Keterangan                                   |
| ----------------- | ------------------------------------------------------------- | -------------------------------------------- |
| `ping`            | `{}`                                                          | Cek koneksi                                  |
| `login`           | `{ email, password }` atau `{ username, password }`           | Balas `{ user }`                             |
| `register`        | `{ name, email, password, company }`                          | Daftar pengguna baru                         |
| `getAll`          | `{}`                                                          | Semua data 8 sheet                           |
| `create_pelanggan`| `{ nama, whatsapp, paket, area, alamat, status }`             | Tambah pelanggan                             |
| `hapus_pelanggan` | `{ id }`                                                      | Hapus pelanggan                              |
| `add_tagihan`     | `{ id_pelanggan, periode, nominal, jatuh_tempo, status }`     | Buat invoice                                 |
| `bayar`           | `{ no_invoice }` atau `{ id }`                                | Tandai lunas + catat pembayaran & transaksi  |
| `kirim_wa`        | `{ wa, pesan }`                                               | Catat pesan (Apps Script tidak kirim WA asli)|
| `forgot_password` | `{ email }`                                                   | Reset ke `password123`                       |
| `update_profil`   | `{ company, email, phone, address, ... }`                     | Simpan profil perusahaan                     |
| `ubah_password`   | `{ email, current, newPassword }`                             | Ganti password                               |
| `add_pengingat`   | `{ name, wa, pkg, amount, due, status }`                      | Tambah pengingat                             |
| `update_pengingat`| `{ nama, status }`                                            | Update status pengingat                      |
| `save_settings`   | `{ section, settings: {...} }`                                | Simpan pengaturan ke sheet `Profil`          |

Semua request wajib **POST** dengan body JSON dan header
`Content-Type: text/plain;charset=utf-8` (Apps Script tidak mendukung
CORS preflight). Respons selalu `{ ok: true, ... }` atau `{ ok: false, error }`.

## Akun Demo (otomatis dibuat saat pertama kali)

| Role                 | Email                    | Password   |
| -------------------- | ------------------------ | ---------- |
| Super Administrator  | admin@mdnetwork.co.id    | admin123   |
| Kasir                | kasir@mdnetwork.co.id    | kasir123   |
| Teknisi              | teknisi@mdnetwork.co.id  | teknisi123 |

## Uji Cepat (PowerShell / Node)

```powershell
$body = @{ action = "getAll" } | ConvertTo-Json -Compress
$url  = "https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec"
Invoke-RestMethod -Method Post -Uri $url -Headers @{ "Content-Type" = "text/plain;charset=utf-8" } -Body $body
```
