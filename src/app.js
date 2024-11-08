document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Burger Beef Cheese", img: "1.png", price: 15000 },
      { id: 2, name: "Burger Chicken Cheese", img: "2.png", price: 15000 },
      { id: 3, name: "Burger Beef", img: "3.png", price: 12000 },
      { id: 4, name: "Burger Chicken", img: "4.png", price: 12000 },
      { id: 5, name: "Burger Medium", img: "5.png", price: 6000 },
      { id: 6, name: "Burger Mini", img: "6.png", price: 4000 },
      { id: 7, name: "Lumpia Beef", img: "7.png", price: 12000 },
      { id: 8, name: "Lumpia Beef Cheese", img: "7.png", price: 15000 },
      { id: 9, name: "Pisang Nugget", img: "9.png", price: 10000 },
      { id: 10, name: "Chicken Katsu + Nasi", img: "10.png", price: 15000 },
    ],
  }));
  // Buat object bernama cart
  // Object cart memiliki array bernama items
  // fungsi add menambahkan data item baru(newItem) kedalam object items
  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // alert("Produk berhasil ditambahkan ke keranjang!");
      // Cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);
      //  Jika blm ada/cart masih kosong
      if (!cartItem) {
        alert("Produk berhasil ditambahkan ke keranjang!");
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // Jika barang sudah ada, cek apakah barangnya sama atau beda dengan yang ada di cart
        this.items = this.items.map((item) => {
          // Jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // Jika barang sudah ada, tambah quantity dan subtotalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yg mau diremove berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri item 1 per 1
        this.items.map((item) => {
          // jika bukan barang yg di klik atau id nya tidak sama dengan barang yg di klik
          if (item.id !== id) {
            return item;
          } else {
            // kurangi quantity per barangnya dan juga hitung ulang total harga per itemnya
            item.quantity--;
            item.total = item.price * item.quantity;
            // kemudian kurangi quantity keseluruhan barang dan juga total harga dikurangi harga 1 buah barangnya
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
        // jika barangnya sisa 1
      } else if (cartItem.quantity === 1) {
        // buat array baru yg berisi semua barang di array lama kecuali barang yg kita klik
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutBtn = document.getElementById("checkout-btn");
const loadingBtn = document.getElementById("loading-btn");
const form = document.getElementById("checkout-form");

// Function untuk memeriksa apakah semua input sudah terisi
function checkForm() {
  let allFilled = true;

  // Memeriksa setiap elemen input dalam form
  // for (let i = 0; i < form.elements.length; i++) {
  for (let i = 0; i < 3; i++) {
    if (
      form.elements[i].nodeName === "INPUT" &&
      form.elements[i].value.trim() === ""
    ) {
      allFilled = false;
      break;
    }
    // Jika elemen tersebut adalah elemen input (nodeName === "INPUT")
    // dan nilai dari input tersebut kosong setelah di-trim (value.trim() === ""),
    // maka allFilled di-set ke false dan loop dihentikan dengan break.
  }

  // Mengatur status tombol checkout berdasarkan nilai allFilled
  // Jika input sudah terisi
  if (allFilled) {
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove("disabled");
  } else {
    // Jika input belum terisi
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add("disabled");
  }
}
// Event listener untuk setiap input di dalam form
form.addEventListener("input", checkForm);

// Checkout Form
const scriptURL =
  "https://script.google.com/macros/s/AKfycbx0gP8ZM-l0TA7Mxi9gQh0K2oGyAMmWEKOBfS_UOiqg28FDH4XzUw3BVfF3gzt7r-vvGQ/exec";
const formOrder = document.forms["order-form"];

// Format pesan WA
const formatMessage = (obj) => {
  return `
  _Pesanan Saya:_
  - Nama: ${obj.name}
  - Request: ${obj.request}
  - Request Tambahan: ${obj.request2}
  
_Data Pesanan:_
 ${JSON.parse(obj.items).map(
   (item) => ` ${item.name} (${item.quantity} x ${rupiah(item.total)})\n`
 )}
*Total: ${rupiah(obj.total)}*

_Catatan:_ 
Jika ingin transfer, bisa melalui:
- 6785100101 (BCA)
- 0813-8388-7134 (DANA)
- a/n Muhammad Rizki Maulana
- Screenshot bukti tf & kirim ke nomor ini

*Terimakasih!!* Pesanan anda sedang dalam proses. Mohon ditunggu ya...`;
};

// Konversi rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Kerika Form Checkout di submit
formOrder.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(formOrder);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);

  // Redirect ke WA
  window.open(
    "https://wa.me/6289682468818?text=" + encodeURIComponent(message),
    "_blank"
  );

  // aktifkan btn loading, non-aktifkan btn checkout
  checkoutBtn.classList.toggle("none");
  loadingBtn.classList.toggle("none");
  loadingBtn.disabled = true;
  // Fetch data & post ke spreadsheet
  fetch(scriptURL, { method: "POST", body: new FormData(formOrder) })
    .then((response) => {
      // Bila sukses, aktifkan btn checkout, non-aktifkan btn loading
      console.log("Success!", response);
      loadingBtn.classList.toggle("none");
      checkoutBtn.classList.toggle("none");
      // Reset form
      formOrder.reset();
    })
    .catch((error) => console.error("Error!", error.message));
});

// Review Form
const scriptURL2 =
  "https://script.google.com/macros/s/AKfycbzYVsk6Ctkabf1PqILklejT1YdnWhW56AdMx_JsQWF9GXl7cYP0-sWfBQis4SSrHGio_w/exec";
const formReview = document.forms["review-form"];
const reviewBtn = document.getElementById("review-btn");
const loadingBtn2 = document.getElementById("loading-btn2");

// Ketika Form review di submit
formReview.addEventListener("submit", (e) => {
  e.preventDefault();
  // aktifkan btn loading, non-aktifkan btn checkout
  reviewBtn.classList.toggle("none");
  loadingBtn2.classList.toggle("none");
  loadingBtn2.disabled = true;
  fetch(scriptURL2, { method: "POST", body: new FormData(formReview) })
    .then((response) => {
      // Bila sukses, aktifkan btn review, non-aktifkan btn loading
      console.log("Success!", response);
      loadingBtn2.classList.toggle("none");
      reviewBtn.classList.toggle("none");
      alert("Terimakasih! Ulasan anda sudah terkirim!");
      // Reset form
      formReview.reset();
    })
    .catch((error) => console.error("Error!", error.message));
});
