(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner(0);

  // Initiate the wowjs
  new WOW().init();

  // Fixed Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".sticky-top").addClass("shadow-sm").css("top", "0px");
    } else {
      $(".sticky-top").removeClass("shadow-sm").css("top", "-300px");
    }
  });

  // Smooth scrolling on the navbar links
  $(".navbar-nav a").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();

      $("html, body").animate(
        {
          scrollTop: $(this.hash).offset().top - 90,
        },
        1500,
        "easeInOutExpo"
      );

      if ($(this).parents(".navbar-nav").length) {
        $(".navbar-nav .active").removeClass("active");
        $(this).closest("a").addClass("active");
      }
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Fungsi Salin (Copy) Nomor Rekening
  $(".btn-copy").on("click", function () {
    // Ambil nomor rekening dari atribut data-rekening
    var rekening = $(this).data("rekening");

    // Gunakan API Clipboard modern untuk menyalin
    navigator.clipboard
      .writeText(rekening)
      .then(
        function () {
          // Jika berhasil, ubah teks tombol
          var originalText = $(this).html(); // Simpan teks asli
          $(this).html("Tersalin!"); // Ubah teks

          // Kembalikan teks ke asli setelah 2 detik
          setTimeout(
            function () {
              $(this).html(originalText);
            }.bind(this),
            2000
          );
        }.bind(this)
      )
      .catch(function (err) {
        // Jika gagal
        console.error("Gagal menyalin: ", err);
        alert("Gagal menyalin nomor rekening.");
      });
  });

  // Kode untuk Splash Screen dan Autoplay Musik
  window.addEventListener("load", function () {
    const splashScreen = document.getElementById("splashScreen");
    const music = document.getElementById("background_music");

    if (!splashScreen) {
      console.log(
        "Splash screen tidak ditemukan, musik mungkin tidak akan autoplay."
      );
      return;
    }

    // =======================================================
    // KODE UNTUK BUKU TAMU (GUESTBOOK) DINAMIS
    // =======================================================

    // !!! PENTING: GANTI DENGAN URL APLIKASI WEB ANDA !!!
    const SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbzxFBC7yYtjgtubJPgZN1EDd6Mc_kNRNYMuRl9e2NbYdsCXh5io7AcZJCj70S4MZhWO/exec";
    // Contoh: "https://script.google.com/macros/s/AKfyc.../exec"

    const guestbookForm = $("#guestbook-form");
    const submitButton = $("#submit-button");
    const formStatus = $("#form-status");
    const messagesContainer = $("#guestbook-messages");

    /**
     * 1. FUNGSI UNTUK MENGAMBIL DAN MENAMPILKAN UCAPAN
     */
    function loadMessages() {
      messagesContainer.html(`
    <div class="col-12 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Memuat ucapan...</span>
      </div>
      <p class="mt-2">Memuat ucapan...</p>
    </div>
  `);

      fetch(SCRIPT_URL)
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "success") {
            messagesContainer.empty(); // Kosongkan area "loading"

            if (result.data.length === 0) {
              messagesContainer.html(
                '<div class="col-12"><p>Belum ada ucapan. Jadilah yang pertama!</p></div>'
              );
              return;
            }

            // Tampilkan setiap ucapan
            result.data.forEach((msg) => {
              const messageCard = `
            <div class="col-md-10 col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
              <div class="p-4 border-secondary mb-3 text-start" style="border-style: double; border-radius: 10px;">
                <h5 class="text-primary fw-bold">${msg.nama}</h5>
                <p class="text-dark mb-0" style="white-space: pre-wrap;">${
                  msg.ucapan
                }</p>
                <small class="text-muted fst-italic">
                  ${new Date(msg.timestamp).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </small>
              </div>
            </div>
          `;
              messagesContainer.append(messageCard);
            });
          } else {
            throw new Error(result.message);
          }
        })
        .catch((error) => {
          console.error("Error loading messages:", error);
          messagesContainer.html(
            '<div class="col-12"><p class="text-danger">Gagal memuat ucapan. Coba segarkan halaman.</p></div>'
          );
        });
    }

    /**
     * 2. FUNGSI UNTUK MENGIRIM UCAPAN BARU
     */
    guestbookForm.on("submit", function (e) {
      e.preventDefault(); // Mencegah form reload halaman

      // Tampilkan status "Loading" di tombol
      const originalButtonText = submitButton.html();
      submitButton.html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Mengirim...'
      );
      submitButton.prop("disabled", true);
      formStatus.empty();

      const formData = {
        nama: $("#guestName").val(),
        ucapan: $("#guestMessage").val(),
      };

      fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Penting untuk Apps Script saat redirect
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          // Karena 'no-cors' kita tidak bisa baca response,
          // jadi kita anggap sukses dan lanjut.

          // Tampilkan pesan sukses
          formStatus.html(
            '<p class="text-success">Ucapan Anda berhasil terkirim!</p>'
          );

          // Reset form
          guestbookForm[0].reset();
          submitButton.html(originalButtonText);
          submitButton.prop("disabled", false);

          // Muat ulang ucapan setelah 2 detik agar data baru tampil
          setTimeout(loadMessages, 2000);
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          formStatus.html(
            '<p class="text-danger">Gagal mengirim ucapan. Coba lagi.</p>'
          );
          submitButton.html(originalButtonText);
          submitButton.prop("disabled", false);
        });
    });

    /**
     * 3. JALANKAN FUNGSI SAAT HALAMAN DIMUAT
     */
    $(document).ready(function () {
      loadMessages();
    });

    // =======================================================
    // AKHIR DARI KODE BUKU TAMU
    // =======================================================

    // Fungsi yang akan dijalankan saat layar diketuk
    function openInvitation() {
      // 1. Ubah opacity menjadi 0 untuk memulai efek fade-out
      splashScreen.style.opacity = "0";

      // 2. Putar musiknya
      music.play().catch((error) => {
        console.error("Gagal memutar musik:", error);
      });

      // 3. Setelah transisi selesai (800ms), sembunyikan elemen splash screen
      //    agar tidak menghalangi konten di bawahnya.
      setTimeout(() => {
        splashScreen.style.display = "none";
      }, 800); // Angka ini (800ms) harus sama dengan durasi transisi di CSS
    }

    // Menambahkan event listener ke splash screen
    // Opsi { once: true } memastikan listener ini hanya berjalan sekali
    splashScreen.addEventListener("click", openInvitation, { once: true });
    splashScreen.addEventListener("touchstart", openInvitation, { once: true });
  });
})(jQuery);
