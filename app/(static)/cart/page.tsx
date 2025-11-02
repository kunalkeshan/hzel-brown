import { Content } from "@/components/cart/content";

export default function CartPage() {
  return (
    <main className="py-16 lg:pt-40">
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Shopping Cart
        </h1>
        <Content />
      </div>
    </main>
  );
}
