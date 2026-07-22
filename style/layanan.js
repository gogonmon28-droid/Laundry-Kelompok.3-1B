let nomor = 2;
        function tambahLayanan() {
            let layanan = document.getElementById("layanan").value;
            let harga = document.getElementById("harga").value;
            let estimasi = document.getElementById("estimasi").value;
            if (layanan == "" || harga == "" || estimasi == "") { alert("Lengkapi data terlebih dahulu"); return; }
            let tabel = document.getElementById("dataLayanan");
            let row = tabel.insertRow();
            row.innerHTML = `<td>${nomor++}</td><td>${layanan}</td><td>${harga}</td><td>${estimasi}</td>
<td><button class="btn btn-warning btn-sm" onclick="editBaris(this)">Edit</button>
<button class="btn btn-danger btn-sm" onclick="hapusBaris(this)">Hapus</button></td>`;
            document.getElementById("layanan").value = "";
            document.getElementById("harga").value = "";
            document.getElementById("estimasi").value = "";
        }
        function hapusBaris(btn) { if (confirm("Yakin ingin menghapus layanan?")) btn.parentElement.parentElement.remove(); }
        function editBaris(btn) {
            let row = btn.parentElement.parentElement;
            let layanan = prompt("Edit Layanan", row.cells[1].innerText);
            let harga = prompt("Edit Harga", row.cells[2].innerText);
            let estimasi = prompt("Edit Estimasi", row.cells[3].innerText);
            if (layanan) row.cells[1].innerText = layanan;
            if (harga) row.cells[2].innerText = harga;
            if (estimasi) row.cells[3].innerText = estimasi;
        }
