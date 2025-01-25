import {useAside} from '~/components/Aside';
import {Link} from '@remix-run/react';
import type {CartMainProps} from '~/components/cart/CartMain';
import {ArrowRight, ShoppingBag} from 'lucide-react';

const CartEmpty = ({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) => {
  const {close} = useAside();

  if (hidden) return null;

  return (
    <div className={`h-full flex flex-col items-center justify-center p-6`}>
      {/* Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-cream rounded-full scale-[1.8] blur-xl opacity-50"></div>
        <div className="relative w-20 h-20 bg-cream rounded-full flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-navy" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md space-x-4 text-center">
        <h2 className="font-playfair text-2xl text-navy ">
          Your Shopping Cart is Empty
        </h2>
        <p className="font-source text-gray-400 leading-relaxed">
          Discover our collection of handcrafted footwear, where traditional
          srtisnship meets contemporary elegance.
        </p>

        {/* Primary CTA */}

        <Link
          to="/collections/all"
          onClick={close}
          prefetch="intent"
          className="inline-flex font-source items-center justify-center mx-auto px-8 py-4 mt-6 bg-navy text-white font-medium hover:bg-navyLight transition-all duration-300"
        >
          Explore Our Products
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>

        {/* Collection/ All CTA */}
        <div className="pt-8 space-y-3 border-t border-gray-100 mt-8">
          <p className="font-source text-base text-gray-400 uppercase tracking-wide">
            Featured Products
          </p>
          <div className="text-sm">
            <Link
              to="/collections/all"
              onClick={close}
              prefetch="intent"
              className="text-gold hover:text-goldDark transition-colors duration-300"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-sm text-gray-500 pt-6">
          <p>Need assistace? Contact our Shop</p>
          <a
            href="mailto:info@rwfitness.com"
            className="font-source text-gold hover:text-goldDark transition-colors duration-300"
          >
            info@rwfitness.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default CartEmpty;
