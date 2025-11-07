"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        })
        .then((registration) => {
          console.log("Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // Check if iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !("MSStream" in window);

    // Check if already installed
    const isInStandaloneMode = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

    // Update state in a batch to avoid cascading renders
    setIsIOS(isIOSDevice);
    setIsStandalone(isInStandaloneMode);

    // For iOS, show prompt after a delay if not installed
    if (isIOSDevice && !isInStandaloneMode) {
      const timer = setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem("pwa-install-prompt-seen");
        if (!hasSeenPrompt) {
          setShowPrompt(true);
        }
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }

    // For Android/Chrome - handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const hasSeenPrompt = localStorage.getItem("pwa-install-prompt-seen");
      if (!hasSeenPrompt) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome installation
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
      localStorage.setItem("pwa-install-prompt-seen", "true");
    }
    // For iOS, the prompt will remain visible with instructions
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-prompt-seen", "true");
  };

  // Don't show anything if already installed or prompt dismissed
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="rounded-lg border border-border bg-background p-4 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Install Hzel Brown</h3>
            {isIOS ? (
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Install this app on your iPhone:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    Tap the Share button{" "}
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 text-xs"
                      role="img"
                      aria-label="share icon"
                    >
                      ⎋
                    </span>{" "}
                    in Safari
                  </li>
                  <li>
                    Scroll down and tap &quot;Add to Home Screen&quot;{" "}
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 text-xs"
                      role="img"
                      aria-label="plus icon"
                    >
                      ➕
                    </span>
                  </li>
                </ol>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Install our app for a better experience:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Quick access from your home screen</li>
                  <li>Works offline</li>
                  <li>Faster loading times</li>
                </ul>
                {deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="mt-3 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Install App
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
