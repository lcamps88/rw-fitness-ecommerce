import type {FetcherWithComponents} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {Loader2, Ticket} from 'lucide-react';
import {useRef, useState} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

const CartGiftCard = ({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const appliedGiftCardCode = useRef<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const codes: string[] =
    giftCardCodes?.map(({lastCharacters}) => `...${lastCharacters} `) || [];

  const saveAppliedCode = (code: string) => {
    if (!inputRef.current) {
      return null;
    }
    const formattedCode = code.replace(/\s/g, '');
    if (!appliedGiftCardCode.current.includes(formattedCode)) {
      appliedGiftCardCode.current.push(formattedCode);
    }
    inputRef.current.value = '';
    setShowInput(false);
  };

  return (
    <div className="py-4 border-t border-gray-100">
      {/* Applied Discounts */}
      {codes.length > 0 && <div></div>}
      {/* Discount Input */}
      {showInput ? (
        <UpdateGiftCardForm
          giftCardCodes={appliedGiftCardCode.current}
          saveAppliedCode={saveAppliedCode}
        >
          {(fetcher) => {
            // Handle loading State
            const isLoading = fetcher.state !== 'idle';

            return (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    name="giftCardCode"
                    placeholder="Enter gift card code"
                    className="px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-navy font-source text-sm"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 bg-navy text-white rounded text-sm font-source transition-colors duration-300 ${
                      isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-navyLight'
                    }`}
                    type="submit"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInput(false)}
                    className="px-4 py-2 bg-gray-200 rounded text-sm font-source hover:bg-gray-300 transition-colors duration-300"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }}
        </UpdateGiftCardForm>
      ) : (
        <button
          className="text-sm text-gold hover:text-goldDark font-source transition-colors inline-flex items-center gap-2"
          onClick={() => setShowInput(true)}
        >
          <Ticket className="w-4 h-4" />
          Add Gift Card
        </button>
      )}
    </div>
  );
};

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode | ((fetcher: any) => React.ReactNode);
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return typeof children === 'function' ? children(fetcher) : children;
      }}
    </CartForm>
  );
}

export default CartGiftCard;
