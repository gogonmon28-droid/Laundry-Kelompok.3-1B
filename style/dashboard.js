const adminPesananKey = 'laundryPesanan';
        function loadLatestOrders() {
            const orders = JSON.parse(localStorage.getItem(adminPesananKey) || '[]');
            const latest = orders.slice(-5).reverse();
            const tbody = document.getElementById('latestOrders');
            if (!tbody) return;
            tbody.innerHTML = latest.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.nama}</td>
            <td>${order.layanan}</td>
            <td>${order.metode || '-'}</td>
            <td>${order.berat} Kg</td>
            <td>${order.status}</td>
            <td>${order.alamat}</td>
        </tr>
    `).join('') || '<tr><td colspan="7" class="text-center">Belum ada pesanan terbaru</td></tr>';
        }
        window.onload = loadLatestOrders;
