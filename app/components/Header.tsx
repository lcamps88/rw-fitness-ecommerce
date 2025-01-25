import {Suspense, useState, useEffect} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Menu, Search, ShoppingBag, User} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;

  const [isScrolled, setisScrolled] = useState(false);
  const [isScrollingUp, setisScrollingUp] = useState(false);
  const [lastScrollY, setlastScrollY] = useState(0);
  const {type: asideType} = useAside();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      '--announcement-height',
      isScrolled ? '0px' : '40px',
    );
    root.style.setProperty('--header-height', isScrolled ? '64px' : '80px');

    const handleScroll = () => {
      if (asideType !== 'closed') return;
      const currentScrollY = window.scrollY;
      setisScrollingUp(currentScrollY < lastScrollY);
      setlastScrollY(currentScrollY);
      setisScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isScrolled, asideType]);

  return (
    <div
      className={`fixed w-full z-40 transition-transform duration-500 ${
        isScrollingUp && isScrolled && asideType === 'closed'
          ? '-translate-y-full'
          : 'translate-y-0'
      }`}
    >
      {/* Announcement Bar */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out bg-navy text-white ${
          isScrolled ? 'max-h-0' : 'masx-h-12'
        }`}
      >
        <div className="container mx-auto text-center py-2.5 px-4">
          <p className="font-source text-[13px] leading-tight sm:text-sm font-light tracking-wider">
            Complimentary Shipping onder Order Above $500.00
          </p>
        </div>
      </div>
      <header
        className={`transition-all duration-500 ease-out border-b ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-sm border-transparent'
            : 'bg-white border-gray-100'
        }`}
      >
        <div className="container mx-auto py-3">
          {/* Mobile Logo (550px and below)*/}
          <div
            className={`hidden max-[550px]:block text-center border-b border-gray-100 transition-all duration-300 ease-in-out ${isScrolled} ? 'py-2' : 'py-3'`}
          >
            <NavLink
              prefetch="intent"
              to="/"
              className="font-playfair text-2xl tracking-normal inline-block"
            >
              <h1 className="font-medium mt mb-3">{shop.name}</h1>
            </NavLink>
          </div>
          {/* Header Content */}
          <div
            className={`flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ease-in-out ${
              isScrolled ? 'py-3 sm:py-4' : 'py-2'
            }`}
          >
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden ">
              <HeaderMenuMobileToggle />
            </div>
            {/* Logo (Above 550px) */}
            <NavLink
              prefetch="intent"
              to="/"
              className={`font-playfair tracking-wider text-center max-[550px]:hidden absolute left-1/2 lg:static lg:translate-x-0 lg:text-left transition-all duration-300 ease-in-out ${
                isScrolled ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-[28px]'
              }`}
            >
              <h1 className="font-playfair font-medium">RW Fitness</h1>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:block flex-1-px-12">
              <HeaderMenu
                menu={menu}
                viewport="desktop"
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            </div>
            {/* CTAS */}
            <div className="flex items-center">
              <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  const baseClassName =
    "transition-all duration-200 hover:text-gold font-source relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full";
  const desktopClassName =
    'flex items-center justify-between space-12 text-sm uppercase tracking-wider gap-5';
  const mobileClassName = 'flex flex-col px-6';

  return (
    <nav
      className={viewport === 'desktop' ? desktopClassName : mobileClassName}
      role="navigation"
    >
      {viewport === 'mobile' && (
        <>
          {/* Mobile Navigation Links */}
          <div className="space-y-6 py-4">
            {menu?.items.map((item) => {
              if (!item.url) return null;
              const url =
                item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) || //rw.com/collections
                item.url.includes(primaryDomainUrl) //store.rw.com/collections
                  ? new URL(item.url).pathname // -->/collections
                  : item.url; //google.com

              return (
                <NavLink
                  className={({isActive}) =>
                    `${baseClassName} text-lg py-1 block ${
                      isActive ? 'text-gold' : 'text-navy'
                    }`
                  }
                  end
                  key={item.id}
                  onClick={close}
                  prefetch="intent"
                  to={url}
                >
                  {item.title}
                </NavLink>
              );
            })}
          </div>
          {/* Mobile Footer Links */}
          <div className="mt-auto border-t border-gray-100 py-6">
            <div className="space-y-4">
              <NavLink
                to="/account"
                className="flex items-center space-x-2 text-navy hover:text-gold"
              >
                <User className="w-5 h-5" />
                <span className="font-source text-base">Account</span>
              </NavLink>
              <button
                onClick={() => {
                  close();
                  //todo search logic
                }}
                className="flex items-center space-x-2 text-navy hover:text-gold w-full text-left "
              >
                <Search className="w-5 h-5" />
                <span className="font-source text-base">Search</span>
              </button>
            </div>
          </div>
        </>
      )}
      {viewport === 'desktop' &&
        // Desktop Menu
        menu?.items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) || //rw.com/collections
            item.url.includes(primaryDomainUrl) //store.rw.com/collections
              ? new URL(item.url).pathname // -->/collections
              : item.url; //google.com

          return (
            <NavLink
              className={({isActive}) =>
                `${baseClassName} ${isActive ? 'text-gold' : 'text-navy'}`
              }
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav
      className="flex items-center space-x-2 sm:space-x-3 lg:space-x-8"
      role="navigation"
    >
      <SearchToggle />
      <NavLink
        prefetch="intent"
        to="/account"
        className="hover:text-gold transition-all duration-200 p-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
      >
        <User className="w-6 h-6" />
        <span className="sr-only">Account</span>
      </NavLink>
      <div className="pl-0 sm:pl-2">
        <CartToggle cart={cart} />
      </div>
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="p-2 -ml-2 hover:text-gold transition-colors duration-200"
      onClick={() => open('mobile')}
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="p-2 hover:text-gold transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
      onClick={() => open('search')}
    >
      <Search className="w-6 h-6" />
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className="relative p-2 hover:text-gold transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      <ShoppingBag className="w-5 h-5" />
      {count !== null && count > 0 && (
        <span className="absolute top-1 right-1 bg-gold text-white text-[12px] rounded-full w-4 h-4 font-medium items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}
