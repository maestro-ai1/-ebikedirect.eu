import React from 'react';
import Link from 'next/link';
import { getLocalizedPath, Locale } from '@/lib/i18n';
import { slugify } from '@/lib/blog-content';

export function getToc(body: string): { id: string; text: string }[] {
  return body
    .split('\n')
    .filter((l) => l.startsWith('## '))
    .map((l) => l.replace(/^##\s+/, '').trim())
    .map((text) => ({ id: slugify(text), text }));
}

function renderInline(text: string, locale: Locale, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      out.push(<strong key={`${keyBase}-b${i}`}>{m[2]}</strong>);
    } else {
      const label = m[4];
      const href = m[5];
      if (href.startsWith('/')) {
        out.push(
          <Link key={`${keyBase}-l${i}`} href={getLocalizedPath(href.length > 1 ? href.replace(/\/$/, '') : href, locale)} className="text-[#FF5722] font-semibold underline underline-offset-2 hover:text-[#E64A19]">
            {label}
          </Link>
        );
      } else {
        out.push(
          <a key={`${keyBase}-l${i}`} href={href} target="_blank" rel="noopener noreferrer" className="text-[#131A22] font-semibold underline underline-offset-2 hover:text-[#FF5722]">
            {label}
          </a>
        );
      }
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function ArticleBody({ body, locale }: { body: string; locale: Locale }) {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith('## ')) {
      const text = line.replace(/^##\s+/, '').trim();
      nodes.push(
        <h2 key={k++} id={slugify(text)} className="scroll-mt-24 text-xl sm:text-2xl font-black text-[#131A22] mt-10 mb-3 tracking-tight">
          {text}
        </h2>
      );
      i++; continue;
    }
    if (line.startsWith('### ')) {
      const text = line.replace(/^###\s+/, '').trim();
      nodes.push(
        <h3 key={k++} className="text-base sm:text-lg font-bold text-[#131A22] mt-6 mb-2">
          {text}
        </h3>
      );
      i++; continue;
    }
    if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        const cells = lines[i].split('|').slice(1, -1).map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...rest] = rows;
      nodes.push(
        <div key={k++} className="overflow-x-auto my-4 rounded-lg border border-gray-200">
          <table className="min-w-full text-xs sm:text-sm text-left">
            <thead className="bg-[#131A22] text-white">
              <tr>{head.map((c, ci) => <th key={ci} className="px-3 py-2 font-bold">{renderInline(c, locale, `th${k}-${ci}`)}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rest.map((r, ri) => (
                <tr key={ri}>{r.map((c, ci) => <td key={ci} className="px-3 py-2 align-top text-gray-700">{renderInline(c, locale, `td${k}-${ri}-${ci}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) { items.push(lines[i].replace(/^[-*] /, '')); i++; }
      nodes.push(
        <ul key={k++} className="list-disc pl-5 space-y-1.5 text-gray-700 my-3">
          {items.map((t, ti) => <li key={ti}>{renderInline(t, locale, `ul${k}-${ti}`)}</li>)}
        </ul>
      );
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s+/, '')); i++; }
      nodes.push(
        <ol key={k++} className="list-decimal pl-5 space-y-1.5 text-gray-700 my-3">
          {items.map((t, ti) => <li key={ti}>{renderInline(t, locale, `ol${k}-${ti}`)}</li>)}
        </ol>
      );
      continue;
    }
    if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) { quote.push(lines[i].replace(/^>\s?/, '')); i++; }
      nodes.push(
        <blockquote key={k++} className="border-l-4 border-[#00C853] bg-[#E8F8F0] px-4 py-3 text-gray-800 my-4 rounded-r-lg">
          {renderInline(quote.join(' '), locale, `bq${k}`)}
        </blockquote>
      );
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3} |\||[-*] |\d+\. |> )/.test(lines[i])) { para.push(lines[i]); i++; }
    nodes.push(
      <p key={k++} className="text-gray-700 leading-relaxed my-3">
        {renderInline(para.join(' '), locale, `p${k}`)}
      </p>
    );
  }

  return <div className="text-sm sm:text-[15px] leading-relaxed">{nodes}</div>;
}
