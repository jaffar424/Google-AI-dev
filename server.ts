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

// Helper for fallback fallback generation when API key is not configured or in offline mode
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
    base.themeDescription = `Tailored party plan designed for ${details.guestCountAdults} adults & ${details.guestCountKids || 0} kids. ${customIdea}`;
  }
  base.drinkCalc = calculatePartyDrinks(base.details);
  base.foodCalc = calculatePartyFood(base.details);
  return base;
}

// 1. Generate Party Plan & Shopping List Endpoint
app.post('/api/plan/generate', async (req, res) => {
  try {
    const { details, customIdea } = req.body as { details: PartyDetails; customIdea?: string };

    if (!details) {
      return res.status(400).json({ error: 'Party details are required.' });
    }

    const drinkCalc = calculatePartyDrinks(details);
    const foodCalc = calculatePartyFood(details);

    if (!process.env.GEMINI_API_KEY) {
      console.log('No GEMINI_API_KEY detected, using intelligent algorithmic generator.');
      const fallback = generateFallbackPlan(details, customIdea);
      return res.json(fallback);
    }

    const prompt = `You are Festivity, an elite Master Party Planner and Grocery Shopping Concierge.
Generate a comprehensive, realistic, and budget-conscious party shopping plan for the following event:
- Title/Occasion: ${details.title || 'Celebration'}
- Custom Theme/Vibe Prompt: ${customIdea || details.theme || 'Festive and memorable'}
- Event Type: ${details.eventType || 'Dinner & Drinks'}
- Adult Guests: ${details.guestCountAdults || 12}
- Kid Guests: ${details.guestCountKids || 0}
- Duration: ${details.durationHours || 4} hours
- Target Budget: $${details.budgetLimit || 250} USD
- Drink Format: ${details.drinkStyle || 'full_bar'}
- Food Prep Style: ${details.cateringStyle || 'semi_homemade'}
- Dietary Needs: ${(details.dietaryRestrictions || []).join(', ') || 'None specified'}

Pre-calculated Benchmarks:
- Estimated Total Drinks: ${drinkCalc.totalDrinks} drinks (${drinkCalc.beerBottles} beers, ${drinkCalc.wineBottles} wine bottles, ${drinkCalc.liquorBottles750ml} liquor bottles 750ml, ${drinkCalc.iceLbs} lbs ice)
- Food Portions: ${foodCalc.appetizerPieces} appetizer bites, ${foodCalc.proteinLbs} lbs protein, ${foodCalc.dessertPieces} desserts.

Generate a complete, cohesive, realistic shopping list. Assign items to practical, popular grocery stores:
- 'Costco / Wholesale' for bulk meats, ice, cups, paper towels, snacks, cases of beer
- 'Trader Joe’s' for cheeses, charcuterie, dips, specialty appetizers, wines
- 'Target' for decor, napkins, candles, tableware
- 'Local Supermarket' for fresh herbs, produce, citrus, bakery
- 'Liquor Store' for spirits, bitters, craft alcohol
- 'Bakery / Specialty' for specialty cakes or breads

Ensure accurate item quantities and realistic USD pricing that aligns closely with the user's budget!`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a professional party planner and culinary procurement agent. Always return structured, actionable party plans in valid JSON matching the schema.',
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
                    description: 'One of: Costco / Wholesale, Trader Joe’s, Target, Local Supermarket, Liquor Store, Amazon / Online, Bakery / Specialty, Other',
                  },
                  priority: {
                    type: Type.STRING,
                    description: 'essential, recommended, or optional',
                  },
                  notes: { type: Type.STRING },
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
      store: it.store || 'Local Supermarket',
      priority: it.priority || 'essential',
      notes: it.notes || '',
      isBought: false,
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
      themeDescription: parsed.themeDescription || 'A handcrafted party plan.',
      vibeKeywords: parsed.vibeKeywords || ['Festive', 'Welcoming'],
      signatureCocktail: parsed.signatureCocktail,
      signatureMocktail: parsed.signatureMocktail,
      items: finalItems,
      drinkCalc,
      foodCalc,
      costSavingTips: parsed.costSavingTips || [],
      timeline: finalTimeline,
      runOfShow: parsed.runOfShow || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    res.json(plan);
  } catch (err: any) {
    console.error('Error generating party plan with Gemini:', err);
    // Graceful fallback so the UI never breaks
    const fallback = generateFallbackPlan(req.body.details, req.body.customIdea);
    res.json(fallback);
  }
});

// 2. Interactive Party Shopping Assistant Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, currentPlan } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Offline fallback conversational responses
      return res.json({
        text: `I'm here to help manage your party plan! You can ask me to swap items, suggest cocktail recipes, calculate quantities for extra guests, or help trim your budget. (Tip: Connected to built-in smart assistant engine).`,
        suggestedPrompts: [
          'How can I cut $30 from this budget?',
          'Suggest a signature batch cocktail recipe',
          'Add gluten-free appetizer options',
        ],
      });
    }

    const itemsSummary = (currentPlan?.items || [])
      .slice(0, 30)
      .map((it: ShoppingItem) => `- ${it.name} (${it.quantity} ${it.unit}, $${it.estimatedPrice}, at ${it.store})`)
      .join('\n');

    const systemPrompt = `You are Festivity, a savvy, enthusiastic Party Planner and Grocery Shopping Agent.
Current Party Context:
- Event: ${currentPlan?.details?.title || 'Party'} (${currentPlan?.details?.eventType || 'Celebration'})
- Guests: ${currentPlan?.details?.guestCountAdults || 10} adults, ${currentPlan?.details?.guestCountKids || 0} kids
- Budget Limit: $${currentPlan?.details?.budgetLimit || 200}
- Current Shopping List (${currentPlan?.items?.length || 0} items):
${itemsSummary}

Your goals:
1. Provide punchy, helpful, practical party host advice.
2. If the user asks to add items (e.g. "Add 2 bottles of prosecco and orange juice for mimosas" or "We need vegetarian sliders"), generate the structured item in 'itemModifications.added'.
3. If the user asks to cut costs or remove items, specify their names or IDs in 'itemModifications.removedIds'.
4. Provide 2-3 short clickable follow-up prompt ideas for the host.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
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

    // Add unique IDs to any added items
    if (parsed.itemModifications?.added) {
      parsed.itemModifications.added = parsed.itemModifications.added.map((item: any, i: number) => ({
        ...item,
        id: `added_${Date.now()}_${i}`,
        isBought: false,
      }));
    }

    res.json(parsed);
  } catch (err: any) {
    console.error('Chat error:', err);
    res.json({
      text: "I received your request! Let's optimize your party shopping list. You can add or adjust any item directly from the shopping list or ask me another question.",
      suggestedPrompts: ['How much ice do I need?', 'Recommend a batch cocktail'],
    });
  }
});

// 3. Recipe-to-Shopping-List Conversion Endpoint
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
            name: `${recipeText} Main Ingredients`,
            category: 'produce',
            quantity: 1,
            unit: 'kit',
            estimatedPrice: 12,
            store: 'Trader Joe’s',
            priority: 'recommended',
            isBought: false,
          },
        ],
      });
    }

    const prompt = `Convert the following dish or recipe into grocery shopping list items scaled for ${servings || 12} party guests:
Recipe: "${recipeText}".
Return items with standard categories, reasonable stores, realistic USD prices, and quantities.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
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
    }));

    res.json({ items });
  } catch (err: any) {
    console.error('Recipe conversion error:', err);
    res.status(500).json({ error: 'Failed to convert recipe to shopping items.' });
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
    console.log(`Festivity Party Planner Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
