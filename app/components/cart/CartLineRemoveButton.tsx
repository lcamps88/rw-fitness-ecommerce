import {CartForm} from '@shopify/hydrogen';
import {X} from 'lucide-react';

type CartLineRemoveButtonProps = {
  lineIds: string[];
  disable: boolean;
};
const CartLineRemoveButton = ({
  lineIds,
  disable,
}: CartLineRemoveButtonProps) => {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disable}
        className={`ml-3 text-gray-400 hover:border-gray-500 transition-colors duration-300 ${
          disable ? 'opacity-50 cursor-not-allowed' : ''
        } `}
      >
        <X className="w-4 h-4" />
      </button>
    </CartForm>
  );
};

export default CartLineRemoveButton;
