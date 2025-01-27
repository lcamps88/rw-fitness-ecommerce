import {Link} from '@remix-run/react';
import {Image, type OptimisticCartLine} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/cart/CartMain';
import {useVariantUrl} from '~/lib/variants';
import {useAside} from '~/components/Aside';
import {ProductPrice} from '~/components/ProductPrice';
import CartLineQuantityAdjustor from '~/components/cart/CartLineQuantityAdjustor';
import CartLineRemoveButton from '~/components/cart/CartLineRemoveButton';
import CartLineUpdateButton from '~/components/cart/CartLineUpdateButton';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <div className="flex gap-4 py-6 border-b border-gray-100">
      {/* Product Image */}
      <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            className="object-cover w-full h-full"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={close}
          className="block"
        >
          <h3 className="font-playfair text-base text-navy truncate mb-1">
            {product.title}
          </h3>
        </Link>
        {/* Product Options */}
        <div className="mt-1 space-y-1">
          {selectedOptions.map((option) => (
            <p
              key={`${product.id}-${option.name}`}
              className="font-source text-sm text-gray-500"
            >
              {option.name}: {option.value}
            </p>
          ))}
        </div>
        {/* Price & Quantity Control */}
        <div className="mt-4 flex items-center justify-between">
          <CartLineQuantityAdjustor line={line} />
          <div className="font-source font-medium">
            <ProductPrice price={line?.cost?.totalAmount} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity">
      <small>Quantity: {quantity} &nbsp;&nbsp;</small>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
        >
          <span>&#8722; </span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
      <CartLineRemoveButton lineIds={[lineId]} disable={!isOptimistic} />
    </div>
  );
}
