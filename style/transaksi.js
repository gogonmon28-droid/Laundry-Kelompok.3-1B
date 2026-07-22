let nomor = 2;
            let currentItems = []; // items cucian sementara untuk form input

            // Helper: menentukan warna badge berdasarkan jenis cucian
            // (mendukung kategori ukuran Kecil/Sedang/Besar untuk Karpet, Selimut, Boneka)
            function getBadgeColor(jenis) {
                const colors = {
                    'Cuci Kering': 'bg-info text-dark',
                    'Cuci Setrika': 'bg-success',
                    'Express': 'bg-danger',
                    'Setrika': 'bg-warning text-dark',
                    'Karpet': 'bg-secondary',
                    'Selimut': 'bg-primary',
                    'Boneka': 'bg-pink',
                    'Sepatu': 'bg-dark',
                    'Tas': 'bg-indigo'
                };
                if (colors[jenis]) return colors[jenis];
                if (jenis.startsWith('Karpet')) return colors['Karpet'];
                if (jenis.startsWith('Selimut')) return colors['Selimut'];
                if (jenis.startsWith('Boneka')) return colors['Boneka'];
                return 'bg-secondary';
            }

            // Helper: menentukan satuan tampilan (Kg untuk cucian timbang, pcs untuk item satuan)
            function getUnit(jenis) {
                const pcsItems = ['Karpet', 'Selimut', 'Boneka', 'Sepatu', 'Tas'];
                if (pcsItems.some(p => jenis.startsWith(p))) return 'pcs';
                return 'Kg';
            }

            // Auto-calculate subtotal saat pilih jenis + berat
            document.getElementById('itemLayanan').addEventListener('change', hitungSubtotal);
            document.getElementById('itemBerat').addEventListener('input', hitungSubtotal);

            function hitungSubtotal() {
                const val = document.getElementById('itemLayanan').value;
                const berat = parseFloat(document.getElementById('itemBerat').value) || 0;
                if (val && berat > 0) {
                    const harga = parseInt(val.split('|')[1]);
                    document.getElementById('itemSubtotal').value = 'Rp ' + (harga * berat).toLocaleString('id-ID');
                } else {
                    document.getElementById('itemSubtotal').value = '';
                }
            }

            function tambahItem() {
                const val = document.getElementById('itemLayanan').value;
                const berat = parseFloat(document.getElementById('itemBerat').value) || 0;
                if (!val || berat <= 0) { alert('Pilih jenis cucian dan masukkan berat/qty!'); return; }

                const parts = val.split('|');
                const jenis = parts[0];
                const harga = parseInt(parts[1]);
                const subtotal = harga * berat;

                currentItems.push({ jenis, berat, harga, subtotal });
                renderItemList();

                document.getElementById('itemLayanan').value = '';
                document.getElementById('itemBerat').value = '';
                document.getElementById('itemSubtotal').value = '';
            }

            function renderItemList() {
                const container = document.getElementById('daftarItem');

                if (currentItems.length === 0) {
                    container.innerHTML = '<div class="text-center text-muted" style="font-size:12px; padding:8px" id="emptyItemMsg">Belum ada item cucian ditambahkan</div>';
                    document.getElementById('grandTotal').textContent = 'Rp 0';
                    return;
                }

                container.innerHTML = currentItems.map((item, i) => {
                    const badgeClass = getBadgeColor(item.jenis);
                    return `<div class="item-cucian-row">
                        <span class="badge ${badgeClass}" style="font-size:10.5px">${item.jenis}</span>
                        <span>${item.berat} ${getUnit(item.jenis)}</span>
                        <span>@ Rp${item.harga.toLocaleString('id-ID')}</span>
                        <span><strong>Rp${item.subtotal.toLocaleString('id-ID')}</strong></span>
                        <button class="remove-item" onclick="hapusItem(${i})" title="Hapus">×</button>
                    </div>`;
                }).join('');

                const total = currentItems.reduce((sum, i) => sum + i.subtotal, 0);
                document.getElementById('grandTotal').textContent = 'Rp ' + total.toLocaleString('id-ID');
            }

            function hapusItem(index) {
                currentItems.splice(index, 1);
                renderItemList();
            }

            function tambahTransaksi() {
                let idPelanggan = document.getElementById("idPelanggan").value.trim();
                let nama = document.getElementById("nama").value.trim();
                let pesanan = document.getElementById("pesanan").value.trim();
                let metodeAmbil = document.getElementById("metodeAmbil").value.trim();
                let alamat = document.getElementById("alamat").value.trim();
                let status = document.getElementById("status").value.trim();
                let metodeBayar = document.getElementById("metodeBayar").value.trim();

                if (nama == "" || pesanan == "") { alert("Lengkapi nama dan ID pesanan!"); return; }
                if (currentItems.length === 0) { alert("Tambahkan minimal 1 item cucian!"); return; }

                let total = currentItems.reduce((sum, i) => sum + i.subtotal, 0);
                let tabel = document.getElementById("dataTransaksi");
                let row = tabel.insertRow();
                let tanggal = new Date().toLocaleString('id-ID');

                row.dataset.idPelanggan = idPelanggan;
                row.dataset.nama = nama;
                row.dataset.pesanan = pesanan;
                row.dataset.metodeAmbil = metodeAmbil;
                row.dataset.alamat = alamat;
                row.dataset.status = status;
                row.dataset.metodeBayar = metodeBayar;
                row.dataset.total = total;
                row.dataset.metode = metodeBayar;
                row.dataset.tanggal = tanggal;
                row.dataset.items = JSON.stringify(currentItems);

                // Build jenis cucian badge (HANYA MENGAMBIL ITEM PERTAMA)
                const firstItem = currentItems[0];
                const bc = getBadgeColor(firstItem.jenis);
                let badgesHtml = `<span class="badge ${bc}" style="font-size:10.5px">${firstItem.jenis} ${firstItem.berat}Kg</span>`;

                // Jika ada item tambahan, beri tanda penambahan
                if (currentItems.length > 1) {
                    badgesHtml += ` <span class="badge bg-secondary" style="font-size:10.5px">+${currentItems.length - 1} lainnya</span>`;
                }

                row.innerHTML = `
<td>${nomor++}</td>
<td>${nama}</td>
<td>${pesanan}</td>
<td>${badgesHtml}</td>
<td>Rp${total.toLocaleString('id-ID')}</td>
<td>${metodeBayar}</td>
<td><span class="badge bg-success">${status}</span></td>
<td>
<button class="btn btn-info btn-sm text-white" onclick="lihatDetail(this)">📋 Detail</button>
<button class="btn btn-success btn-sm" onclick="cetakStruk(this)">🧾 Struk</button>
<button class="btn btn-warning btn-sm" onclick="editBaris(this)">Edit</button>
<button class="btn btn-danger btn-sm" onclick="hapusBaris(this)">Hapus</button>
</td>`;

                // Reset form
                currentItems = [];
                renderItemList();
                document.getElementById("idPelanggan").value = "";
                document.getElementById("nama").value = "";
                document.getElementById("pesanan").value = "";
                document.getElementById("metodeAmbil").value = "";
                document.getElementById("alamat").value = "";
                document.getElementById("status").value = "Selesai";
                document.getElementById("metodeBayar").value = "Tunai";
            }

            function lihatDetail(btn) {
                let row = btn.closest('tr');
                document.getElementById("detailPesanan").innerText = row.dataset.pesanan || '-';
                document.getElementById("detailIdPelanggan").innerText = row.dataset.idPelanggan || '-';
                document.getElementById("detailNama").innerText = row.dataset.nama || '-';
                document.getElementById("detailMetodeAmbil").innerText = row.dataset.metodeAmbil || '-';
                document.getElementById("detailAlamat").innerText = row.dataset.alamat || '-';
                document.getElementById("detailStatus").innerText = row.dataset.status || '-';
                document.getElementById("detailMetodeBayar").innerText = row.dataset.metodeBayar || row.dataset.metode || '-';
                document.getElementById("detailTanggal").innerText = row.dataset.tanggal || '-';

                // Parse items lengkap untuk ditampilkan di modal detail
                let items = [];
                try { items = JSON.parse(row.dataset.items || '[]'); } catch (e) { }

                const tbody = document.getElementById("detailItemList");
                let grandTotal = 0;

                if (items.length > 0) {
                    tbody.innerHTML = items.map((item, i) => {
                        grandTotal += item.subtotal;
                        return `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${item.jenis}</td>
                            <td>${item.berat} ${getUnit(item.jenis)}</td>
                            <td>Rp${item.harga.toLocaleString('id-ID')}</td>
                            <td>Rp${item.subtotal.toLocaleString('id-ID')}</td>
                        </tr>`;
                    }).join('');
                } else {
                    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Tidak ada rincian item</td></tr>`;
                }

                document.getElementById("detailGrandTotal").innerText = 'Rp ' + grandTotal.toLocaleString('id-ID');

                // Buka modal Bootstrap secara rasional
                let modal = new bootstrap.Modal(document.getElementById('modalDetail'));
                modal.show();
            }

            function cetakStruk(btn) {
                let row = btn.closest('tr');
                document.getElementById("strukPesanan").innerText = row.dataset.pesanan || '-';
                document.getElementById("strukIdPelanggan").innerText = row.dataset.idPelanggan || '-';
                document.getElementById("strukNama").innerText = row.dataset.nama || '-';
                document.getElementById("strukMetode").innerText = row.dataset.metodeAmbil || '-';
                document.getElementById("strukAlamat").innerText = row.dataset.alamat || '-';
                document.getElementById("strukStatus").innerText = row.dataset.status || '-';
                document.getElementById("strukMetodeBayar").innerText = row.dataset.metodeBayar || row.dataset.metode || '-';
                document.getElementById("strukTanggal").innerText = row.dataset.tanggal || '-';

                let items = [];
                try { items = JSON.parse(row.dataset.items || '[]'); } catch (e) { }

                const tbody = document.getElementById("strukItemList");
                let total = 0;

                if (items.length > 0) {
                    tbody.innerHTML = items.map(item => {
                        total += item.subtotal;
                        return `
                        <tr>
                            <td>${item.jenis}</td>
                            <td>${item.berat} ${getUnit(item.jenis)}</td>
                            <td>Rp${item.subtotal.toLocaleString('id-ID')}</td>
                        </tr>`;
                    }).join('');
                } else {
                    tbody.innerHTML = `<tr><td colspan="3" class="text-center">Tidak ada item</td></tr>`;
                }

                document.getElementById("strukTotal").innerText = 'Rp' + total.toLocaleString('id-ID');

                let modal = new bootstrap.Modal(document.getElementById('modalStruk'));
                modal.show();
            }

            function hapusBaris(btn) {
                if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
                    let row = btn.closest('tr');
                    row.remove();
                }
            }

            function editBaris(btn) {
                alert('Fungsi Edit dapat disesuaikan dengan kebutuhan form Anda.');
            }
