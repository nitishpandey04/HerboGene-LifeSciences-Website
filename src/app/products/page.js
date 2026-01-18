import { products } from "../../data/products";
import SectionTitle from "../../components/SectionTitle";
import ProductCard from "../../components/ProductCard";

export default function Products() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our Premium Product Range"
          subtitle="Crafted for Wellness"
        />
        <div className="text-center max-w-3xl mx-auto mb-16 text-text-muted">
          <p>
            At HerboGene LifeSciences, we pride ourselves on offering a diverse range of premium quality herbal and nutraceutical medicines. Each product is crafted with the utmost care and precision, adhering to the highest standards of quality and safety.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
