import { DrinkCalculation, FoodCalculation, PartyDetails } from '../types/party';

export function calculatePartyDrinks(details: PartyDetails): DrinkCalculation {
  const adults = Math.max(1, details.guestCountAdults || 0);
  const kids = Math.max(0, details.guestCountKids || 0);
  const hours = Math.max(1, details.durationHours || 3);
  const drinkStyle = details.drinkStyle || 'full_bar';

  // Standard rule of thumb: 2 drinks first hour, 1 drink each subsequent hour
  const drinksPerAdult = hours <= 1 ? 2 : 2 + (hours - 1);
  const totalAdultDrinks = adults * drinksPerAdult;

  let beerBottles = 0;
  let wineBottles = 0;
  let liquorBottles750ml = 0;
  let mixersBottles = 0;
  let mocktailLitres = Math.ceil((kids * 2 + adults * 0.5) * (hours / 2));

  if (drinkStyle === 'beer_wine_only') {
    // 55% beer, 45% wine
    const beerDrinks = Math.round(totalAdultDrinks * 0.55);
    const wineDrinks = Math.round(totalAdultDrinks * 0.45);
    beerBottles = Math.ceil(beerDrinks);
    wineBottles = Math.ceil(wineDrinks / 5); // 5 glasses per 750ml wine bottle
    liquorBottles750ml = 0;
    mixersBottles = Math.ceil(adults * 0.5);
  } else if (drinkStyle === 'cocktail_special') {
    // 30% beer, 25% wine, 45% cocktails
    beerBottles = Math.ceil(totalAdultDrinks * 0.3);
    wineBottles = Math.ceil((totalAdultDrinks * 0.25) / 5);
    const cocktailDrinks = totalAdultDrinks * 0.45;
    liquorBottles750ml = Math.ceil(cocktailDrinks / 16); // 16 drinks per 750ml bottle
    mixersBottles = Math.ceil(cocktailDrinks / 4); // 1 mixer bottle (1L) per 4-5 cocktails
  } else if (drinkStyle === 'mocktails_only') {
    beerBottles = 0;
    wineBottles = 0;
    liquorBottles750ml = 0;
    mocktailLitres = Math.ceil((adults + kids) * (hours * 0.6));
    mixersBottles = Math.ceil((adults + kids) * 0.8);
  } else if (drinkStyle === 'byob') {
    // Host provides mixers, garnishes, ice, and emergency back-up 6-pack
    beerBottles = Math.ceil(adults * 0.6);
    wineBottles = Math.ceil(adults * 0.2);
    liquorBottles750ml = 0;
    mixersBottles = Math.ceil(adults * 0.8);
  } else {
    // Standard full bar: 40% beer, 35% wine, 25% liquor
    beerBottles = Math.ceil(totalAdultDrinks * 0.4);
    wineBottles = Math.ceil((totalAdultDrinks * 0.35) / 5);
    const liquorDrinks = totalAdultDrinks * 0.25;
    liquorBottles750ml = Math.ceil(liquorDrinks / 16);
    mixersBottles = Math.ceil(liquorDrinks / 4);
  }

  // Ice: 1.5 lbs per total person (1 lb for chilling cooler, 0.5 lb for glasses)
  const totalGuests = adults + kids;
  const isOutdoorOrLong = hours >= 4 || details.eventType.toLowerCase().includes('bbq');
  const iceRate = isOutdoorOrLong ? 2.0 : 1.5;
  const iceLbs = Math.ceil(totalGuests * iceRate);

  // Water & Seltzers: 1 per guest per 1.5 hours
  const waterSeltzers = Math.ceil(totalGuests * (hours / 1.5));

  // Glasses / Cups: 2.5 cups per guest (guests lose track of cups)
  const glassesCups = Math.ceil(totalGuests * 2.5);

  return {
    totalDrinks: totalAdultDrinks,
    beerBottles,
    wineBottles,
    liquorBottles750ml,
    mixersBottles,
    mocktailLitres,
    iceLbs,
    waterSeltzers,
    glassesCups,
    formulaNote: `Calculated for ${adults} adults & ${kids} kids over ${hours}h: Standard 2 drinks/first hour, 1 drink/each following hour + 1.5 lbs ice/person.`
  };
}

export function calculatePartyFood(details: PartyDetails): FoodCalculation {
  const adults = Math.max(1, details.guestCountAdults || 0);
  const kids = Math.max(0, details.guestCountKids || 0);
  const effectiveGuests = adults + kids * 0.6; // kids eat approx 60%
  const isCocktailOnly = details.eventType.toLowerCase().includes('cocktail') || details.eventType.toLowerCase().includes('tapas');

  if (isCocktailOnly) {
    // 10-12 appetizer pieces per person
    const appetizerPieces = Math.ceil(effectiveGuests * 11);
    const dessertPieces = Math.ceil(effectiveGuests * 2);
    return {
      appetizerPieces,
      proteinLbs: 0,
      sideDishesLbs: Math.ceil(effectiveGuests * 0.25),
      saladLbs: Math.ceil(effectiveGuests * 0.15),
      dessertPieces,
      formulaNote: `Heavy Hors d'Oeuvres party: ~11 appetizer bites + 2 mini dessert bites per guest.`
    };
  }

  // Full meal party (Dinner, BBQ, Birthday, etc.)
  // 4-5 appetizer bites, 0.5 lb meat/protein per adult (0.35 lb for kids), 0.35 lb sides, 0.25 lb salad, 1.25 desserts
  const appetizerPieces = Math.ceil(effectiveGuests * 4);
  const proteinLbs = Number((adults * 0.5 + kids * 0.3).toFixed(1));
  const sideDishesLbs = Number((effectiveGuests * 0.35).toFixed(1));
  const saladLbs = Number((effectiveGuests * 0.2).toFixed(1));
  const dessertPieces = Math.ceil(effectiveGuests * 1.3);

  return {
    appetizerPieces,
    proteinLbs,
    sideDishesLbs,
    saladLbs,
    dessertPieces,
    formulaNote: `Full Meal party: 0.5 lb protein/adult, 4 appetizer bites, sides & salad, plus 1.3 dessert portions/guest.`
  };
}
