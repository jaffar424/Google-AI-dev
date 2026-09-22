import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { PartyDetails, PartyPlan, ShoppingItem } from './src/types/party';
import { calculatePartyDrinks, calculatePartyFood } from './src/utils/calculator';
import { PARTY_TEMPLATES, createPartyFromTemplate } from './src/utils/templates';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization with recommended telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for fallback generation when API key is not configured or in offline mode
function generateFallbackPlan(details: PartyDetails, customIdea?: string): PartyPlan {
  const baseTemplateKey = details.eventType?.toLowerCase().includes('bbq')
    ? 'backyard_bbq'
    : details.eventType?.toLowerCase().includes('wine') || details.eventType?.toLowerCase().includes('tapas')
    ? 'wine_tapas'
    : 'taco_fiesta';

  const base = createPartyFromTemplate(baseTemplateKey);
  base.details = { ...base.details, ...details, id: details.id || `party_${Date.now()}` };
  if (customIdea) {
    base.themeTitle = `${details.title || customIdea}`;
    base.themeDescription = `Curated CymbalMart party plan for ${details.guestCountAdults} adults & ${details.guestCountKids || 0} kids. ${customIdea}`;
  }
  base.drinkCalc = calculatePartyDrinks(base.details);
  base.foodCalc = calculatePartyFood(base.details);
  return base;
}

// 1. Generate Party Plan & Shopping List Endpoint (Task 1: Define Event -> Curated List)
app.post('/api/plan/generate', async (req, res) => {
  try {
    const { details, customIdea } = req.body as { details: PartyDetails; customIdea?: string };

    if (!details) {
      return res.status(400).json({ error: 'Party details are required.' });
    }

    const drinkCalc = calculatePartyDrinks(details);
    const foodCalc = calculatePartyFood(details);

    if (!process.env.GEMINI_API_KEY) {
      console.log('No GEMINI_API_KEY detected, using CymbalMart intelligent algorithmic generator.');
      const fallback = generateFallbackPlan(details, customIdea);
      return res.json(fallback);
    }

    const prompt = `You are the CymbalMart Shopping Agent, Google Cloud retail's premier AI party planner and grocery concierge.
Your mission is to convert a busy host's event intent into a curated, budget-conscious CymbalMart shopping list and fulfillment plan.

Event Profile:
- Party Type: ${details.eventType || 'Dinner & Drinks'}
- Theme/Occasion: ${details.title || 'Celebration'}
- Custom Theme/Vibe Notes: ${customIdea || details.theme || 'Festive and memorable'}
- Adult Guests: ${details.guestCountAdults || 12}
- Kid Guests: ${details.guestCountKids || 0}
- Duration: ${details.durationHours || 4} hours
- Target Total Budget: $${details.budgetLimit || 250} USD (CRITICAL: Total estimated price of essential + recommended items MUST be close to or under $${details.budgetLimit || 250}!)
- Drink Format: ${details.drinkStyle || 'full_bar'}
- Prep Style: ${details.cateringStyle || 'semi_homemade'}
- Dietary Restrictions: ${(details.dietaryRestrictions || []).join(', ') || 'None specified'}
- Special Requests: ${details.specialRequests || 'None specified'}

Pre-calculated Benchmarks:
- Estimated Total Drinks: ${drinkCalc.totalDrinks} drinks (${drinkCalc.beerBottles} beers, ${drinkCalc.wineBottles} wine bottles, ${drinkCalc.liquorBottles750ml} liquor bottles 750ml, ${drinkCalc.iceLbs} lbs ice)
- Food Portions: ${foodCalc.appetizerPieces} appetizer bites, ${foodCalc.proteinLbs} lbs protein, ${foodCalc.dessertPieces} desserts.

Requirements:
1. Provide a tailored theme title, description, and 3-5 vibe keywords.
2. Provide a signature cocktail and kid/non-drinker mocktail.
3. Generate a structured list of 16-24 grocery and party items.
4. Assign items to CymbalMart store formats:
   - 'CymbalMart Supercenter' (pantry, meats, paper goods, bulk snacks)
   - 'CymbalMart Fresh Market' (fresh produce, artisan cheeses, bakery)
   - 'CymbalMart Wine & Spirits' (beer, wine, liquor)
   - 'CymbalMart Wholesale Club' (bulk ice, large packs)
5. Identify budget-saving items with 'isCymbalMartBrand: true' (brandName: "CymbalMart Select", "CymbalMart Butcher Select", "CymbalMart Organics", "CymbalMart Bakery", or "CymbalMart Earth First").
6. Provide specific aisle numbers (e.g. "Aisle 1", "Aisle 4 - Butcher", "Aisle 8 - Freezers").
7. Provide actionable CymbalMart cost-saving tips to keep the host on budget.
8. Provide a timeline with prep phases and a day-of Run of Show.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are the CymbalMart Shopping Agent. Always output valid JSON strictly matching the requested schema. Ensure realistic prices in USD that align with the user budget.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themeTitle: { type: Type.STRING },
            themeDescription: { type: Type.STRING },
            vibeKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            signatureCocktail: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                ingredients: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['name', 'description', 'ingredients'],
            },
            signatureMocktail: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                ingredients: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['name', 'description', 'ingredients'],
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: 'One of: proteins, produce, dairy_charcuterie, bakery, pantry_snacks, alcohol, beverages_mixers, ice, tableware, decor_ambience, favors_activities',
                  },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  estimatedPrice: { type: Type.NUMBER },
                  store: {
                    type: Type.STRING,
                    description: 'One of: CymbalMart Supercenter, CymbalMart Fresh Market, CymbalMart Wine & Spirits, CymbalMart Wholesale Club, CymbalMart Express',
                  },
                  priority: {
                    type: Type.STRING,
                    description: 'essential, recommended, or optional',
                  },
                  notes: { type: Type.STRING },
                  isCymbalMartBrand: { type: Type.BOOLEAN },
                  brandName: { type: Type.STRING },
                  aisleNumber: { type: Type.STRING },
                },
                required: ['name', 'category', 'quantity', 'unit', 'estimatedPrice', 'store', 'priority'],
              },
            },
            costSavingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        task: { type: Type.STRING },
                        category: { type: Type.STRING },
                      },
                      required: ['task', 'category'],
                    },
                  },
                },
                required: ['phaseName', 'timeframe', 'tasks'],
              },
            },
            runOfShow: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: ['time', 'activity', 'tip'],
              },
            },
          },
          required: ['themeTitle', 'themeDescription', 'items', 'costSavingTips', 'timeline', 'runOfShow'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Attach stable IDs, bought status, and calculations
    const finalItems: ShoppingItem[] = (parsed.items || []).map((it: any, index: number) => ({
      id: `item_${Date.now()}_${index}`,
      name: it.name,
      category: it.category || 'pantry_snacks',
      quantity: Number(it.quantity) || 1,
      unit: it.unit || 'units',
      estimatedPrice: Number(it.estimatedPrice) || 5,
      store: it.store || 'CymbalMart Supercenter',
      priority: it.priority || 'essential',
      notes: it.notes || '',
      isBought: false,
      isCymbalMartBrand: it.isCymbalMartBrand ?? true,
      brandName: it.brandName || (it.isCymbalMartBrand ? 'CymbalMart Select' : undefined),
      aisleNumber: it.aisleNumber || 'Aisle 1',
    }));

    const finalTimeline = (parsed.timeline || []).map((ph: any, pIdx: number) => ({
      phaseName: ph.phaseName,
      timeframe: ph.timeframe,
      tasks: (ph.tasks || []).map((t: any, tIdx: number) => ({
        id: `task_${pIdx}_${tIdx}`,
        task: t.task,
        category: t.category || 'Shopping',
        completed: false,
      })),
    }));

    const plan: PartyPlan = {
      details: { ...details, id: details.id || `party_${Date.now()}` },
      themeTitle: parsed.themeTitle || details.title,
      themeDescription: parsed.themeDescription || 'A handcrafted CymbalMart party plan.',
      vibeKeywords: parsed.vibeKeywords || ['Festive', 'Budget-Smart', 'Delicious'],
      signatureCocktail: parsed.signatureCocktail,
      signatureMocktail: parsed.signatureMocktail,
      items: finalItems,
      drinkCalc,
      foodCalc,
      costSavingTips: parsed.costSavingTips || [],
      timeline: finalTimeline,
      runOfShow: parsed.runOfShow || [],
      fulfillment: {
        type: 'pickup',
        storeLocation: 'CymbalMart Supercenter #101 - Metro Center',
        slot: 'Party Day, 11:00 AM - 1:00 PM',
        status: 'planning',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    res.json(plan);
  } catch (err: any) {
    console.error('Error generating party plan with Gemini:', err);
    const fallback = generateFallbackPlan(req.body.details, req.body.customIdea);
    res.json(fallback);
  }
});

// 2. Align List to Budget Endpoint (Task 2: Review List -> Align items with total budget)
app.post('/api/plan/align-budget', async (req, res) => {
  try {
    const { items, budgetLimit, details } = req.body as { items: ShoppingItem[]; budgetLimit: number; details: PartyDetails };

    if (!items || !budgetLimit) {
      return res.status(400).json({ error: 'Items and budget limit are required.' });
    }

    const currentTotal = items.reduce((sum, i) => sum + (i.estimatedPrice || 0), 0);
    if (currentTotal <= budgetLimit) {
      return res.json({
        items,
        totalSavings: 0,
        message: `Your shopping list is already within your $${budgetLimit} budget (Current: $${currentTotal.toFixed(2)}).`,
        tips: ['Great job! You have remaining budget cushion for ice or extra drinks.'],
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Algorithmic budget alignment fallback
      let runningTotal = currentTotal;
      const optimizedItems = items.map((item) => {
        let price = item.estimatedPrice;
        let isCymbalMart = item.isCymbalMartBrand;
        let brand = item.brandName;
        // Swap to CymbalMart Select for 20% discount if not already
        if (!isCymbalMart && runningTotal > budgetLimit) {
          const discount = Math.round(price * 0.22 * 100) / 100;
          price = Math.max(1, price - discount);
          runningTotal -= discount;
          isCymbalMart = true;
          brand = 'CymbalMart Select';
        }
        // Downsize optional items
        if (item.priority === 'optional' && runningTotal > budgetLimit) {
          const discount = Math.round(price * 0.4 * 100) / 100;
          price = Math.max(2, price - discount);
          runningTotal -= discount;
        }
        return {
          ...item,
          estimatedPrice: Math.round(price * 100) / 100,
          isCymbalMartBrand: isCymbalMart,
          brandName: brand,
        };
      });

      const newTotal = optimizedItems.reduce((s, i) => s + i.estimatedPrice, 0);
      return res.json({
        items: optimizedItems,
        totalSavings: Math.max(0, currentTotal - newTotal),
        message: `Aligned list to budget by swapping items to CymbalMart Select brand and rightsizing portions! New total: $${newTotal.toFixed(2)} (Target: $${budgetLimit}).`,
        tips: [
          'Swapped brand-name items to CymbalMart Select private label.',
          'Consolidated portion sizes to match exact guest headcounts.',
        ],
      });
    }

    const prompt = `You are the CymbalMart Shopping Agent's Budget Optimizer.
Current Shopping List Total: $${currentTotal.toFixed(2)}
Target Budget Ceiling: $${budgetLimit.toFixed(2)}
Over-budget amount to trim: $${(currentTotal - budgetLimit).toFixed(2)}
Guests: ${details?.guestCountAdults || 12} adults, ${details?.guestCountKids || 0} kids.

Shopping List:
${JSON.stringify(
  items.map((i) => ({
    id: i.id,
    name: i.name,
    category: i.category,
    price: i.estimatedPrice,
    quantity: i.quantity,
    priority: i.priority,
    isCymbalMartBrand: i.isCymbalMartBrand,
  })),
  null,
  2
)}

Task:
Adjust the prices, quantities, and brands so the NEW total is LESS THAN OR EQUAL to $${budgetLimit.toFixed(2)}.
Techniques:
1. Swap brand names to 'CymbalMart Select' or 'CymbalMart Butcher Select' for 20-30% savings.
2. Trim optional/decor items or recommend bulk multi-packs.
3. Adjust quantities to realistic portion needs without leaving guests hungry.
Return the optimized item list and a short summary of how the budget was aligned.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  estimatedPrice: { type: Type.NUMBER },
                  store: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  notes: { type: Type.STRING },
                  isCymbalMartBrand: { type: Type.BOOLEAN },
                  brandName: { type: Type.STRING },
                  aisleNumber: { type: Type.STRING },
                },
                required: ['id', 'name', 'estimatedPrice', 'quantity'],
              },
            },
            message: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['items', 'message', 'tips'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const optimizedItems: ShoppingItem[] = (parsed.items || []).map((it: any) => {
      const orig = items.find((o) => o.id === it.id);
      return {
        id: it.id || `item_${Date.now()}`,
        name: it.name || orig?.name || 'Item',
        category: it.category || orig?.category || 'pantry_snacks',
        quantity: Number(it.quantity) || orig?.quantity || 1,
        unit: it.unit || orig?.unit || 'units',
        estimatedPrice: Number(it.estimatedPrice) || orig?.estimatedPrice || 5,
        store: it.store || orig?.store || 'CymbalMart Supercenter',
        priority: it.priority || orig?.priority || 'essential',
        notes: it.notes || orig?.notes || '',
        isBought: orig?.isBought || false,
        isCymbalMartBrand: it.isCymbalMartBrand ?? true,
        brandName: it.brandName || 'CymbalMart Select',
        aisleNumber: it.aisleNumber || orig?.aisleNumber || 'Aisle 1',
      };
    });

    const newTotal = optimizedItems.reduce((s, i) => s + i.estimatedPrice, 0);
    res.json({
      items: optimizedItems,
      totalSavings: Math.max(0, currentTotal - newTotal),
      message: parsed.message || `Successfully aligned shopping list to your $${budgetLimit} budget!`,
      tips: parsed.tips || ['Swapped items to CymbalMart Select for maximum value.'],
    });
  } catch (err: any) {
    console.error('Budget alignment error:', err);
    res.status(500).json({ error: 'Failed to align budget.' });
  }
});

// 3. Interactive CymbalMart Shopping Agent Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, currentPlan } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: `I'm your CymbalMart Shopping Agent! I can help you swap items for CymbalMart Select brands, calculate drink quantities, adjust for dietary restrictions (Gluten-Free, Vegan), or trim your cart to meet your budget.`,
        suggestedPrompts: [
          'Trim $25 from my cart',
          'Make this 100% Gluten-Free',
          'Add a signature batch cocktail recipe',
        ],
      });
    }

    const itemsSummary = (currentPlan?.items || [])
      .slice(0, 30)
      .map((it: ShoppingItem) => `- ${it.name} (${it.quantity} ${it.unit}, $${it.estimatedPrice}, ${it.isCymbalMartBrand ? '[CymbalMart Select]' : ''} at ${it.store})`)
      .join('\n');

    const systemPrompt = `You are the CymbalMart Shopping Agent, an expert retail shopping concierge for party hosts.
Party Context:
- Occasion: ${currentPlan?.details?.title || 'Party'} (${currentPlan?.details?.eventType || 'Celebration'})
- Guests: ${currentPlan?.details?.guestCountAdults || 10} adults, ${currentPlan?.details?.guestCountKids || 0} kids
- Budget Ceiling: $${currentPlan?.details?.budgetLimit || 200}
- Current Shopping List (${currentPlan?.items?.length || 0} items):
${itemsSummary}

Rules:
1. Always be helpful, upbeat, efficient, and budget-conscious.
2. If the user asks to add items, provide them in 'itemModifications.added' with realistic USD prices and CymbalMart brand/store tagging.
3. If the user asks to cut costs or remove items, specify IDs in 'itemModifications.removedIds'.
4. If the user asks to refine for dietary constraints (e.g. Vegan, Gluten-Free), suggest smart swaps.
5. Provide 2-3 short clickable follow-up prompts.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            suggestedPrompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            itemModifications: {
              type: Type.OBJECT,
              properties: {
                note: { type: Type.STRING },
                added: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      quantity: { type: Type.NUMBER },
                      unit: { type: Type.STRING },
                      estimatedPrice: { type: Type.NUMBER },
                      store: { type: Type.STRING },
                      priority: { type: Type.STRING },
                      notes: { type: Type.STRING },
                      isCymbalMartBrand: { type: Type.BOOLEAN },
                      brandName: { type: Type.STRING },
                      aisleNumber: { type: Type.STRING },
                    },
                    required: ['name', 'category', 'quantity', 'unit', 'estimatedPrice', 'store', 'priority'],
                  },
                },
                removedIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
            },
          },
          required: ['text'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    if (parsed.itemModifications?.added) {
      parsed.itemModifications.added = parsed.itemModifications.added.map((item: any, i: number) => ({
        ...item,
        id: `added_${Date.now()}_${i}`,
        isBought: false,
        isCymbalMartBrand: item.isCymbalMartBrand ?? true,
        brandName: item.brandName || 'CymbalMart Select',
        store: item.store || 'CymbalMart Supercenter',
      }));
    }

    res.json(parsed);
  } catch (err: any) {
    console.error('Chat error:', err);
    res.json({
      text: "I'm ready to help you optimize your CymbalMart cart! You can adjust any item on the list or ask me to find budget-friendly swaps.",
      suggestedPrompts: ['How much ice do I need?', 'Swap to CymbalMart Select brands'],
    });
  }
});

// 4. Recipe-to-Shopping-List Conversion
app.post('/api/recipe-to-list', async (req, res) => {
  try {
    const { recipeText, servings } = req.body;
    if (!recipeText) {
      return res.status(400).json({ error: 'Recipe text is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        items: [
          {
            id: `rec_${Date.now()}_1`,
            name: `${recipeText} Ingredients Kit`,
            category: 'produce',
            quantity: 1,
            unit: 'kit',
            estimatedPrice: 12,
            store: 'CymbalMart Fresh Market',
            priority: 'recommended',
            isBought: false,
            isCymbalMartBrand: true,
            brandName: 'CymbalMart Fresh',
            aisleNumber: 'Aisle 1',
          },
        ],
      });
    }

    const prompt = `Convert the following dish or recipe into CymbalMart grocery shopping list items scaled for ${servings || 12} party guests:
Recipe: "${recipeText}".
Return items with standard categories, CymbalMart stores, realistic USD prices, aisle numbers, and CymbalMart Select private brand tags where appropriate.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  estimatedPrice: { type: Type.NUMBER },
                  store: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  notes: { type: Type.STRING },
                  isCymbalMartBrand: { type: Type.BOOLEAN },
                  brandName: { type: Type.STRING },
                  aisleNumber: { type: Type.STRING },
                },
                required: ['name', 'category', 'quantity', 'unit', 'estimatedPrice', 'store', 'priority'],
              },
            },
          },
          required: ['items'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const items = (parsed.items || []).map((it: any, idx: number) => ({
      ...it,
      id: `rec_${Date.now()}_${idx}`,
      isBought: false,
      isCymbalMartBrand: it.isCymbalMartBrand ?? true,
      brandName: it.brandName || 'CymbalMart Select',
      store: it.store || 'CymbalMart Supercenter',
    }));

    res.json({ items });
  } catch (err: any) {
    console.error('Recipe conversion error:', err);
    res.status(500).json({ error: 'Failed to convert recipe to shopping items.' });
  }
});

// 5. Checkout & Order Placement Endpoint (Task 3: Refine & Checkout)
app.post('/api/checkout', async (req, res) => {
  try {
    const { plan, fulfillment } = req.body;
    const orderNumber = `CYMBAL-MART-${Math.floor(100000 + Math.random() * 900000)}`;
    const placedAt = new Date().toISOString();

    res.json({
      success: true,
      orderNumber,
      placedAt,
      fulfillment: {
        ...fulfillment,
        orderNumber,
        status: 'placed',
        placedAt,
      },
      message: `Your CymbalMart Party Order #${orderNumber} has been received!`,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to complete checkout.' });
  }
});

// Production static file serving or Vite development middleware
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CymbalMart Shopping Agent Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
