import {
	FileText,
	FolderOpen,
	Home,
	Info,
	Phone,
	Scale,
	ShoppingCart,
	UtensilsCrossed,
	type LucideIcon,
} from "lucide-react";

/**
 * Icon mapping for command menu items
 */
export const COMMAND_ICONS: Record<string, LucideIcon> = {
	// Result type icons
	page: FileText,
	category: FolderOpen,
	menuItem: UtensilsCrossed,
	legal: Scale,

	// Page-specific icons
	home: Home,
	"": Home, // Root path
	about: Info,
	menu: UtensilsCrossed,
	contact: Phone,
	cart: ShoppingCart,
	legals: Scale,
	categories: FolderOpen,
};

/**
 * Get icon for a given page slug or type
 */
export function getCommandIcon(
	type: "page" | "category" | "menuItem" | "legal",
	slug?: string
): LucideIcon {
	// For pages, try to get specific icon first, then fall back to generic page icon
	if (type === "page" && slug) {
		return COMMAND_ICONS[slug] || COMMAND_ICONS.page;
	}

	// For other types, return the type-specific icon
	return COMMAND_ICONS[type];
}
