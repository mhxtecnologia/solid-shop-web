import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProductGrid } from './ProductGrid';
import type { Product } from '@/types/product';

const product = (overrides: Partial<Product>): Product => ({
  id: 1,
  name: 'Wireless Headphones',
  price: 899.9,
  promotion: null,
  description: null,
  photo: null,
  stock: null,
  category_id: null,
  ...overrides,
});

describe('ProductGrid', () => {
  it('links each product to its detail page', () => {
    render(<ProductGrid products={[product({ id: 3, name: 'Keyboard' })]} />);

    expect(screen.getByRole('link', { name: /keyboard/i })).toHaveAttribute('href', '/produto/3');
  });

  it('shows the promotional price and strikes the original one', () => {
    render(<ProductGrid products={[product({ price: 100, promotion: 80 })]} />);

    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent(/R\$\s80,00/);
    expect(item).toHaveTextContent(/R\$\s100,00/);
  });

  it('renders an empty state', () => {
    render(<ProductGrid products={[]} />);

    expect(screen.getByText('Nenhum produto disponível no momento.')).toBeInTheDocument();
  });
});
