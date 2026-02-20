"use client";

export async function logout() {
  try {
    const res = await fetch("/api/logout", {
      method: "POST",
    });
    if (!res.ok) {
      console.error("Error al hacer el logout");
      return;
    }
    window.location.href = "/login";
  } catch (error) {
    console.error("Error al hacer el logout", error);
  }
}
