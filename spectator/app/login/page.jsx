// app/login/page.jsx (if using the app directory)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { credentials } from "../../lib/credentials";
import styles from "../page.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Validate credentials
    const isValid = credentials.some(
      (cred) => cred.username === username && cred.password === password
    );

    if (isValid) {
      // Save authentication flag
      localStorage.setItem("auth", "true");
      router.push("/badminton/scorer"); // Redirect to the dashboard or protected page
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <main className={styles.main}>
      <h1>Login</h1>
      <form className={styles.loginContainer} onSubmit={handleLogin}>
        <div className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className={styles.formGroup}>
            <button className={styles.loginBtn} type="submit">Login</button>
          </div>
        </div>
        
      </form>
      <div>-</div>
    </main>
  );
}
