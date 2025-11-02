import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";

export function EmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </EmptyMedia>
        <EmptyTitle>Your cart is empty</EmptyTitle>
        <EmptyDescription>
          Start adding delicious items to your cart to continue shopping.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild size="lg">
          <Link href="/menu" prefetch={false}>
            Browse Menu
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
