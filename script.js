// Master Data Destinasi Wisata
const DESTINATIONS = [
    {
        id: 'dest-1',
        name: 'Candi Borobudur',
        location: 'Magelang, Jawa Tengah',
        category: 'Budaya',
        price: 50000,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
        desc: 'Kemegahan candi Buddha terbesar di dunia yang menjadi salah satu keajaiban dunia.'
    },
    {
        id: 'dest-2',
        name: 'Pantai Kuta Bali',
        location: 'Badung, Bali',
        category: 'Pantai',
        price: 25000,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
        desc: 'Pantai legendaris dengan pemandangan matahari terbenam spektakuler dan ombak peselancar.'
    },
    {
        id: 'dest-3',
        name: 'Gunung Bromo',
        location: 'Probolinggo, Jawa Timur',
        category: 'Gunung',
        price: 75000,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80',
        desc: 'Nikmati pemandangan lautan pasir luas dan matahari terbit spektakuler dari puncak Bromo.'
    },
    {
        id: 'dest-4',
        name: 'Dufan Ancol',
        location: 'Jakarta Utara, DKI Jakarta',
        category: 'Wahana',
        price: 225000,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=600&q=80',
        desc: 'Taman hiburan tematik terbesar di Indonesia dengan puluhan wahana menantang adrenalin.'
    },
    {
        id: 'dest-5',
        name: 'Labuan Bajo & Komodo',
        location: 'Nusa Tenggara Timur',
        category: 'Pantai',
        price: 150000,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=600&q=80',
        desc: 'Rumah bagi kadal terbesar di dunia dan keindahan bukit padang savana berbalut laut biru.'
    },
    {
        id: 'dest-6',
        name: 'Taman Safari Bogor',
        location: 'Bogor, Jawa Barat',
        category: 'Wahana',
        price: 230000,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80',
        desc: 'Konservasi alam terbuka tempat Anda dapat berinteraksi langsung dengan aneka satwa luar biasa.'
    }
];

// App State Management
let currentCategory = 'all';
let selectedDest = null;
let ticketQuantity = 1;
let currentBookingData = null;

// Initialize Web App
document.addEventListener('DOMContentLoaded', () => {
    // Set minimal tanggal kunjungan = hari ini
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('visit-date').min = today;
    document.getElementById('visit-date').value = today;

    renderCatalog();
    updateHistoryBadge();
});

// Format Rupiah
function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// Navigation Handler
function showSection(sectionName) {
    const sections = ['catalog', 'booking', 'payment', 'ticket', 'history'];
    sections.forEach(s => {
        document.getElementById(`section-${s}`).classList.add('hidden');
    });

    document.getElementById(`section-${sectionName}`).classList.remove('hidden');

    // Update state tombol nav
    const navCatalog = document.getElementById('nav-catalog');
    const navHistory = document.getElementById('nav-history');

    if (sectionName === 'history') {
        renderHistory();
        navHistory.className = "nav-btn px-4 py-2 rounded-lg text-sm font-semibold transition text-indigo-600 bg-indigo-50";
        navCatalog.className = "nav-btn px-4 py-2 rounded-lg text-sm font-semibold transition text-gray-600 hover:text-indigo-600 hover:bg-gray-50";
    } else {
        navCatalog.className = "nav-btn px-4 py-2 rounded-lg text-sm font-semibold transition text-indigo-600 bg-indigo-50";
        navHistory.className = "nav-btn px-4 py-2 rounded-lg text-sm font-semibold transition text-gray-600 hover:text-indigo-600 hover:bg-gray-50";
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filter & Render Catalog
function setCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-filter-btn').forEach(btn => {
        if (btn.innerText.toLowerCase() === cat.toLowerCase() || (cat === 'all' && btn.innerText === 'Semua')) {
            btn.className = 'cat-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white transition';
        } else {
            btn.className = 'cat-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition';
        }
    });
    renderCatalog();
}

function filterDestinations() {
    renderCatalog();
}

function renderCatalog() {
    const grid = document.getElementById('destination-grid');
    const searchVal = document.getElementById('search-input').value.toLowerCase();

    const filtered = DESTINATIONS.filter(item => {
        const matchCategory = currentCategory === 'all' || item.category === currentCategory;
        const matchSearch = item.name.toLowerCase().includes(searchVal) || item.location.toLowerCase().includes(searchVal);
        return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-400">
                <i class="fa-solid fa-[#9ca3af] fa-circle-exclamation text-4xl mb-2"></i>
                <p class="text-sm">Destinasi wisata tidak ditemukan.</p>
            </div>`;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition border border-gray-100 flex flex-col">
            <div class="relative h-44 overflow-hidden">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover hover:scale-105 transition duration-300">
                <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1 shadow-sm">
                    <i class="fa-solid fa-[#eab308] fa-star text-amber-500"></i> ${item.rating}
                </span>
                <span class="absolute bottom-3 left-3 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                    ${item.category}
                </span>
            </div>
            <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    <h3 class="font-bold text-gray-800 text-base leading-snug">${item.name}</h3>
                    <p class="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <i class="fa-solid fa-[#9ca3af] fa-location-dot"></i> ${item.location}
                    </p>
                    <p class="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed">${item.desc}</p>
                </div>
                <div class="pt-3 border-t flex items-center justify-between">
                    <div>
                        <span class="text-[10px] text-gray-400 block">Mulai dari</span>
                        <span class="text-base font-extrabold text-indigo-600">${formatRupiah(item.price)}</span>
                    </div>
                    <button onclick="startBooking('${item.id}')" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition">
                        Pesan
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Select Destination & Open Booking Section
function startBooking(destId) {
    selectedDest = DESTINATIONS.find(d => d.id === destId);
    ticketQuantity = 1;
    document.getElementById('ticket-qty').innerText = ticketQuantity;

    // Set Destinasi Header di Form
    document.getElementById('booking-dest-header').innerHTML = `
        <img src="${selectedDest.image}" class="w-16 h-16 rounded-xl object-cover">
        <div>
            <h2 class="font-bold text-gray-800 text-base">${selectedDest.name}</h2>
            <p class="text-xs text-gray-500"><i class="fa-solid fa-[#9ca3af] fa-location-dot"></i> ${selectedDest.location}</p>
        </div>
    `;

    document.getElementById('form-ticket-price').innerText = `${formatRupiah(selectedDest.price)} / orang`;

    calculateTotal();
    showSection('booking');
}

// Quantity Counter
function updateQuantity(delta) {
    if (ticketQuantity + delta >= 1) {
        ticketQuantity += delta;
        document.getElementById('ticket-qty').innerText = ticketQuantity;
        calculateTotal();
    }
}

// Real-time Pricing Calculation
function calculateTotal() {
    if (!selectedDest) return;

    const subtotal = selectedDest.price * ticketQuantity;
    const hasGuide = document.getElementById('addon-guide').checked;
    const hasInsurance = document.getElementById('addon-insurance').checked;

    const guideCost = hasGuide ? 100000 : 0;
    const insuranceCost = hasInsurance ? (10000 * ticketQuantity) : 0;
    const adminFee = 5000;

    const grandTotal = subtotal + guideCost + insuranceCost + adminFee;

    // UI Updates
    document.getElementById('summary-qty-label').innerText = `${ticketQuantity}x Tiket Masuk`;
    document.getElementById('summary-subtotal').innerText = formatRupiah(subtotal);

    document.getElementById('summary-guide-row').style.display = hasGuide ? 'flex' : 'none';

    const insRow = document.getElementById('summary-insurance-row');
    if (hasInsurance) {
        insRow.style.display = 'flex';
        document.getElementById('summary-insurance').innerText = formatRupiah(insuranceCost);
    } else {
        insRow.style.display = 'none';
    }

    document.getElementById('summary-grand-total').innerText = formatRupiah(grandTotal);
}

// Proceed to Payment Step
function proceedToPayment() {
    const name = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;
    const phone = document.getElementById('cust-phone').value;
    const date = document.getElementById('visit-date').value;

    if (!name || !email || !phone || !date) {
        alert('Mohon lengkapi semua data pemesan!');
        return;
    }

    const hasGuide = document.getElementById('addon-guide').checked;
    const hasInsurance = document.getElementById('addon-insurance').checked;

    const subtotal = selectedDest.price * ticketQuantity;
    const guideCost = hasGuide ? 100000 : 0;
    const insuranceCost = hasInsurance ? (10000 * ticketQuantity) : 0;
    const grandTotal = subtotal + guideCost + insuranceCost + 5000;

    // Generate unique booking code
    const bookingCode = 'TKT-' + Math.floor(100000 + Math.random() * 900000);

    currentBookingData = {
        bookingCode: bookingCode,
        destName: selectedDest.name,
        custName: name,
        custEmail: email,
        custPhone: phone,
        visitDate: date,
        qty: ticketQuantity,
        total: grandTotal,
        timestamp: new Date().toLocaleString('id-ID')
    };

    showSection('payment');
}

// Payment Tabs Switcher
function selectPaymentMethod(method) {
    ['qris', 'va', 'card'].forEach(m => {
        document.getElementById(`pay-content-${m}`).classList.add('hidden');
        document.getElementById(`tab-${m}`).className = 'pay-tab py-2 rounded-lg text-gray-600';
    });

    document.getElementById(`pay-content-${method}`).classList.remove('hidden');
    document.getElementById(`tab-${method}`).className = 'pay-tab py-2 rounded-lg bg-white shadow-sm text-indigo-600';
}

function copyVA() {
    navigator.clipboard.writeText('880012389100223');
    alert('Nomor Virtual Account berhasil disalin!');
}

// Complete Payment & Save Ticket
function processSimulatedPayment() {
    const btn = document.getElementById('btn-pay-confirm');
    btn.disabled = true;
    btn.innerText = 'Memproses Pembayaran...';

    setTimeout(() => {
        btn.disabled = false;
        btn.innerText = 'Konfirmasi Pembayaran Saya';

        // Simpan ke LocalStorage
        saveTicketToStorage(currentBookingData);

        // Pasang data ke E-Ticket
        document.getElementById('t-booking-code').innerText = currentBookingData.bookingCode;
        document.getElementById('t-dest-name').innerText = currentBookingData.destName;
        document.getElementById('t-cust-name').innerText = currentBookingData.custName;
        document.getElementById('t-visit-date').innerText = currentBookingData.visitDate;
        document.getElementById('t-qty').innerText = `${currentBookingData.qty} Orang`;
        document.getElementById('t-total').innerText = formatRupiah(currentBookingData.total);

        // QR Code Generator API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentBookingData.bookingCode}`;
        document.getElementById('t-qr-image').src = qrUrl;

        showSection('ticket');
    }, 1200);
}

// LocalStorage Helper
function getSavedTickets() {
    return JSON.parse(localStorage.getItem('gowisata_tickets') || '[]');
}

function saveTicketToStorage(ticket) {
    const tickets = getSavedTickets();
    tickets.unshift(ticket);
    localStorage.setItem('gowisata_tickets', JSON.stringify(tickets));
    updateHistoryBadge();
}

function updateHistoryBadge() {
    const count = getSavedTickets().length;
    const badge = document.getElementById('ticket-badge');
    if (count > 0) {
        badge.innerText = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// Render Riwayat Pemesanan
function renderHistory() {
    const tickets = getSavedTickets();
    const container = document.getElementById('history-container');

    if (tickets.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-8 text-center rounded-2xl border text-gray-400">
                <i class="fa-solid fa-[#9ca3af] fa-ticket-simple text-4xl mb-2"></i>
                <p class="text-sm">Belum ada riwayat tiket yang dibeli.</p>
            </div>`;
        return;
    }

    container.innerHTML = tickets.map(t => `
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="space-y-1">
                <div class="flex items-center gap-2">
                    <span class="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">${t.bookingCode}</span>
                    <span class="text-[10px] text-gray-400">${t.timestamp}</span>
                </div>
                <h4 class="font-bold text-gray-800 text-sm">${t.destName}</h4>
                <p class="text-xs text-gray-500">Tanggal Kunjungan: <span class="font-semibold text-gray-700">${t.visitDate}</span> (${t.qty} Tiket)</p>
            </div>
            <div class="text-right w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 flex sm:flex-col justify-between items-center sm:items-end">
                <span class="text-sm font-extrabold text-emerald-600">${formatRupiah(t.total)}</span>
                <span class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">LUNAS</span>
            </div>
        </div>
    `).join('');
}