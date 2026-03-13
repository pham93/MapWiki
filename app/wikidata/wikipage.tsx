import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import wtf from 'wtf_wikipedia';
import type { WikiDataSiteLinksResponse } from '~/app.schema';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Skeleton } from '~/components/ui/skeleton';
import { useGlobalState } from '~/lib/global-state';
import { ImagePreview } from './image-preview';
import { useState } from 'react';

export const useRetrieveWikiPage = (wikiId: string) => {
  return useQuery<wtf.Document | null>({
    queryKey: [wikiId],
    queryFn: async ({ signal }) => {
      const apiUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikiId}&props=sitelinks&format=json`;
      const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;

      const response = await fetch(proxiedUrl, { signal });
      const { entities } = (await response.json()) as WikiDataSiteLinksResponse;

      const title = entities[wikiId]?.sitelinks.enwiki.title;
      if (!title) {
        return null;
      }
      const doc = (await wtf.fetch(title)) as wtf.Document;
      return doc;
    },
  });
};

const WikiMediaImages = ({
  images,
  isLoading,
}: {
  images: wtf.Image[];
  isLoading: boolean;
}) => {
  const { setGlobalStates } = useGlobalState();
  const [selected, setSelected] = useState<wtf.Image>();
  if (isLoading) {
    return (
      <div className="grid grid-flow-col grid-rows-2 gap-1 gap-y-2">
        {new Array(6).fill(0).map((_, idx) => (
          <Skeleton key={idx} className="rounded-sm h-20" />
        ))}
      </div>
    );
  }
  if (images.length === 0) {
    return <h1>No images</h1>;
  }
  return (
    <>
      <div className="grid gap-1 w-full grid-cols-4">
        {images.map((value) => (
          <img
            onClick={() => {
              setGlobalStates({ imagePreview: true });
              setSelected(value);
            }}
            className="object-cover aspect-square"
            key={value.thumbnail()}
            src={value.thumbnail()}
            alt={value.alt()}
          />
        ))}
      </div>
      <ImagePreview album={images} selected={selected} />
    </>
  );
};

export function WikidataMedia({ wikiId }: { wikiId: string }) {
  const { data, error, isLoading } = useRetrieveWikiPage(wikiId);

  if (error) {
    return (
      <span className="bg-red-400 text-white p-2 rounded-sm font-bold">
        <AlertCircle /> There seems to be an issue with this wiki page {wikiId}
      </span>
    );
  }

  return (
    <div className="flex overflow-auto h-full flex-col p-2 max-h-[48rem]">
      {data ? (
        <h1>
          {data?.description()} {data?.text().slice(0, 500)}
        </h1>
      ) : (
        <>
          <Skeleton className="h-5 w-full rounded-none" />
          <Skeleton className="h-5 w-full mt-1 rounded-none" />
          <Skeleton className="h-5 w-full mt-1 rounded-none" />
        </>
      )}
      <Accordion type="single" defaultValue="Images" collapsible>
        <AccordionItem value="Images">
          <AccordionTrigger>Images</AccordionTrigger>
          <AccordionContent>
            <WikiMediaImages
              images={data?.images() ?? []}
              isLoading={isLoading}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
