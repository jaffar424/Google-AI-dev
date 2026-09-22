import { PartyPlan } from '../types/party';
import { calculatePartyDrinks, calculatePartyFood } from './calculator';

export const PARTY_TEMPLATES: Record<string, Partial<PartyPlan>> = {
  taco_fiesta: {
    details: {
      id: 'template_taco_fiesta',
      title: 'Cinco de Celebration: Street Taco & Margarita Fiesta',
      theme: 'Vibrant Mexican Street Food & Craft Margaritas',
      eventType: 'Dinner & Cocktails Party',
      guestCountAdults: 16,
      guestCountKids: 2,
      durationHours: 4,
      budgetLimit: 280,
      drinkStyle: 'cocktail_special',
      cateringStyle: 'semi_homemade',
      dietaryRestrictions: ['Gluten-Free Friendly', 'Vegetarian Option'],
    },
    themeTitle: 'Sizzling Street Taco Cantina & Citrus Margarita Bar',
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
      { id: 'tf_1', name: 'Boneless Pork Shoulder (for Carnitas)', category: 'proteins', quantity: 6, unit: 'lbs', estimatedPrice: 22, store: 'Costco / Wholesale', priority: 'essential', notes: 'Slow cook in Dutch oven or Crockpot with oranges & spices', isBought: false },
      { id: 'tf_2', name: 'Chicken Thighs (Taco Seasoned)', category: 'proteins', quantity: 4, unit: 'lbs', estimatedPrice: 15, store: 'Trader Joe’s', priority: 'essential', notes: 'Quick grill or skillet sear with fajita spices', isBought: false },
      { id: 'tf_3', name: 'Black Beans & Roasted Sweet Potatoes (Veggie option)', category: 'proteins', quantity: 3, unit: 'cans', estimatedPrice: 6, store: 'Trader Joe’s', priority: 'recommended', notes: 'Warm seasoned filling for vegetarian guests', isBought: false },

      // Produce
      { id: 'tf_4', name: 'Fresh Hass Avocados (for large Guac batch)', category: 'produce', quantity: 8, unit: 'units', estimatedPrice: 9, store: 'Costco / Wholesale', priority: 'essential', notes: 'Mash with lime, sea salt, minced onion & cilantro', isBought: false },
      { id: 'tf_5', name: 'Fresh Limes (Cocktails & Taco wedges)', category: 'produce', quantity: 20, unit: 'units', estimatedPrice: 7, store: 'Costco / Wholesale', priority: 'essential', notes: 'Juice 12 for margarita batch, cut 8 into wedges', isBought: false },
      { id: 'tf_6', name: 'Fresh Cilantro & Red Onions', category: 'produce', quantity: 3, unit: 'bunches', estimatedPrice: 4, store: 'Local Supermarket', priority: 'essential', notes: 'Finely diced street-style garnish', isBought: false },
      { id: 'tf_7', name: 'Roma Tomatoes & Jalapeños', category: 'produce', quantity: 2, unit: 'lbs', estimatedPrice: 5, store: 'Local Supermarket', priority: 'recommended', notes: 'Pico de gallo & spicy cocktail kick', isBought: false },

      // Dairy & Charcuterie
      { id: 'tf_8', name: 'Cotija or Queso Fresco Crumbled Cheese', category: 'dairy_charcuterie', quantity: 2, unit: 'packs', estimatedPrice: 7, store: 'Trader Joe’s', priority: 'essential', notes: 'Sprinkle over street tacos', isBought: false },
      { id: 'tf_9', name: 'Mexican Crema or Sour Cream', category: 'dairy_charcuterie', quantity: 1, unit: 'bottle', estimatedPrice: 3.5, store: 'Local Supermarket', priority: 'recommended', isBought: false },

      // Bakery & Carbs
      { id: 'tf_10', name: 'Street Taco Size White Corn Tortillas', category: 'bakery', quantity: 60, unit: 'units (2 packs)', estimatedPrice: 6, store: 'Costco / Wholesale', priority: 'essential', notes: 'Naturally gluten-free; heat on comal or dry skillet', isBought: false },
      { id: 'tf_11', name: 'Cinnamon Sugar Churro Bites or Tres Leches', category: 'bakery', quantity: 18, unit: 'servings', estimatedPrice: 14, store: 'Bakery / Specialty', priority: 'recommended', isBought: false },

      // Pantry & Chips
      { id: 'tf_12', name: 'Artisan Restaurant-Style Tortilla Chips', category: 'pantry_snacks', quantity: 3, unit: 'large bags', estimatedPrice: 11, store: 'Costco / Wholesale', priority: 'essential', isBought: false },
      { id: 'tf_13', name: 'Salsa Verde & Smoky Chipotle Salsa', category: 'pantry_snacks', quantity: 3, unit: 'jars', estimatedPrice: 9, store: 'Trader Joe’s', priority: 'essential', isBought: false },

      // Alcohol
      { id: 'tf_14', name: 'Blanco Tequila 100% Agave (e.g. Espolòn / Cazadores)', category: 'alcohol', quantity: 2, unit: '750ml bottles', estimatedPrice: 48, store: 'Liquor Store', priority: 'essential', notes: 'For fresh lime pitcher margaritas', isBought: false },
      { id: 'tf_15', name: 'Modelo Especial / Corona Extra Mexican Beer', category: 'alcohol', quantity: 24, unit: 'bottles', estimatedPrice: 28, store: 'Costco / Wholesale', priority: 'essential', notes: 'Chill in cooler with fresh lime slices', isBought: false },
      { id: 'tf_16', name: 'Triple Sec / Orange Liqueur', category: 'alcohol', quantity: 1, unit: '750ml bottle', estimatedPrice: 14, store: 'Liquor Store', priority: 'essential', isBought: false },

      // Beverages & Mixers
      { id: 'tf_17', name: 'Agave Nectar Syrup', category: 'beverages_mixers', quantity: 1, unit: 'bottle', estimatedPrice: 6, store: 'Trader Joe’s', priority: 'essential', isBought: false },
      { id: 'tf_18', name: 'Jarritos Mexican Sodas & Mineral Waters', category: 'beverages_mixers', quantity: 12, unit: 'bottles', estimatedPrice: 14, store: 'Local Supermarket', priority: 'recommended', isBought: false },

      // Ice
      { id: 'tf_19', name: 'Party Cubed Ice', category: 'ice', quantity: 25, unit: 'lbs (3 bags)', estimatedPrice: 9, store: 'Local Supermarket', priority: 'essential', notes: '1 bag for cocktail shaking/glasses, 2 bags for cooler', isBought: false },

      // Tableware & Supplies
      { id: 'tf_20', name: 'Heavy Duty Compostable Taco Plates (10 inch)', category: 'tableware', quantity: 40, unit: 'pack', estimatedPrice: 10, store: 'Target', priority: 'essential', isBought: false },
      { id: 'tf_21', name: 'Cocktail Napkins & Colorful Beverage Cups', category: 'tableware', quantity: 60, unit: 'count', estimatedPrice: 8, store: 'Target', priority: 'essential', isBought: false },

      // Decor
      { id: 'tf_22', name: 'Papel Picado Banner & Colorful Table Runner', category: 'decor_ambience', quantity: 1, unit: 'set', estimatedPrice: 13, store: 'Amazon / Online', priority: 'optional', isBought: false },
    ],
    costSavingTips: [
      'Batch the margaritas in a large 1-gallon drink dispenser 2 hours before instead of shaking individual cocktails — saves tequila and host stress!',
      'Buy pork shoulder in bulk at Costco ($3.50/lb vs $7.99/lb for precooked carnitas) — save over $25 on meat.',
      'Corn tortillas are 1/3 the price of flour tortillas and naturally satisfy gluten-free guests.',
      'Put out large bowls of chips, salsas, and guacamole first — guests fill up comfortably on delicious dips.'
    ],
    timeline: [
      {
        phaseName: '1 Week Before',
        timeframe: '7 Days Out',
        tasks: [
          { id: 't_1', task: 'Finalize RSVP count and dietary checks', completed: false, category: 'Host Ready' },
          { id: 't_2', task: 'Order papel picado decor and check drink dispensers', completed: false, category: 'Decor & Ambience' },
          { id: 't_3', task: 'Check tequila & triple sec supply', completed: false, category: 'Bar Setup' }
        ]
      },
      {
        phaseName: '2-3 Days Before',
        timeframe: 'Thursday',
        tasks: [
          { id: 't_4', task: 'Buy alcohol, shelf-stable canned beans, chips, and tortillas', completed: false, category: 'Shopping' },
          { id: 't_5', task: 'Prep spice rubs and thaw pork shoulder if frozen', completed: false, category: 'Food Prep' },
          { id: 't_6', task: 'Assemble Latin party playlist (Cumbia, Buena Vista, Bossa)', completed: false, category: 'Decor & Ambience' }
        ]
      },
      {
        phaseName: 'Day Before',
        timeframe: 'Friday Evening',
        tasks: [
          { id: 't_7', task: 'Slow-cook the carnitas pork; shred and store in cooking juices', completed: false, category: 'Food Prep' },
          { id: 't_8', task: 'Dice onions, jalapeños, and chop cilantro (keep airtight with paper towel)', completed: false, category: 'Food Prep' },
          { id: 't_9', task: 'Chill beers and mineral waters in the fridge', completed: false, category: 'Bar Setup' }
        ]
      },
      {
        phaseName: 'Morning of Party',
        timeframe: 'Saturday 10 AM',
        tasks: [
          { id: 't_10', task: 'Pick up fresh ice bags and ripe avocados', completed: false, category: 'Shopping' },
          { id: 't_11', task: 'Squeeze fresh limes and mix the batch margarita (without ice)', completed: false, category: 'Bar Setup' },
          { id: 't_12', task: 'Set out buffet plates, napkins, salsa bowls, and taco warmers', completed: false, category: 'Decor & Ambience' }
        ]
      },
      {
        phaseName: '1 Hour Before',
        timeframe: 'Saturday 4 PM',
        tasks: [
          { id: 't_13', task: 'Broil carnitas under broiler for 5 mins to get crispy edges', completed: false, category: 'Food Prep' },
          { id: 't_14', task: 'Mash fresh guacamole (add squeeze of lime to keep green)', completed: false, category: 'Food Prep' },
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
      title: 'Smokehouse Backyard BBQ & Craft Beer Bash',
      theme: 'All-American Grill & Chill with Lawn Games',
      eventType: 'Outdoor BBQ Cookout',
      guestCountAdults: 20,
      guestCountKids: 6,
      durationHours: 5,
      budgetLimit: 340,
      drinkStyle: 'beer_wine_only',
      cateringStyle: 'bbq_grill',
      dietaryRestrictions: ['Kid-Friendly', 'Vegetarian Burgers Option'],
    },
    themeTitle: 'Backyard Smoke & Sizzle Cookout',
    themeDescription: 'Classic sunny afternoon grilling juicy smash burgers, grilled sausage links, potato salad, sweet watermelon slices, and iced tubs of craft IPAs and lemonades.',
    vibeKeywords: ['Sunny', 'Relaxed', 'Smoky', 'Family-Friendly', 'Lawn Games'],
    signatureCocktail: {
      name: 'Spiked Bourbon Peach Sweet Tea',
      description: 'Brewed black tea sweetened with peach nectar and fresh mint leaves, with bourbon on the side for adults.',
      ingredients: ['Kentucky Bourbon (750ml)', 'Peach Puree / Nectar', 'Fresh Mint', 'Brewed Southern Sweet Tea'],
    },
    items: [
      { id: 'bbq_1', name: 'Fresh 80/20 Ground Beef Patties', category: 'proteins', quantity: 8, unit: 'lbs (24 patties)', estimatedPrice: 38, store: 'Costco / Wholesale', priority: 'essential', isBought: false },
      { id: 'bbq_2', name: 'Artisan Smoked Bratwurst / Hot Dogs', category: 'proteins', quantity: 16, unit: 'links', estimatedPrice: 18, store: 'Costco / Wholesale', priority: 'essential', isBought: false },
      { id: 'bbq_3', name: 'Black Bean Veggie Burger Patties', category: 'proteins', quantity: 6, unit: 'patties', estimatedPrice: 9, store: 'Trader Joe’s', priority: 'recommended', isBought: false },
      { id: 'bbq_4', name: 'Seedless Red Watermelon', category: 'produce', quantity: 1, unit: 'large (15 lbs)', estimatedPrice: 8, store: 'Costco / Wholesale', priority: 'essential', notes: 'Slice into handheld triangles', isBought: false },
      { id: 'bbq_5', name: 'Sweet Corn on the Cob', category: 'produce', quantity: 14, unit: 'ears', estimatedPrice: 9, store: 'Local Supermarket', priority: 'recommended', notes: 'Grill in husks with seasoned butter', isBought: false },
      { id: 'bbq_6', name: 'Burger & Dog Buns (Brioche & Potato)', category: 'bakery', quantity: 32, unit: 'buns (4 packs)', estimatedPrice: 14, store: 'Costco / Wholesale', priority: 'essential', isBought: false },
      { id: 'bbq_7', name: 'Sharp Cheddar Cheese Slices', category: 'dairy_charcuterie', quantity: 24, unit: 'slices', estimatedPrice: 7, store: 'Costco / Wholesale', priority: 'essential', isBought: false },
      { id: 'bbq_8', name: 'Homestyle Potato Salad & Creamy Slaw', category: 'pantry_snacks', quantity: 5, unit: 'lbs', estimatedPrice: 16, store: 'Costco / Wholesale', priority: 'essential', isBought: false },
      { id: 'bbq_9', name: 'Ketchup, Dijon Mustard, Pickles & BBQ Sauce', category: 'pantry_snacks', quantity: 4, unit: 'bottles', estimatedPrice: 12, store: 'Trader Joe’s', priority: 'essential', isBought: false },
      { id: 'bbq_10', name: 'Craft IPA / Pale Ale 12-pack', category: 'alcohol', quantity: 2, unit: '12-packs (24 cans)', estimatedPrice: 38, store: 'Liquor Store', priority: 'essential', isBought: false },
      { id: 'bbq_11', name: 'Crisp Pilsner / Light Lager 24-pack', category: 'alcohol', quantity: 1, unit: 'case (24 cans)', estimatedPrice: 24, store: 'Costco / Wholesale', priority: 'essential', isBought: false },
      { id: 'bbq_12', name: 'Chilled Crisp Rosé or Sauvignon Blanc', category: 'alcohol', quantity: 3, unit: 'bottles', estimatedPrice: 33, store: 'Trader Joe’s', priority: 'recommended', isBought: false },
      { id: 'bbq_13', name: 'Country Lemonade & Sparkling Waters', category: 'beverages_mixers', quantity: 4, unit: 'gallons/packs', estimatedPrice: 16, store: 'Costco / Wholesale', priority: 'essential', isBought: false },
      { id: 'bbq_14', name: 'Heavy Duty Party Ice (for drink coolers)', category: 'ice', quantity: 40, unit: 'lbs (4 bags)', estimatedPrice: 14, store: 'Local Supermarket', priority: 'essential', isBought: false },
      { id: 'bbq_15', name: 'Grill Charcoal / Pellets & Tongs', category: 'tableware', quantity: 1, unit: 'bag', estimatedPrice: 15, store: 'Target', priority: 'essential', isBought: false },
      { id: 'bbq_16', name: 'Heavy Paper Plates, Red Cups & Wet Wipes', category: 'tableware', quantity: 1, unit: 'pack combo', estimatedPrice: 14, store: 'Costco / Wholesale', priority: 'essential', isBought: false },
    ],
    costSavingTips: [
      'Buying ground beef patties and hot dogs in bulk packs at Costco cuts meat cost by 40% vs pre-shaped boutique patties.',
      'Corn on the cob and watermelon are huge crowd-pleasers that cost under $1 per guest.',
      'Provide 2 coolers: one labeled "Beer & Seltzers" and one labeled "Kids & Soft Drinks" to avoid unnecessary ice melting.'
    ],
    timeline: [
      {
        phaseName: '1 Week Before',
        timeframe: '7 Days Out',
        tasks: [
          { id: 'b_1', task: 'Clean grill grates and check propane/charcoal supply', completed: false, category: 'Food Prep' },
          { id: 'b_2', task: 'Test lawn games (Cornhole, Spikeball, Bocce)', completed: false, category: 'Decor & Ambience' }
        ]
      },
      {
        phaseName: 'Day Before',
        timeframe: 'Day Before',
        tasks: [
          { id: 'b_3', task: 'Stock coolers with canned beers, seltzers, and sodas', completed: false, category: 'Bar Setup' },
          { id: 'b_4', task: 'Make potato salad and slaw; slice watermelon triangles', completed: false, category: 'Food Prep' }
        ]
      },
      {
        phaseName: 'Morning of Event',
        timeframe: 'Morning of BBQ',
        tasks: [
          { id: 'b_5', task: 'Fill coolers with 40 lbs of ice', completed: false, category: 'Shopping' },
          { id: 'b_6', task: 'Set up shade umbrellas, lawn chairs, and condiment bar', completed: false, category: 'Decor & Ambience' }
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
      title: 'Candlelight Spanish Tapas & Sommelier Wine Soirée',
      theme: 'Sophisticated Mediterranean Charcuterie & Wine Tasting',
      eventType: 'Cocktail & Tapas Soiree',
      guestCountAdults: 12,
      guestCountKids: 0,
      durationHours: 3.5,
      budgetLimit: 260,
      drinkStyle: 'beer_wine_only',
      cateringStyle: 'semi_homemade',
      dietaryRestrictions: ['Nut Allergy Alert', 'Vegetarian Options'],
    },
    themeTitle: 'Iberian Nights: Tapas, Pintxos & Rioja Pairings',
    themeDescription: 'An intimate evening of cured Jamón Serrano, aged Manchego, marinated olives, pan con tomate, bacon-wrapped dates, and curated Spanish reds, Albariño, and bubbly Cava.',
    vibeKeywords: ['Warm Ambient Glow', 'Acoustic Spanish Guitar', 'Gourmet Grazing', 'Effortless Elegance'],
    signatureCocktail: {
      name: 'Blackberry & Citrus Red Wine Sangria',
      description: 'Full-bodied Garnacha infused overnight with brandy, sliced oranges, blackberries, and cinnamon bark.',
      ingredients: ['Spanish Garnacha / Tempranillo', 'Spanish Brandy', 'Fresh Blackberries & Oranges', 'Club Soda splash'],
    },
    items: [
      { id: 'wt_1', name: 'Jamón Serrano / Prosciutto di Parma', category: 'proteins', quantity: 1, unit: 'lb (3 packs)', estimatedPrice: 22, store: 'Trader Joe’s', priority: 'essential', isBought: false },
      { id: 'wt_2', name: 'Spanish Chorizo & Salchichón Slices', category: 'proteins', quantity: 12, unit: 'oz', estimatedPrice: 14, store: 'Trader Joe’s', priority: 'essential', isBought: false },
      { id: 'wt_3', name: 'Aged Manchego (6-month) & Goat Cheese logs', category: 'dairy_charcuterie', quantity: 1.5, unit: 'lbs', estimatedPrice: 18, store: 'Costco / Wholesale', priority: 'essential', isBought: false },
      { id: 'wt_4', name: 'Castelvetrano & Stuffed Spanish Olives', category: 'pantry_snacks', quantity: 2, unit: 'jars', estimatedPrice: 8, store: 'Trader Joe’s', priority: 'essential', isBought: false },
      { id: 'wt_5', name: 'Marcona Almonds with Rosemary & Sea Salt', category: 'pantry_snacks', quantity: 1, unit: 'bag', estimatedPrice: 7, store: 'Trader Joe’s', priority: 'recommended', isBought: false },
      { id: 'wt_6', name: 'Artisan Sourdough & Rustic Baguettes', category: 'bakery', quantity: 3, unit: 'loaves', estimatedPrice: 11, store: 'Bakery / Specialty', priority: 'essential', notes: 'Toast with garlic and grated tomato for Pan con Tomate', isBought: false },
      { id: 'wt_7', name: 'Heirloom Grating Tomatoes & Fresh Garlic', category: 'produce', quantity: 2, unit: 'lbs', estimatedPrice: 6, store: 'Local Supermarket', priority: 'essential', isBought: false },
      { id: 'wt_8', name: 'Medjool Dates & Goat Cheese (for baking)', category: 'dairy_charcuterie', quantity: 1, unit: 'box', estimatedPrice: 9, store: 'Trader Joe’s', priority: 'recommended', isBought: false },
      { id: 'wt_9', name: 'Spanish Cava Brut Bubbly', category: 'alcohol', quantity: 3, unit: 'bottles', estimatedPrice: 36, store: 'Trader Joe’s', priority: 'essential', notes: 'Welcome toast poured in flutes', isBought: false },
      { id: 'wt_10', name: 'Rioja Reserva / Ribera del Duero Reds', category: 'alcohol', quantity: 4, unit: 'bottles', estimatedPrice: 56, store: 'Liquor Store', priority: 'essential', isBought: false },
      { id: 'wt_11', name: 'Albariño / Crisp White Wine', category: 'alcohol', quantity: 2, unit: 'bottles', estimatedPrice: 24, store: 'Trader Joe’s', priority: 'essential', isBought: false },
      { id: 'wt_12', name: 'Sparkling San Pellegrino / Perrier', category: 'beverages_mixers', quantity: 6, unit: 'bottles', estimatedPrice: 12, store: 'Costco / Wholesale', priority: 'essential', isBought: false },
      { id: 'wt_13', name: 'Clean Gourmet Ice for Chillers', category: 'ice', quantity: 15, unit: 'lbs', estimatedPrice: 6, store: 'Local Supermarket', priority: 'essential', isBought: false },
      { id: 'wt_14', name: 'Taper Candles & Cocktail Skewers / Toothpicks', category: 'decor_ambience', quantity: 1, unit: 'pack', estimatedPrice: 9, store: 'Target', priority: 'essential', isBought: false },
    ],
    costSavingTips: [
      'Trader Joe’s has the highest price-to-quality ratio for Spanish Cava ($8-$11/bottle) and imported cheeses in America.',
      'Pan con Tomate is one of the world’s greatest tapas and costs under $5 total to make with fresh bread, garlic, ripe tomatoes, and olive oil.',
      'A large wooden board or butcher paper runner down the middle of the table eliminates the need for expensive catering platters.'
    ],
    timeline: [
      {
        phaseName: '2 Days Out',
        timeframe: '2 Days Out',
        tasks: [
          { id: 'w_1', task: 'Pick up Cava, Rioja, Albariño, and shelf-stable tapas items', completed: false, category: 'Shopping' },
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

export function createPartyFromTemplate(templateKey: string): PartyPlan {
  const tmpl = PARTY_TEMPLATES[templateKey] || PARTY_TEMPLATES.taco_fiesta;
  const details = {
    ...PARTY_TEMPLATES.taco_fiesta.details!,
    ...tmpl.details,
    id: `party_${Date.now()}`
  };

  const drinkCalc = calculatePartyDrinks(details);
  const foodCalc = calculatePartyFood(details);

  return {
    details,
    themeTitle: tmpl.themeTitle || details.title,
    themeDescription: tmpl.themeDescription || 'A custom crafted party experience.',
    vibeKeywords: tmpl.vibeKeywords || ['Fun', 'Memorable', 'Delicious'],
    signatureCocktail: tmpl.signatureCocktail,
    signatureMocktail: tmpl.signatureMocktail,
    items: (tmpl.items || []).map((it) => ({ ...it })),
    drinkCalc,
    foodCalc,
    costSavingTips: tmpl.costSavingTips || [],
    timeline: tmpl.timeline || [],
    runOfShow: tmpl.runOfShow || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
