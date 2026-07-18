/**
 * EMAGE GALAXY - Wallpaper Data (100+ Demo Wallpapers)
 * Generates demo wallpaper objects with placeholder images
 */

const WALLPAPER_CATEGORIES = [
  'Space', 'Galaxy', 'Nature', 'Cars', 'Technology',
  'Anime', 'Cities', 'Animals', 'Abstract', 'Minimal', 'Sports', 'Gaming'
];

const CATEGORY_ICONS = {
  Space: 'fa-rocket', Galaxy: 'fa-star', Nature: 'fa-leaf', Cars: 'fa-car',
  Technology: 'fa-microchip', Anime: 'fa-dragon', Cities: 'fa-city',
  Animals: 'fa-paw', Abstract: 'fa-shapes', Minimal: 'fa-minimize',
  Sports: 'fa-futbol', Gaming: 'fa-gamepad'
};

const RESOLUTIONS = ['1920x1080', '2560x1440', '3840x2160', '1366x768', '1440x900'];

const TAG_POOL = [
  '4K', 'HD', 'Ultra HD', 'Dark', 'Light', 'Colorful', 'Neon', 'Vintage',
  'Modern', 'Artistic', 'Cinematic', 'Mobile', 'Desktop', 'Wide', 'Portrait',
  'Aesthetic', 'Cool', 'Epic', 'Stunning', 'Premium', 'Exclusive'
];

const TITLE_PREFIXES = {
  Space: ['Cosmic', 'Nebula', 'Stellar', 'Orbital', 'Lunar', 'Solar'],
  Galaxy: ['Milky Way', 'Andromeda', 'Starfield', 'Cosmic', 'Interstellar'],
  Nature: ['Forest', 'Mountain', 'Ocean', 'Sunset', 'Valley', 'Meadow'],
  Cars: ['Supercar', 'Classic', 'Racing', 'Luxury', 'Sports Car', 'Hypercar'],
  Technology: ['Cyber', 'Digital', 'Future', 'Tech', 'Circuit', 'Matrix'],
  Anime: ['Anime', 'Manga', 'Kawaii', 'Epic Battle', 'Fantasy', 'Hero'],
  Cities: ['Skyline', 'Urban', 'Metropolis', 'Downtown', 'Night City'],
  Animals: ['Wild', 'Majestic', 'Cute', 'Exotic', 'Safari', 'Ocean Life'],
  Abstract: ['Abstract', 'Geometric', 'Fluid', 'Pattern', 'Gradient'],
  Minimal: ['Minimal', 'Clean', 'Simple', 'Zen', 'Pure', 'Essence'],
  Sports: ['Champion', 'Victory', 'Action', 'Dynamic', 'Athletic'],
  Gaming: ['Gaming', 'Esports', 'Pixel', 'Retro Game', 'Battle']
};

/** Generate random tags for a wallpaper */
function generateTags(category, count = 3) {
  const tags = [category];
  const shuffled = [...TAG_POOL].sort(() => Math.random() - 0.5);
  for (let i = 0; i < count - 1 && i < shuffled.length; i++) {
    tags.push(shuffled[i]);
  }
  return tags;
}

/** Generate wallpaper title */
function generateTitle(category, index) {
  const prefixes = TITLE_PREFIXES[category] || ['Premium'];
  const prefix = prefixes[index % prefixes.length];
  return `${prefix} ${category} #${String(index + 1).padStart(3, '0')}`;
}

/** Generate 120 demo wallpapers */
function generateWallpapers() {
  const wallpapers = [];
  let id = 1;

  WALLPAPER_CATEGORIES.forEach((category, catIndex) => {
    const count = catIndex < 8 ? 10 : 9;
    for (let i = 0; i < count; i++) {
      const seed = `emage-${category.toLowerCase()}-${i + 1}`;
      wallpapers.push({
        id: id++,
        title: generateTitle(category, i),
        category,
        image: `https://picsum.photos/seed/${seed}/800/500`,
        imageHD: `https://picsum.photos/seed/${seed}/1920/1080`,
        resolution: RESOLUTIONS[i % RESOLUTIONS.length],
        tags: generateTags(category),
        downloads: Math.floor(Math.random() * 50000) + 1000,
        featured: i < 2,
        trending: Math.random() > 0.6,
        isNew: Math.random() > 0.7,
        editorPick: i === 0,
        uploadDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
  });

  return wallpapers;
}

const WALLPAPERS_DATA = generateWallpapers();

/** Demo comments for wallpaper detail modal */
const DEMO_COMMENTS = [
  { author: 'Alex M.', text: 'Absolutely stunning wallpaper! Perfect for my desktop setup.', time: '2 hours ago' },
  { author: 'Sarah K.', text: 'Love the colors and composition. Downloaded in 4K!', time: '5 hours ago' },
  { author: 'Mike R.', text: 'One of the best wallpapers I have found on this site.', time: '1 day ago' },
  { author: 'Emma L.', text: 'Great quality, works perfectly on my ultrawide monitor.', time: '2 days ago' }
];

/** Export for use in other modules */
if (typeof window !== 'undefined') {
  window.WALLPAPER_CATEGORIES = WALLPAPER_CATEGORIES;
  window.CATEGORY_ICONS = CATEGORY_ICONS;
  window.WALLPAPERS_DATA = WALLPAPERS_DATA;
  window.DEMO_COMMENTS = DEMO_COMMENTS;
}
