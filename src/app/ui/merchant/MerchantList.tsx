"use client";

import { MerchantRecord } from "@/app/lib/types/map.types";
import { MerchantProps } from "@/app/lib/types/merchant.types";
import { Globe, Mail, MapPin, Phone, Send, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "../badge";

import { Card, CardContent } from "../card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../dialog";

type LogoProps = {
  src?: string;
  name: string;
  logoContentType: boolean;
  size?: string;
};

const Logo = (props: LogoProps) => {
  const { src, size = "h-12 w-12", name, logoContentType } = props;

  if (!props.src) {
    return <div>{name.charAt(0)}</div>;
  }

  return (
    <div
      className={`${size} shrink-0 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center font-bold text-primary`}
    >
      <Image
        width={256}
        height={256}
        src={src!}
        alt={name}
        className="h-15 w-15 object-contain"
        quality={100}
        unoptimized={logoContentType}
      />
    </div>
  );
};

interface MerchantListProps {
  searchQuery: string;
  merchants: MerchantProps;
}

type GroupedMerchantCategory = {
  [categoryName: string]: MerchantRecord[];
};

export default function MerchantList(props: MerchantListProps) {
  const [selected, setSelected] = useState<MerchantRecord | null>(null);

  const FAVORITE_CATEGORY = "Favorite";
  const UPVOTE_COUNT_FAVORITE = 15;

  // Group merchants by category and add the 'Favorite' category dynamically
  const groupedMerchants = props.merchants.data.reduce((acc, merchant) => {
    const { category, upvoteCount } = merchant;
    const categoryKey = category || "No category";

    // Check if merchant has upvotes >= UPVOTE_COUNT_FAVORITE
    if (upvoteCount >= UPVOTE_COUNT_FAVORITE) {
      if (!acc[FAVORITE_CATEGORY]) {
        acc[FAVORITE_CATEGORY] = []; // Initialize the 'Favorite' category if it doesn't exist
      }

      acc[FAVORITE_CATEGORY].push(merchant); // Add merchant to FAVORITE_CATEGORY
      return acc;
    }

    // Group merchants by their original category
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(merchant);
    return acc;
  }, {} as GroupedMerchantCategory);

  // Maintain the 'FAVORITE_CATEGORY' is at the top
  const favoriteAtTop = {
    Favorite: groupedMerchants[FAVORITE_CATEGORY] || [],
    ...groupedMerchants,
  } as GroupedMerchantCategory;

  // Filtered merchants based on the search input
  const filteredMerchants = Object.keys(favoriteAtTop).reduce(
    (acc, category) => {
      //
      const categoryMerchants = favoriteAtTop[category].filter(
        (merchant) =>
          merchant.name
            .toLowerCase()
            .includes(props.searchQuery.toLowerCase()) ||
          category.toLowerCase().includes(props.searchQuery.toLowerCase()),
      );

      if (categoryMerchants.length > 0) {
        acc[category] = categoryMerchants;
      }

      return acc;
    },
    {} as GroupedMerchantCategory,
  );

  return (
    <div className="merchant-list">
      {Object.keys(filteredMerchants).map((category) => (
        <div key={category} className="category mb-20 rounded-lg">
          <h2
            id={`category-${category}`}
            className="text-2xl not-last:font-medium mb-4"
          >
            {category}
          </h2>
          <div className="merchant-items grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMerchants[category].map((m) => (
              <Card
                key={m.id}
                className="bg-card/50 border-border/50 hover:border-primary/40 transition-colors"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <Logo
                    src={m.logoUrl!}
                    name={m.name}
                    logoContentType={m.logoContentType === "image/svg+xml"}
                  />
                  <div className="min-w-0">
                    <button
                      onClick={() => setSelected(m)}
                      className="font-semibold text-foreground hover:text-primary hover:cursor-pointer text-left"
                    >
                      {m.name[0].toUpperCase() + m.name.slice(1)}
                    </button>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />{" "}
                      {m.state !== "Not Available" && (
                        <span>
                          {m.state}
                          {","}
                        </span>
                      )}
                      {m.country !== "Not Available" && (
                        <span>{m.country}</span>
                      )}
                    </div>
                    <Badge variant="secondary" className="mt-2 text-[10px]">
                      {m.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredMerchants[category].length === 0 && (
              <p className="text-muted-foreground">No business found.</p>
            )}
          </div>
        </div>
      ))}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2l` max-h-[90hv] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Logo
                    name={selected.name}
                    src={selected.logoUrl!}
                    size="h-10 w-10 text-sm"
                    logoContentType={
                      selected.logoContentType === "image/svg+xml"
                    }
                  />
                  <div>
                    <DialogTitle className="text-primary">
                      {selected.name[0].toUpperCase() + selected.name.slice(1)}
                    </DialogTitle>
                    <DialogDescription>
                      {selected.category} ·{" "}
                      {selected.state !== "Not Available" && (
                        <span>
                          {selected.state}
                          {","}
                        </span>
                      )}
                      {selected.country !== "Not Available" && (
                        <span>{selected.country}</span>
                      )}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <img
                src={selected.logoUrl!}
                alt={selected.name}
                className="w-full aspect-video object-cover rounded-lg"
              />

              {selected.subtitle.length && (
                <p className="text-sm text-muted-foreground">
                  {selected.subtitle.length > 250
                    ? `${selected.subtitle.slice(1, 200)}...`
                    : selected.subtitle}
                </p>
              )}

              {selected.description && (
                <p className="text-sm text-muted-foreground">
                  {selected.description.length > 250
                    ? `${selected.description?.slice(0, 200)}...`
                    : selected.description}
                </p>
              )}
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <a
                  href={selected.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  {selected.website.replace("https://", "")}
                </a>

                {selected.contacts?.email && (
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selected.contacts.email}
                  </span>
                )}

                {selected.contacts?.phone && (
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {selected.contacts.phone}
                  </span>
                )}

                {selected.contacts?.address && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {selected.contacts.address}
                  </span>
                )}
                {selected.socials?.twitter && (
                  <span className="flex items-center gap-2">
                    <X className="h-4 w-4 text-muted-foreground" />
                    {selected.socials.twitter}
                  </span>
                )}

                {selected.socials?.telegram && (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-muted-foreground" />
                    {selected.socials.telegram}
                  </span>
                )}
              </div>

              <iframe
                title="Map location"
                className="w-full h-64 rounded-lg border border-border"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selected.geo?.lng! - 0.01}, ${selected.geo?.lat! - 0.01} , ${selected.geo?.lng! + 0.01}, ${selected.geo?.lat! + 0.01}&layer=mapnik&marker=${selected.geo?.lat!},${selected.geo?.lng}`}
              ></iframe>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
