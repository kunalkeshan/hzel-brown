import type { LucideIcon } from "lucide-react";
import type { Slug } from "./cms";

/**
 * Static page definition for command menu
 */
export interface StaticPage {
	title: string;
	slug: string;
	description: string;
	icon?: LucideIcon;
}

/**
 * Category result from Sanity search
 */
export interface CategorySearchResult {
	_id: string;
	title: string | null;
	slug: Slug | null;
	description?: string | null;
}

/**
 * Menu item result from Sanity search
 */
export interface MenuItemSearchResult {
	_id: string;
	name: string | null;
	slug: Slug | null;
	price: number | null;
	categories?: Array<{
		slug: Slug | null;
	}> | null;
	isAvailable: boolean | null;
}

/**
 * Legal document result from Sanity search
 */
export interface LegalSearchResult {
	_id: string;
	title: string | null;
	slug: Slug | null;
	description?: string | null;
}

/**
 * Unified search results from all sources
 */
export interface CommandSearchResults {
	pages: StaticPage[];
	categories: CategorySearchResult[];
	menuItems: MenuItemSearchResult[];
	legal: LegalSearchResult[];
}

/**
 * Search state for the command menu
 */
export interface CommandSearchState extends CommandSearchResults {
	isLoading: boolean;
	error: Error | null;
	hasResults: boolean;
}

/**
 * Command item type for grouping
 */
export type CommandItemType = "page" | "category" | "menuItem" | "legal";

/**
 * Navigation target for command items
 */
export interface CommandNavigationTarget {
	type: CommandItemType;
	href: string;
	label: string;
	metadata?: {
		price?: number;
		description?: string;
	};
}
