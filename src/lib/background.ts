const GRADIENT = /^\s*(repeating-)?(linear|radial|conic)-gradient\(/;

/**
 * Converte o campo `image` em um valor válido para a propriedade CSS `background`.
 * - gradientes (ex.: "linear-gradient(...)") são usados como estão;
 * - qualquer outra string é tratada como URL de imagem;
 * - sem imagem, usa o fallback.
 */
export function toBackground(
  image?: string,
  fallback = "linear-gradient(135deg, #003366, #1E293B)"
): string {
  if (!image) return fallback;
  if (GRADIENT.test(image)) return image;
  return `url("${image}") center/cover no-repeat`;
}
