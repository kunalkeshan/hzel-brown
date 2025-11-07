"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { TwitterIcon } from "@/components/icons/twitter-icon";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";
import { RedditIcon } from "@/components/icons/reddit-icon";
import { TelegramIcon } from "@/components/icons/telegram-icon";

interface SocialShareProps {
  url: string;
  title?: string;
  description?: string;
  className?: string;
}

export function SocialShare({
  url,
  title = "",
  description = "",
  className,
}: SocialShareProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?url=${encodedUrl}&title=${encodedTitle}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    telegram: `https://telegram.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TooltipProvider delayDuration={0}>
        {/* WhatsApp */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare("whatsapp")}
              aria-label="Share on WhatsApp"
              className="hover:bg-[#25D366]/10 hover:border-[#25D366] hover:text-[#25D366]"
            >
              <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            <p>Share on WhatsApp</p>
          </TooltipContent>
        </Tooltip>

        {/* Twitter/X */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare("twitter")}
              aria-label="Share on X"
              className="hover:bg-black/10 hover:border-black hover:text-black dark:hover:bg-white/10 dark:hover:border-white dark:hover:text-white"
            >
              <TwitterIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            <p>Share on X</p>
          </TooltipContent>
        </Tooltip>

        {/* LinkedIn */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare("linkedin")}
              aria-label="Share on LinkedIn"
              className="hover:bg-[#0A66C2]/10 hover:border-[#0A66C2] hover:text-[#0A66C2]"
            >
              <LinkedInIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            <p>Share on LinkedIn</p>
          </TooltipContent>
        </Tooltip>

        {/* Reddit */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare("reddit")}
              aria-label="Share on Reddit"
              className="hover:bg-[#FF4500]/10 hover:border-[#FF4500] hover:text-[#FF4500]"
            >
              <RedditIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            <p>Share on Reddit</p>
          </TooltipContent>
        </Tooltip>

        {/* Telegram */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare("telegram")}
              aria-label="Share on Telegram"
              className="hover:bg-[#26A5E4]/10 hover:border-[#26A5E4] hover:text-[#26A5E4]"
            >
              <TelegramIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            <p>Share on Telegram</p>
          </TooltipContent>
        </Tooltip>

        {/* Copy Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="disabled:opacity-100"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy link"}
              disabled={copied}
            >
              <div
                className={cn(
                  "transition-all",
                  copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
              >
                <CheckIcon
                  className="stroke-emerald-500"
                  size={16}
                  aria-hidden="true"
                />
              </div>
              <div
                className={cn(
                  "absolute transition-all",
                  copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                )}
              >
                <CopyIcon size={16} aria-hidden="true" />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            <p>Copy link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
