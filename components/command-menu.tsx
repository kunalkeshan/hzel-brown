"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { useCommandSearch } from "@/hooks/use-command-search";
import { useCommandNavigation } from "@/hooks/use-command-navigation";
import { getCommandIcon } from "@/constants/command-icons";

/**
 * Global command menu component
 * Triggered by Cmd/Ctrl + K
 * Searches across pages, categories, menu items, and legal documents
 */
export function CommandMenu() {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	// Setup keyboard shortcut
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	// Reset search when dialog closes
	useEffect(() => {
		if (!open) {
			setSearchTerm("");
		}
	}, [open]);

	// Search hook
	const {
		pages,
		categories,
		menuItems,
		legal,
		isLoading,
		isSearching,
		isEmpty,
	} = useCommandSearch(searchTerm);

	// Navigation handlers
	const { navigateToPage, navigateToCategory, navigateToMenuItem, navigateToLegal } =
		useCommandNavigation(() => setOpen(false));

	return (
		<CommandDialog
			open={open}
			onOpenChange={setOpen}
			title="Search"
			description="Search for pages, menu items, categories, and more"
		>
			<CommandInput
				placeholder="Search pages, menu items, categories..."
				value={searchTerm}
				onValueChange={setSearchTerm}
			/>

			<CommandList>
				{/* Empty State - Only when searching and no results */}
				{isEmpty && (
					<CommandEmpty>No results found for &ldquo;{searchTerm}&rdquo;</CommandEmpty>
				)}

				{/* Pages Group - Always visible (default or filtered) */}
				{pages.length > 0 && (
					<CommandGroup heading="Pages">
						{pages.map((page) => {
							const Icon = getCommandIcon("page", page.slug);
							return (
								<CommandItem
									key={page.slug}
									value={page.title}
									onSelect={() => navigateToPage(page)}
									className="cursor-pointer"
								>
									<Icon className="mr-2" />
									<div className="flex flex-col">
										<span className="font-medium">{page.title}</span>
										{page.description && (
											<span className="text-xs text-muted-foreground">
												{page.description}
											</span>
										)}
									</div>
								</CommandItem>
							);
						})}
					</CommandGroup>
				)}

				{/* Separator after Pages - Only show when searching and dynamic content will follow */}
				{isSearching && pages.length > 0 && <CommandSeparator />}

				{/* Loading State - Only show when actively searching dynamic content */}
				{isSearching && isLoading && (
					<div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
						<Loader2 className="size-4 animate-spin" />
						<span>Searching menu items, categories, and legal documents...</span>
					</div>
				)}

				{/* Dynamic Content - Only show when searching */}
				{isSearching && !isLoading && (
					<>
						{/* Categories Group */}
						{categories.length > 0 && (
							<CommandGroup heading="Categories">
								{categories.map((category) => {
									const Icon = getCommandIcon("category");
									return (
										<CommandItem
											key={category._id}
											value={category.title ?? ""}
											onSelect={() => navigateToCategory(category)}
											className="cursor-pointer"
										>
											<Icon className="mr-2" />
											<div className="flex flex-col">
												<span className="font-medium">{category.title}</span>
												{category.description && (
													<span className="text-xs text-muted-foreground">
														{category.description}
													</span>
												)}
											</div>
										</CommandItem>
									);
								})}
							</CommandGroup>
						)}

						{/* Separator after Categories */}
						{categories.length > 0 && (menuItems.length > 0 || legal.length > 0) && (
							<CommandSeparator />
						)}

						{/* Menu Items Group */}
						{menuItems.length > 0 && (
							<CommandGroup heading="Menu Items">
								{menuItems.map((item) => {
									const Icon = getCommandIcon("menuItem");
									return (
										<CommandItem
											key={item._id}
											value={item.name ?? ""}
											onSelect={() => navigateToMenuItem(item)}
											className="cursor-pointer"
										>
											<Icon className="mr-2" />
											<div className="flex flex-1 items-center justify-between">
												<span className="font-medium">{item.name}</span>
												{item.price && (
													<span className="text-sm text-muted-foreground">
														${item.price.toFixed(2)}
													</span>
												)}
											</div>
										</CommandItem>
									);
								})}
							</CommandGroup>
						)}

						{/* Separator after Menu Items */}
						{menuItems.length > 0 && legal.length > 0 && <CommandSeparator />}

						{/* Legal Documents Group */}
						{legal.length > 0 && (
							<CommandGroup heading="Legal">
								{legal.map((doc) => {
									const Icon = getCommandIcon("legal");
									return (
										<CommandItem
											key={doc._id}
											value={doc.title ?? ""}
											onSelect={() => navigateToLegal(doc)}
											className="cursor-pointer"
										>
											<Icon className="mr-2" />
											<div className="flex flex-col">
												<span className="font-medium">{doc.title}</span>
												{doc.description && (
													<span className="text-xs text-muted-foreground">
														{doc.description}
													</span>
												)}
											</div>
										</CommandItem>
									);
								})}
							</CommandGroup>
						)}
					</>
				)}
			</CommandList>
		</CommandDialog>
	);
}
