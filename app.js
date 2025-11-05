// Control splash screen and main app
document.addEventListener("DOMContentLoaded", function () {
  const splashScreen = document.getElementById("splash-screen");
  const mainApp = document.getElementById("main-app");

  // Remove splash screen and show app after 2 seconds
  setTimeout(() => {
    splashScreen.style.display = "none";
    mainApp.classList.remove("hidden");
    initializeLoginPage();
  }, 2000);
});

// تهيئة صفحة تسجيل الدخول
function initializeLoginPage() {
  // زر إظهار/إخفاء كلمة المرور
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  if (togglePassword) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      // تغيير أيقونة العين
      if (type === "text") {
        this.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="currentColor"/>
          </svg>
        `;
      } else {
        this.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
          </svg>
        `;
      }
    });
  }

  // معالجة نموذج تسجيل الدخول
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        nationalId: document.getElementById("nationalId").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      };

      console.log("Login data:", formData);

      // Store user session
      localStorage.setItem("currentUser", JSON.stringify(formData));

      // Redirect to services page
      setTimeout(() => {
        window.location.href = "services.html";
      }, 1000);

      alert("Login successful! Redirecting to services...");

      // Example: Send data to server
      // fetch('login.php', {
      //   method: 'POST',
      //   headers: {'Content-Type': 'application/json'},
      //   body: JSON.stringify(formData)
      // })
      // .then(response => response.json())
      // .then(data => console.log(data))
      // .catch(error => console.error('Error:', error));
    });
  }

  // معالجة أزرار تسجيل الدخول عبر وسائل التواصل
  const btnFacebook = document.querySelector(".btn-facebook");
  const btnGoogle = document.querySelector(".btn-google");
  const btnApple = document.querySelector(".btn-apple");

  if (btnFacebook) {
    btnFacebook.addEventListener("click", function () {
      console.log("تسجيل الدخول عبر Facebook");
      alert("سيتم فتح صفحة تسجيل الدخول عبر Facebook");
      // هنا يمكنك إضافة كود Facebook Login API
    });
  }

  if (btnGoogle) {
    btnGoogle.addEventListener("click", function () {
      console.log("تسجيل الدخول عبر Google");
      alert("سيتم فتح صفحة تسجيل الدخول عبر Google");
      // هنا يمكنك إضافة كود Google Sign-In API
    });
  }

  if (btnApple) {
    btnApple.addEventListener("click", function () {
      console.log("تسجيل الدخول عبر Apple");
      alert("سيتم فتح صفحة تسجيل الدخول عبر Apple");
      // هنا يمكنك إضافة كود Apple Sign In
    });
  }

  // تنسيق رقم الهاتف تلقائياً
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
      e.target.value = value;
    });
  }

  // تنسيق رقم الهوية تلقائياً
  const nationalIdInput = document.getElementById("nationalId");
  if (nationalIdInput) {
    nationalIdInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
      e.target.value = value;
    });
  }
}

// منع التكبير على الأجهزة المحمولة
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

// تحسين الأداء على الأجهزة المحمولة
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // يمكن تفعيل Service Worker لاحقاً للعمل دون اتصال
  });
}
