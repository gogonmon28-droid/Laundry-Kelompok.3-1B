/* ==========================================================================
   konsumen.js — Combined scripts for all pages
   ========================================================================== */

/* ---------- INDEX PAGE: Scroll-to-top button ---------- */
(function () {
  var scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", function () {
      scrollTopBtn.style.display = window.scrollY > 300 ? "flex" : "none";
    });
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();

/* ---------- KONSUMEN PAGE: Pesan Laundry ---------- */
function pesanLaundry() {
  var nama = document.getElementById("nama").value;
  if (nama == "") {
    alert("Nama harus diisi!");
    return;
  }
  var nomor = Math.floor(Math.random() * 900) + 100;
  var kode = "LDR" + nomor;
  document.getElementById("hasilPesan").style.display = "block";
  document.getElementById("kodePesanan").innerHTML =
    "<b>Kode Pesanan Anda : " + kode + "</b>";
}
