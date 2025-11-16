"use client";

import MovieForm from "@/components/MovieForm";
import { MovieFormData } from "@/types/movie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewMoviePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: MovieFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/movies");
      } else {
        alert("Failed to create movie");
      }
    } catch (error) {
      console.error("Error creating movie:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            🎬 Movie Manager
          </Link>
          <Link
            href="/movies"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
          >
            ← Back to Movies
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <MovieForm onSubmit={handleSubmit} isLoading={isLoading} />
      </main>
    </>
  );
}
