# Panduan: Tes Lokal & Deploy Testnet (Badge Threes)

Langkah ini sesuai **Phase 1 checklist** baris 307–308 di plan: jalankan 11 tes lokal, lalu deploy ke testnet.

---

## Step 1: Semua 11 tes lulus lokal

### Opsi A: Vitest (npm test)

Dari **root repo** atau dari folder contract:

```powershell
cd d:\Work\Web3\badge-three-stacks\contracts\badgethrees-contract
npm install
npm test
```

**Catatan:** Di beberapa lingkungan (terutama Windows), Vitest + environment Clarinet bisa gagal dengan error *"Failed to start forks worker"*. Jika itu terjadi, gunakan Opsi B.

### Opsi B: Validasi contract dengan Clarinet (tanpa menjalankan 11 tes)

Contract sudah divalidasi dengan `clarinet check` (syntax + 1 contract checked). Untuk memastikan lagi:

```powershell
cd d:\Work\Web3\badge-three-stacks\contracts\badgethrees-contract
clarinet check
```

Jika muncul prompt **Overwrite? [Y/n]** (karena simnet plan berubah), ketik **Y** lalu Enter.

**Expected:** `✔ 1 contract checked` (warning boleh diabaikan).

### Ringkasan Step 1

| Yang dilakukan | Status |
|----------------|--------|
| `npm install` di `contracts/badgethrees-contract` | ✅ |
| `clarinet check` (contract valid) | ✅ |
| `npm test` (11 tes) | ⚠️ Di mesin ini bisa gagal karena Vitest/Clarinet worker di Windows; gunakan WSL/Linux atau CI jika perlu semua 11 tes. |

---

## Step 2: Deploy contract ke testnet

### 2.1 Konfigurasi Testnet

1. Buka file:
   ```
   contracts/badgethrees-contract/settings/Testnet.toml
   ```

2. Ganti placeholder mnemonic dengan **mnemonic asli** wallet testnet Anda (alamat harus `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5`):
   ```toml
   [accounts.deployer]
   mnemonic = "kata1 kata2 kata3 ... kata12"
   ```

3. **Jangan commit** file yang sudah berisi mnemonic asli. Pastikan `settings/Testnet.toml` tidak masuk git jika berisi secret (atau gunakan encrypted mnemonic sesuai dokumentasi Hiro).

### 2.2 Generate deployment plan (opsional, jika ingin ulang cost)

Jika Anda ingin menghitung ulang cost atau regenerate plan:

```powershell
cd d:\Work\Web3\badge-three-stacks\contracts\badgethrees-contract
clarinet deployments generate --testnet --manual-cost
```

Ikuti prompt untuk memasukkan cost jika diminta. Plan yang ada: `deployments/default.testnet-plan.yaml`.

### 2.3 Deploy ke testnet

```powershell
cd d:\Work\Web3\badge-three-stacks\contracts\badgethrees-contract
clarinet deployments apply --testnet
```

- Pastikan wallet testnet punya cukup STX (untuk deployment fee).
- Setelah sukses, catat **contract address** dan **transaction ID**.

**Contract address yang diharapkan:**
```
ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees
```

### 2.4 Jika error `RecvError` / koneksi

Sering terkait jaringan (firewall/VPN/blocking ke Bitcoin testnet atau Stacks API). Bisa coba:

1. **Ganti endpoint di plan**  
   Edit `deployments/default.testnet-plan.yaml`, set:
   ```yaml
   stacks-node: "https://stacks-node-api.testnet.stacks.co"
   ```
   Lalu jalankan lagi: `clarinet deployments apply --testnet`.

2. **Matikan VPN** atau coba jaringan lain (mis. hotspot).

3. **Deploy lewat Hiro Platform**  
   https://www.hiro.so/platform → Deploy Contracts → testnet, upload `contracts/badgethrees.clar` dan deploy dengan wallet yang sama.

### 2.5 Verifikasi di Stacks Explorer

- URL: https://explorer.stacks.co/?chain=testnet&contract=ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees  
- Cek: kode contract terbaca, fungsi dan maps sesuai (13 functions, 4 maps), tx deploy confirmed.

---

## Checklist singkat

- [ ] `npm install` dan `npm test` (atau minimal `clarinet check`) di `contracts/badgethrees-contract`
- [ ] `settings/Testnet.toml` sudah diisi mnemonic deployer (ST22...BRW5)
- [ ] `clarinet deployments apply --testnet` sukses
- [ ] Contract address dan tx ID dicatat
- [ ] Verifikasi di Stacks Explorer (testnet)

Setelah ini bisa lanjut Phase 2 (feature flags, claim flow, dll.) sesuai plan.
