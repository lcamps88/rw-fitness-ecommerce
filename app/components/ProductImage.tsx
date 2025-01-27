import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

type GalleryImages = {
  id?: string;
  altText?: string;
  url?: string;
  width?: number;
  height?: number;
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
        >
          {/* Image Container */}
          <div className="absolute inset-0">
            {allImages.map((image, index) => (
              <div
                className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out ${
                  !isDragging ? 'transition-transform duration-300' : ''
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
          {/* Thumbnail Strip */}
        </div>
      </div>

      {/* Modal / Popup */}
    </>
  );
};
export default ProductImage;
