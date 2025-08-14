(function () {
  var CONFIG = {
    BASE_URL: "http://localhost:3000",
    endpoints: { login: "/api/login", register: "/api/registrar" },
    redirectAfterLogin: "paginaPrincipal.html",
    redirectAfterRegister: "ingresar.html",
    toastDuration: 1800,
    MOCK: true, // ← así funciona sin backend
  };

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function showToast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () {
      t.classList.add("show");
    }, 0);
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () {
        if (t.parentNode) {
          t.parentNode.removeChild(t);
        }
      }, 300);
    }, CONFIG.toastDuration);
  }

  function handleSubmit(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var path = (location.pathname || "").toLowerCase();
    var isLogin =
      /ingresar\.html$/.test(path) ||
      /ingresar/.test(document.title.toLowerCase());
    var isRegistro =
      /registrate\.html$/.test(path) ||
      /registr/.test(document.title.toLowerCase());

    if (isLogin) {
      var emailEl = form.querySelector('input[type="email"]');
      var passEl = form.querySelector('input[type="password"]');
      var email = emailEl ? emailEl.value.trim() : "";
      var pass = passEl ? passEl.value : "";
      if (!email || !pass) {
        showToast("Completa email y contraseña");
        (email ? passEl : emailEl).focus();
        return;
      }

      if (CONFIG.MOCK) {
        showToast("Ingreso exitoso");
        form.reset();
        setTimeout(function () {
          location.href = CONFIG.redirectAfterLogin;
        }, 900);
        return;
      }
      fetch(CONFIG.BASE_URL + CONFIG.endpoints.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: pass }),
      })
        .then(function (res) {
          if (res.ok) {
            showToast("Ingreso exitoso");
            form.reset();
            setTimeout(function () {
              location.href = CONFIG.redirectAfterLogin;
            }, 900);
          } else {
            return res.text().then(function (t) {
              showToast("Credenciales inválidas" + (t ? ": " + t : ""));
            });
          }
        })
        .catch(function () {
          showToast("Error de red");
        });
      return;
    }

    if (isRegistro) {
      var texts = form.querySelectorAll('input[type="text"]');
      var nombre = texts[0] ? texts[0].value.trim() : "";
      var apellido = texts[1] ? texts[1].value.trim() : "";
      var emailEl2 = form.querySelector('input[type="email"]');
      var passEl2 = form.querySelector('input[type="password"]');
      var email2 = emailEl2 ? emailEl2.value.trim() : "";
      var pass2 = passEl2 ? passEl2.value : "";
      if (!nombre || !apellido || !email2 || !pass2) {
        showToast("Completa todos los campos");
        (texts[0] || texts[1] || emailEl2 || passEl2).focus();
        return;
      }

      if (CONFIG.MOCK) {
        showToast("Registro exitoso");
        form.reset();
        setTimeout(function () {
          location.href = CONFIG.redirectAfterRegister;
        }, 900);
        return;
      }
      fetch(CONFIG.BASE_URL + CONFIG.endpoints.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          email: email2,
          password: pass2,
        }),
      })
        .then(function (res) {
          if (res.ok) {
            showToast("Registro exitoso");
            form.reset();
            setTimeout(function () {
              location.href = CONFIG.redirectAfterRegister;
            }, 900);
          } else {
            return res.text().then(function (t) {
              showToast("No se pudo registrar" + (t ? ": " + t : ""));
            });
          }
        })
        .catch(function () {
          showToast("Error de red");
        });
      return;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = qs("form");
    if (form) {
      form.addEventListener("submit", handleSubmit);
    }
  });
})();
