import {CartForm} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {Loader2} from 'lucide-react';
import React, {useState, useEffect} from 'react';

type CartLineUpdateButtonProps = {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
};

const CartLineUpdateButton = ({lines, children}: CartLineUpdateButtonProps) => {
  const [updating, setUpdating] = useState<boolean>(false);

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {(fetcher) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (fetcher.state === 'loading') {
            setUpdating(true);
          } else if (fetcher.state === 'idle') {
            setTimeout(() => setUpdating(false), 200);
          }
        }, [fetcher.state]);

        if (updating) {
          return (
            <div className="relative inline-flex items-center justify-center">
              <div className="opacity-50 pointer-events-none">{children}</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-gold animate-spin" />
              </div>
            </div>
          );
        }
        return children;
      }}
    </CartForm>
  );
};

export default CartLineUpdateButton;
