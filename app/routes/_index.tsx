import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ArrowRight, Star} from 'lucide-react';
import ProductItem from '~/components/ProductItem';

export const meta: MetaFunction = () => {
  return [{title: 'PSL Mug | Home'}];
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
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] bg-navy pt-48 pb-20">
        <Image
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="eager"
          alt="Hero Mug"
          data={{
            url: '/images/chelsey-horne.webp',
            width: 1920,
            height: 1080,
          }}
        />
        <div className="relative container mx-auto px-4 h-full flex items-center text-white">
          <div className="max-w-2xl">
            <h1 className="font-playfair text-4xl md:text-6xl mb-6">
              Crafted Mugs for the Everyday Connoisseur
            </h1>
            <p className="font-source text-lg text-gray-200 mb-8">
              Handcrafted excellence, designed for distinction
            </p>
            <Link
              to="/collections/all"
              className="inline-flex items-center px-8 py-4 bg-gold hover:bg-goldDark transition-colors duration-300 rounded-md"
            >
              Explore Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
      {/* Recomended Products */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="font-playfair text-navy text-4xl text-center mb-12">
            Our Lastesr Products
          </h2>
          <div>
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Array.from({length: 4}).map((_, i) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={`skeleton-${i}`}
                      className="flex flex-wrap gap-4 animate-pulse"
                    >
                      <div className="w-20 h-20 bg-gray-200 rounded" />
                      <div className="w-20 h-20 bg-gray-200 rounded" />
                      <div className="w-20 h-20 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              }
            >
              <Await resolve={data.recommendedProducts}>
                {(response) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {response?.products.nodes.map((product) => (
                      <ProductItem
                        key={product.id}
                        product={product}
                        loading="lazy"
                        //hidePrice
                      />
                    ))}
                  </div>
                )}
              </Await>
            </Suspense>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}

      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                alt="Craftsmanship"
                className="w-full h-[30rem] lg:h-[40rem] object-cover"
                data={{
                  url: '/images/drew-williams.webp',
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

      {/* Testimonials Section */}
      <div className="pt-20 px-4 bg-navy text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            {Array.from({length: 5}).map((_, i) => (
              <Star
                // eslint-disable-next-line react/no-array-index-key
                key={`start-${i}`}
                fill="#C3A343"
                color="#C3A343"
                className="w-8 h-8"
              />
            ))}
          </div>
          <blockquote className="font-playfair text-2xl md:text-3xl mb-8">
            &quot;Absolutely love this mug! The design is vibrant, and it keeps
            my coffee warm for hours.&quot;
          </blockquote>
          <cite className="font-source text-gray-300 not-italic">
            – Emily R.
          </cite>
        </div>
      </div>
    </div>
  );
}

// function FeaturedCollection({
//   collection,
// }: {
//   collection: FeaturedCollectionFragment;
// }) {
//   if (!collection) return null;
//   const image = collection?.image;
//   return (
//     <Link
//       className="featured-collection"
//       to={`/collections/${collection.handle}`}
//     >
//       {image && (
//         <div className="featured-collection-image">
//           <Image data={image} sizes="100vw" />
//         </div>
//       )}
//       <h1>{collection.title}</h1>
//     </Link>
//   );
// }

// function RecommendedProducts({
//   products,
// }: {
//   products: Promise<RecommendedProductsQuery | null>;
// }) {
//   return (
//     <div className="recommended-products">
//       <h2 className="text-navy">Recommended Products</h2>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Await resolve={products}>
//           {(response) => (
//             <div className="recommended-products-grid">
//               {response
//                 ? response.products.nodes.map((product) => (
//                     <Link
//                       key={product.id}
//                       className="recommended-product"
//                       to={`/products/${product.handle}`}
//                     >
//                       <Image
//                         data={product.images.nodes[0]}
//                         aspectRatio="1/1"
//                         sizes="(min-width: 45em) 20vw, 50vw"
//                       />
//                       <h4>{product.title}</h4>
//                       <small>
//                         <Money data={product.priceRange.minVariantPrice} />
//                       </small>
//                     </Link>
//                   ))
//                 : null}
//             </div>
//           )}
//         </Await>
//       </Suspense>
//       <br />
//     </div>
//   );
// }

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage{
      id
      altText
      url
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        url
        altText
        width
        height
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
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
