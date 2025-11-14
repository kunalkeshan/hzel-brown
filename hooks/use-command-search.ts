"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import type {
	CommandSearchResults,
	StaticPage,
} from "@/types/cmd";
import type { COMMAND_SEARCH_QUERYResult } from "@/types/cms";
import { COMMAND_SEARCH_QUERY } from "@/sanity/queries/search";
import { clientFetch } from "@/sanity/lib/client-fetch";
import { Home, Info, Phone, ShoppingCart, UtensilsCrossed, Scale } from "lucide-react";

/**
 * Static pages available in the app
 */
const STATIC_PAGES: StaticPage[] = [
	{
		title: "Home",
		slug: "",
		description: "Return to the homepage",
		icon: Home,
	},
	{
		title: "About Us",
		slug: "about",
		description: "Learn more about Hzel Brown",
		icon: Info,
	},
	{
		title: "Menu",
		slug: "menu",
		description: "Browse our full menu",
		icon: UtensilsCrossed,
	},
	{
		title: "Contact",
		slug: "contact",
		description: "Get in touch with us",
		icon: Phone,
	},
	{
		title: "Cart",
		slug: "cart",
		description: "View your shopping cart",
		icon: ShoppingCart,
	},
	{
		title: "Legal",
		slug: "legals",
		description: "Privacy policy and terms of service",
		icon: Scale,
	},
];

/**
 * Search static pages by term
 * Returns all pages if no search term (default state)
 */
function searchStaticPages(searchTerm: string): StaticPage[] {
	if (!searchTerm) return STATIC_PAGES;

	const term = searchTerm.toLowerCase();
	return STATIC_PAGES.filter(
		(page) =>
			page.title.toLowerCase().includes(term) ||
			page.description.toLowerCase().includes(term) ||
			page.slug.toLowerCase().includes(term)
	);
}

/**
 * Hook for searching across all command menu content
 * Includes static pages, categories, menu items, and legal documents
 *
 * @param searchTerm - The search term (debounced externally)
 * @returns Search results and loading state
 */
export function useCommandSearch(searchTerm: string) {
	const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

	// Debounce search term (300ms)
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedTerm(searchTerm);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Search static pages immediately (client-side)
	const staticPageResults = useMemo(
		() => searchStaticPages(searchTerm),
		[searchTerm]
	);

	// Fetch Sanity content with debounced term
	const {
		data: sanityData,
		isLoading,
		error,
	} = useQuery<COMMAND_SEARCH_QUERYResult>({
		queryKey: ["command-search", debouncedTerm],
		queryFn: () =>
			clientFetch<COMMAND_SEARCH_QUERYResult>(COMMAND_SEARCH_QUERY, {
				searchTerm: `${debouncedTerm}*`, // Add wildcard for partial matching
			}),
		enabled: debouncedTerm.length > 0,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Combine results
	const results: CommandSearchResults = useMemo(() => {
		return {
			pages: staticPageResults,
			categories: sanityData?.categories ?? [],
			menuItems: sanityData?.menuItems ?? [],
			legal: sanityData?.legal ?? [],
		};
	}, [staticPageResults, sanityData]);

	// Check if any results exist
	const hasResults =
		results.pages.length > 0 ||
		results.categories.length > 0 ||
		results.menuItems.length > 0 ||
		results.legal.length > 0;

	return {
		...results,
		isLoading: isLoading && debouncedTerm.length > 0,
		isSearching: searchTerm.length > 0,
		error,
		hasResults,
		isEmpty: !isLoading && !hasResults && searchTerm.length > 0,
	};
}
