import type { TrustedTypePolicy } from 'trusted-types/lib';

export let defaultTrustedTypePolicy: Pick<
  TrustedTypePolicy<{
    createHTML: (input: string) => string;
    createScriptURL: (input: string) => string;
    createScript: (input: string) => string;
  }>,
  'name' | 'createHTML' | 'createScript' | 'createScriptURL'
>;

const ALLOWED_TAGS = new Set([
  'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span', 'div',
  'ul', 'ol', 'li', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
]);

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

const sanitizeHtml = (input: string): string => {
  return input.replace(/<[^>]*>/g, (match) => {
    const tagName = match.match(/<\/?\s*([a-zA-Z0-9]+)/)?.[1]?.toLowerCase();
    if (tagName && ALLOWED_TAGS.has(tagName)) {
      if (match.startsWith('</')) {
        return match;
      }
      const safeAttrs = match.replace(
        /(\s+(href|src|class|id|style|title|alt)\s*=\s*"[^"]*")/gi,
        (attr) => {
          const urlMatch = attr.match(
            /(?:href|src)\s*=\s*"([^"]*)"/i,
          );
          if (urlMatch) {
            try {
              const url = new URL(urlMatch[1], 'https://music.youtube.com');
              if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
                return '';
              }
            } catch {
              return '';
            }
          }
          return attr;
        },
      );
      const cleanAttrs = safeAttrs.replace(
        /\s+(on\w+|style|id)\s*=\s*"[^"]*"/gi,
        '',
      );
      return cleanAttrs;
    }
    return '';
  });
};

export const registerWindowDefaultTrustedTypePolicy = () => {
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    defaultTrustedTypePolicy = window.trustedTypes.createPolicy('default', {
      createHTML: (input) => sanitizeHtml(input),
      createScriptURL: (input) => input,
      createScript: (_input) => '',
    });
  }
};
