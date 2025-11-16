"use client";

import { Movie, MovieFormData } from "@/types/movie";
import { useState } from "react";

interface MovieFormProps {
  movie?: Movie;
  onSubmit: (data: MovieFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function MovieForm({
  movie,
  onSubmit,
  isLoading,
}: MovieFormProps) {
  const [formData, setFormData] = useState<MovieFormData>({
    title: movie?.title || "",
    description: movie?.description || "",
    genre: movie?.genre || "",
    rating: movie?.rating || 0,
    releaseDate: movie?.releaseDate
      ? movie.releaseDate.toString().split("T")[0]
      : "",
    posterUrl: movie?.posterUrl || "",
    director: movie?.director || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6">
        {movie ? "Edit Movie" : "Add New Movie"}
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Movie title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Movie description"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Genre *
          </label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            title="Select a genre"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select genre</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Horror</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>
            <option value="Animation">Animation</option>
            <option value="Documentary">Documentary</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Rating
          </label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Release Date
          </label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Director
          </label>
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Director name"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Poster URL
        </label>
        <input
          type="url"
          name="posterUrl"
          value={formData.posterUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/poster.jpg"
          title="Enter poster image URL"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        {isLoading ? "Saving..." : movie ? "Update Movie" : "Add Movie"}
      </button>
    </form>
  );
}
