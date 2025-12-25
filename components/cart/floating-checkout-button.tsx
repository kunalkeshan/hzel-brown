'use client';

import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';

export function FloatingCheckoutButton() {
	const pathname = usePathname();
	const { totalItems } = useCart();

	// Hide button if on cart page or if cart is empty
	const shouldShow = totalItems > 0 && pathname !== '/cart';

	return (
		<AnimatePresence>
			{shouldShow && (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
					className="fixed bottom-6 right-6 z-50"
				>
					<Link
						href="/cart"
						className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
					>
						<ShoppingCart className="h-4 w-4" />
						<span>Checkout ({totalItems})</span>
					</Link>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
