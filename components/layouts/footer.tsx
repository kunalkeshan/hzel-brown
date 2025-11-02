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
        <div className="grid grid-cols-6 gap-6 p-4">
          <div className="col-span-6 flex flex-col gap-4 pt-5 md:col-span-3">
            <div className="w-max">
              <Logo />
            </div>
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
          {footerSections.map((section) => {
            if (section.type === "contact") {
              return (
                <div
                  className="col-span-6 w-full md:col-span-1"
                  key={section.title}
                >
                  <span className="text-muted-foreground text-xs">
                    {section.title || contactTitle}
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
              );
            }
            if (section.type === "links") {
              const items = section.links || [];
              return (
                <div
                  className="col-span-6 w-full md:col-span-1"
                  key={section.title}
                >
                  <span className="text-muted-foreground text-xs">
                    {section.title}
                  </span>
                  <div className="mt-2 flex flex-col gap-2">
                    {items.map((l) => (
                      <a
                        className="w-max text-sm hover:underline"
                        href={l.href ?? "#"}
                        key={`${l.label}-${l.href}`}
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            if (section.type === "legal") {
              const items = legalLinks || [];
              return (
                <div
                  className="col-span-6 w-full md:col-span-1"
                  key={section.title}
                >
                  <span className="text-muted-foreground text-xs">
                    {section.title}
                  </span>
                  <div className="mt-2 flex flex-col gap-2">
                    {items.map((doc) => (
                      <a
                        className="w-max text-sm hover:underline"
                        href={
                          doc.slug?.current
                            ? `/legals/${doc.slug.current}`
                            : "/legals"
                        }
                        key={doc._id}
                      >
                        {doc.title}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="absolute inset-x-0 h-px w-full bg-border" />
        <div className="flex container flex-col md:flex-row items-center justify-between gap-2 md:gap-4 py-4">
          <p className="text-center md:text-left font-light text-muted-foreground text-sm">
            &copy; 2025 Hzel Brown, All rights reserved
          </p>
          <p className="text-center md:text-right font-light text-muted-foreground text-sm">
            built by{" "}
            <a
              href="https://kunalkeshan.dev"
              target="_blank"
              rel="noreferrer"
              className="hover:underline font-semibold"
              style={{ color: "#ffa503" }}
            >
              Kunal Keshan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
