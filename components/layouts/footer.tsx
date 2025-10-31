import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "../ui/logo";
import { footerSections, getSocialIcon } from "@/constants/navigation";
import type {
  SITE_CONFIG_QUERYResult,
  FOOTER_LEGAL_LINKS_QUERYResult,
} from "@/types/cms";

type FooterProps = {
  siteConfig?: SITE_CONFIG_QUERYResult;
  legalLinks?: FOOTER_LEGAL_LINKS_QUERYResult;
};

export default function Footer({ siteConfig, legalLinks }: FooterProps) {
  const linksSection = footerSections.find((s) => s.type === "links");
  const resources =
    linksSection?.links && linksSection.links.length > 0
      ? linksSection.links.map((l) => ({ title: l.label, href: l.href ?? "#" }))
      : [];

  const company =
    legalLinks && legalLinks.length > 0
      ? legalLinks.map((l) => ({
          title: l.title ?? "",
          href: l.slug?.current ? `/legals/${l.slug.current}` : "/legals",
        }))
      : [];

  const socialLinks = (siteConfig?.socialMedia ?? [])
    .filter((s) => s?.platform && s?.url)
    .map((s) => ({
      icon: getSocialIcon(String(s.platform)),
      link: String(s.url),
    }))
    .filter((s) => Boolean(s.icon));
  const contactSection = footerSections.find((s) => s.type === "contact");
  const contactTitle = contactSection?.title || "Contact";
  const contactPhones = (siteConfig?.phoneNumbers || []).filter(
    (p) => p?.number
  );
  return (
    <footer className="relative">
      <div
        className={cn(
          "container lg:border-x",
          "dark:bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)]"
        )}
      >
        <div className="absolute inset-x-0 h-px w-full bg-border" />
        <div className="grid max-w-5xl grid-cols-6 gap-6 p-4">
          <div className="col-span-6 flex flex-col gap-4 pt-5 md:col-span-4">
            <a className="w-max" href="#">
              <Logo className="h-5" />
            </a>
            <p className="max-w-sm text-balance font-mono text-muted-foreground text-sm">
              Handcrafted brownies, brookies, cupcakes & cookies. Fresh, made
              with love. Delivery across Tamil Nadu.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((item, index) => (
                <Button
                  key={`social-${item.link}-${index}`}
                  size="icon-sm"
                  variant="outline"
                  asChild
                >
                  <a href={item.link} target="_blank" rel="noreferrer">
                    {item.icon}
                  </a>
                </Button>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-muted-foreground text-xs">
              {contactTitle}
            </span>
            <div className="mt-2 flex flex-col gap-2">
              {contactPhones.map((p) => (
                <a
                  className="w-max text-sm hover:underline"
                  href={`tel:${String(p.number).replace(/\s/g, "")}`}
                  key={String(p.number)}
                >
                  {p.number}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-muted-foreground text-xs">
              {linksSection?.title || "Resources"}
            </span>
            <div className="mt-2 flex flex-col gap-2">
              {resources.map(({ href, title }) => (
                <a
                  className="w-max text-sm hover:underline"
                  href={href}
                  key={`${title}-${href}`}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 h-px w-full bg-border" />
        <div className="flex container flex-col justify-between gap-2 py-4">
          <p className="text-center font-light text-muted-foreground text-sm">
            &copy; 2025 Hzel Brown, All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
