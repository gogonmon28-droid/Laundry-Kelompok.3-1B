let nomor = 2;
        function tambahPelanggan() {
            let nama = document.getElementById("nama").value;
            let alamat = document.getElementById("alamat").value;
            let telepon = document.getElementById("telepon").value;
            if (nama == "" || alamat == "" || telepon == "") { alert("Silakan lengkapi data terlebih dahulu"); return; }
            let tabel = document.getElementById("dataPelanggan");
            let row = tabel.insertRow();
            row.innerHTML = `<td>${nomor++}</td><td>${nama}</td><td>${alamat}</td><td>${telepon}</td>
<td><button class="btn btn-warning btn-sm" onclick="editBaris(this)">Edit</button>
<button class="btn btn-danger btn-sm" onclick="hapusBaris(this)">Hapus</button></td>`;
            document.getElementById("nama").value = "";
            document.getElementById("alamat").value = "";
            document.getElementById("telepon").value = "";
        }
        function hapusBaris(btn) { if (confirm("Yakin ingin menghapus data?")) btn.parentElement.parentElement.remove(); }
        function editBaris(btn) {
            let row = btn.parentElement.parentElement;
            let nama = prompt("Edit Nama", row.cells[1].innerText);
            let alamat = prompt("Edit Alamat", row.cells[2].innerText);
            let telepon = prompt("Edit Telepon", row.cells[3].innerText);
            if (nama) row.cells[1].innerText = nama;
            if (alamat) row.cells[2].innerText = alamat;
            if (telepon) row.cells[3].innerText = telepon;
        }
