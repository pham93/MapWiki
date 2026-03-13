import { useEffect, useState } from 'react';
import type wtf from 'wtf_wikipedia';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel';
import { Dialog, DialogContent } from '~/components/ui/dialog';
import { useGlobalState } from '~/lib/global-state';

export const ImagePreview = ({
  album,
  selected,
}: {
  album: wtf.Image[];
  selected?: wtf.Image;
}) => {
  const { imagePreview, setGlobalStates } = useGlobalState();
  const [image, setImage] = useState(selected?.url());

  useEffect(() => {
    setImage(selected?.url());
  }, [selected]);

  return (
    <Dialog
      open={imagePreview}
      onOpenChange={(open) => setGlobalStates({ imagePreview: open })}
    >
      <DialogContent className="bg-transparent !max-w-full max-h-full w-[80%] flex justify-center items-center border-none shadow-none">
        <div className="flex flex-col justify-center items-center h-full">
          <img
            className="aspect-auto height-[80%]"
            src={image}
            
            alt="preview-image"
          />
          <Carousel
            opts={{
              align: 'start',
            }}
            className="w-full"
          >
            <CarouselContent>
              {album.map((image, index) => (
                <CarouselItem key={index} className="lg:basis-1/10 h-[20%]">
                  <img
                    onClick={() => setImage(image.url())}
                    className="p-1 aspect-square"
                    alt={image.caption()}
                    src={image.thumbnail()}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};
