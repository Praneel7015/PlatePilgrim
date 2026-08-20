import type { ReactNode } from "react";

interface Props {
  text: string;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let i = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={`${keyPrefix}-b-${i++}`}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<em key={`${keyPrefix}-i-${i++}`}>{token.slice(1, -1)}</em>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** Lightweight markdown for Bedrock recipe text: headings, bold, lists. */
export default function RecipeMarkdown({ text }: Props) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let list: { type: "ol" | "ul"; items: string[] } | null = null;
  let key = 0;

  function flushList() {
    if (!list) return;
    const Tag = list.type;
    blocks.push(
      <Tag key={`l-${key++}`} className="recipe-list">
        {list.items.map((item, idx) => (
          <li key={idx}>{renderInline(item, `li-${key}-${idx}`)}</li>
        ))}
      </Tag>
    );
    list = null;
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }

    const ol = line.match(/^\d+[.)]\s+(.*)$/);
    const ul = line.match(/^[-*•]\s+(.*)$/);
    if (ol) {
      if (list?.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(ol[1]);
      continue;
    }
    if (ul) {
      if (list?.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(ul[1]);
      continue;
    }

    flushList();

    const heading = line.match(/^#{1,3}\s+(.*)$/);
    if (heading) {
      blocks.push(<h4 key={`h-${key++}`} className="recipe-h">{renderInline(heading[1], `h-${key}`)}</h4>);
      continue;
    }

    blocks.push(<p key={`p-${key++}`} className="recipe-p">{renderInline(line, `p-${key}`)}</p>);
  }
  flushList();

  return <div className="recipe-md">{blocks}</div>;
}

const SKIP_DISH_LABEL = /^(ingredients|cooking tips?|instructions|directions|steps|method|tips|beginner recipe|you will need):?$/i;

export function extractDishName(recipe?: string): string | null {
  if (!recipe) return null;
  for (const match of recipe.matchAll(/\*\*([^*]+)\*\*/g)) {
    const value = match[1].replace(/^[#\s]+/, "").trim();
    if (value && !SKIP_DISH_LABEL.test(value)) return value;
  }
  const heading = recipe.match(/^#+\s+(.+)$/m);
  const headingValue = heading?.[1]?.trim();
  if (headingValue && !SKIP_DISH_LABEL.test(headingValue)) return headingValue;
  return null;
}
