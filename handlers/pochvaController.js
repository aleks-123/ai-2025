const Pochva = require('../pkg/pocva/pochvaSchema');
const { chatWithAI } = require('./aiSystem');

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
          `Име: ${p.ime}, Тип: ${p.tip}, pH: ${p.ph}, Хумус: ${p.humus}, Локација: ${p.lokacija}, Култура:${p.kultura}`
      )
      .join('\n');

    const systemMessage =
      'Ти си експерт за почви во Македонија. Користи ги следниве информации за да одговараш на прашања:';

    const fullPrompt = `${systemMessage}\n${context}\n\nПрањање: ${req.body.prompt}`;

    const aiResponse = await chatWithAI(fullPrompt);

    res.json(aiResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addSamplePochvi = async (req, res) => {
  try {
    const samplePochvi = [
      {
        ime: 'Црница',
        tip: 'Црнозем',
        ph: 6.8,
        humus: 3.5,
        tekstura: 'глинеста',
        boja: 'темно кафеава',
        lokacija: 'Пелагонија',
        nadmorskaVisina: 600,
        karakteristiki: 'Плодна почва, богата со хумус, погодна за житни култури.',
        kultura: ['пченица', 'јачмен', 'сончоглед'],
      },
      {
        ime: 'Алувијална почва',
        tip: 'Алувијална',
        ph: 7.2,
        humus: 2.1,
        tekstura: 'песоклива',
        boja: 'светло кафеава',
        lokacija: 'Вардарска долина',
        nadmorskaVisina: 150,
        karakteristiki: 'Добра дренажа, погодна за овоштарство и зеленчук.',
        kultura: ['јаболка', 'пиперка', 'домати'],
      },
      {
        ime: 'Рендзина',
        tip: 'Рендзина',
        ph: 7.5,
        humus: 4.0,
        tekstura: 'глинесто-песоклива',
        boja: 'сива',
        lokacija: 'Охридско-Преспански регион',
        nadmorskaVisina: 900,
        karakteristiki: 'Карбонатна почва, богата со минерали.',
        kultura: ['винова лоза', 'пченка'],
      },
      {
        ime: 'Планинска почва',
        tip: 'Планинска',
        ph: 5.8,
        humus: 2.8,
        tekstura: 'каменеста',
        boja: 'темно сива',
        lokacija: 'Шар Планина',
        nadmorskaVisina: 1500,
        karakteristiki: 'Слабо развиена, погодна за пасишта.',
        kultura: ['детелина', 'ливадарка'],
      },
      {
        ime: 'Глинеста почва',
        tip: 'Глинеста',
        ph: 6.2,
        humus: 2.5,
        tekstura: 'глинеста',
        boja: 'црвеникава',
        lokacija: 'Тиквешко',
        nadmorskaVisina: 200,
        karakteristiki: 'Добра за лозарство и градинарство.',
        kultura: ['грозје', 'краставици'],
      },
      {
        ime: 'Песоклива почва',
        tip: 'Песоклива',
        ph: 7.0,
        humus: 1.2,
        tekstura: 'песоклива',
        boja: 'жолта',
        lokacija: 'Гевгелиско',
        nadmorskaVisina: 80,
        karakteristiki: 'Лесна за обработка, брзо се загрева.',
        kultura: ['лубеница', 'диња'],
      },
      {
        ime: 'Солончаци',
        tip: 'Солончаци',
        ph: 8.5,
        humus: 0.8,
        tekstura: 'глинесто-песоклива',
        boja: 'бела',
        lokacija: 'Кумановско',
        nadmorskaVisina: 120,
        karakteristiki: 'Висока содржина на соли.',
        kultura: ['јачмен', 'пченка'],
      },
      {
        ime: 'Каменеста почва',
        tip: 'Каменеста',
        ph: 6.0,
        humus: 1.0,
        tekstura: 'каменеста',
        boja: 'сива',
        lokacija: 'Крушевско',
        nadmorskaVisina: 1100,
        karakteristiki: 'Слабо плодна, погодна за шуми.',
        kultura: ['бор', 'буква'],
      },
      {
        ime: 'Иловица',
        tip: 'Иловица',
        ph: 6.5,
        humus: 2.0,
        tekstura: 'иловична',
        boja: 'светло кафеава',
        lokacija: 'Струмичко',
        nadmorskaVisina: 250,
        karakteristiki: 'Добра за зеленчук и овошје.',
        kultura: ['домати', 'јагоди'],
      },
      {
        ime: 'Планинска црница',
        tip: 'Црнозем',
        ph: 6.9,
        humus: 3.8,
        tekstura: 'глинеста',
        boja: 'темно кафеава',
        lokacija: 'Маврово',
        nadmorskaVisina: 1400,
        karakteristiki: 'Плодна, богата со органска материја.',
        kultura: ['пченица', 'компир'],
      },
    ];

    const inserted = await Pochva.insertMany(samplePochvi);
    res.status(201).json({
      message: 'Dodadeni pocvi',
      data: inserted,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
