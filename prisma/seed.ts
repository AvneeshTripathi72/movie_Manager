import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      process.env[key.trim()] = value;
    }
  });
}

import prisma from "../src/lib/prisma";

const sampleMovies = [
  {
    title: "Inception",
    description:
      "A skilled thief who steals corporate secrets through dream-sharing technology.",
    genre: "Sci-Fi",
    rating: 8.8,
    releaseDate: new Date("2010-07-16"),
    director: "Christopher Nolan",
    posterUrl:
      "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=600&fit=crop",
  },
  {
    title: "The Dark Knight",
    description:
      "Batman must accept one of the greatest psychological tests to fight injustice.",
    genre: "Action",
    rating: 9.0,
    releaseDate: new Date("2008-07-18"),
    director: "Christopher Nolan",
    posterUrl:
      "https://images.unsplash.com/photo-1533613220915-609f1a6c7f2b?w=400&h=600&fit=crop",
  },
  {
    title: "Interstellar",
    description:
      "A team of astronauts travels through a wormhole to save humanity.",
    genre: "Sci-Fi",
    rating: 8.6,
    releaseDate: new Date("2014-11-07"),
    director: "Christopher Nolan",
    posterUrl:
      "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
  },
  {
    title: "The Matrix",
    description:
      "A computer hacker learns about the true nature of his reality.",
    genre: "Sci-Fi",
    rating: 8.7,
    releaseDate: new Date("1999-03-31"),
    director: "Lana Wachowski, Lilly Wachowski",
    posterUrl:
      "https://images.unsplash.com/photo-1522869635100-ce306e08e08f?w=400&h=600&fit=crop",
  },
  {
    title: "Pulp Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine.",
    genre: "Drama",
    rating: 8.9,
    releaseDate: new Date("1994-10-14"),
    director: "Quentin Tarantino",
    posterUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
  },
  {
    title: "Forrest Gump",
    description:
      "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.",
    genre: "Drama",
    rating: 8.8,
    releaseDate: new Date("1994-07-06"),
    director: "Robert Zemeckis",
    posterUrl:
      "https://images.unsplash.com/photo-1489599849228-ed4dc5ee4b79?w=400&h=600&fit=crop",
  },
  {
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption.",
    genre: "Drama",
    rating: 9.3,
    releaseDate: new Date("1994-10-14"),
    director: "Frank Darabont",
    posterUrl:
      "https://images.unsplash.com/photo-1571847252215-a7d5c1f6f39e?w=400&h=600&fit=crop",
  },
  {
    title: "Avatar",
    description:
      "A paraplegic Marine dispatched to Pandora fights to save the indigenous people.",
    genre: "Sci-Fi",
    rating: 7.8,
    releaseDate: new Date("2009-12-18"),
    director: "James Cameron",
    posterUrl:
      "https://images.unsplash.com/photo-1543803735-d0c6fc8c3dd0?w=400&h=600&fit=crop",
  },
  {
    title: "The Lion King",
    description:
      "A young lion prince flees his kingdom only to learn the truth about his past.",
    genre: "Animation",
    rating: 8.5,
    releaseDate: new Date("1994-06-15"),
    director: "Roger Allers, Rob Minkoff",
    posterUrl:
      "https://images.unsplash.com/photo-1537903904737-13fc2b5f941c?w=400&h=600&fit=crop",
  },
  {
    title: "Titanic",
    description:
      "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the Titanic.",
    genre: "Romance",
    rating: 7.8,
    releaseDate: new Date("1997-12-19"),
    director: "James Cameron",
    posterUrl:
      "https://images.unsplash.com/photo-1540224652318-41b37a4d15ad?w=400&h=600&fit=crop",
  },
];

async function main() {
  try {
    console.log("🌱 Starting seed...");

    // Create or get default user
    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: "demo_user_001",
          email: "demo@example.com",
          name: "Demo User",
        },
      });
      console.log("✅ Created demo user");
    }

    // Delete existing movies for this user
    await prisma.movie.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Create sample movies
    for (const movie of sampleMovies) {
      await prisma.movie.create({
        data: {
          ...movie,
          userId: user.id,
        },
      });
    }

    console.log(`✅ Seeded ${sampleMovies.length} movies`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
