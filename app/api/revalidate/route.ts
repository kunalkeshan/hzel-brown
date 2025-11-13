import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _id: string;
      _type: string;
      slug?: string;
      categorySlug?: string;
    }>(req, process.env.SANITY_WEBHOOK_SECRET);

    // Validate the webhook signature
    if (!isValidSignature) {
      const message = "Invalid signature";
      return new NextResponse(JSON.stringify({ message, isValidSignature }), {
        status: 401,
      });
    }

    if (!body?._type) {
      const message = "Bad Request: Missing _type";
      return new NextResponse(JSON.stringify({ message }), { status: 400 });
    }

    // Revalidate based on document type
    const tags: string[] = [];

    switch (body._type) {
      case "menuItem":
        // Revalidate all menu-related pages
        tags.push("menuItems");
        // Revalidate specific menu item if slug exists
        if (body.slug) {
          tags.push(`menuItem:${body.slug}`);
        }
        // Revalidate category page if categorySlug exists
        if (body.categorySlug) {
          tags.push(`category:${body.categorySlug}`);
        }
        break;

      case "category":
        // Revalidate all categories and menu pages
        tags.push("categories");
        // Revalidate specific category if slug exists
        if (body.slug) {
          tags.push(`category:${body.slug}`);
        }
        break;

      case "siteConfig":
        // Site config affects all pages (used in layout)
        tags.push("siteConfig");
        break;

      case "legal":
        // Revalidate legal documents list and specific document
        tags.push("legal");
        if (body.slug) {
          tags.push(`legal:${body.slug}`);
        }
        break;

      case "faq":
        // Revalidate FAQs
        tags.push("faqs");
        break;

      default:
        // Unknown type, log it but don't fail
        console.warn(`Unknown document type: ${body._type}`);
    }

    // Revalidate all relevant tags
    for (const tag of tags) {
      revalidateTag(tag);
    }

    return NextResponse.json({
      success: true,
      revalidated: tags,
      now: Date.now(),
    });
  } catch (err: unknown) {
    console.error("Webhook error:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return new NextResponse(JSON.stringify({ message }), { status: 500 });
  }
}
