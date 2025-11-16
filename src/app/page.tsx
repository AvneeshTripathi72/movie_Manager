import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            🎬 MovieDb
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

      <SignedOut>
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h1 className="text-6xl font-bold mb-6">
              Your Movie Collection Hub
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
              Organize, rate, and manage all your favorite movies in one beautiful place. 
              Create your collection today and discover new cinema experiences.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">📽️</div>
                <h3 className="text-xl font-bold mb-2">Organize</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Keep track of all your movies with beautiful grid layout and search
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-bold mb-2">Rate</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Give ratings and write detailed reviews for every movie you watch
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2">Discover</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Find similar movies and build your personalized watchlist
                </p>
              </div>
            </div>

            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                Start Building Your Collection
              </button>
            </SignInButton>
          </div>
        </main>
      </SignedOut>

      <SignedIn>
        <main className="bg-white dark:bg-gray-950 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold">My Movies</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your movie collection</p>
                </div>
                <Link
                  href="/movies/new"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  + Add Movie
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Movies will be loaded here */}
              <div className="text-center col-span-full py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Loading your movies...</p>
              </div>
            </div>
          </div>
        </main>
      </SignedIn>
    </>
  );
}
