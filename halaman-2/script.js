
    let dataPenjualanHarian = [];
    let totalHari = 0;
    let hariAktual = 0;

    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('mobile-open');
      });
    });

    // ===== NAVBAR SCROLL SHADOW =====
    window.addEventListener('scroll', () => {
      document.querySelector('nav').classList.toggle('scrolled', window.scrollY > 10);
    });

    // ===== SCROLL REVEAL ANIMATION =====
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ===== FORM INPUT FOCUS EFFECTS =====
    document.querySelectorAll('.form-group input, .form-group select').forEach(el => {
      el.addEventListener('focus', () => el.closest('.form-group').classList.add('focused'));
      el.addEventListener('blur',  () => el.closest('.form-group').classList.remove('focused'));
    });

    // ===== MODAL =====
    function bukaModal() {
      if (totalHari > 0) {
        document.getElementById('inputTotalHari').value = totalHari;
        document.getElementById('inputHariAktual').value = hariAktual;
      }
      document.getElementById('step1').style.display = 'block';
      document.getElementById('step2').style.display = 'none';
      document.getElementById('modalOverlay').classList.add('open');
    }

    function tutupModal() {
      document.getElementById('modalOverlay').classList.remove('open');
    }

    function lanjutStep2() {
      const n  = parseInt(document.getElementById('inputTotalHari').value);
      const ha = parseInt(document.getElementById('inputHariAktual').value);

      if (!n || n < 1)   { alert('Masukkan total hari prediksi yang valid!'); return; }
      if (!ha || ha < 1) { alert('Masukkan jumlah hari yang sudah terjadi!'); return; }
      if (ha >= n)       { alert('Hari aktual harus lebih kecil dari total hari prediksi!'); return; }

      totalHari  = n;
      hariAktual = ha;

      const container = document.getElementById('hariInputsContainer');
      container.innerHTML = '';

      for (let i = 1; i <= n; i++) {
        const isAktual  = i <= ha;
        const row       = document.createElement('div');
        row.className   = 'hari-row';
        const nilaiLama = dataPenjualanHarian[i - 1];

        row.innerHTML = `
          <span class="hari-row-label">Hari ${i}</span>
          <span class="hari-row-badge ${isAktual ? 'badge-aktual' : 'badge-prediksi'}">
            ${isAktual ? 'Aktual' : 'Prediksi'}
          </span>
          <input
            type="number"
            id="hariInput_${i}"
            placeholder="${isAktual ? 'unit terjual' : 'otomatis'}"
            min="0"
            ${!isAktual ? 'readonly' : ''}
            value="${(nilaiLama !== undefined && nilaiLama !== null && isAktual) ? nilaiLama : ''}"
          />
        `;
        container.appendChild(row);
      }

      document.getElementById('infoPrediksi').textContent =
        `Hari 1–${ha}: input data aktual penjualan. Hari ${ha + 1}–${n}: dihitung otomatis dari rata-rata.`;

      document.getElementById('step1').style.display = 'none';
      document.getElementById('step2').style.display = 'block';
    }

    function kembaliStep1() {
      document.getElementById('step1').style.display = 'block';
      document.getElementById('step2').style.display = 'none';
    }

    function simpanPenjualan() {
      const data = [];
      for (let i = 1; i <= hariAktual; i++) {
        const val = document.getElementById(`hariInput_${i}`).value;
        if (val === '' || isNaN(parseInt(val))) {
          alert(`Hari ${i}: data penjualan belum diisi!`);
          return;
        }
        data.push(parseInt(val));
      }

      const rata = data.reduce((a, b) => a + b, 0) / data.length;

      for (let i = hariAktual + 1; i <= totalHari; i++) {
        data.push(Math.round(rata));
      }

      dataPenjualanHarian = data;

      const aktualStr = data.slice(0, hariAktual).join(', ');
      const predStr   = data.slice(hariAktual).join(', ');
      const preview   = document.getElementById('penjualanPreview');
      preview.innerHTML = `
        <strong>Data aktual (${hariAktual} hari):</strong> ${aktualStr} unit<br>
        <strong>Prediksi (${totalHari - hariAktual} hari, rata-rata ${rata.toFixed(1)} unit/hari):</strong> ${predStr} unit
      `;
      preview.classList.add('visible');

      tutupModal();
    }

    document.getElementById('modalOverlay').addEventListener('click', function(e) {
      if (e.target === this) tutupModal();
    });

    // ===== HITUNG PREDIKSI =====
    function hitungPrediksi() {
      const nama = document.getElementById('namaBarang').value.trim();
      const stok = parseInt(document.getElementById('stokAwal').value);

      if (!nama) { alert('Nama barang belum diisi!'); return; }
      if (isNaN(stok)) { alert('Stok saat ini belum diisi!'); return; }
      if (dataPenjualanHarian.length === 0) {
        alert('Data penjualan belum diisi!\nKlik tombol "Klik Untuk Input Penjualan" terlebih dahulu.');
        return;
      }

      let sisaStok  = stok;
      let totalJual = 0;
      let hariHabis = null;
      let hariWarn  = null;
      const rows    = [];

      const totalAktual = dataPenjualanHarian.slice(0, hariAktual).reduce((a, b) => a + b, 0);
      const rataAktual  = (totalAktual / hariAktual).toFixed(1);

      for (let i = 0; i < totalHari; i++) {
        const jual     = dataPenjualanHarian[i];
        const isAktual = i < hariAktual;
        const sisaBefore = sisaStok;

        sisaStok  = Math.max(sisaStok - jual, 0);
        totalJual += jual;

        let status, statusClass;
        if (sisaBefore <= jual) {
          if (hariHabis === null) hariHabis = i + 1;
          status = 'Stok Habis'; statusClass = 'status-habis';
        } else if (sisaStok <= stok * 0.2) {
          if (hariWarn === null) hariWarn = i + 1;
          status = 'Perlu Restock'; statusClass = 'status-warning';
        } else {
          status = 'Aman'; statusClass = 'status-aman';
        }

        rows.push({ hari: i + 1, isAktual, jual, sisa: sisaStok, status, statusClass });
      }

      let rekomendasiStok;
      if (hariHabis !== null) {
        const perluTambah = Math.ceil(parseFloat(rataAktual)) * (totalHari - hariHabis + 1);
        rekomendasiStok = `Restock sebelum hari ke-${hariHabis} (estimasi tambah ±${perluTambah} unit)`;
      } else if (hariWarn !== null) {
        rekomendasiStok = `Mulai pertimbangkan restock di hari ke-${hariWarn} (stok tinggal ≤20%)`;
      } else {
        rekomendasiStok = `Stok cukup untuk ${totalHari} hari ke depan ✓`;
      }

      document.getElementById('outNama').textContent        = nama;
      document.getElementById('outRata').textContent        = rataAktual + ' unit/hari (dari ' + hariAktual + ' hari aktual)';
      document.getElementById('outTotal').textContent       = totalAktual + ' unit (' + hariAktual + ' hari)';
      document.getElementById('outHabis').textContent       = hariHabis ? 'Hari ke-' + hariHabis : '> Hari ke-' + totalHari + ' (aman)';
      document.getElementById('outRekomendasi').textContent = rekomendasiStok;

      const tbody = document.getElementById('tabelBody');
      tbody.innerHTML = rows.map(r =>
        `<tr>
          <td>Hari ${r.hari}</td>
          <td><span class="${r.isAktual ? 'tipe-aktual' : 'tipe-prediksi'}">${r.isAktual ? 'Aktual' : 'Prediksi'}</span></td>
          <td>${r.jual} unit</td>
          <td>${r.sisa} unit</td>
          <td class="${r.statusClass}">${r.status}</td>
        </tr>`
      ).join('');

      const tabelWrapper = document.getElementById('tabelWrapper');
      tabelWrapper.style.display = 'block';
      // Trigger animasi
      tabelWrapper.style.animation = 'none';
      tabelWrapper.offsetHeight; // reflow
      tabelWrapper.style.animation = '';

      document.querySelector('.hasil-section').scrollIntoView({ behavior: 'smooth' });
    }

    // ===== TOMBOL RESET (opsional: klik logo kembali ke index) =====
    document.querySelector('.nav-logo').addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'index__2_.html';
    });