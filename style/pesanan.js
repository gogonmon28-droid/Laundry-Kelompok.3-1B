const adminPesananKey = "laundryPesanan";
            let nomor = 2;
            function renderOrders() {
                const orders = JSON.parse(localStorage.getItem(adminPesananKey) || "[]");
                const tabel = document.getElementById("dataPesanan");
                if (!tabel) return;
                tabel.innerHTML = "";
                orders.forEach((order) => {
                    const row = tabel.insertRow();
                    row.dataset.orderId = order.id;
                    row.innerHTML = `
<td>${order.id}</td>
<td>${order.nama || "Konsumen"}</td>
<td>${order.layanan || "-"}</td>
<td>${order.status || "Proses"}</td>
<td>Rp${Number(order.total || 0).toLocaleString("id-ID")}</td>
<td>
<button class="btn btn-info btn-sm text-white" onclick="showDetail(${order.id})">Detail</button>
<button class="btn btn-warning btn-sm" onclick="editBaris(this)">Edit</button>
<button class="btn btn-danger btn-sm" onclick="hapusBaris(this)">Hapus</button>
</td>`;
                });
                nomor = orders.length + 1;
                renderBarangMasuk(orders);
            }
            function renderBarangMasuk(orders) {
                const tabel = document.getElementById("dataBarangMasuk");
                if (!tabel) return;
                const masuk = orders.filter((o) => (o.status || "Proses") === "Proses");
                tabel.innerHTML = masuk.map((o) => `
<tr><td>${o.nama||"Konsumen"}</td><td>${o.layanan||"-"}</td><td>${o.berat||0} Kg</td>
<td>${o.metode||"-"}</td><td>${o.createdAt?new Date(o.createdAt).toLocaleString("id-ID"):"-"}</td></tr>
`).join("") || '<tr><td colspan="5" class="text-center">Belum ada barang masuk</td></tr>';
            }
            function showDetail(orderId) {
                const orders = JSON.parse(localStorage.getItem(adminPesananKey) || "[]");
                const order = orders.find((o) => Number(o.id) === Number(orderId));
                if (!order) return;
                document.getElementById("detailId").innerText = order.id;
                document.getElementById("detailIdPelanggan").innerText = order.idPelanggan || "-";
                document.getElementById("detailNama").innerText = order.nama || "-";
                document.getElementById("detailLayanan").innerText = order.layanan || "-";
                document.getElementById("detailMetode").innerText = order.metode || "-";
                document.getElementById("detailBerat").innerText = `${order.berat || 0} Kg`;
                document.getElementById("detailAlamat").innerText = order.alamat || "-";
                document.getElementById("detailStatus").innerText = order.status || "-";
                document.getElementById("detailMetodeBayar").innerText = order.metodeBayar || "-";
                document.getElementById("detailWaktu").innerText = order.createdAt ? new Date(order.createdAt).toLocaleString("id-ID") : "-";
                document.getElementById("detailTotal").innerText = `Rp${Number(order.total || 0).toLocaleString("id-ID")}`;
                const modal = new bootstrap.Modal(document.getElementById("modalDetail"));
                modal.show();
            }
            function simpanKeStorage(order) {
                const orders = JSON.parse(localStorage.getItem(adminPesananKey) || "[]");
                orders.push(order);
                localStorage.setItem(adminPesananKey, JSON.stringify(orders));
            }
            function tambahPesanan() {
                let idPelanggan = document.getElementById("idPelanggan").value.trim();
                let nama = document.getElementById("nama").value.trim();
                let layanan = document.getElementById("layanan");
                let harga = parseInt(layanan.value);
                let namaLayanan = layanan.options[layanan.selectedIndex].text;
                let metode = document.getElementById("metode").value;
                let berat = document.getElementById("berat").value;
                let alamat = document.getElementById("alamat").value.trim();
                let status = document.getElementById("status").value;
                if (nama == "" || layanan.value == "" || metode == "" || berat == "" || alamat == "") {
                    alert("Lengkapi data terlebih dahulu"); return;
                }
                let total = harga * berat;
                const order = {
                    id: nomor++, idPelanggan, nama, layanan: namaLayanan, metode,
                    berat: Number(berat), status, total, alamat, metodeBayar: "-",
                    createdAt: new Date().toISOString()
                };
                simpanKeStorage(order);
                renderOrders();
                document.getElementById("idPelanggan").value = "";
                document.getElementById("nama").value = "";
                document.getElementById("layanan").selectedIndex = 0;
                document.getElementById("metode").selectedIndex = 0;
                document.getElementById("berat").value = "";
                document.getElementById("alamat").value = "";
            }
            function hapusBaris(btn) {
                if (confirm("Yakin ingin menghapus pesanan?")) {
                    const row = btn.parentElement.parentElement;
                    const orderId = Number(row.dataset.orderId);
                    const orders = JSON.parse(localStorage.getItem(adminPesananKey) || "[]");
                    const filtered = orders.filter((o) => Number(o.id) !== orderId);
                    localStorage.setItem(adminPesananKey, JSON.stringify(filtered));
                    renderOrders();
                }
            }
            function editBaris(btn) {
                let row = btn.parentElement.parentElement;
                const orderId = Number(row.dataset.orderId);
                const orders = JSON.parse(localStorage.getItem(adminPesananKey) || "[]");
                const order = orders.find((o) => Number(o.id) === orderId);
                if (!order) return;
                let nama = prompt("Edit Nama", order.nama);
                let status = prompt("Edit Status (Proses/Selesai/Diantar)", order.status);
                if (nama) order.nama = nama;
                if (status) order.status = status;
                localStorage.setItem(adminPesananKey, JSON.stringify(orders));
                renderOrders();
            }
            window.onload = renderOrders;
