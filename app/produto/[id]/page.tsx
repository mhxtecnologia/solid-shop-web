import { ProductCard } from '@components/layout/ProductCard';

interface ProdutoPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProdutoPage({ params }: ProdutoPageProps) {
    const res = await fetch(`http://localhost:3001/api/products/${(await params).id}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Falha ao buscar produto");

    const produto = await res.json();

    return (
        <ProductCard
            id={produto.product.data.id}
            name={produto.product.data.name}
            category={produto.product.data.category_id}
            description={produto.product.data.description}
            price={produto.product.data.price}
            promotionalPrice={produto.product.data.promotion}
            imageUrl={produto.product.data.photo}
            rating={4.5}
            reviewsCount={128}
        />
    );
}