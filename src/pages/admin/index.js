import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ login: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("adminLoggedIn", "true");
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Невірний логін або пароль");
      }
    } catch (error) {
      setError("Помилка сервера. Спробуйте пізніше.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Head>
        <title>Адмін панель - Landscape Academy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-login">
        <div className="admin-login__container">
          <div className="admin-login__header">
            <h1 className="admin-login__title">Landscape Academy</h1>
            <h2 className="admin-login__subtitle">Адміністративна панель</h2>
          </div>

          <form className="admin-login__form" onSubmit={handleSubmit}>
            {error && (
              <div className="admin-login__error">
                {error}
              </div>
            )}

            <div className="admin-login__field">
              <label className="admin-login__label">Логін</label>
              <input
                type="text"
                name="login"
                value={credentials.login}
                onChange={handleChange}
                className="admin-login__input"
                required
                disabled={isLoading}
                placeholder="Введіть логін"
              />
            </div>

            <div className="admin-login__field">
              <label className="admin-login__label">Пароль</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="admin-login__input"
                required
                disabled={isLoading}
                placeholder="Введіть пароль"
              />
            </div>

            <button
              type="submit"
              className="admin-login__button"
              disabled={isLoading}
            >
              {isLoading ? "Вхід..." : "Увійти"}
            </button>
          </form>

          <div className="admin-login__info">
            <p>Для доступу до адмін панелі введіть логін та пароль</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
