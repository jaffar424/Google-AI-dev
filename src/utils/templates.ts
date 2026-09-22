import { PartyPlan } from '../types/party';
import { calculatePartyDrinks, calculatePartyFood } from './calculator';

export const PARTY_TEMPLATES: Record<string, Partial<PartyPlan>> = {
  tropical_birthday: {
    details: {
      id: 'template_tropical_birthday',
      title: 'Tropical Island Birthday Celebration',
      theme: 'Tropical Tiki Oasis with Island Rum Punch, Fresh Pineapple & Teriyaki',
      eventType: 'Birthday Celebration',
      guestCountAdults: 18,
      guestCountKids: 2,
      durationHours: 4.5,
      budgetLimit: 290,
      drinkStyle: 'cocktail_special',
      cateringStyle: 'semi_homemade',
      dietaryRestrictions: ['Gluten-Free Friendly', 'Nut-Free Safe'],
      specialRequests: 'Scheduled for Next Saturday. Include fresh pineapples, party ice for tropical coolers, bamboo tiki plates, custom bakery birthday cake, and coconut rum punch.',
    },
    themeTitle: 'CymbalMart Tropical Island Birthday Celebration',
    themeDescription: 'A sun-drenched tropical oasis celebration for 20 guests next Saturday featuring teriyaki glazed chicken skewers, Hawaiian sweet rolls, mango lime salsa, coconut rum punch, and a signature passionfruit spritz.',
    vibeKeywords: ['Tropical Vibes', 'Island Reggae & Ukulele', 'Exotic Fruit', 'Birthday Toast', 'Tiki Ambience'],
    signatureCocktail: {
      name: 'Island Breeze Coconut Rum & Passionfruit Punch',
      description: 'A batch cocktail of Caribbean white & spiced rum, passionfruit juice, fresh pineapple juice, lime, and coconut cream topped with toasted coconut flakes.',
      ingredients: ['750ml Caribbean White Rum', '750ml Spiced Rum', 'CymbalMart 100% Pineapple Juice', 'Passionfruit Nectar', 'Fresh Limes (15 units)', 'Cream of Coconut'],
    },
    signatureMocktail: {
      name: 'Sparkling Guava Mango Tiki Spritzer',
      description: 'Chilled guava nectar and crushed sweet mango shaken with fresh lime juice, topped with sparkling coconut water and a maraschino cherry.',
      ingredients: ['Guava Nectar (2 bottles)', 'CymbalMart Fresh Mangoes', 'Sparkling Coconut Water (6-pack)', 'Fresh Mint Sprigs', 'Lime wedges'],
    },
    items: [
      { id: 'tb_1', name: 'Boneless Skinless Chicken Breasts & Thighs (Teriyaki Skewers)', category: 'proteins', quantity: 6, unit: 'lbs', estimatedPrice: 22, store: 'CymbalMart Supercenter', priority: 'essential', notes: 'Marinate in pineapple ginger teriyaki; thread onto bamboo skewers', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Butcher Select', aisleNumber: 'Aisle 4' },
      { id: 'tb_2', name: 'Sweet Hawaiian Glazed Pulled Pork', category: 'proteins', quantity: 4, unit: 'lbs', estimatedPrice: 18, store: 'CymbalMart Supercenter', priority: 'essential', notes: 'Slow cooker with pineapple chunks & brown sugar glaze', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Butcher Select', aisleNumber: 'Aisle 4' },
      { id: 'tb_3', name: 'Plant-Based Island Pineapple Glazed Meatless Sliders', category: 'proteins', quantity: 1, unit: 'pack (8 patties)', estimatedPrice: 7.5, store: 'CymbalMart Supercenter', priority: 'recommended', notes: 'Vegetarian and vegan guest main protein', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Organics', aisleNumber: 'Aisle 8 (Freezer)' },
      { id: 'tb_4', name: 'Golden Sweet Whole Ripe Pineapples', category: 'produce', quantity: 3, unit: 'units', estimatedPrice: 8.5, store: 'CymbalMart Fresh Market', priority: 'essential', notes: 'Hollow 1 for punch bowl, slice 2 for grilling & fruit skewers', isBought: false, aisleNumber: 'Aisle 1' },
      { id: 'tb_5', name: 'Fresh Mangoes & Red Bell Peppers (for Mango Salsa)', category: 'produce', quantity: 5, unit: 'units', estimatedPrice: 6, store: 'CymbalMart Fresh Market', priority: 'essential', notes: 'Dice with red onion, jalapeño, cilantro & lime', isBought: false, aisleNumber: 'Aisle 1' },
      { id: 'tb_6', name: 'Fresh Key Limes & Cocktail Mint', category: 'produce', quantity: 2, unit: 'bags + bunches', estimatedPrice: 5.5, store: 'CymbalMart Fresh Market', priority: 'essential', notes: 'For rum punch batch & garnish', isBought: false, aisleNumber: 'Aisle 1' },
      { id: 'tb_7', name: 'Crisp Island Coleslaw Blend (Cabbage & Carrots)', category: 'produce', quantity: 3, unit: 'bags', estimatedPrice: 6.5, store: 'CymbalMart Fresh Market', priority: 'essential', notes: 'Toss with sesame ginger lime dressing', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 1' },
      { id: 'tb_8', name: 'CymbalMart Bakery Tropical Mango Passionfruit Birthday Cake (8-inch)', category: 'bakery', quantity: 1, unit: 'whole cake', estimatedPrice: 24, store: 'CymbalMart Supercenter', priority: 'essential', notes: 'Custom birthday inscription: Happy Birthday! 20 Servings', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Artisan Bakery', aisleNumber: 'Aisle 2' },
      { id: 'tb_9', name: 'Original Hawaiian Sweet Rolls', category: 'bakery', quantity: 24, unit: 'rolls (2 packs)', estimatedPrice: 8, store: 'CymbalMart Supercenter', priority: 'essential', notes: 'For pulled pork and island sliders', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Bakery', aisleNumber: 'Aisle 2' },
      { id: 'tb_10', name: 'Cream of Coconut (Coco Lopez or Select)', category: 'dairy_charcuterie', quantity: 2, unit: 'cans', estimatedPrice: 6, store: 'CymbalMart Supercenter', priority: 'essential', notes: 'For batch cocktails and mocktails', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 6' },
      { id: 'tb_11', name: 'Sweet Maui Onion & Plantain Chips', category: 'pantry_snacks', quantity: 3, unit: 'large bags', estimatedPrice: 10.5, store: 'CymbalMart Supercenter', priority: 'essential', notes: 'Serve with fresh mango salsa and guacamole', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 5' },
      { id: 'tb_12', name: 'Sweet Soy Teriyaki Marinade & Sesame Glaze', category: 'pantry_snacks', quantity: 2, unit: 'bottles', estimatedPrice: 6, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 5' },
      { id: 'tb_13', name: 'Caribbean White Rum & Aged Spiced Rum (750ml bottles)', category: 'alcohol', quantity: 2, unit: 'bottles', estimatedPrice: 38, store: 'CymbalMart Wine & Spirits', priority: 'essential', notes: 'For batch Tropical Rum Punch dispenser', isBought: false, aisleNumber: 'Aisle 7' },
      { id: 'tb_14', name: 'Kona Big Wave Golden Ale & Island Seltzers', category: 'alcohol', quantity: 24, unit: 'cans', estimatedPrice: 32, store: 'CymbalMart Wine & Spirits', priority: 'essential', notes: 'Tropical craft beer & passionfruit seltzers', isBought: false, aisleNumber: 'Aisle 7' },
      { id: 'tb_15', name: 'Prosecco Sparkling Bubbly (for Birthday Toast)', category: 'alcohol', quantity: 2, unit: 'bottles', estimatedPrice: 22, store: 'CymbalMart Wine & Spirits', priority: 'recommended', notes: 'For birthday cake toast', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Cellars', aisleNumber: 'Aisle 7' },
      { id: 'tb_16', name: '100% Pineapple Juice & Passionfruit Nectar', category: 'beverages_mixers', quantity: 4, unit: 'bottles/cans', estimatedPrice: 11, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 6' },
      { id: 'tb_17', name: 'Sparkling Coconut Mineral Water', category: 'beverages_mixers', quantity: 12, unit: 'cans', estimatedPrice: 9.5, store: 'CymbalMart Supercenter', priority: 'recommended', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 6' },
      { id: 'tb_18', name: 'CymbalMart Pure Cubed Party Ice', category: 'ice', quantity: 30, unit: 'lbs (3 bags)', estimatedPrice: 9, store: 'CymbalMart Supercenter', priority: 'essential', notes: 'Chilling rum punch, beer coolers, and tropical glasses', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Ice', aisleNumber: 'Aisle 8 (Freezer)' },
      { id: 'tb_19', name: 'Eco-Bamboo Island Plates & Napkins (50 ct)', category: 'tableware', quantity: 1, unit: 'pack', estimatedPrice: 11, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Earth First', aisleNumber: 'Aisle 9' },
      { id: 'tb_20', name: 'Tropical Tiki Birthday Leis & Palm Leaf Garland', category: 'decor_ambience', quantity: 1, unit: 'pack', estimatedPrice: 13, store: 'CymbalMart Supercenter', priority: 'recommended', isBought: false, aisleNumber: 'Aisle 10' },
      { id: 'tb_21', name: 'Birthday Cake Candles & Sparklers', category: 'decor_ambience', quantity: 1, unit: 'pack', estimatedPrice: 3.5, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, aisleNumber: 'Aisle 10' },
    ],
    costSavingTips: [
      'Batch the Tropical Rum Punch in a 2-gallon drink dispenser with pineapple rings floating on top — saves 40% vs. individual mixed drinks.',
      'Whole sweet pineapples at CymbalMart ($2.89/unit) are 60% cheaper than pre-sliced fruit cups and make stunning table centerpieces.',
      'CymbalMart Artisan Bakery 8-inch round cakes deliver customized birthday flair for $24, half the price of boutique bakeries.',
      'Hawaiian pulled pork made with pork shoulder and sweet soy glaze feeds 20 guests abundantly for under $2.20 per plate.'
    ],
    timeline: [
      {
        phaseName: '1 Week Before',
        timeframe: '7 Days Out',
        tasks: [
          { id: 'tb_t1', task: 'Confirm 20 guest RSVPs and birthday cake custom message with CymbalMart Bakery', completed: false, category: 'Host Ready' },
          { id: 'tb_t2', task: 'Check tropical playlist and prepare outdoor tiki torches / string lights', completed: false, category: 'Decor & Ambience' },
          { id: 'tb_t3', task: 'Reserve CymbalMart Curbside Pickup slot for Next Saturday 10:00 AM', completed: false, category: 'Shopping' }
        ]
      },
      {
        phaseName: '2 Days Before',
        timeframe: 'Thursday',
        tasks: [
          { id: 'tb_t4', task: 'Soak bamboo skewers in water so they do not char on the grill', completed: false, category: 'Food Prep' },
          { id: 'tb_t5', task: 'Assemble party coolers and rinse beverage dispensers', completed: false, category: 'Bar Setup' }
        ]
      },
      {
        phaseName: 'Day Before',
        timeframe: 'Friday Evening',
        tasks: [
          { id: 'tb_t6', task: 'Marinate chicken in teriyaki sauce and prep pineapple glaze for pulled pork', completed: false, category: 'Food Prep' },
          { id: 'tb_t7', task: 'Dice mangoes and bell peppers for the mango lime salsa', completed: false, category: 'Food Prep' },
          { id: 'tb_t8', task: 'Chill tropical seltzers, beers, and fruit juices', completed: false, category: 'Bar Setup' }
        ]
      },
      {
        phaseName: 'Saturday Morning',
        timeframe: 'Next Saturday 10:00 AM',
        tasks: [
          { id: 'tb_t9', task: 'Pick up CymbalMart Curbside order: Birthday cake, 30 lbs party ice & fresh mint', completed: false, category: 'Shopping' },
          { id: 'tb_t10', task: 'Mix batch Island Breeze Coconut Rum Punch in drink dispenser', completed: false, category: 'Bar Setup' },
          { id: 'tb_t11', task: 'Hang palm leaf garland, arrange floral leis, and lay bamboo tableware', completed: false, category: 'Decor & Ambience' }
        ]
      },
      {
        phaseName: '1 Hour Before',
        timeframe: 'Next Saturday 4:00 PM',
        tasks: [
          { id: 'tb_t12', task: 'Grill teriyaki chicken skewers until glazed and caramelized', completed: false, category: 'Food Prep' },
          { id: 'tb_t13', task: 'Fill ice coolers with beer, seltzers, and sparkling coconut waters', completed: false, category: 'Bar Setup' },
          { id: 'tb_t14', task: 'Set out chips and mango salsa; light tiki candles and start island music', completed: false, category: 'Host Ready' }
        ]
      }
    ],
    runOfShow: [
      { time: '5:00 PM', activity: 'Guest Arrival & Tropical Welcome Punch', tip: 'Hand each guest a floral lei and a glass of chilled Coconut Rum Punch or Guava Tiki Spritz.' },
      { time: '5:45 PM', activity: 'Plantain Chips & Fresh Mango Salsa Station', tip: 'Keep grazing relaxed with light bites while chicken skewers finish caramelizing.' },
      { time: '6:30 PM', activity: 'Island Dinner Buffet Opens', tip: 'Serve warm teriyaki skewers, glazed pulled pork sliders, and sesame slaw.' },
      { time: '8:00 PM', activity: 'Birthday Cake Presentation & Prosecco Toast', tip: 'Dim lights, bring out sparkler candles on the mango passionfruit cake, and pour Prosecco flutes.' },
      { time: '9:30 PM', activity: 'Island Sunset Social & Reggae Chill', tip: 'Enjoy tropical desserts, island vibes, and wind down.' }
    ]
  },

  taco_fiesta: {
    details: {
      id: 'template_taco_fiesta',
      title: 'Cinco & Fiesta: Street Taco & Margarita Cantina',
      theme: 'Vibrant Mexican Street Food & Craft Margaritas',
      eventType: 'Dinner & Cocktails Party',
      guestCountAdults: 16,
      guestCountKids: 2,
      durationHours: 4,
      budgetLimit: 280,
      drinkStyle: 'cocktail_special',
      cateringStyle: 'semi_homemade',
      dietaryRestrictions: ['Gluten-Free Friendly', 'Vegetarian Option'],
      specialRequests: 'Include fresh limes, Tajín rim station, and eco-friendly compostable plates.',
    },
    themeTitle: 'CymbalMart Sizzling Street Taco & Citrus Cantina',
    themeDescription: 'A lively fiesta featuring slow-braised carnitas, seasoned chicken, warm corn tortillas, fresh salsas, guacamole, and a DIY fresh lime margarita station with salted rims.',
    vibeKeywords: ['Festive', 'Colorful', 'Upbeat Latin Beats', 'Casual Sharing', 'Tangy & Spicy'],
    signatureCocktail: {
      name: 'Smoked Jalapeño & Fresh Lime Margarita',
      description: '100% Blue Agave blanco tequila, freshly squeezed lime juice, orange liqueur, agave nectar, and optional jalapeño wheel.',
      ingredients: ['750ml Blanco Tequila', 'Triple Sec or Cointreau', 'Fresh Limes (2 lbs)', 'Agave Nectar', 'Tajín & Sea Salt'],
    },
    signatureMocktail: {
      name: 'Hibiscus Agua de Jamaica Spritz',
      description: 'Tart iced hibiscus tea infused with fresh orange slices, lime juice, and topped with sparkling soda water.',
      ingredients: ['Dried Hibiscus Flowers (Flor de Jamaica)', 'Cinnamon stick', 'Sparkling Mineral Water', 'Cane Sugar', 'Orange slices'],
    },
    items: [
      // Proteins
      { id: 'tf_1', name: 'Boneless Pork Shoulder (for Carnitas)', category: 'proteins', quantity: 6, unit: 'lbs', estimatedPrice: 21, store: 'CymbalMart Supercenter', priority: 'essential', notes: 'Slow cook with oranges & spices', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Butcher Select', aisleNumber: 'Aisle 4' },
      { id: 'tf_2', name: 'Fresh Chicken Thighs (Taco Seasoned)', category: 'proteins', quantity: 4, unit: 'lbs', estimatedPrice: 14, store: 'CymbalMart Supercenter', priority: 'essential', notes: 'Quick skillet sear with taco seasoning', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 4' },
      { id: 'tf_3', name: 'Black Beans & Roasted Corn (Veggie Option)', category: 'proteins', quantity: 3, unit: 'cans', estimatedPrice: 4.5, store: 'CymbalMart Supercenter', priority: 'recommended', notes: 'Warm seasoned filling for vegetarian guests', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Organics', aisleNumber: 'Aisle 5' },

      // Produce
      { id: 'tf_4', name: 'Fresh Hass Avocados (for Guacamole batch)', category: 'produce', quantity: 8, unit: 'units', estimatedPrice: 8, store: 'CymbalMart Fresh Market', priority: 'essential', notes: 'Mash with lime, sea salt, minced onion & cilantro', isBought: false, aisleNumber: 'Aisle 1' },
      { id: 'tf_5', name: 'Fresh Limes (Cocktails & Taco wedges)', category: 'produce', quantity: 20, unit: 'units', estimatedPrice: 6, store: 'CymbalMart Fresh Market', priority: 'essential', notes: 'Juice 12 for margarita batch, cut 8 into wedges', isBought: false, aisleNumber: 'Aisle 1' },
      { id: 'tf_6', name: 'Fresh Cilantro & Red Onions', category: 'produce', quantity: 3, unit: 'bunches', estimatedPrice: 3.5, store: 'CymbalMart Fresh Market', priority: 'essential', notes: 'Finely diced street-style garnish', isBought: false, aisleNumber: 'Aisle 1' },
      { id: 'tf_7', name: 'Roma Tomatoes & Jalapeños', category: 'produce', quantity: 2, unit: 'lbs', estimatedPrice: 4, store: 'CymbalMart Fresh Market', priority: 'recommended', notes: 'Pico de gallo & spicy cocktail kick', isBought: false, aisleNumber: 'Aisle 1' },

      // Dairy & Charcuterie
      { id: 'tf_8', name: 'Cotija Crumbled Cheese & Queso Fresco', category: 'dairy_charcuterie', quantity: 2, unit: 'packs', estimatedPrice: 6.5, store: 'CymbalMart Supercenter', priority: 'essential', notes: 'Sprinkle over street tacos', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 3' },
      { id: 'tf_9', name: 'Mexican Crema or Sour Cream', category: 'dairy_charcuterie', quantity: 1, unit: 'bottle', estimatedPrice: 3, store: 'CymbalMart Supercenter', priority: 'recommended', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 3' },

      // Bakery
      { id: 'tf_10', name: 'Street Taco Size White Corn Tortillas', category: 'bakery', quantity: 60, unit: 'units (2 packs)', estimatedPrice: 5.5, store: 'CymbalMart Supercenter', priority: 'essential', notes: 'Naturally gluten-free; heat on comal or dry skillet', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Bakery', aisleNumber: 'Aisle 2' },
      { id: 'tf_11', name: 'Cinnamon Sugar Churro Bites', category: 'bakery', quantity: 18, unit: 'servings', estimatedPrice: 12, store: 'CymbalMart Supercenter', priority: 'recommended', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Bakery', aisleNumber: 'Aisle 2' },

      // Pantry & Chips
      { id: 'tf_12', name: 'Restaurant-Style Sea Salt Tortilla Chips', category: 'pantry_snacks', quantity: 3, unit: 'large bags', estimatedPrice: 9.5, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 5' },
      { id: 'tf_13', name: 'Salsa Verde & Roasted Chipotle Salsa', category: 'pantry_snacks', quantity: 3, unit: 'jars', estimatedPrice: 8, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 5' },

      // Alcohol
      { id: 'tf_14', name: 'Blanco Tequila 100% Blue Agave', category: 'alcohol', quantity: 2, unit: '750ml bottles', estimatedPrice: 46, store: 'CymbalMart Wine & Spirits', priority: 'essential', notes: 'For fresh lime pitcher margaritas', isBought: false, aisleNumber: 'Aisle 7' },
      { id: 'tf_15', name: 'Mexican Cerveza (Modelo / Corona)', category: 'alcohol', quantity: 24, unit: 'bottles', estimatedPrice: 27, store: 'CymbalMart Wine & Spirits', priority: 'essential', notes: 'Chill in cooler with fresh lime slices', isBought: false, aisleNumber: 'Aisle 7' },
      { id: 'tf_16', name: 'Orange Liqueur / Triple Sec', category: 'alcohol', quantity: 1, unit: '750ml bottle', estimatedPrice: 12, store: 'CymbalMart Wine & Spirits', priority: 'essential', isBought: false, aisleNumber: 'Aisle 7' },

      // Beverages & Mixers
      { id: 'tf_17', name: 'Organic Agave Nectar', category: 'beverages_mixers', quantity: 1, unit: 'bottle', estimatedPrice: 5.5, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Organics', aisleNumber: 'Aisle 6' },
      { id: 'tf_18', name: 'Mexican Sodas & Sparkling Lime Water', category: 'beverages_mixers', quantity: 12, unit: 'bottles', estimatedPrice: 13, store: 'CymbalMart Supercenter', priority: 'recommended', isBought: false, aisleNumber: 'Aisle 6' },

      // Ice
      { id: 'tf_19', name: 'CymbalMart Pure Party Ice', category: 'ice', quantity: 25, unit: 'lbs (3 bags)', estimatedPrice: 8, store: 'CymbalMart Supercenter', priority: 'essential', notes: '1 bag for cocktail glasses, 2 bags for drink tub', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Ice', aisleNumber: 'Aisle 8 (Freezer)' },

      // Tableware & Supplies
      { id: 'tf_20', name: 'Eco-Craft Bamboo Compostable Plates (10 inch)', category: 'tableware', quantity: 40, unit: 'pack', estimatedPrice: 9.5, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Earth First', aisleNumber: 'Aisle 9' },
      { id: 'tf_21', name: 'Recycled Beverage Cups & Fiesta Napkins', category: 'tableware', quantity: 60, unit: 'count', estimatedPrice: 7, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Earth First', aisleNumber: 'Aisle 9' },

      // Decor
      { id: 'tf_22', name: 'Fiesta Papel Picado & Mini Table Cacti', category: 'decor_ambience', quantity: 1, unit: 'set', estimatedPrice: 11, store: 'CymbalMart Supercenter', priority: 'optional', isBought: false, aisleNumber: 'Aisle 10' },
    ],
    costSavingTips: [
      'Batch the margaritas in a large 1-gallon drink dispenser 2 hours before instead of shaking individual cocktails — saves liquor and host stress!',
      'Choose CymbalMart Butcher Select pork shoulder ($3.49/lb) instead of precooked carnitas ($7.99/lb) to save over $27.',
      'Corn tortillas are 1/3 the price of flour wraps and naturally satisfy gluten-free guests.',
      'Put out large bowls of chips, salsas, and guacamole first — guests fill up comfortably on delicious dips.'
    ],
    timeline: [
      {
        phaseName: '1 Week Before',
        timeframe: '7 Days Out',
        tasks: [
          { id: 't_1', task: 'Finalize RSVP count and confirm dietary restrictions in CymbalMart app', completed: false, category: 'Host Ready' },
          { id: 't_2', task: 'Order compostable tableware and inspect party drink dispensers', completed: false, category: 'Decor & Ambience' },
          { id: 't_3', task: 'Confirm Tequila and Cerveza stock in CymbalMart cart', completed: false, category: 'Bar Setup' }
        ]
      },
      {
        phaseName: '2-3 Days Before',
        timeframe: 'Thursday',
        tasks: [
          { id: 't_4', task: 'Schedule CymbalMart Curbside Pickup or Same-Day Delivery slot', completed: false, category: 'Shopping' },
          { id: 't_5', task: 'Prep spice rubs and thaw pork shoulder if frozen', completed: false, category: 'Food Prep' },
          { id: 't_6', task: 'Assemble Latin party playlist (Cumbia, Buena Vista, Bossa)', completed: false, category: 'Decor & Ambience' }
        ]
      },
      {
        phaseName: 'Day Before',
        timeframe: 'Friday Evening',
        tasks: [
          { id: 't_7', task: 'Slow-cook the carnitas pork; shred and store in cooking juices', completed: false, category: 'Food Prep' },
          { id: 't_8', task: 'Dice onions, jalapeños, and chop cilantro (keep airtight with damp paper towel)', completed: false, category: 'Food Prep' },
          { id: 't_9', task: 'Chill beers and mineral waters in the fridge', completed: false, category: 'Bar Setup' }
        ]
      },
      {
        phaseName: 'Morning of Party',
        timeframe: 'Saturday 10 AM',
        tasks: [
          { id: 't_10', task: 'Pick up CymbalMart Curbside order (Ice bags & ripe avocados)', completed: false, category: 'Shopping' },
          { id: 't_11', task: 'Squeeze fresh limes and mix the batch margarita (without ice)', completed: false, category: 'Bar Setup' },
          { id: 't_12', task: 'Set out buffet plates, napkins, salsa bowls, and taco warmers', completed: false, category: 'Decor & Ambience' }
        ]
      },
      {
        phaseName: '1 Hour Before',
        timeframe: 'Saturday 4 PM',
        tasks: [
          { id: 't_13', task: 'Broil carnitas under broiler for 5 mins to get crispy edges', completed: false, category: 'Food Prep' },
          { id: 't_14', task: 'Mash fresh guacamole with lime juice and sea salt', completed: false, category: 'Food Prep' },
          { id: 't_15', task: 'Fill ice buckets, rim margarita glasses with Tajín, queue music', completed: false, category: 'Host Ready' }
        ]
      }
    ],
    runOfShow: [
      { time: '5:00 PM', activity: 'Doors Open & Welcome Margaritas', tip: 'Hand arriving guests a chilled salted margarita or Agua de Jamaica spritz.' },
      { time: '5:30 PM', activity: 'Chips, Guac & Salsa Station Open', tip: 'Keeps guests relaxed and mingling while tacos stay warm.' },
      { time: '6:30 PM', activity: 'Street Taco Buffet Opens', tip: 'Keep tortillas wrapped in clean kitchen towels or a tortilla warmer.' },
      { time: '8:00 PM', activity: 'Churros & Coffee / Dessert Toast', tip: 'Warm churro bites served with chocolate dipping sauce.' },
      { time: '9:30 PM', activity: 'Wind Down & Leftover Packs', tip: 'Have eco-friendly foil boxes ready for guests who want tacos for tomorrow.' }
    ]
  },

  backyard_bbq: {
    details: {
      id: 'template_bbq',
      title: 'CymbalMart Smokehouse Backyard BBQ & Grill',
      theme: 'All-American Grill & Chill with Lawn Games',
      eventType: 'Outdoor BBQ Cookout',
      guestCountAdults: 20,
      guestCountKids: 6,
      durationHours: 5,
      budgetLimit: 330,
      drinkStyle: 'beer_wine_only',
      cateringStyle: 'bbq_grill',
      dietaryRestrictions: ['Kid-Friendly', 'Vegetarian Burgers Option'],
      specialRequests: 'Include charcoal, ice for coolers, and kids juice pouches.',
    },
    themeTitle: 'CymbalMart Backyard Smoke & Sizzle Cookout',
    themeDescription: 'Classic sunny afternoon grilling juicy smash burgers, grilled sausage links, potato salad, sweet watermelon slices, and iced tubs of craft IPAs and lemonades.',
    vibeKeywords: ['Sunny', 'Relaxed', 'Smoky', 'Family-Friendly', 'Lawn Games'],
    signatureCocktail: {
      name: 'Spiked Bourbon Peach Sweet Tea',
      description: 'Brewed black tea sweetened with peach nectar and fresh mint leaves, with bourbon on the side for adults.',
      ingredients: ['Kentucky Bourbon (750ml)', 'Peach Puree / Nectar', 'Fresh Mint', 'Brewed Southern Sweet Tea'],
    },
    items: [
      { id: 'bbq_1', name: 'CymbalMart Angus 80/20 Ground Beef Patties', category: 'proteins', quantity: 8, unit: 'lbs (24 patties)', estimatedPrice: 34, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Butcher Select', aisleNumber: 'Aisle 4' },
      { id: 'bbq_2', name: 'Smoked Bratwurst & All-Beef Hot Dogs', category: 'proteins', quantity: 16, unit: 'links', estimatedPrice: 16, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 4' },
      { id: 'bbq_3', name: 'Black Bean Chipotle Veggie Burgers', category: 'proteins', quantity: 6, unit: 'patties', estimatedPrice: 8, store: 'CymbalMart Supercenter', priority: 'recommended', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Organics', aisleNumber: 'Aisle 8 (Freezer)' },
      { id: 'bbq_4', name: 'Sweet Seedless Red Watermelon', category: 'produce', quantity: 1, unit: 'large (16 lbs)', estimatedPrice: 7, store: 'CymbalMart Fresh Market', priority: 'essential', notes: 'Slice into handheld triangles', isBought: false, aisleNumber: 'Aisle 1' },
      { id: 'bbq_5', name: 'Sweet Bicolor Corn on the Cob', category: 'produce', quantity: 14, unit: 'ears', estimatedPrice: 7.5, store: 'CymbalMart Fresh Market', priority: 'recommended', notes: 'Grill in husks with seasoned butter', isBought: false, aisleNumber: 'Aisle 1' },
      { id: 'bbq_6', name: 'Brioche Burger & Potato Hot Dog Buns', category: 'bakery', quantity: 32, unit: 'buns (4 packs)', estimatedPrice: 12, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Bakery', aisleNumber: 'Aisle 2' },
      { id: 'bbq_7', name: 'Sharp Cheddar Cheese Deli Slices', category: 'dairy_charcuterie', quantity: 24, unit: 'slices', estimatedPrice: 6, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 3' },
      { id: 'bbq_8', name: 'Homestyle Yukon Gold Potato Salad & Slaw', category: 'pantry_snacks', quantity: 5, unit: 'lbs', estimatedPrice: 14, store: 'CymbalMart Fresh Market', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Deli', aisleNumber: 'Aisle 3' },
      { id: 'bbq_9', name: 'Ketchup, Dijon Mustard & BBQ Sauce Tri-Pack', category: 'pantry_snacks', quantity: 1, unit: 'bundle', estimatedPrice: 8, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 5' },
      { id: 'bbq_10', name: 'Craft IPA / American Pale Ale 12-pack', category: 'alcohol', quantity: 2, unit: '12-packs (24 cans)', estimatedPrice: 34, store: 'CymbalMart Wine & Spirits', priority: 'essential', isBought: false, aisleNumber: 'Aisle 7' },
      { id: 'bbq_11', name: 'Crisp Pilsner / Light Lager 24-can Case', category: 'alcohol', quantity: 1, unit: 'case (24 cans)', estimatedPrice: 22, store: 'CymbalMart Wine & Spirits', priority: 'essential', isBought: false, aisleNumber: 'Aisle 7' },
      { id: 'bbq_12', name: 'Chilled Crisp Rosé or Sauvignon Blanc', category: 'alcohol', quantity: 3, unit: 'bottles', estimatedPrice: 28, store: 'CymbalMart Wine & Spirits', priority: 'recommended', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Cellars', aisleNumber: 'Aisle 7' },
      { id: 'bbq_13', name: 'Old Fashioned Lemonade & Juice Pouches', category: 'beverages_mixers', quantity: 4, unit: 'packs', estimatedPrice: 13, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 6' },
      { id: 'bbq_14', name: 'CymbalMart Party Ice Bags (for coolers)', category: 'ice', quantity: 40, unit: 'lbs (4 bags)', estimatedPrice: 11, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Ice', aisleNumber: 'Aisle 8 (Freezer)' },
      { id: 'bbq_15', name: 'Hardwood Lump Charcoal & Fire Starters', category: 'tableware', quantity: 1, unit: 'bag', estimatedPrice: 13, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, aisleNumber: 'Aisle 9' },
      { id: 'bbq_16', name: 'Compostable Heavy Duty Plates & Wet Wipes', category: 'tableware', quantity: 1, unit: 'pack combo', estimatedPrice: 12, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Earth First', aisleNumber: 'Aisle 9' },
    ],
    costSavingTips: [
      'Choosing CymbalMart Angus patties in the bulk butcher pack cuts meat cost by 35% compared to pre-packaged specialty sliders.',
      'Corn on the cob and watermelon are delicious crowd-pleasers that cost under $0.85 per serving.',
      'Provide 2 separate coolers: one labeled "Adult Beers & Seltzers" and one labeled "Kids & Mocktails" to keep drinks organized and reduce ice waste.'
    ],
    timeline: [
      {
        phaseName: '1 Week Before',
        timeframe: '7 Days Out',
        tasks: [
          { id: 'b_1', task: 'Check grill grates and propane/charcoal supplies in garage', completed: false, category: 'Food Prep' },
          { id: 'b_2', task: 'Confirm yard games and outdoor shade canopy', completed: false, category: 'Decor & Ambience' }
        ]
      },
      {
        phaseName: 'Day Before',
        timeframe: 'Day Before',
        tasks: [
          { id: 'b_3', task: 'Stock coolers with drinks for cold chilling', completed: false, category: 'Bar Setup' },
          { id: 'b_4', task: 'Make potato salad and slice watermelon triangles', completed: false, category: 'Food Prep' }
        ]
      },
      {
        phaseName: 'Morning of Event',
        timeframe: 'Morning of BBQ',
        tasks: [
          { id: 'b_5', task: 'Collect CymbalMart Curbside order (Ice, buns & produce)', completed: false, category: 'Shopping' },
          { id: 'b_6', task: 'Fire up charcoal 30 mins before first burger', completed: false, category: 'Food Prep' }
        ]
      }
    ],
    runOfShow: [
      { time: '1:00 PM', activity: 'Guests Arrive & Lawn Games Begin', tip: 'Direct guests to the self-serve iced coolers on the patio.' },
      { time: '2:15 PM', activity: 'Grill Fires Up: Dogs & Burgers', tip: 'Cook in batches so food stays piping hot right off the grate.' },
      { time: '3:30 PM', activity: 'Chilled Watermelon & Dessert', tip: 'Hand out cold watermelon slices and popsicles for kids.' },
      { time: '5:00 PM', activity: 'Golden Hour Drinks & Campfire/Music', tip: 'Switch to relaxed acoustic guitar tunes as sun sets.' }
    ]
  },

  wine_tapas: {
    details: {
      id: 'template_wine_tapas',
      title: 'CymbalMart Candlelight Mediterranean Wine & Tapas Soirée',
      theme: 'Sophisticated Mediterranean Charcuterie & Sommelier Wine Tasting',
      eventType: 'Cocktail & Tapas Soiree',
      guestCountAdults: 12,
      guestCountKids: 0,
      durationHours: 3.5,
      budgetLimit: 250,
      drinkStyle: 'beer_wine_only',
      cateringStyle: 'semi_homemade',
      dietaryRestrictions: ['Nut Allergy Alert', 'Vegetarian Options'],
      specialRequests: 'Include curated Spanish wines, imported cheeses, and crusty sourdough baguettes.',
    },
    themeTitle: 'CymbalMart Iberian Tapas & Sommelier Pairings',
    themeDescription: 'An intimate evening of cured Jamón Serrano, aged Manchego, marinated olives, pan con tomate, bacon-wrapped dates, and curated Spanish reds, Albariño, and bubbly Cava.',
    vibeKeywords: ['Warm Ambient Glow', 'Acoustic Spanish Guitar', 'Gourmet Grazing', 'Effortless Elegance'],
    signatureCocktail: {
      name: 'Blackberry & Citrus Red Wine Sangria',
      description: 'Full-bodied Garnacha infused overnight with brandy, sliced oranges, blackberries, and cinnamon bark.',
      ingredients: ['Spanish Garnacha / Tempranillo', 'Spanish Brandy', 'Fresh Blackberries & Oranges', 'Club Soda splash'],
    },
    items: [
      { id: 'wt_1', name: 'Spanish Jamón Serrano & Prosciutto di Parma', category: 'proteins', quantity: 1, unit: 'lb (3 packs)', estimatedPrice: 19, store: 'CymbalMart Fresh Market', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Reserve', aisleNumber: 'Aisle 3' },
      { id: 'wt_2', name: 'Spanish Chorizo & Salchichón Slices', category: 'proteins', quantity: 12, unit: 'oz', estimatedPrice: 12, store: 'CymbalMart Fresh Market', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Reserve', aisleNumber: 'Aisle 3' },
      { id: 'wt_3', name: 'Aged Manchego (6-month) & Goat Cheese logs', category: 'dairy_charcuterie', quantity: 1.5, unit: 'lbs', estimatedPrice: 16, store: 'CymbalMart Fresh Market', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Reserve', aisleNumber: 'Aisle 3' },
      { id: 'wt_4', name: 'Castelvetrano & Stuffed Spanish Olives', category: 'pantry_snacks', quantity: 2, unit: 'jars', estimatedPrice: 7, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 5' },
      { id: 'wt_5', name: 'Rosemary & Sea Salt Marcona Almonds', category: 'pantry_snacks', quantity: 1, unit: 'bag', estimatedPrice: 6.5, store: 'CymbalMart Supercenter', priority: 'recommended', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 5' },
      { id: 'wt_6', name: 'Fresh Artisan Sourdough & French Baguettes', category: 'bakery', quantity: 3, unit: 'loaves', estimatedPrice: 9.5, store: 'CymbalMart Fresh Market', priority: 'essential', notes: 'Toast with garlic and grated tomato for Pan con Tomate', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Bakery', aisleNumber: 'Aisle 2' },
      { id: 'wt_7', name: 'Heirloom Vine Tomatoes & Fresh Garlic', category: 'produce', quantity: 2, unit: 'lbs', estimatedPrice: 5.5, store: 'CymbalMart Fresh Market', priority: 'essential', isBought: false, aisleNumber: 'Aisle 1' },
      { id: 'wt_8', name: 'Medjool Dates & Goat Cheese (for baking)', category: 'dairy_charcuterie', quantity: 1, unit: 'box', estimatedPrice: 8, store: 'CymbalMart Fresh Market', priority: 'recommended', isBought: false, aisleNumber: 'Aisle 3' },
      { id: 'wt_9', name: 'Spanish Cava Brut Bubbly', category: 'alcohol', quantity: 3, unit: 'bottles', estimatedPrice: 32, store: 'CymbalMart Wine & Spirits', priority: 'essential', notes: 'Welcome toast poured in flutes', isBought: false, aisleNumber: 'Aisle 7' },
      { id: 'wt_10', name: 'Rioja Reserva / Spanish Tempranillo Reds', category: 'alcohol', quantity: 4, unit: 'bottles', estimatedPrice: 52, store: 'CymbalMart Wine & Spirits', priority: 'essential', isBought: false, aisleNumber: 'Aisle 7' },
      { id: 'wt_11', name: 'Crisp Spanish Albariño White Wine', category: 'alcohol', quantity: 2, unit: 'bottles', estimatedPrice: 22, store: 'CymbalMart Wine & Spirits', priority: 'essential', isBought: false, aisleNumber: 'Aisle 7' },
      { id: 'wt_12', name: 'Italian Sparkling Mineral Water', category: 'beverages_mixers', quantity: 6, unit: 'bottles', estimatedPrice: 10, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Select', aisleNumber: 'Aisle 6' },
      { id: 'wt_13', name: 'Clean Gourmet Ice for Wine Chillers', category: 'ice', quantity: 15, unit: 'lbs', estimatedPrice: 5.5, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, isCymbalMartBrand: true, brandName: 'CymbalMart Ice', aisleNumber: 'Aisle 8 (Freezer)' },
      { id: 'wt_14', name: 'Taper Candles & Cocktail Skewers / Bamboo Toothpicks', category: 'decor_ambience', quantity: 1, unit: 'pack', estimatedPrice: 8, store: 'CymbalMart Supercenter', priority: 'essential', isBought: false, aisleNumber: 'Aisle 10' },
    ],
    costSavingTips: [
      'CymbalMart Reserve Spanish Cava ($9.99/bottle) delivers Champagne-method brioche notes at 1/4 the cost of French champagne.',
      'Pan con Tomate is one of the world’s greatest tapas and costs under $4.50 total to make with fresh bakery baguettes, garlic, and ripe tomatoes.',
      'A large wooden cutting board or butcher paper runner down the dining table eliminates the need for expensive catering platters.'
    ],
    timeline: [
      {
        phaseName: '2 Days Out',
        timeframe: '2 Days Out',
        tasks: [
          { id: 'w_1', task: 'Order Cava, Rioja, Albariño, and shelf-stable tapas via CymbalMart App', completed: false, category: 'Shopping' },
          { id: 'w_2', task: 'Wash and polish wine glasses and charcuterie boards', completed: false, category: 'Bar Setup' }
        ]
      },
      {
        phaseName: 'Day of Soirée',
        timeframe: '4:00 PM',
        tasks: [
          { id: 'w_3', task: 'Grate fresh tomatoes with garlic, olive oil, and sea salt', completed: false, category: 'Food Prep' },
          { id: 'w_4', task: 'Slice Manchego into iconic Spanish triangles', completed: false, category: 'Food Prep' },
          { id: 'w_5', task: 'Put Cava and Albariño on ice; uncork first bottle of Rioja to breathe', completed: false, category: 'Bar Setup' },
          { id: 'w_6', task: 'Light taper candles and start Flamenco/Bossa Nova playlist', completed: false, category: 'Decor & Ambience' }
        ]
      }
    ],
    runOfShow: [
      { time: '6:30 PM', activity: 'Welcome Flute of Chilled Cava & Marcona Almonds', tip: 'Greets guests with festive effervescence and low-prep crunch.' },
      { time: '7:15 PM', activity: 'Pan con Tomate & Charcuterie Spread', tip: 'Warm sliced sourdough bread right before serving.' },
      { time: '8:15 PM', activity: 'Warm Tapas & Rioja Tasting', tip: 'Bring out warm goat cheese stuffed dates or garlic prawns.' },
      { time: '9:30 PM', activity: 'Dark Chocolate & Espresso / Digestif', tip: 'Spanish dark chocolate with sea salt and espresso.' }
    ]
  }
};

export function createPartyFromTemplate(templateKey: string = 'tropical_birthday'): PartyPlan {
  const tmpl = PARTY_TEMPLATES[templateKey] || PARTY_TEMPLATES.tropical_birthday || PARTY_TEMPLATES.taco_fiesta;
  const details = {
    ...PARTY_TEMPLATES.tropical_birthday.details!,
    ...tmpl.details,
    id: `party_${Date.now()}`
  };

  const drinkCalc = calculatePartyDrinks(details);
  const foodCalc = calculatePartyFood(details);

  return {
    details,
    themeTitle: tmpl.themeTitle || details.title,
    themeDescription: tmpl.themeDescription || 'A custom crafted party experience curated by CymbalMart.',
    vibeKeywords: tmpl.vibeKeywords || ['Fun', 'Memorable', 'Delicious'],
    signatureCocktail: tmpl.signatureCocktail,
    signatureMocktail: tmpl.signatureMocktail,
    items: (tmpl.items || []).map((it) => ({ ...it })),
    drinkCalc,
    foodCalc,
    costSavingTips: tmpl.costSavingTips || [],
    timeline: tmpl.timeline || [],
    runOfShow: tmpl.runOfShow || [],
    fulfillment: {
      type: 'pickup',
      storeLocation: 'CymbalMart Supercenter #101 - Metro Center',
      slot: 'Party Day, 11:00 AM - 1:00 PM',
      status: 'planning',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
