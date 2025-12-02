// app.js

// Global değişken: data.js içinde tanımlı
// window.SECRET_SANTA_USERS

(function () {
  const loginCard = document.getElementById("login-card");
  const mainCard = document.getElementById("main-card");
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginError = document.getElementById("login-error");

  const welcomeTitle = document.getElementById("welcome-title");
  const receiverName = document.getElementById("receiver-name");
  const receiverHints = document.getElementById("receiver-hints");
  const logoutBtn = document.getElementById("logout-btn");

  // =============================
  // KONFETİ KODU
  // =============================
  function createConfettiPiece() {
    const colors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ffffff"];
    const piece = document.createElement("div");
    piece.classList.add("confetti-piece");

    const left = Math.random() * 100;
    const duration = 3 + Math.random() * 3; // 3-6 saniye arası
    const delay = Math.random() * 0.5;      // 0-0.5 sn gecikme
    const horizontalDrift = (Math.random() - 0.5) * 200; // -100 ile 100 arası

    piece.style.left = left + "vw";
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = duration + "s";
    piece.style.animationDelay = delay + "s";
    piece.style.transform = `translate3d(${horizontalDrift}px, 0, 0)`;

    document.body.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, (duration + delay) * 1000);
  }

  function launchConfetti(count = 120) {
    for (let i = 0; i < count; i++) {
      createConfettiPiece();
    }
  }
  // =============================
  // KONFETİ KODU BİTİŞ
  // =============================

  // Basit session mantığı: sadece bu sekme için
  function getCurrentUser() {
    const raw = sessionStorage.getItem("secret_santa_current_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function setCurrentUser(user) {
    sessionStorage.setItem("secret_santa_current_user", JSON.stringify(user));
  }

  function clearCurrentUser() {
    sessionStorage.removeItem("secret_santa_current_user");
  }

  // Kullanıcıyı arama
  function findUser(username, password) {
    if (!window.SECRET_SANTA_USERS) return null;
    return window.SECRET_SANTA_USERS.find(
      (u) => u.username === username && u.password === password
    );
  }

  // Login olmuşsa main ekrana geç
  function showMainForUser(user) {
    loginCard.style.display = "none";
    mainCard.style.display = "block";

    welcomeTitle.textContent = `Merhaba, ${user.displayName}`;
    receiverName.textContent = user.receiver?.name || "Atama bulunamadı";
    receiverHints.textContent =
      user.receiver?.hints || "Bu kişi için ipucu girilmemiş.";

    // Kullanıcının hediye alacağı kişiyi gördüğü anda konfeti
    launchConfetti();
  }

  function showLogin() {
    mainCard.style.display = "none";
    loginCard.style.display = "block";
    loginError.style.display = "none";
    loginForm.reset();
  }

  // Sayfa açıldığında daha önce login olmuş mu kontrol et
  document.addEventListener("DOMContentLoaded", () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      showMainForUser(currentUser);
    } else {
      showLogin();
    }
  });

  // Login form submit
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    const user = findUser(username, password);

    if (!user) {
      loginError.style.display = "block";
      return;
    }

    loginError.style.display = "none";
    setCurrentUser(user);
    showMainForUser(user); // burada launchConfetti zaten çağrılıyor
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    clearCurrentUser();
    showLogin();
  });
})();
