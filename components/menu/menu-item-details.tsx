import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/numbers";
import { COMMON_MENU_ACCORDIONS } from "@/constants/menu-accordions";
import type { MENU_ITEM_BY_SLUGS_QUERYResult } from "@/types/cms";
import { MenuItemDisplayActions } from "./menu-item-display-actions";

type MenuItemType = NonNullable<MENU_ITEM_BY_SLUGS_QUERYResult["item"]>;

interface MenuItemDetailsProps {
  item: MenuItemType;
}

export function MenuItemDetails({ item }: MenuItemDetailsProps) {
  const primaryCategory = item.categories?.[0];

  const accordionItems: Array<{
    name: string;
    items: string[];
    isText?: boolean;
  }> = [];

  if (item.ingredients && item.ingredients.length > 0) {
    accordionItems.push({
      name: "Ingredients",
      items: item.ingredients,
    });
  }

  if (item.allergens && item.allergens.length > 0) {
    accordionItems.push({
      name: "Allergens",
      items: item.allergens,
    });
  }

  if (item.isCombo && item.comboDescription) {
    accordionItems.push({
      name: "Combo Details",
      items: [item.comboDescription],
      isText: true,
    });
  }

  // Add common accordions (Shipping and Returns) to all items
  accordionItems.push(...COMMON_MENU_ACCORDIONS);

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {item.name}
      </h1>

      <div className="mt-3">
        <h2 className="sr-only">Product information</h2>
        <p className="text-3xl tracking-tight text-foreground">
          {formatCurrency(item.price || 0)}
        </p>
      </div>

      {primaryCategory && (
        <div className="mt-3">
          <Link href={`/menu/${primaryCategory.slug?.current}`}>
            <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
              {primaryCategory.title}
            </Badge>
          </Link>
        </div>
      )}

      {item.description && (
        <div className="mt-6">
          <h3 className="sr-only">Description</h3>
          <p className="space-y-6 text-base leading-7 text-muted-foreground">
            {item.description}
          </p>
        </div>
      )}

      {/* Cart Actions */}
      <div className="mt-6">
        <MenuItemDisplayActions item={item} />
      </div>

      {/* Accordion Details */}
      {accordionItems.length > 0 && (
        <section aria-labelledby="details-heading" className="mt-12">
          <h2 id="details-heading" className="sr-only">
            Additional details
          </h2>
          <div className="divide-y divide-border border-t border-border">
            <Accordion type="single" collapsible className="w-full">
              {accordionItems.map((detail) => (
                <AccordionItem key={detail.name} value={detail.name}>
                  <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary">
                    {detail.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    {detail.isText ? (
                      <p className="text-sm leading-6 text-muted-foreground">
                        {detail.items[0]}
                      </p>
                    ) : (
                      <ul
                        role="list"
                        className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground marker:text-muted"
                      >
                        {detail.items.map((item, index) => (
                          <li key={index} className="pl-2">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </>
  );
}
