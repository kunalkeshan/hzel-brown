import { type LucideIcon, Mail, MapPin, Phone } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getSocialIcon, getSocialName } from "@/constants/navigation";
import type { SITE_CONFIG_QUERYResult } from "@/types/cms";
import { MotionSection } from "../ui/motion-section";

type ContactProps = {
  siteConfig?: SITE_CONFIG_QUERYResult;
};

export function Contact({ siteConfig }: ContactProps) {
  const emails = siteConfig?.emails?.filter((e) => e.email) || [];
  const phoneNumbers = siteConfig?.phoneNumbers?.filter((p) => p.number) || [];
  const address = siteConfig?.address;
  const socialMedia =
    siteConfig?.socialMedia?.filter((s) => s.platform && s.url) || [];

  // Format address string
  const formatAddress = () => {
    if (!address) return null;
    const parts = [
      address.street,
      address.city,
      address.state,
      address.postalCode ? address.postalCode : undefined,
      address.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  };

  const addressString = formatAddress();

  // Map social links
  const socialLinks = socialMedia
    .map((social) => ({
      icon: getSocialIcon(social.platform || ""),
      href: social.url || "#",
      label: social.label || getSocialName(social.platform || ""),
      platform: social.platform || "",
    }))
    .filter((link) => link.icon !== null); // Filter out unsupported platforms

  const hasContactInfo =
    emails.length > 0 || phoneNumbers.length > 0 || addressString;

  return (
    <MotionSection className="mx-auto h-full min-h-screen max-w-5xl lg:border-x py-16 lg:pt-40">
      <div className="flex grow flex-col justify-center px-4 pb-18 md:items-center">
        <h1 className="font-bold text-4xl md:text-5xl">Contact Us</h1>
        <p className="mb-5 text-base text-muted-foreground">
          Order fresh, home-baked brownies, brookies, cupcakes & cookies. Get in
          touch!
        </p>
      </div>
      <BorderSeparator />

      {hasContactInfo && (
        <div className="grid md:grid-cols-3">
          {emails.length > 0 && (
            <Box
              description="Have questions or custom orders? We respond to all emails within 24 hours."
              icon={Mail}
              title="Email"
            >
              <div className="flex flex-col gap-2">
                {emails.map((emailItem, index) => (
                  <a
                    key={index}
                    className="font-medium font-mono text-sm tracking-wide hover:underline"
                    href={`mailto:${emailItem.email}`}
                  >
                    {emailItem.email}
                  </a>
                ))}
              </div>
            </Box>
          )}

          {addressString && (
            <Box
              description="Contact us for pick-up availability and directions."
              icon={MapPin}
              title="Kitchen Address"
            >
              <span className="font-medium font-mono text-sm tracking-wide">
                {addressString}
              </span>
            </Box>
          )}

          {phoneNumbers.length > 0 && (
            <Box
              className="border-b-0 md:border-r-0"
              description="Call us for orders or inquiries. Available Mon-Fri, 9am-5pm."
              icon={Phone}
              title="Phone"
            >
              <div className="flex flex-col gap-2">
                {phoneNumbers.map((phoneItem, index) => (
                  <a
                    key={index}
                    className="block font-medium font-mono text-sm tracking-wide hover:underline"
                    href={`tel:${phoneItem.number}`}
                  >
                    {phoneItem.number}
                  </a>
                ))}
              </div>
            </Box>
          )}
        </div>
      )}

      {!hasContactInfo && (
        <div className="px-4 py-12 text-center">
          <p className="text-muted-foreground">
            Contact information will be available soon.
          </p>
        </div>
      )}

      <BorderSeparator />

      {socialLinks.length > 0 && (
        <div className="z-1 flex h-full flex-col items-center justify-center gap-4 pt-24">
          <h2 className="text-center font-medium text-2xl text-muted-foreground tracking-tight md:text-3xl">
            Find us <span className="text-foreground">online</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {socialLinks.map((link, index) => (
              <Badge
                key={index}
                variant="outline"
                asChild
                className="gap-x-2 font-mono text-xs font-medium tracking-wide shadow"
              >
                <a href={link.href} rel="noopener noreferrer" target="_blank">
                  <span className="size-3.5 text-muted-foreground">
                    {link.icon}
                  </span>
                  {link.label}
                </a>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </MotionSection>
  );
}

function BorderSeparator({ className }: React.ComponentProps<"div">) {
  return (
    <div className={cn("absolute inset-x-0 h-px w-full border-b", className)} />
  );
}

type ContactBox = React.ComponentProps<"div"> & {
  icon: LucideIcon;
  title: string;
  description: string;
};

function Box({
  title,
  description,
  className,
  children,
  ...props
}: ContactBox) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between border-b md:border-r md:border-b-0",
        className
      )}
    >
      <div className="flex items-center gap-x-3 border-b bg-secondary/50 p-4 dark:bg-secondary/20">
        <props.icon className="size-5 text-muted-foreground" strokeWidth={1} />
        <h2 className="font-heading font-medium text-lg tracking-wider">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-x-2 p-4 py-12">{children}</div>
      <div className="border-t p-4">
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
