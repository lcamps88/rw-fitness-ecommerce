import {Link, useNavigate} from '@remix-run/react';
import {RichText, type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import {CircleArrowUp} from 'lucide-react';

export function ProductForm({
  productOptions,
  selectedVariant,
  className,
  product,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  className: string;
  product: ProductFragment;
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="space-y-8">
        {/* variants Options */}
        {productOptions.map((option) => {
          // If there is only a single value in the option values, don't display the option
          if (option.optionValues.length === 1) return null;
          return (
            <div className="product-options" key={option.name}>
              <h5>{option.name}</h5>
              <div className="product-options-grid">
                {option.optionValues.map((value) => {
                  const {
                    name,
                    handle,
                    variantUriQuery,
                    selected,
                    available,
                    exists,
                    isDifferentProduct,
                    swatch,
                  } = value;

                  if (isDifferentProduct) {
                    return (
                      <Link
                        className="product-options-item"
                        key={option.name + name}
                        prefetch="intent"
                        preventScrollReset
                        replace
                        to={`/products/${handle}?${variantUriQuery}`}
                        style={{
                          border: selected
                            ? '1px solid black'
                            : '1px solid transparent',
                          opacity: available ? 1 : 0.3,
                        }}
                      >
                        <ProductOptionSwatch swatch={swatch} name={name} />
                      </Link>
                    );
                  } else {
                    return (
                      <button
                        type="button"
                        className={`product-options-item${
                          exists && !selected ? ' link' : ''
                        }`}
                        key={option.name + name}
                        style={{
                          border: selected
                            ? '1px solid black'
                            : '1px solid transparent',
                          opacity: available ? 1 : 0.3,
                        }}
                        disabled={!exists}
                        onClick={() => {
                          if (!selected) {
                            navigate(`?${variantUriQuery}`, {
                              replace: true,
                              preventScrollReset: true,
                            });
                          }
                        }}
                      >
                        <ProductOptionSwatch swatch={swatch} name={name} />
                      </button>
                    );
                  }
                })}
              </div>
              <br />
            </div>
          );
        })}
        {/* Add to Cart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-source text-navy/60">
              {selectedVariant?.availableForSale
                ? 'Ready to ship'
                : 'Current unavailable'}
            </div>
            {selectedVariant?.sku && (
              <div className="text-sm font-source text-navy/60">
                SKU: {selectedVariant.sku}
              </div>
            )}
          </div>
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            afterAddToCart={() => {
              open('cart');
            }}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: 1,
                      selectedVariant,
                    },
                  ]
                : []
            }
          >
            {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
          </AddToCartButton>
        </div>
        {/* Product Details Accordion */}

        <div className="mt-12 border-t border-navy-10">
          <div className="grid grid-cols-1 divide-y divide-navy/10">
            {/* Material Section */}
            {product.materials?.value && (
              <details className="group py-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-playfair text-2xl text-navy">
                    Materials & Construction
                  </h3>
                  <span>
                    <CircleArrowUp className="relative flex-shrink-0 ml-4 w-6 h-6 transform transition-transform duration-300 group-open:rotate-180" />
                  </span>
                </summary>
                <div className="pt-4 prose font-source text-navy/80">
                  <RichText data={product.materials?.value} />
                  {product.construction?.value && (
                    <div className="mt-4">
                      <h4 className="font-playfair text-xl text-navy/80">
                        Construction
                      </h4>
                      <p>{product.construction.value}</p>
                    </div>
                  )}
                </div>
              </details>
            )}
            {/* Size & Fit Section */}
            {product.sizingNotes?.value && (
              <details className="group py-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-playfair text-2xl text-navy">
                    Size & Fit{' '}
                  </h3>
                  <span>
                    <CircleArrowUp className="relative flex-shrink-0 ml-4 w-6 h-6 transform transition-transform duration-300 group-open:rotate-180" />
                  </span>
                </summary>
                <div className="pt-4 prose font-source text-navy/80">
                  <p>{product.sizingNotes.value}</p>
                </div>
              </details>
            )}

            {/* Cate Instruction */}
            {product.careInstructions?.value && (
              <details className="group py-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-playfair text-2xl text-navy">
                    Care Instructions
                  </h3>
                  <span>
                    <CircleArrowUp className="relative flex-shrink-0 ml-4 w-6 h-6 transform transition-transform duration-300 group-open:rotate-180" />
                  </span>
                </summary>
                <div className="pt-4 prose font-source text-navy/80">
                  <RichText data={product.careInstructions.value} />
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
