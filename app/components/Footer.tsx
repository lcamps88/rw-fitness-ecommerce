import {Suspense} from 'react';
import {Await, Form, NavLink} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapIcon,
  Phone,
} from 'lucide-react';
import {useAside} from './Aside';
import {Image} from '@shopify/hydrogen';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-navy text-white">
            {/* Newletter Section */}
            <div className="border-b border-white/10">
              <div className="container mx-auto x-4 py-12">
                <div className="mx-auto max-w-xl text-center">
                  <h2 className="font-playfair text-2xl text-white mb-4">
                    Join the RW Fitness
                  </h2>
                  <p className="font-source text-sm text-gray-500 mb-6">
                    Subscriber to receive exclusive offers
                  </p>
                  <Form className="flex flex-wrap gap-4 px-4 justify-center">
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      className="flex-1 px-4 py-3 bg-white/10 border-white/20 rounded-md text-white font-source placeholder:text-gray-400"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gold hover:bg-goldDark rounded-md transition-colors duration-300 font-source"
                    >
                      Subscribe
                    </button>
                  </Form>
                </div>
              </div>
            </div>
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand Columns */}
                <div className="space-y-6">
                  <div className="p-1 bg-gold rounded-full w-[100px] h-[100px]  flex items-center justify-center">
                    <Image
                      alt="home 2"
                      className="w-full object-cover rounded-full h-full"
                      data={{
                        url: '/images/Logo.png',
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <h3 className="font-playfair text-2xl ml-2">PSL Mug</h3>
                  </div>
                  <p className="font-source text-sm text-gray-300 leading-relaxed">
                    {' '}
                    Modern Designed for distintion
                  </p>
                  <div className="flex space-x-4">
                    <a
                      href="facebook.com"
                      className="text-white/80 hover:text-gold transition-colors duration-300"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="Instagram.com">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="Linkedin.com">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                {/* Contact Column */}
                <div className="space-y-6">
                  <h4 className="font-playfair text-xl">Contact Us</h4>
                  <ul className="space-y-4 font-source text-sm text-gray-400">
                    <li className="flex items-start space-x-3">
                      <MapIcon className="w-5 h-5 text-gold flex-shrink-0 cursor-pointer" />
                      <span>123 Address City Country</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-gold flex-shrink-0 cursor-pointer" />
                      <span>+1(888 123-4567)</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-gold flex-shrink-0 cursor-pointer" />
                      <span>info@rwfitness.com</span>
                    </li>
                  </ul>
                </div>

                {/* Quick links */}
                <div className="space-y-6">
                  <h4 className="font-playfair text-xl">Quick Links</h4>
                  <ul className="space-y-4 font-source text-sm text-gray-400">
                    <li className="flex items-start space-x-3">
                      <NavLink
                        to="/collections/All"
                        className="text-gray-300 hover:text-gold transition-colors duration-300"
                      >
                        Products
                      </NavLink>
                    </li>
                    <li className="flex items-start space-x-3">
                      <NavLink
                        to="/pages/care-guide"
                        className="text-gray-300 hover:text-gold transition-colors duration-300"
                      >
                        Care Guide
                      </NavLink>
                    </li>
                    <li className="flex items-start space-x-3">
                      <NavLink
                        to="/pages.about-us"
                        className="text-gray-300 hover:text-gold transition-colors duration-300"
                      >
                        About Us
                      </NavLink>
                    </li>
                  </ul>
                </div>

                {/* Policies Columns */}
                <div className="space-y-6">
                  <h4 className="font-playfair text-xl">Polices</h4>
                  <FooterMenu
                    menu={footer?.menu}
                    primaryDomainUrl={header.shop.primaryDomain.url}
                    publicStoreDomain={publicStoreDomain}
                  />
                </div>
              </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-white/10">
              <div className="container px-4 py-6 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <p className="font-source text-sm text-gray-400">
                    © {new Date().getFullYear()} RW-Fitness. All right reserved
                  </p>
                  <p className="font-source text-sm text-gray-400">
                    Created by LisyTech
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  const {close} = useAside();
  return (
    <nav className="space-y-3 font-source text-sm" role="navigation">
      {menu?.items.map((item) => {
        if (!item.url) {
          return null;
        }
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) || //rw.com/collections
          item.url.includes(primaryDomainUrl) //store.rw.com/collections
            ? new URL(item.url).pathname // -->/collections
            : item.url; //google.com

        return (
          <NavLink
            className={({isActive}) =>
              `block text-gold hover:text-goldDrark transition-colors duration-300 ${
                isActive ? 'text-gold' : ''
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
    </nav>
    // <nav className="footer-menu" role="navigation">
    //   {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
    //     if (!item.url) return null;
    //     // if the url is internal, we strip the domain
    //     const url =
    //       item.url.includes('myshopify.com') ||
    //       item.url.includes(publicStoreDomain) ||
    //       item.url.includes(primaryDomainUrl)
    //         ? new URL(item.url).pathname
    //         : item.url;
    //     const isExternal = !url.startsWith('/');
    //     return isExternal ? (
    //       <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
    //         {item.title}
    //       </a>
    //     ) : (
    //       <NavLink
    //         end
    //         key={item.id}
    //         prefetch="intent"
    //         style={activeLinkStyle}
    //         to={url}
    //       >
    //         {item.title}
    //       </NavLink>
    //     );
    //   })}
    // </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
