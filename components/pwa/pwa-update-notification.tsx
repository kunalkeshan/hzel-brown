"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, RefreshCw } from "lucide-react";

export function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );
  
  // Store event handlers in refs to ensure proper cleanup
  const handleControllerChangeRef = useRef<() => void>();
  const handleVisibilityChangeRef = useRef<() => void>();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let updateCheckInterval: NodeJS.Timeout;

    // Listen for new service worker updates
    const handleUpdate = (registration: ServiceWorkerRegistration) => {
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New content is available
            setWaitingWorker(newWorker);
            setShowUpdate(true);
          }
        });
      });
    };

    // Check for updates when tab becomes visible
    handleVisibilityChangeRef.current = () => {
      if (document.visibilityState === "visible") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update();
        });
      }
    };

    // Handle controller change
    handleControllerChangeRef.current = () => {
      window.location.reload();
    };

    // Get the current registration
    navigator.serviceWorker.ready.then((registration) => {
      handleUpdate(registration);

      // Check for updates every hour (only if this is the main/first instance)
      // Use a shared worker or limit to focused tabs to avoid redundant checks
      if (document.hasFocus()) {
        updateCheckInterval = setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    });
    
    // Add event listeners using the ref values
    const controllerChangeHandler = () => handleControllerChangeRef.current?.();
    const visibilityChangeHandler = () => handleVisibilityChangeRef.current?.();
    
    navigator.serviceWorker.addEventListener("controllerchange", controllerChangeHandler);
    document.addEventListener("visibilitychange", visibilityChangeHandler);

    // Cleanup on unmount
    return () => {
      if (updateCheckInterval) {
        clearInterval(updateCheckInterval);
      }
      navigator.serviceWorker.removeEventListener("controllerchange", controllerChangeHandler);
      document.removeEventListener("visibilitychange", visibilityChangeHandler);
    };
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="rounded-lg border border-border bg-background p-4 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Update Available</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              A new version of Hzel Brown is available with the latest content
              and improvements.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleUpdate} size="sm" className="flex-1">
                Update Now
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Later
              </Button>
            </div>
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
