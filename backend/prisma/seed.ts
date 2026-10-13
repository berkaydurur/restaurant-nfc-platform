import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean old data
  await prisma.analyticsEvent.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.restaurant.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Restaurant: Lucca Bistro & Lounge
  const lucca = await prisma.restaurant.create({
    data: {
      slug: 'lucca-bistro',
      name: 'Lucca Bistro & Lounge',
      tagline: 'Modern Akdeniz Mutfağı & İmza Kokteyller',
      description: 'İstanbul Bebek sahilinin kalbinde, eşsiz kokteyller, şef dokunuşlu lezzetler ve sıcak bir bistro atmosferi.',
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&h=200&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&h=600&q=80',
      address: 'Cevdet Paşa Cad. No:51 Bebek, Beşiktaş, İstanbul',
      phone: '+90 (212) 257 12 00',
      email: 'info@luccabistro.com',
      websiteUrl: 'https://luccastyle.com',
      primaryColor: '#e11d48', // Luxury Rose Red
      accentColor: '#f59e0b',  // Warm Amber
      themeMode: 'dark',
      fontFamily: 'Inter',
      wifiSsid: 'Lucca_Guest_5G',
      wifiPassword: 'LuccaGuest2026',
      wifiEncryption: 'WPA',
      wifiHidden: false,
      googleReviewUrl: 'https://g.page/r/sample-lucca-review/review',
      googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      googleMapsUrl: 'https://maps.google.com/?cid=1029384756',
      instagramHandle: 'luccastyle',
      whatsappNumber: '905321234567',
      currency: '₺',
      languageDefault: 'tr',
      isActive: true,
    },
  });

  // User for Lucca
  await prisma.user.create({
    data: {
      email: 'admin@lucca.com',
      name: 'Kemal Yönetici',
      passwordHash: defaultPasswordHash,
      role: 'RESTAURANT_OWNER',
      restaurantId: lucca.id,
    },
  });

  // Categories for Lucca
  const catStarters = await prisma.menuCategory.create({
    data: {
      restaurantId: lucca.id,
      name: 'Başlangıçlar & Tapas',
      nameEn: 'Starters & Tapas',
      description: 'Paylaşımlık sıcak ve soğuk Akdeniz tabakları',
      icon: '🥗',
      sortOrder: 1,
    },
  });

  const catMains = await prisma.menuCategory.create({
    data: {
      restaurantId: lucca.id,
      name: 'Ana Yemekler & Izgara',
      nameEn: 'Main Courses & Grills',
      description: 'Kömür ateşinde ızgaralar ve şefin taze spesiyalleri',
      icon: '🥩',
      sortOrder: 2,
    },
  });

  const catPasta = await prisma.menuCategory.create({
    data: {
      restaurantId: lucca.id,
      name: 'El Yapımı Makarna & Risotto',
      nameEn: 'Handmade Pasta & Risotto',
      description: 'Günlük açılan taze hamur ve İtalyan unları ile',
      icon: '🍝',
      sortOrder: 3,
    },
  });

  const catCocktails = await prisma.menuCategory.create({
    data: {
      restaurantId: lucca.id,
      name: 'İmza Kokteyller',
      nameEn: 'Signature Cocktails',
      description: 'Miksologlarımız tarafından hazırlanan taze aromatik kokteyller',
      icon: '🍸',
      sortOrder: 4,
    },
  });

  const catDesserts = await prisma.menuCategory.create({
    data: {
      restaurantId: lucca.id,
      name: 'Tatlılar',
      nameEn: 'Desserts',
      description: 'Günün tatlı kapanışları',
      icon: '🍰',
      sortOrder: 5,
    },
  });

  // Menu items for Lucca
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: lucca.id,
        categoryId: catStarters.id,
        name: 'Trüflü Burrata & Fırın Domates',
        nameEn: 'Truffled Burrata & Roasted Tomatoes',
        description: 'Taze İtalyan burrata peyniri, fırınlanmış salkım domates, ev yapımı fesleğen pesto ve çıtır ekşi maya kıtırları.',
        descriptionEn: 'Fresh burrata, roasted vine tomatoes, homemade basil pesto, sourdough crisps.',
        price: 490,
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69103851?auto=format&fit=crop&w=600&q=80',
        isChefSpecial: true,
        isPopular: true,
        dietaryTags: 'vejetaryen',
        allergens: 'süt,gluten',
        calories: 420,
        sortOrder: 1,
      },
      {
        restaurantId: lucca.id,
        categoryId: catStarters.id,
        name: 'Avokadolu Somon Tartar',
        nameEn: 'Salmon Tartare with Avocado',
        description: 'Norveç somonu, misket limonu, frenk soğanı, olgun avokado ve ponzu sos eşliğinde.',
        descriptionEn: 'Fresh Norwegian salmon, lime, chives, ripe avocado, ponzu sauce.',
        price: 520,
        imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
        isPopular: true,
        dietaryTags: 'glutensiz',
        allergens: 'balık,soya',
        calories: 360,
        sortOrder: 2,
      },
      {
        restaurantId: lucca.id,
        categoryId: catPasta.id,
        name: 'Trüf Mantarlı Ev Yapımı Tagliolini',
        nameEn: 'Homemade Truffle Tagliolini',
        description: 'El yapımı taze tagliolini, siyah yaz trüfü ezmesi, parmesan kreması ve taze dağ kekiği.',
        descriptionEn: 'Fresh handmade tagliolini, black summer truffle, parmesan cream, fresh thyme.',
        price: 640,
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=600&q=80',
        isChefSpecial: true,
        isPopular: true,
        dietaryTags: 'vejetaryen',
        allergens: 'gluten,süt,yumurta',
        calories: 590,
        sortOrder: 1,
      },
      {
        restaurantId: lucca.id,
        categoryId: catMains.id,
        name: 'Kuru Dinlendirilmiş Dana Antrikot (300g)',
        nameEn: 'Dry Aged Ribeye Steak (300g)',
        description: '28 gün kuru dinlendirilmiş yerli dana antrikot, trüflü patates püresi ve biberiye tereyağı ile.',
        descriptionEn: '28-day dry aged ribeye steak, truffle mashed potatoes, rosemary herb butter.',
        price: 880,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        isChefSpecial: true,
        dietaryTags: 'glutensiz',
        allergens: 'süt',
        calories: 780,
        sortOrder: 1,
      },
      {
        restaurantId: lucca.id,
        categoryId: catMains.id,
        name: 'Deniz Levreği & Kuşkonmaz',
        nameEn: 'Pan-Seared Sea Bass & Asparagus',
        description: 'Tavada mühürlenmiş taze deniz levreği, ızgara kuşkonmaz, safranlı beurre blanc sos.',
        descriptionEn: 'Crispy skin sea bass, grilled asparagus, saffron beurre blanc sauce.',
        price: 720,
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
        dietaryTags: 'glutensiz',
        allergens: 'balık,süt',
        calories: 460,
        sortOrder: 2,
      },
      {
        restaurantId: lucca.id,
        categoryId: catCocktails.id,
        name: 'Satsuma Vodka (Lucca Original)',
        nameEn: 'Satsuma Vodka (Original)',
        description: 'Bodrum satsuma mandalinası püresi, premium votka, taze nane ve hafif zencefil.',
        descriptionEn: 'Bodrum satsuma puree, premium vodka, fresh mint, gentle ginger touch.',
        price: 480,
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
        isChefSpecial: true,
        isPopular: true,
        sortOrder: 1,
      },
      {
        restaurantId: lucca.id,
        categoryId: catCocktails.id,
        name: 'Smoked Rosemary Mezcalita',
        nameEn: 'Smoked Rosemary Mezcalita',
        description: 'Tütsülenmiş biberiye, artisanal mezcal, misket limonu, organik agave ve chili tuz çemberi.',
        descriptionEn: 'Artisanal mezcal, smoked rosemary, fresh lime, agave nectar, chili salt rim.',
        price: 520,
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
        isNew: true,
        sortOrder: 2,
      },
      {
        restaurantId: lucca.id,
        categoryId: catDesserts.id,
        name: 'San Sebastián Cheesecake & Belçika Çikolatası',
        nameEn: 'San Sebastian Cheesecake & Warm Belgian Chocolate',
        description: 'Akışkan iç kıvamlı fırın cheesecake, yanında sıcak eritilmiş Callebaut bitter çikolata sosu.',
        descriptionEn: 'Basque burnt cheesecake with molten Callebaut dark chocolate sauce on the side.',
        price: 320,
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
        isPopular: true,
        allergens: 'gluten,süt,yumurta',
        calories: 520,
        sortOrder: 1,
      },
    ],
  });

  // 2. Restaurant: Gusto Trattoria (Italian bistro)
  const gusto = await prisma.restaurant.create({
    data: {
      slug: 'gusto-trattoria',
      name: 'Gusto Trattoria Nişantaşı',
      tagline: 'Otantik Napoli Pizza & Taze Ev Yapımı Makarnalar',
      description: 'Taş fırından yeni çıkmış sıcak Napoli pizzaları ve nesilden nesile aktarılan İtalyan lezzetleri.',
      logoUrl: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=200&h=200&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&h=600&q=80',
      address: 'Abdi İpekçi Cad. No:18 Nişantaşı, Şişli, İstanbul',
      phone: '+90 (212) 296 33 44',
      primaryColor: '#ea580c', // Warm Terracotta
      accentColor: '#16a34a',  // Italian Green
      themeMode: 'dark',
      fontFamily: 'Inter',
      wifiSsid: 'Gusto_Guest_Wi-Fi',
      wifiPassword: 'BuonAppetito2026',
      wifiEncryption: 'WPA',
      wifiHidden: false,
      googleReviewUrl: 'https://g.page/r/gusto-trattoria-review/review',
      currency: '₺',
      isActive: true,
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@gusto.com',
      name: 'Mario Ustabaşı',
      passwordHash: defaultPasswordHash,
      role: 'RESTAURANT_OWNER',
      restaurantId: gusto.id,
    },
  });

  const catPizza = await prisma.menuCategory.create({
    data: {
      restaurantId: gusto.id,
      name: 'Taş Fırın Napoli Pizza',
      nameEn: 'Wood-fired Neapolitan Pizza',
      icon: '🍕',
      sortOrder: 1,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: gusto.id,
        categoryId: catPizza.id,
        name: 'Pizza Margherita Di Bufala',
        nameEn: 'Margherita Di Bufala',
        description: 'San Marzano domates sosu, manda mozzarellası, taze fesleğen ve sızma zeytinyağı.',
        price: 430,
        imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
        isPopular: true,
        dietaryTags: 'vejetaryen',
        allergens: 'gluten,süt',
      },
      {
        restaurantId: gusto.id,
        categoryId: catPizza.id,
        name: 'Pizza Quattro Formaggi',
        nameEn: 'Four Cheese Pizza',
        description: 'Mozzarella, gorgonzola, parmesan, ricotta ve organik kekik balı dokunuşu.',
        price: 480,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        dietaryTags: 'vejetaryen',
        allergens: 'gluten,süt',
      },
    ],
  });

  // Seed sample analytics events for Lucca (NFC taps, WiFi connects, etc.)
  const now = new Date();
  const eventTypes = ['NFC_TAP', 'MENU_VIEW', 'WIFI_CONNECT', 'GOOGLE_REVIEW', 'WAITER_CALL'];

  for (let i = 0; i < 45; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 3600000 * 12);
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const tableNum = `Masa ${Math.floor(Math.random() * 15) + 1}`;

    await prisma.analyticsEvent.create({
      data: {
        restaurantId: lucca.id,
        eventType: type,
        tableNumber: tableNum,
        createdAt: date,
      },
    });
  }

  console.log('✅ Seeding completed successfully!');
  console.log(`Lucca Admin: admin@lucca.com / password123 (Slug: lucca-bistro)`);
  console.log(`Gusto Admin: admin@gusto.com / password123 (Slug: gusto-trattoria)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
