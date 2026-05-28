import { ProductCatalog } from '@/components/products/ProductCatalog';
import { products } from '@/data/products';

export default function ProductsPage(): React.JSX.Element {
  return <ProductCatalog products={products} />;
}
