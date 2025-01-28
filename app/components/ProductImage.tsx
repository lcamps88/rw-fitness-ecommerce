import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import {ChevronLeft, ChevronRight, X} from 'lucide-react';

type GalleryImages = {
  id?: string | null;
  altText?: string | null;
  url?: string | null;
  width?: number | null;
  height?: number | null;
};

type ProductImageProps = {
  selectedVariantImage: ProductVariantFragment['image'];
  images: GalleryImages[];
};

const ProductImage = ({selectedVariantImage, images}: ProductImageProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalIndex, setModalIndex] = useState<number>(0);

  const [touchStart, setTouchStart] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setisDragging] = useState<boolean>(false);

  const allImages = selectedVariantImage
    ? [
        selectedVariantImage,
        ...images.filter((img) => img.id !== selectedVariantImage.id),
      ]
    : images;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
    setisDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentTouch = e.targetTouches[0].clientX;
    const offset = currentTouch - touchStart;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const minSwipeDistance = 50;
    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0 && selectedIndex > 0) {
        setSelectedIndex((prev) => prev - 1);
      } else if (dragOffset < 0 && selectedIndex < allImages.length - 1) {
        setSelectedIndex((prev) => prev + 1);
      }
    }
    setisDragging(false);
    setDragOffset(0);
  };

  const getImagePosition = (index: number) => {
    const baseTransform = isDragging ? dragOffset : 0;
    const diff = index - (modalOpen ? modalIndex : selectedIndex);
    return `translate3d(calc(${diff * 100}% + ${baseTransform}px), 0, 0)`;
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };

  if (allImages.length < 1) {
    return (
      <div className="aspect-square bg-cream rounded-lg animate-pulse"></div>
    );
  }

  return (
    <>
      {/* Image Carousel */}
      <div className="space-y-4">
        {/* Main Images Container */}
        <div
          className="aspect-square relative rounded-lg overflow-hidden bg-cream cursor-zoom-in"
          onTouchStart={(e: React.TouchEvent<HTMLDivElement>) =>
            handleTouchStart(e)
          }
          onTouchMove={(e: React.TouchEvent<HTMLDivElement>) =>
            handleTouchMove(e)
          }
          onTouchEnd={handleTouchEnd}
          onClick={() => !isDragging && openModal(selectedIndex)}
        >
          {/* Image Container */}
          <div className="absolute inset-0">
            {allImages.map((image, index) => (
              <div
                className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out ${
                  !isDragging
                    ? 'transition-transform duration-300'
                    : 'transition-none'
                }`}
                style={{transform: getImagePosition(index)}}
                key={image.id || index}
              >
                <Image
                  alt={image.altText || 'Product Image'}
                  data={image}
                  sizes="(min-width: 1024px), 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* Navigation Arrows - Desktop */}
          <div className="absolute inset-0 hidden md:flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (selectedIndex > 0) {
                  setSelectedIndex((prev) => prev - 1);
                }
              }}
              disabled={selectedIndex === 0}
              className="bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-navy" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (selectedIndex < allImages.length - 1) {
                  setSelectedIndex((prev) => prev + 1);
                }
              }}
              disabled={selectedIndex === allImages.length - 1}
              className="bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-navy" />
            </button>
          </div>
        </div>
        {/* Thumbnail Strip */}
        <div className="grid grid-cols-[repeat(auto-fill,_5rem)] gap-4 py-2 px-1">
          {allImages.map((image, index) => (
            <button
              // eslint-disable-next-line react/no-array-index-key
              key={`thumbnail-${index}-${image.id || 'x'}`}
              className={`relative aspect-square w-20 rounded-md overflow-hidden transition-all duration-300 ease-out ${
                selectedIndex === index
                  ? 'ring-2 ring-gold ring-offset-2'
                  : 'hover:ring-2 hover:ring-navy/10 hover:ring-offset-2 opacity-70 hover:opacity-100'
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                alt={image.altText || 'Product Thumbnail'}
                data={image}
                sizes="80px"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
        {/* Dot Indicator */}
        <div className="flex md:hidden justify-center space-x-2 mt-4">
          {allImages.map((_, index) => (
            <button
              // eslint-disable-next-line react/no-array-index-key
              key={`dot-${index}`}
              onClick={() => setSelectedIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? 'bg-gold w-4'
                  : 'bg-navy/20 hover:bg-navy/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal / Popup */}
      {modalOpen && (
        <div className="fixed top-0 left-0 !my-0 inset-0 z-50 backdrop-blur bg-black/20">
          <div className="absolute inset-0 overflow-hidden">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h6" />
            </button>
            {/* Image Counter */}
            <div className="absolute top-4 z-50 left-4">
              <p className="text-white/80 font-source text-sm">
                {`${modalIndex + 1} / ${allImages.length}`}
              </p>
            </div>

            {/* Modal Iamge */}
            <div
              className="w-full h-full p-0 flex items-center md:p-8"
              onTouchStart={(e: React.TouchEvent<HTMLDivElement>) =>
                handleTouchStart(e)
              }
              onTouchMove={(e: React.TouchEvent<HTMLDivElement>) =>
                handleTouchMove(e)
              }
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative w-full h-full flex justify-center items-center">
                {allImages.map((image, index) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`modal-${image.id || 'x'}-${index}`}
                    className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out ${
                      !isDragging
                        ? 'transition-transform duration-300'
                        : 'transition-none'
                    }`}
                    style={{transform: getImagePosition(index)}}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        alt={image.altText || 'Product Image'}
                        data={image}
                        sizes="90vw"
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal navigation arrows */}
            <div className="w-full h-full fixed inset-0 hidden md:flex items-center justify-between px-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (modalIndex > 0) {
                    setModalIndex((prev) => prev - 1);
                  }
                }}
                disabled={modalIndex === 0}
                className="bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (modalIndex < allImages.length - 1) {
                    setModalIndex((prev) => prev + 1);
                  }
                }}
                disabled={modalIndex === allImages.length - 1}
                className="bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ProductImage;
