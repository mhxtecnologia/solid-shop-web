import { describe, expect, it } from 'vitest';
import { effectivePrice, formatPrice, productImageSrc } from './format';

describe('format helpers', () => {
  it('formats BRL currency', () => {
    // Intl usa espaço não separável entre "R$" e o valor.
    expect(formatPrice(1234.5).replace(/\s/g, ' ')).toBe('R$ 1.234,50');
  });

  it.each([
    [100, 80, 80],
    [100, 120, 100],
    [100, null, 100],
  ])('effective price of %d with promotion %p is %d', (price, promotion, expected) => {
    expect(effectivePrice(price, promotion)).toBe(expected);
  });

  it('resolves product images', () => {
    expect(productImageSrc('https://cdn.example.com/a.jpg')).toBe('https://cdn.example.com/a.jpg');
    expect(productImageSrc('a.jpg')).toBe('/images/products/a.jpg');
    expect(productImageSrc(null)).toBe('/images/product-placeholder.svg');
  });
});
