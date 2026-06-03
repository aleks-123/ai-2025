const { property } = require("cohere-ai/core/schemas");
const Pochva = require("../pkg/pocva/pochvaSchema");
const { chatWithAI, chatWithAITools } = require("./aiSystem");

exports.createPochva = async (req, res) => {
  try {
    const pochva = new Pochva(req.body);
    await pochva.save();
    res.status(201).json(pochva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPochvi = async (req, res) => {
  try {
    const pochva = await Pochva.find();
    res.json(pochva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.chatAboutPochva = async (req, res) => {
  try {
    const pochvi = await Pochva.find();

    const context = pochvi
      .map(
        (p) =>
          `Име: ${p.ime}, Тип: ${p.tip}, pH: ${p.ph}, Хумус: ${p.humus}, Локација: ${p.lokacija}, Култура:${p.kultura}`,
      )
      .join("\n");

    const systemMessage =
      "Ти си експерт за почви во Македонија. Користи ги следниве информации за да одговараш на прашања:";

    const fullPrompt = `${systemMessage}\n${context}\n\nПрањање: ${req.body.prompt} <odgovor-primer> Pocvhata x ima tolku ph vrednost, tolku humus, i se naogja na nekoj region <odgovor-primer>`;

    const aiResponse = await chatWithAI(fullPrompt);

    res.json(aiResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.chatAboutPochvaV2 = async (req, res) => {
  try {
    const prompt = (req.body.prompt || "").trim();

    if (!prompt) {
      return res.status(400).json({ error: "Nedostiga 'prompt'" });
    }

    const tools = [
      {
        type: "function",
        function: {
          name: "najdi_pochvi",
          description:
            "Враќа почви од базата филтрирани по име, тип, локација или опсег на pH. Сите параметри се опционални.",
          parameters: {
            type: "object",
            properties: {
              ime: { type: "string", description: "Име на почвата" },
              tip: { type: "string", description: "Тип на почва" },
              lokacija: { type: "string", description: "Локација/регион" },
              phMin: { type: "number", description: "Минимална pH вредност" },
              phMax: { type: "number", description: "Максимална pH вредност" },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "presmetaj",
          description: "Пресметај аритметичка операција помеѓу два броја и степенување",
          parameters: {
            type: "object",
            properties: {
              a: { type: "number", description: "Прв број" },
              b: { type: "number", description: "Втор број" },
              operacija: {
                type: "string",
                description: "Операција: + - * ^",
                enum: ["+", "-", "*", "^"],
              },
            },
            required: ["a", "b", "operacija"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "denes_datum",
          description: "Го враќа моменталниот датум и време, нема параметри",
          parameters: { type: "object", properties: {} },
        },
      },
    ];

    const toolHandlers = {
      najdi_pochvi: async ({ ime, tip, lokacija, phMin, phMax }) => {
        const query = {};
        if (ime) query.ime = new RegExp(ime, "i");
        if (tip) query.tip = new RegExp(tip, "i");
        if (lokacija) query.lokacija = new RegExp(lokacija, "i");
        if (phMin != null || phMax != null) {
          query.ph = {};
          if (phMin != null) query.ph.$gte = phMin;
          if (phMax != null) query.ph.$lte = phMax;
        }

        const rezultati = await Pochva.find(query).limit(20).lean();
        return rezultati.map((p) => ({
          ime: p.ime,
          tip: p.tip,
          ph: p.ph,
          humus: p.humus,
          lokacija: p.lokacija,
          kultura: p.kultura,
          karakteristiki: p.karakteristiki,
        }));
      },
      presmetaj: async ({ a, b, operacija }) => {
        let rezultat;
        switch (operacija) {
          case "+":
            rezultat = a + b;
            break;
          case "-":
            rezultat = a - b;
            break;
          case "*":
            rezultat = a * b;
            break;
          case "^":
            rezultat = a ^ b;
          default:
            return { error: "Nepoznata operacija" };
        }
        return { a, b, operacija, rezultat };
      },
      denes_datum: async () => {
        const sega = new Date();
        return {
          datum: sega.toLocaleDateString("mk-MK"),
          vreme: sega.toLocaleTimeString("mk-MK"),
          iso: sega.toISOString(),
        };
      },
    };

    const systemMessage =
      "Ти си експерт за почви во Македонија. Кога ти треба информација за конкретна почва, " +
      "повикај го tool-от 'najdi_pochvi'. За пресметки користи го 'presmetaj', а за моментален даум 'denes_datum'. Одговарај прецизно и само врз основа на податоците од базата. " +
      "Ако нема податок, кажи дека немаш информација.";

    const aiResponse = await chatWithAITools({
      systemMessage,
      userPrompt: prompt,
      tools,
      toolHandlers,
      temperature: 0.2,
    });

    res.json(aiResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addSamplePochvi = async (req, res) => {
  try {
    const samplePochvi = [
      {
        ime: "Црница",
        tip: "Црнозем",
        ph: 6.8,
        humus: 3.5,
        tekstura: "глинеста",
        boja: "темно кафеава",
        lokacija: "Пелагонија",
        nadmorskaVisina: 600,
        karakteristiki: "Плодна почва, богата со хумус, погодна за житни култури.",
        kultura: ["пченица", "јачмен", "сончоглед"],
      },
      {
        ime: "Алувијална почва",
        tip: "Алувијална",
        ph: 7.2,
        humus: 2.1,
        tekstura: "песоклива",
        boja: "светло кафеава",
        lokacija: "Вардарска долина",
        nadmorskaVisina: 150,
        karakteristiki: "Добра дренажа, погодна за овоштарство и зеленчук.",
        kultura: ["јаболка", "пиперка", "домати"],
      },
      {
        ime: "Рендзина",
        tip: "Рендзина",
        ph: 7.5,
        humus: 4.0,
        tekstura: "глинесто-песоклива",
        boja: "сива",
        lokacija: "Охридско-Преспански регион",
        nadmorskaVisina: 900,
        karakteristiki: "Карбонатна почва, богата со минерали.",
        kultura: ["винова лоза", "пченка"],
      },
      {
        ime: "Планинска почва",
        tip: "Планинска",
        ph: 5.8,
        humus: 2.8,
        tekstura: "каменеста",
        boja: "темно сива",
        lokacija: "Шар Планина",
        nadmorskaVisina: 1500,
        karakteristiki: "Слабо развиена, погодна за пасишта.",
        kultura: ["детелина", "ливадарка"],
      },
      {
        ime: "Глинеста почва",
        tip: "Глинеста",
        ph: 6.2,
        humus: 2.5,
        tekstura: "глинеста",
        boja: "црвеникава",
        lokacija: "Тиквешко",
        nadmorskaVisina: 200,
        karakteristiki: "Добра за лозарство и градинарство.",
        kultura: ["грозје", "краставици"],
      },
      {
        ime: "Песоклива почва",
        tip: "Песоклива",
        ph: 7.0,
        humus: 1.2,
        tekstura: "песоклива",
        boja: "жолта",
        lokacija: "Гевгелиско",
        nadmorskaVisina: 80,
        karakteristiki: "Лесна за обработка, брзо се загрева.",
        kultura: ["лубеница", "диња"],
      },
      {
        ime: "Солончаци",
        tip: "Солончаци",
        ph: 8.5,
        humus: 0.8,
        tekstura: "глинесто-песоклива",
        boja: "бела",
        lokacija: "Кумановско",
        nadmorskaVisina: 120,
        karakteristiki: "Висока содржина на соли.",
        kultura: ["јачмен", "пченка"],
      },
      {
        ime: "Каменеста почва",
        tip: "Каменеста",
        ph: 6.0,
        humus: 1.0,
        tekstura: "каменеста",
        boja: "сива",
        lokacija: "Крушевско",
        nadmorskaVisina: 1100,
        karakteristiki: "Слабо плодна, погодна за шуми.",
        kultura: ["бор", "буква"],
      },
      {
        ime: "Иловица",
        tip: "Иловица",
        ph: 6.5,
        humus: 2.0,
        tekstura: "иловична",
        boja: "светло кафеава",
        lokacija: "Струмичко",
        nadmorskaVisina: 250,
        karakteristiki: "Добра за зеленчук и овошје.",
        kultura: ["домати", "јагоди"],
      },
      {
        ime: "Планинска црница",
        tip: "Црнозем",
        ph: 6.9,
        humus: 3.8,
        tekstura: "глинеста",
        boja: "темно кафеава",
        lokacija: "Маврово",
        nadmorskaVisina: 1400,
        karakteristiki: "Плодна, богата со органска материја.",
        kultura: ["пченица", "компир"],
      },
    ];

    const inserted = await Pochva.insertMany(samplePochvi);
    res.status(201).json({
      message: "Dodadeni pocvi",
      data: inserted,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
