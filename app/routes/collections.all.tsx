import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ArrowRight} from 'lucide-react';
import ProductItem from '~/components/ProductItem';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `PSL Mug | Products`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="collection">
      {/* hero Section */}
      <section className="relative h-[80vh] min-h-[550px] bg-navy pt-48 pb-20">
        <div className="absolute inset-0 ">
          <Image
            className="absolute inset-0 w-full h-full object-cover opacity-60 "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
            alt="Hero Mug"
            data={{
              url: '/images/collection-image.jpg',
              width: 1920,
              height: 1080,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/30 to-navy/60"></div>
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center text-white">
          <div className="max-w-2xl">
            <h1 className="font-playfair text-4xl md:text-6xl mb-6">
              Collections
            </h1>
            <p className="font-source text-lg text-gray-200 mb-8">
              Handcrafted excellence, designed for distinction
            </p>
          </div>
        </div>
      </section>

      {/* Collection Navigation */}

      <div className="bg-cream border-y border-navy/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 px-4 gap4">
            <div className="space-y-2">
              <h2 className="font-source text-3xl text-navy">The Collection</h2>
              <p className="font-source text-navy/60">
                Showing {products.nodes.length} handcrafted pieces
              </p>
            </div>

            <div className="flex items-center gap-6">
              <button className="font-source text-sm text-navy/60 hover:text-navy transition-colors">
                Filter
              </button>
              <button className="font-source text-sm text-navy/60 hover:text-navy transition-colors">
                Short
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <PaginatedResourceSection
            connection={products}
            resourcesClassName="grid grid-col md:grid-cols-2 lg:grid-cols-3 gap-16"
          >
            {({node: product, index}) => (
              <ProductItem key={product.id} product={product} loading="lazy" />
            )}
          </PaginatedResourceSection>
        </div>
      </section>

      {/* Craftsmanship section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                alt="Craftsmanship"
                className="w-full h-[30rem] lg:h-[40rem] object-cover"
                data={{
                  url: '/images/lilartsy.webp',
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
            <div className="max-w-xl">
              <h2 className="font-playfair text-3xl mb-6">Coffe Cup</h2>
              <p className="font-source text-gray-600 mb-8 leading-relaxed">
                Enjoy your coffee in style with our premium coffee cup. Designed
                for both comfort and durability, it keeps your drink at the
                perfect temperature while offering a sleek, modern look. Whether
                you&apos;re at home, in the office, or on the go, this cup is
                the perfect companion for your daily coffee ritual.
              </p>
              <Link
                to="/pages/our-mugs"
                className="inline-flex items-center text-navy font-medium hover:text-gold transition-colors duration-300"
              >
                Discover Our Progress
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage banner */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col justify-center items-center">
          <div className="font-playfair text-3xl text-navy mb-6">
            <h3>A Legacy of Distinction</h3>
          </div>
          <p className="font-source text-navy/80 mb-4">
            Enjoy your coffee in style with our premium coffee cup.
          </p>
          <p className="font-source text-navy/60 mb-4">
            Available for private consultation and bespoke commissions
          </p>
        </div>
      </section>
    </div>
    // <section className="py-20 px-4 bg-white">
    //   <div className="container mx-auto pt-28">
    //     <h1 className="font-playfair text-navy text-4xl text-center mb-12">
    //       Products
    //     </h1>
    //     <PaginatedResourceSection
    //       connection={products}
    //       resourcesClassName="products-grid"
    //     >
    //       {({node: product, index}) => (
    //         <ProductItem
    //           key={product.id}
    //           product={product}
    //           loading={index < 8 ? 'eager' : undefined}
    //         />
    //       )}
    //     </PaginatedResourceSection>
    //   </div>
    // </section>
  );
}

// function ProductItem({
//   product,
//   loading,
// }: {
//   product: ProductItemFragment;
//   loading?: 'eager' | 'lazy';
// }) {
//   const variantUrl = useVariantUrl(product.handle);
//   return (
//     <Link
//       className="product-item"
//       key={product.id}
//       prefetch="intent"
//       to={variantUrl}
//     >
//       {product.featuredImage && (
//         <Image
//           alt={product.featuredImage.altText || product.title}
//           aspectRatio="1/1"
//           data={product.featuredImage}
//           loading={loading}
//           sizes="(min-width: 45em) 400px, 100vw"
//         />
//       )}
//       <h4>{product.title}</h4>
//       <small>
//         <Money data={product.priceRange.minVariantPrice} />
//       </small>
//     </Link>
//   );
// }

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first:10){
      nodes{
        id
        altText
        url
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1){
      nodes{
        selectedOptions{
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2024-01/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
