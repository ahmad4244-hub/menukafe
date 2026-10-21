
/* =========================================
   1. DATA MENU CAFE
   =========================================
   Data ini merupakan contoh menu cafe.
   Harga menggunakan angka agar dapat dihitung.
*/

const menuData = [
  {
    id: 1,
    name: "Es Kopi Susu",
    category: "Minuman",
    price: 18000,
    description: "Perpaduan kopi, susu, dan gula aren.",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    available: true
  },
  {
    id: 2,
    name: "Es Cokelat",
    category: "Minuman",
    price: 17000,
    description: "Minuman cokelat dingin yang creamy.",
    image:
      "https://images.unsplash.com/photo-1542990253-0b8be7d4a2f5?auto=format&fit=crop&w=800&q=80",
    available: true
  },
  {
    id: 3,
    name: "Kentang Goreng",
    category: "Camilan",
    price: 15000,
    description: "Kentang renyah dengan saus pilihan.",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    available: true
  },
  {
    id: 4,
    name: "Rice Bowl Ayam",
    category: "Makanan",
    price: 22000,
    description: "Nasi hangat dengan ayam dan saus gurih.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    available: true
  },
  {
    id: 5,
    name: "Roti Panggang",
    category: "Camilan",
    price: 14000,
    description: "Roti panggang dengan topping cokelat.",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    available: true
  },
  {
    id: 6,
    name: "Americano",
    category: "Minuman",
    price: 14000,
    description: "Kopi dengan cita rasa yang kuat.",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    available: true
  }
];


/* =========================================
   2. VARIABEL APLIKASI
   ========================================= */

// Menampung daftar item yang dipilih pelanggan.
let cart = [];

// Kategori yang sedang dipilih.
let activeCategory = "Semua";

// Kata kunci pencarian.
let searchQuery = "";


/* =========================================
   3. FORMAT HARGA RUPIAH
   ========================================= */

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}


/* =========================================
   4. MEMBUAT TOMBOL KATEGORI
   ========================================= */

function renderCategories() {
  const categories = [
    "Semua",
    ...new Set(menuData.map(menu => menu.category))
  ];

  const container =
    document.getElementById("categoryButtons");

  container.innerHTML = categories.map(category => `
    <button
      type="button"
      class="category-btn ${
        category === activeCategory ? "active" : ""
      }"
      data-category="${category}"
    >
      ${category}
    </button>
  `).join("");

  // Event ketika pelanggan memilih kategori.
  container.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;

      renderCategories();
      renderMenus();
    });
  });
}


/* =========================================
   5. MENAMPILKAN MENU
   ========================================= */

function renderMenus() {
  const grid = document.getElementById("menuGrid");

  // Menyaring menu berdasarkan kategori dan kata kunci.
  const filteredMenus = menuData.filter(menu => {
    const matchesCategory =
      activeCategory === "Semua" ||
      menu.category === activeCategory;

    const matchesSearch =
      menu.name.toLowerCase().includes(searchQuery) ||
      menu.description.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  // Pesan jika hasil pencarian kosong.
  if (filteredMenus.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>Menu tidak ditemukan</h3>
        <p>Coba kata kunci atau kategori lain.</p>
      </div>
    `;
    return;
  }

  // Membuat kartu untuk setiap menu.
  grid.innerHTML = filteredMenus.map(menu => `
    <article class="menu-card">
      <div class="menu-image-wrap">
        <img
          class="menu-image"
          src="${menu.image}"
          alt="${menu.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Foto+Menu';"
        >

        <span class="category-label">
          ${menu.category}
        </span>
      </div>

      <div class="menu-info">
        <h3>${menu.name}</h3>

        <p class="menu-description">
          ${menu.description}
        </p>

        <div class="menu-bottom">
          <span class="menu-price">
            ${formatRupiah(menu.price)}
          </span>

          <button
            type="button"
            class="add-btn"
            data-add="${menu.id}"
            ${menu.available ? "" : "disabled"}
          >
            ${menu.available ? "+ Tambah" : "Menu Habis"}
          </button>
        </div>

        ${
          menu.available
            ? ""
            : '<span class="stock-label">Stok tidak tersedia</span>'
        }

        <button
          type="button"
          class="admin-stock-btn"
          data-stock="${menu.id}"
        >
          Admin demo: ${
            menu.available ? "Tandai habis" : "Aktifkan menu"
          }
        </button>
      </div>
    </article>
  `).join("");

  // Hubungkan tombol tambah dengan keranjang.
  grid.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.add));
    });
  });

  // Hubungkan tombol simulasi status menu.
  grid.querySelectorAll("[data-stock]").forEach(button => {
    button.addEventListener("click", () => {
      toggleAvailability(Number(button.dataset.stock));
    });
  });
}


/* =========================================
   6. MENAMBAHKAN MENU KE KERANJANG
   ========================================= */

function addToCart(menuId) {
  const menu = menuData.find(item => item.id === menuId);

  // Pastikan menu tersedia.
  if (!menu || !menu.available) return;

  const existingItem = cart.find(item => item.id === menuId);

  if (existingItem) {
    // Tambah jumlah jika menu sudah ada.
    existingItem.quantity += 1;
  } else {
    // Tambahkan menu baru ke keranjang.
    cart.push({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      quantity: 1
    });
  }

  renderCart();
  alert(menu.name + " ditambahkan ke keranjang.");
}


/* =========================================
   7. MENGUBAH JUMLAH PESANAN
   ========================================= */

function changeQuantity(menuId, change) {
  const item = cart.find(item => item.id === menuId);

  if (!item) return;

  item.quantity += change;

  // Hapus item ketika jumlahnya mencapai nol.
  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== menuId);
  }

  renderCart();
}


/* =========================================
   8. MENGHITUNG TOTAL HARGA
   ========================================= */

function calculateTotal() {
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}


/* =========================================
   9. MENAMPILKAN KERANJANG
   ========================================= */

function renderCart() {
  const list = document.getElementById("cartList");
  const count = document.getElementById("cartCount");
  const total = document.getElementById("cartTotal");

  const checkoutButton =
    document.getElementById("checkoutButton");

  // Hitung seluruh kuantitas pesanan.
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  count.textContent = totalItems;
  total.textContent = formatRupiah(calculateTotal());

  // Tombol checkout aktif jika keranjang tidak kosong.
  checkoutButton.disabled = cart.length === 0;

  // Tampilan jika belum ada pesanan.
  if (cart.length === 0) {
    list.innerHTML = `
      <p class="empty-state">
        Keranjang masih kosong. Silakan pilih menu.
      </p>
    `;
    return;
  }

  // Tampilkan seluruh item dalam keranjang.
  list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <small>
          ${formatRupiah(item.price)} × ${item.quantity}
        </small>
      </div>

      <div class="cart-controls">
        <button
          type="button"
          class="qty-btn"
          data-id="${item.id}"
          data-change="-1"
          aria-label="Kurangi ${item.name}"
        >−</button>

        <span>${item.quantity}</span>

        <button
          type="button"
          class="qty-btn"
          data-id="${item.id}"
          data-change="1"
          aria-label="Tambah ${item.name}"
        >+</button>
      </div>
    </div>
  `).join("");

  // Hubungkan tombol jumlah pesanan.
  list.querySelectorAll("[data-change]").forEach(button => {
    button.addEventListener("click", () => {
      changeQuantity(
        Number(button.dataset.id),
        Number(button.dataset.change)
      );
    });
  });
}


/* =========================================
   10. MENGUBAH STATUS KETERSEDIAAN MENU
   ========================================= */

function toggleAvailability(menuId) {
  const menu = menuData.find(item => item.id === menuId);

  if (!menu) return;

  // Ubah status tersedia menjadi habis atau sebaliknya.
  menu.available = !menu.available;

  // Hapus menu dari keranjang jika stok habis.
  if (!menu.available) {
    cart = cart.filter(item => item.id !== menuId);
  }

  renderMenus();
  renderCart();
}


/* =========================================
   11. FITUR PENCARIAN
   ========================================= */

document.getElementById("searchInput")
  .addEventListener("input", event => {
    searchQuery = event.target.value
      .trim()
      .toLowerCase();

    renderMenus();
  });


/* =========================================
   12. NAVIGASI HALAMAN
   ========================================= */

function scrollToMenu() {
  document.getElementById("menu").scrollIntoView({
    behavior: "smooth"
  });
}

function scrollToCart() {
  document.getElementById("cart").scrollIntoView({
    behavior: "smooth"
  });
}


/* =========================================
   13. PENGIRIMAN PESANAN VIA WHATSAPP
   ========================================= */

document.getElementById("checkoutForm")
  .addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Silakan pilih menu terlebih dahulu.");
      return;
    }

    const name =
      document.getElementById("customerName").value.trim();

    const table =
      document.getElementById("tableNumber").value;

    if (!name || !table) {
      alert("Lengkapi nama dan nomor meja.");
      return;
    }

    // Susun daftar menu yang akan dipesan.
    const orderDetails = cart.map(item =>
      `- ${item.name} x${item.quantity}: ` +
      formatRupiah(item.price * item.quantity)
    ).join("\n");

    // Buat isi pesan WhatsApp.
    const message = [
      "PESANAN MENU KITA",
      "Nama: " + name,
      "Meja: " + table,
      "",
      orderDetails,
      "",
      "Total: " + formatRupiah(calculateTotal())
    ].join("\n");

    /*
      Ganti nomor berikut dengan nomor WhatsApp cafe.
      Gunakan kode negara tanpa tanda + atau spasi.
      Contoh format Indonesia: 6281234567890
    */

    const whatsappNumber = "6281234567890";

    const whatsappURL =
      "https://wa.me/" + whatsappNumber +
      "?text=" + encodeURIComponent(message);

    const sendOrder = confirm(
      "Pesanan siap dikirim melalui WhatsApp.\n\n" +
      "Pilih OK untuk membuka WhatsApp."
    );

    if (sendOrder) {
      window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );
    }
  });


/* =========================================
   14. INISIALISASI APLIKASI
   ========================================= */

function initializeApp() {
  document.getElementById("currentYear").textContent =
    new Date().getFullYear();

  renderCategories();
  renderMenus();
  renderCart();
}

// Menjalankan aplikasi.
initializeApp();
</script>

</body>
</html>
