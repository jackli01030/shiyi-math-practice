import type { MathQuestion, QuestionType, QuestionVisual } from "../types/question";

export const specialPracticeTypes: QuestionType[] = [
  "20以内加法",
  "20以内减法",
  "100以内数的认识",
  "大小比较",
  "100以内简单加减",
  "人民币",
  "找规律",
  "观察物体",
  "有趣的图形",
  "解决问题",
];

export const dailyPracticeTypes: QuestionType[] = specialPracticeTypes;

type QuestionDraft = Omit<MathQuestion, "id">;

function rotateOptions(options: string[], seed: number): string[] {
  const uniqueOptions = Array.from(new Set(options)).slice(0, 4);
  const shift = seed % uniqueOptions.length;
  return uniqueOptions.map((_, index) => uniqueOptions[(index + shift) % uniqueOptions.length]);
}

function numberOptions(answer: number, seed: number, min = 0, max = 120, step = 1): string[] {
  const offsets = [0, step, -step, 2 * step, -2 * step, 3 * step, -3 * step, 5 * step, -5 * step, 10, -10];
  const values: number[] = [];

  offsets.forEach((offset) => {
    const value = answer + offset;
    if (value >= min && value <= max && !values.includes(value)) {
      values.push(value);
    }
  });

  let extra = min;
  while (values.length < 4) {
    if (!values.includes(extra)) {
      values.push(extra);
    }
    extra += step;
  }

  return rotateOptions(values.map(String), seed);
}

function textOptions(answer: string, distractors: string[], seed: number): string[] {
  return rotateOptions([answer, ...distractors.filter((option) => option !== answer)], seed);
}

function emojiRows(item: string, count: number, caption?: string, perRow = 10): QuestionVisual {
  const rows: string[][] = [];

  for (let index = 0; index < count; index += perRow) {
    rows.push(Array.from({ length: Math.min(perRow, count - index) }, () => item));
  }

  return { caption, rows };
}

function twoGroupVisual(
  leftItem: string,
  leftCount: number,
  rightItem: string,
  rightCount: number,
  caption?: string,
): QuestionVisual {
  return {
    caption,
    rows: [
      Array.from({ length: leftCount }, () => leftItem),
      Array.from({ length: rightCount }, () => rightItem),
    ],
  };
}

function addIds(prefix: string, drafts: QuestionDraft[]): MathQuestion[] {
  return drafts.map((question, index) => ({
    id: `${prefix}-${String(index + 1).padStart(3, "0")}`,
    ...question,
  }));
}

function buildAdditionQuestions(): MathQuestion[] {
  const pairs: Array<[number, number]> = [];
  for (let first = 1; first <= 10; first += 1) {
    for (let second = 1; second <= 10; second += 1) {
      if (first + second <= 20) {
        pairs.push([first, second]);
      }
    }
  }

  return addIds(
    "add",
    pairs.slice(0, 45).map(([first, second], index) => {
      const answer = first + second;
      const useVisual = index % 3 === 0;
      const item = index % 2 === 0 ? "🍎" : "⭐";

      return {
        type: "20以内加法",
        question: useVisual ? `上面两行一共有几个${item === "🍎" ? "苹果" : "星星"}？` : `${first} + ${second} = ?`,
        options: numberOptions(answer, index, 0, 20),
        answer: String(answer),
        explanation: `${first} 加 ${second}，可以接着数，也可以先凑成 10，再继续算。`,
        visual: useVisual ? twoGroupVisual(item, first, item, second, "看图想一想") : undefined,
      };
    }),
  );
}

function buildSubtractionQuestions(): MathQuestion[] {
  const pairs: Array<[number, number]> = [];
  for (let total = 10; total <= 20; total += 1) {
    for (let minus = 1; minus < total; minus += 1) {
      if (total - minus <= 12) {
        pairs.push([total, minus]);
      }
    }
  }

  return addIds(
    "sub",
    pairs.slice(0, 45).map(([total, minus], index) => {
      const answer = total - minus;
      const useVisual = index % 4 === 0;
      const item = index % 2 === 0 ? "🍎" : "🐟";

      return {
        type: "20以内减法",
        question: useVisual ? `有 ${total} 个，拿走 ${minus} 个，还剩几个？` : `${total} - ${minus} = ?`,
        options: numberOptions(answer, index, 0, 20),
        answer: String(answer),
        explanation: `想 ${minus} 加几等于 ${total}，也可以从 ${total} 往前数 ${minus} 个。`,
        visual: useVisual ? emojiRows(item, total, "先看一共有多少，再想拿走多少") : undefined,
      };
    }),
  );
}

function buildNumberQuestions(): MathQuestion[] {
  const numbers = Array.from({ length: 80 }, (_, index) => index + 20);

  return addIds(
    "number",
    numbers.slice(0, 45).map((number, index) => {
      const tens = Math.floor(number / 10);
      const ones = number % 10;
      const mode = index % 5;

      if (mode === 0) {
        const answer = `${tens}个十和${ones}个一`;
        return {
          type: "100以内数的认识",
          question: `${number} 是由什么组成的？`,
          options: textOptions(answer, [`${ones}个十和${tens}个一`, `${tens}个十`, `${number}个一`, `${number}个十`], index),
          answer,
          explanation: `${number} 的十位是 ${tens}，个位是 ${ones}。`,
          visual: {
            caption: "十位和个位",
            rows: [Array.from({ length: tens }, () => "十"), Array.from({ length: Math.max(ones, 1) }, () => (ones === 0 ? "0" : "一"))],
          },
        };
      }

      if (mode === 1) {
        const answer = number + 1;
        return {
          type: "100以内数的认识",
          question: `${number} 后面的一个数是？`,
          options: numberOptions(answer, index, 0, 100),
          answer: String(answer),
          explanation: `从 ${number} 往后数一个，就是 ${answer}。`,
        };
      }

      if (mode === 2) {
        const answer = number - 1;
        return {
          type: "100以内数的认识",
          question: `${number} 前面的一个数是？`,
          options: numberOptions(answer, index, 0, 100),
          answer: String(answer),
          explanation: `从 ${number} 往前数一个，就是 ${answer}。`,
        };
      }

      if (mode === 3) {
        const target = tens * 10 + ones;
        return {
          type: "100以内数的认识",
          question: `十位是 ${tens}，个位是 ${ones} 的数是？`,
          options: numberOptions(target, index, 0, 100),
          answer: String(target),
          explanation: `${tens} 个十和 ${ones} 个一合起来是 ${target}。`,
        };
      }

      const jump = (index % 3) + 2;
      const answer = number + jump;
      return {
        type: "100以内数的认识",
        question: `${number} 后面第 ${jump} 个数是？`,
        options: numberOptions(answer, index, 0, 100),
        answer: String(answer),
        explanation: `从 ${number} 开始往后数 ${jump} 个，就数到 ${answer}。`,
      };
    }),
  );
}

function buildCompareQuestions(): MathQuestion[] {
  const drafts: QuestionDraft[] = [];

  for (let index = 0; index < 45; index += 1) {
    const first = ((index * 17 + 23) % 99) + 1;
    const second = index % 9 === 0 ? first : ((index * 29 + 11) % 99) + 1;
    const mode = index % 3;

    if (mode === 0) {
      const answer = first > second ? ">" : first < second ? "<" : "=";
      drafts.push({
        type: "大小比较",
        question: `${first} ○ ${second}，○ 里填什么？`,
        options: textOptions(answer, [">", "<", "=", "都不是"], index),
        answer,
        explanation: `先看十位，再看个位。${first} 和 ${second} 比较后，应该填 ${answer}。`,
      });
      continue;
    }

    if (mode === 1) {
      const left = (index % 8) + 3;
      const right = ((index * 2) % 8) + 3;
      const answer = left > right ? "左边" : left < right ? "右边" : "一样多";
      drafts.push({
        type: "大小比较",
        question: "看图比较，哪边苹果更多？",
        options: textOptions(answer, ["左边", "右边", "一样多", "看不出来"], index),
        answer,
        explanation: `左边有 ${left} 个，右边有 ${right} 个，数清楚再比较。`,
        visual: twoGroupVisual("🍎", left, "🍏", right, "左边一行，右边一行"),
      });
      continue;
    }

    const values = [first, second, ((index * 13 + 37) % 99) + 1, ((index * 7 + 51) % 99) + 1];
    const answer = Math.max(...values);
    drafts.push({
      type: "大小比较",
      question: `${values.join("、")} 中，最大的数是？`,
      options: numberOptions(answer, index, 0, 100),
      answer: String(answer),
      explanation: "比较几个数时，可以先比较十位，十位大的数更大。",
    });
  }

  return addIds("compare", drafts);
}

function buildSimpleAddSubQuestions(): MathQuestion[] {
  const drafts: QuestionDraft[] = [];

  for (let index = 0; index < 50; index += 1) {
    const mode = index % 4;
    const tensNumber = ((index % 7) + 2) * 10;
    const ones = (index % 8) + 1;
    const base = ((index * 7) % 70) + 20;

    if (mode === 0) {
      const add = ((index % 5) + 1) * 10;
      const answer = Math.min(tensNumber + add, 100);
      drafts.push({
        type: "100以内简单加减",
        question: `${tensNumber} + ${add} = ?`,
        options: numberOptions(answer, index, 0, 100, 10),
        answer: String(answer),
        explanation: `几个十加几个十，还是几个十。`,
      });
      continue;
    }

    if (mode === 1) {
      const answer = base + ones <= 100 ? base + ones : base - ones;
      const sign = base + ones <= 100 ? "+" : "-";
      drafts.push({
        type: "100以内简单加减",
        question: `${base} ${sign} ${ones} = ?`,
        options: numberOptions(answer, index, 0, 100),
        answer: String(answer),
        explanation: sign === "+" ? `从 ${base} 往后数 ${ones} 个。` : `从 ${base} 往前数 ${ones} 个。`,
      });
      continue;
    }

    if (mode === 2) {
      const minus = ((index % 4) + 1) * 10;
      const start = Math.max(tensNumber + minus, 50);
      const answer = start - minus;
      drafts.push({
        type: "100以内简单加减",
        question: `${start} - ${minus} = ?`,
        options: numberOptions(answer, index, 0, 100, 10),
        answer: String(answer),
        explanation: `几个十减几个十，可以看十位来算。`,
      });
      continue;
    }

    const addTens = ((index % 3) + 1) * 10;
    const answer = base + addTens <= 100 ? base + addTens : base - addTens;
    drafts.push({
      type: "100以内简单加减",
      question: `${base} ${base + addTens <= 100 ? "+" : "-"} ${addTens} = ?`,
      options: numberOptions(answer, index, 0, 100, 10),
      answer: String(answer),
      explanation: "加减整十数时，个位不变，十位变化。",
    });
  }

  return addIds("simple", drafts);
}

function buildMoneyQuestions(): MathQuestion[] {
  const drafts: QuestionDraft[] = [];

  for (let index = 0; index < 35; index += 1) {
    const mode = index % 5;

    if (mode === 0) {
      drafts.push({
        type: "人民币",
        question: "1元 = ?角",
        options: textOptions("10角", ["1角", "5角", "100角"], index),
        answer: "10角",
        explanation: "1 元等于 10 角。",
        visual: { caption: "认识人民币", rows: [["💴", "=", "🪙", "🪙", "🪙", "🪙", "🪙", "🪙", "🪙", "🪙", "🪙", "🪙"]] },
      });
      continue;
    }

    if (mode === 1) {
      const left = (index % 7) + 1;
      const right = 10 - left;
      drafts.push({
        type: "人民币",
        question: `${left}角 + ${right}角 = ?`,
        options: textOptions("1元", [`${left + right}角`, "2元", "5角"], index),
        answer: "1元",
        explanation: `${left} 角加 ${right} 角是 10 角，也就是 1 元。`,
        visual: twoGroupVisual("🪙", Math.min(left, 8), "🪙", Math.min(right, 8), "两堆硬币合起来"),
      });
      continue;
    }

    if (mode === 2) {
      const price = (index % 8) + 2;
      const paid = price + ((index % 4) + 1);
      const answer = paid - price;
      drafts.push({
        type: "人民币",
        question: `买橡皮用 ${price}元，付 ${paid}元，应找回？`,
        options: textOptions(`${answer}元`, [`${answer + 1}元`, `${answer + 2}元`, `${answer + 3}元`], index),
        answer: `${answer}元`,
        explanation: `用付的钱减去用掉的钱：${paid} - ${price} = ${answer}。`,
      });
      continue;
    }

    if (mode === 3) {
      const yuan = (index % 5) + 1;
      const jiao = (index % 8) + 1;
      const answer = yuan * 10 + jiao;
      drafts.push({
        type: "人民币",
        question: `${yuan}元${jiao}角 = ?角`,
        options: textOptions(`${answer}角`, [`${answer - 1}角`, `${answer + 1}角`, `${yuan + jiao}角`], index),
        answer: `${answer}角`,
        explanation: `${yuan} 元是 ${yuan * 10} 角，再加 ${jiao} 角，一共 ${answer} 角。`,
      });
      continue;
    }

    const first = (index % 6) + 2;
    const second = (index % 5) + 1;
    const answer = first + second;
    drafts.push({
      type: "人民币",
      question: `${first}元 + ${second}元 = ?`,
      options: textOptions(`${answer}元`, [`${answer - 1}元`, `${answer + 1}元`, `${answer + 2}元`], index),
      answer: `${answer}元`,
      explanation: `元和元相加，${first} + ${second} = ${answer}。`,
    });
  }

  return addIds("money", drafts);
}

function buildPatternQuestions(): MathQuestion[] {
  const drafts: QuestionDraft[] = [];
  const numberPatterns: Array<[number[], number, string]> = [
    [[2, 4, 6, 8], 10, "每次多 2。"],
    [[5, 10, 15, 20], 25, "每次多 5。"],
    [[1, 3, 5, 7], 9, "每次多 2。"],
    [[10, 9, 8, 7], 6, "每次少 1。"],
    [[3, 6, 9, 12], 15, "每次多 3。"],
    [[20, 18, 16, 14], 12, "每次少 2。"],
    [[30, 40, 50, 60], 70, "每次多 10。"],
    [[9, 7, 5, 3], 1, "每次少 2。"],
  ];

  for (let index = 0; index < 24; index += 1) {
    const [pattern, answer, explanation] = numberPatterns[index % numberPatterns.length];
    drafts.push({
      type: "找规律",
      question: `${pattern.join("，")}，？`,
      options: numberOptions(answer, index, 0, 100),
      answer: String(answer),
      explanation,
    });
  }

  const visualPatterns = [
    { row: ["🍎", "🍌", "🍎", "🍌", "🍎"], answer: "🍌", text: "苹果、香蕉交替出现。" },
    { row: ["🔴", "🔵", "🔴", "🔵", "🔴"], answer: "🔵", text: "红、蓝、红、蓝地排。" },
    { row: ["▲", "■", "▲", "■", "▲"], answer: "■", text: "三角形和正方形交替出现。" },
    { row: ["⭐", "⭐", "🌙", "⭐", "⭐"], answer: "🌙", text: "两个星星后面跟一个月亮。" },
  ];

  for (let index = 0; index < 16; index += 1) {
    const pattern = visualPatterns[index % visualPatterns.length];
    drafts.push({
      type: "找规律",
      question: "看图形规律，下一个是什么？",
      options: textOptions(pattern.answer, ["🍎", "🍌", "🔴", "🔵", "▲", "■", "⭐", "🌙"], index),
      answer: pattern.answer,
      explanation: pattern.text,
      visual: { caption: "按规律排一排", rows: [pattern.row, ["?"]] },
    });
  }

  return addIds("pattern", drafts);
}

function buildObservationQuestions(): MathQuestion[] {
  const objects = [
    { icon: "🥤", name: "杯子", top: "圆形", side: "长方形" },
    { icon: "📦", name: "盒子", top: "正方形", side: "长方形" },
    { icon: "⚽", name: "球", top: "圆形", side: "圆形" },
    { icon: "🧃", name: "饮料盒", top: "长方形", side: "长方形" },
    { icon: "🎲", name: "积木块", top: "正方形", side: "正方形" },
  ];

  const drafts = Array.from({ length: 25 }, (_, index): QuestionDraft => {
    const item = objects[index % objects.length];
    const askTop = index % 2 === 0;
    const answer = askTop ? item.top : item.side;
    return {
      type: "观察物体",
      question: `从${askTop ? "上面" : "侧面"}看${item.name}，大约像什么图形？`,
      options: textOptions(answer, ["圆形", "正方形", "长方形", "三角形"], index),
      answer,
      explanation: `观察物体时，要先想清楚是从哪个方向看。`,
      visual: { caption: `观察：${item.name}`, rows: [[item.icon]] },
    };
  });

  return addIds("observe", drafts);
}

function buildShapeQuestions(): MathQuestion[] {
  const drafts: QuestionDraft[] = [];
  const shapeRows = [
    ["🔴", "🔺", "🟦", "🔺", "🟨", "🔺"],
    ["🟦", "🟦", "🔴", "🟨", "🔴", "🟩"],
    ["🔺", "🔴", "🔺", "🟦", "🟩", "🔺", "🔴"],
    ["🟨", "🟩", "🟨", "🔺", "🟦", "🟨"],
  ];
  const shapeNames: Record<string, string> = {
    "🔴": "圆形",
    "🔺": "三角形",
    "🟦": "正方形",
    "🟨": "正方形",
    "🟩": "正方形",
  };

  for (let index = 0; index < 40; index += 1) {
    const row = shapeRows[index % shapeRows.length];
    const target = ["🔴", "🔺", "🟦", "🟨"][index % 4];
    const targetName = shapeNames[target];
    const count = row.filter((shape) => shape === target).length;

    drafts.push({
      type: "有趣的图形",
      question: `图中有几个${targetName}？`,
      options: numberOptions(count, index, 0, 8),
      answer: String(count),
      explanation: `先找到所有${targetName}，再一个一个数清楚。`,
      visual: { caption: "数一数图形", rows: [row] },
    });
  }

  return addIds("shape", drafts);
}

function buildWordProblemQuestions(): MathQuestion[] {
  const drafts: QuestionDraft[] = [];
  const scenes = [
    { name: "铅笔", unit: "支", icon: "✏️" },
    { name: "苹果", unit: "个", icon: "🍎" },
    { name: "松果", unit: "个", icon: "🌰" },
    { name: "图书", unit: "本", icon: "📘" },
    { name: "跳绳", unit: "根", icon: "🪢" },
    { name: "瓶子", unit: "个", icon: "🧴" },
  ];

  for (let index = 0; index < 45; index += 1) {
    const scene = scenes[index % scenes.length];
    const mode = index % 3;

    if (mode === 0) {
      const first = (index % 9) + 5;
      const second = (index % 8) + 3;
      const answer = first + second;
      drafts.push({
        type: "解决问题",
        question: `原来有 ${first}${scene.unit}${scene.name}，又拿来 ${second}${scene.unit}，现在有多少${scene.unit}？`,
        options: numberOptions(answer, index, 0, 100),
        answer: String(answer),
        explanation: `把原来的和又拿来的合起来，用加法：${first} + ${second} = ${answer}。`,
        visual: first + second <= 18 ? twoGroupVisual(scene.icon, first, scene.icon, second, "先看两部分，再合起来") : undefined,
      });
      continue;
    }

    if (mode === 1) {
      const total = (index % 14) + 12;
      const used = (index % 7) + 3;
      const answer = total - used;
      drafts.push({
        type: "解决问题",
        question: `一共有 ${total}${scene.unit}${scene.name}，用掉 ${used}${scene.unit}，还剩多少${scene.unit}？`,
        options: numberOptions(answer, index, 0, 100),
        answer: String(answer),
        explanation: `求还剩多少，用减法：${total} - ${used} = ${answer}。`,
        visual: total <= 18 ? emojiRows(scene.icon, total, "先看一共有多少") : undefined,
      });
      continue;
    }

    const first = (index % 12) + 8;
    const second = first + ((index % 6) + 2);
    const answer = second - first;
    drafts.push({
      type: "解决问题",
      question: `小明有 ${first}${scene.unit}${scene.name}，小红有 ${second}${scene.unit}，小红比小明多多少${scene.unit}？`,
      options: numberOptions(answer, index, 0, 30),
      answer: String(answer),
      explanation: `求多多少，用较大的数减较小的数：${second} - ${first} = ${answer}。`,
    });
  }

  return addIds("word", drafts);
}

function buildExamPaperQuestions(): MathQuestion[] {
  const drafts: QuestionDraft[] = [
    {
      type: "100以内简单加减",
      question: "16 比 9 多多少？",
      options: numberOptions(7, 1, 0, 20),
      answer: "7",
      explanation: "求多多少，用减法：16 - 9 = 7。",
    },
    {
      type: "100以内简单加减",
      question: "8 比 13 少多少？",
      options: numberOptions(5, 2, 0, 20),
      answer: "5",
      explanation: "求少多少，用较大的数减较小的数：13 - 8 = 5。",
    },
    {
      type: "100以内简单加减",
      question: "38 比哪个数多 17？",
      options: numberOptions(21, 3, 0, 100),
      answer: "21",
      explanation: "38 比一个数多 17，就是 38 - 17 = 21。",
    },
    {
      type: "100以内简单加减",
      question: "哪个数比 66 少 22？",
      options: numberOptions(44, 4, 0, 100),
      answer: "44",
      explanation: "比 66 少 22，用减法：66 - 22 = 44。",
    },
    {
      type: "100以内数的认识",
      question: "一个数的个位上是 2，十位上是 1，这个数是？",
      options: numberOptions(12, 5, 0, 100),
      answer: "12",
      explanation: "十位是 1，表示 1 个十；个位是 2，表示 2 个一，合起来是 12。",
    },
    {
      type: "100以内数的认识",
      question: "20 根小棒，每 10 根捆成一捆，可以捆成几捆？",
      options: numberOptions(2, 6, 0, 10),
      answer: "2",
      explanation: "20 里面有 2 个 10，所以可以捆成 2 捆。",
      visual: {
        caption: "每 10 根一捆",
        rows: [Array.from({ length: 10 }, () => "丨"), Array.from({ length: 10 }, () => "丨")],
      },
    },
    {
      type: "100以内简单加减",
      question: "9 ○ 4 = 13，○ 里填什么？",
      options: textOptions("+", ["-", "=", "都不是"], 7),
      answer: "+",
      explanation: "9 + 4 = 13，所以填加号。",
    },
    {
      type: "100以内简单加减",
      question: "12 ○ 6 = 18，○ 里填什么？",
      options: textOptions("+", ["-", "=", "都不是"], 8),
      answer: "+",
      explanation: "12 + 6 = 18，所以填加号。",
    },
    {
      type: "100以内简单加减",
      question: "70 ○ 10 = 60，○ 里填什么？",
      options: textOptions("-", ["+", "=", "都不是"], 9),
      answer: "-",
      explanation: "70 - 10 = 60，所以填减号。",
    },
    {
      type: "100以内简单加减",
      question: "18 ○ 9 = 9，○ 里填什么？",
      options: textOptions("-", ["+", "=", "都不是"], 10),
      answer: "-",
      explanation: "18 - 9 = 9，所以填减号。",
    },
    {
      type: "100以内简单加减",
      question: "80 ○ 20 = 60，○ 里填什么？",
      options: textOptions("-", ["+", "=", "都不是"], 11),
      answer: "-",
      explanation: "80 - 20 = 60，所以填减号。",
    },
    {
      type: "100以内简单加减",
      question: "30 ○ 40 = 70，○ 里填什么？",
      options: textOptions("+", ["-", "=", "都不是"], 12),
      answer: "+",
      explanation: "30 + 40 = 70，所以填加号。",
    },
    {
      type: "100以内简单加减",
      question: "17 - （ ） = 8，括号里填几？",
      options: numberOptions(9, 13, 0, 20),
      answer: "9",
      explanation: "想 8 加几等于 17，8 + 9 = 17，所以括号里填 9。",
    },
    {
      type: "100以内简单加减",
      question: "（ ） - 2 = 12，括号里填几？",
      options: numberOptions(14, 14, 0, 30),
      answer: "14",
      explanation: "想几减 2 等于 12，12 + 2 = 14。",
    },
    {
      type: "100以内简单加减",
      question: "（ ） + 20 = 90，括号里填几？",
      options: numberOptions(70, 15, 0, 100, 10),
      answer: "70",
      explanation: "想几加 20 等于 90，90 - 20 = 70。",
    },
    {
      type: "100以内简单加减",
      question: "8 + （ ） = 11，括号里填几？",
      options: numberOptions(3, 16, 0, 20),
      answer: "3",
      explanation: "想 8 加几等于 11，8 + 3 = 11。",
    },
    {
      type: "100以内简单加减",
      question: "10 + （ ） = 84，括号里填几？",
      options: numberOptions(74, 17, 0, 100),
      answer: "74",
      explanation: "想几加 10 等于 84，84 - 10 = 74。",
    },
    {
      type: "100以内简单加减",
      question: "（ ） - 12 = 30，括号里填几？",
      options: numberOptions(42, 18, 0, 100),
      answer: "42",
      explanation: "想几减 12 等于 30，30 + 12 = 42。",
    },
    {
      type: "大小比较",
      question: "13 - 8 ○ 47 - 40，○ 里填什么？",
      options: textOptions("<", [">", "=", "都不是"], 19),
      answer: "<",
      explanation: "13 - 8 = 5，47 - 40 = 7，5 小于 7，所以填 <。",
    },
    {
      type: "大小比较",
      question: "43 + 50 ○ 53 + 40，○ 里填什么？",
      options: textOptions("=", [">", "<", "都不是"], 20),
      answer: "=",
      explanation: "43 + 50 = 93，53 + 40 = 93，两边一样大，所以填 =。",
    },
    {
      type: "大小比较",
      question: "12 - 8 ○ 18 - 2，○ 里填什么？",
      options: textOptions("<", [">", "=", "都不是"], 21),
      answer: "<",
      explanation: "12 - 8 = 4，18 - 2 = 16，4 小于 16，所以填 <。",
    },
    {
      type: "大小比较",
      question: "14 - 6 ○ 60 - 50，○ 里填什么？",
      options: textOptions("<", [">", "=", "都不是"], 22),
      answer: "<",
      explanation: "14 - 6 = 8，60 - 50 = 10，8 小于 10，所以填 <。",
    },
    {
      type: "大小比较",
      question: "22 + 33 ○ 11 + 44，○ 里填什么？",
      options: textOptions("=", [">", "<", "都不是"], 23),
      answer: "=",
      explanation: "22 + 33 = 55，11 + 44 = 55，两边一样大，所以填 =。",
    },
    {
      type: "大小比较",
      question: "35 + 10 ○ 53 - 10，○ 里填什么？",
      options: textOptions(">", ["<", "=", "都不是"], 24),
      answer: ">",
      explanation: "35 + 10 = 45，53 - 10 = 43，45 大于 43，所以填 >。",
    },
    {
      type: "大小比较",
      question: "32 + 52 ○ 83 - 52，○ 里填什么？",
      options: textOptions(">", ["<", "=", "都不是"], 25),
      answer: ">",
      explanation: "32 + 52 = 84，83 - 52 = 31，84 大于 31，所以填 >。",
    },
    {
      type: "大小比较",
      question: "47 - 7 ○ 100 - 50，○ 里填什么？",
      options: textOptions("<", [">", "=", "都不是"], 26),
      answer: "<",
      explanation: "47 - 7 = 40，100 - 50 = 50，40 小于 50，所以填 <。",
    },
    {
      type: "大小比较",
      question: "15 - 7 ○ 12 - 5，○ 里填什么？",
      options: textOptions(">", ["<", "=", "都不是"], 27),
      answer: ">",
      explanation: "15 - 7 = 8，12 - 5 = 7，8 大于 7，所以填 >。",
    },
  ];

  return addIds("paper-number-operation", drafts);
}

export const questions: MathQuestion[] = [
  ...buildAdditionQuestions(),
  ...buildSubtractionQuestions(),
  ...buildNumberQuestions(),
  ...buildCompareQuestions(),
  ...buildSimpleAddSubQuestions(),
  ...buildMoneyQuestions(),
  ...buildPatternQuestions(),
  ...buildObservationQuestions(),
  ...buildShapeQuestions(),
  ...buildWordProblemQuestions(),
  ...buildExamPaperQuestions(),
];
