const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Formata reais no padrão brasileiro (R$ 1.234,56). Instância única, criada uma vez. */
export function formatPrice(value: number): string {
  return brl.format(value);
}

/** Preço efetivo: a promoção só vale quando é menor que o preço cheio (mesma regra da API). */
export function effectivePrice(price: number, promotion: number | null | undefined): number {
  return promotion != null && promotion < price ? promotion : price;
}

/** Aceita URL absoluta (https://...) ou nome de arquivo em /public/images/products. */
export function productImageSrc(photo: string | null | undefined): string {
  if (!photo) return '/images/product-placeholder.svg';
  return /^https?:\/\//.test(photo) ? photo : `/images/products/${photo}`;
}
