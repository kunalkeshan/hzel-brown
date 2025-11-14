"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type {
	CategorySearchResult,
	LegalSearchResult,
	MenuItemSearchResult,
	StaticPage,
} from "@/types/cmd";

/**
 * Helper to safely navigate with typed routes
 * This is necessary due to Next.js typedRoutes being enabled
 */
function safeNavigate(router: ReturnType<typeof useRouter>, path: string) {
	// Type assertion is safe here as we're building valid route paths
	router.push(path as Parameters<typeof router.push>[0]);
}

/**
 * Hook for handling navigation from command menu items
 *
 * @param onNavigate - Callback to execute after navigation (e.g., close dialog)
 * @returns Navigation handlers for different item types
 */
export function useCommandNavigation(onNavigate?: () => void) {
	const router = useRouter();

	/**
	 * Navigate to a static page
	 */
	const navigateToPage = useCallback(
		(page: StaticPage) => {
			const path = page.slug ? `/${page.slug}` : "/";
			safeNavigate(router, path);
			onNavigate?.();
		},
		[router, onNavigate]
	);

	/**
	 * Navigate to a category page
	 */
	const navigateToCategory = useCallback(
		(category: CategorySearchResult) => {
			if (!category.slug?.current) return;
			safeNavigate(router, `/menu/${category.slug.current}`);
			onNavigate?.();
		},
		[router, onNavigate]
	);

	/**
	 * Navigate to a menu item page
	 */
	const navigateToMenuItem = useCallback(
		(menuItem: MenuItemSearchResult) => {
			if (!menuItem.slug?.current) return;

			// Get the first category slug if available
			const categorySlug = menuItem.categories?.[0]?.slug?.current;

			if (categorySlug) {
				safeNavigate(router, `/menu/${categorySlug}/${menuItem.slug.current}`);
			} else {
				// Fallback: navigate to menu page if no category
				safeNavigate(router, `/menu`);
			}

			onNavigate?.();
		},
		[router, onNavigate]
	);

	/**
	 * Navigate to a legal document page
	 */
	const navigateToLegal = useCallback(
		(legal: LegalSearchResult) => {
			if (!legal.slug?.current) return;
			safeNavigate(router, `/legals/${legal.slug.current}`);
			onNavigate?.();
		},
		[router, onNavigate]
	);

	return {
		navigateToPage,
		navigateToCategory,
		navigateToMenuItem,
		navigateToLegal,
	};
}
