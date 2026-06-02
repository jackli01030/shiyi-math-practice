import { customPinyin, pinyin } from "pinyin-pro";

interface PinyinTextProps {
  text: string;
  className?: string;
}

interface PinyinToken {
  origin: string;
  pinyin: string;
  isZh: boolean;
}

customPinyin({
  数一数: "shǔ yì shǔ",
  一行: "yì háng",
  一样多: "yí yàng duō",
  看不出来: "kàn bù chū lái",
  都不是: "dōu bú shì",
  找回: "zhǎo huí",
});

export function PinyinText({ text, className }: PinyinTextProps) {
  const tokens = pinyin(text, {
    toneType: "symbol",
    toneSandhi: true,
    type: "all",
  }) as PinyinToken[];
  const hasPinyin = tokens.some((token) => token.isZh && token.pinyin);

  return (
    <span className={["pinyin-text", className].filter(Boolean).join(" ")}>
      {tokens.map((token, index) => {
        if (token.isZh && token.pinyin) {
          return (
          <ruby className="pinyin-ruby" key={`${token.origin}-${index}`}>
            <span className="pinyin-hanzi">{token.origin}</span>
            <rt>{token.pinyin}</rt>
          </ruby>
          );
        }

        if (hasPinyin && token.origin.trim()) {
          return (
            <span className="pinyin-non-hanzi" key={`${token.origin}-${index}`}>
              <span className="pinyin-main">{token.origin}</span>
              <span className="pinyin-spacer" aria-hidden="true">
                &nbsp;
              </span>
            </span>
          );
        }

        return (
          <span className="pinyin-plain" key={`${token.origin}-${index}`}>
            {token.origin}
          </span>
        );
      })}
    </span>
  );
}
