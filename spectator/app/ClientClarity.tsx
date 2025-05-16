// app/ClientClarity.tsx (Client Component)
"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClientClarity() {
  useEffect(() => {
    Clarity.init("pk1vamr87a");
  }, []);

  return null;
}
