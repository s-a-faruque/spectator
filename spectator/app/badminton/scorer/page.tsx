"use client";
import styles from "./badminton.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function CardsPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth"); // Clear authentication flag
    router.push("/login"); // Redirect to login
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("auth");

    if (!isAuthenticated) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [router]);
  
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Home page of a scorer</h1>
        <button className={styles.logOut} onClick={handleLogout}>
          <Image
            src="/logout.png"
            alt="Logout Icon"
            width={16}
            height={16}
          />
        </button>
      </header>
      <div className={styles.primaryContent}>
        <button
          className={styles.startButton}
          onClick={() => {
            const uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
            window.location.href = `/badminton/scorer/match/${uniqueId}`;
          }}
        >
          +
        </button>
      </div>
    </main>
  );
}
