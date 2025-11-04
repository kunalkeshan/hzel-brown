import { useCallback, useId, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type SelectableSize = "sm" | "md";

interface SelectableProps {
  id?: string;
  label: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: SelectableSize;
  showCheck?: boolean;
  animatePulse?: boolean;
}

export default function Selectable({
  id: idProp,
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  size = "sm",
  showCheck = true,
  animatePulse = false,
}: SelectableProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const prefersReducedMotion = useReducedMotion();

  const [internalChecked, setInternalChecked] = useState<boolean>(
    Boolean(defaultChecked)
  );

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? Boolean(checked) : internalChecked;

  const sizeClasses =
    size === "md" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";
  const iconPixelSize = size === "md" ? 14 : 12;

  const handleCheckedChange = useCallback(
    (v: unknown) => {
      const next = Boolean(v);
      if (!isControlled) setInternalChecked(next);
      onCheckedChange?.(next);
    },
    [isControlled, onCheckedChange]
  );

  const pulseAnimate = useMemo(() => {
    if (prefersReducedMotion || disabled || !animatePulse) {
      return { scale: 1 } as const;
    }
    return isChecked ? { scale: 1.04 } : { scale: 1 };
  }, [prefersReducedMotion, disabled, animatePulse, isChecked]);

  return (
    <motion.div
      initial={false}
      animate={pulseAnimate}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 24,
        duration: 0.18,
      }}
      className="inline-flex"
    >
      <Badge
        className={cn(
          "relative outline-none has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50 has-data-[state=unchecked]:bg-muted has-data-[state=unchecked]:text-muted-foreground peer-data-[state=checked]:text-white",
          sizeClasses,
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
        aria-disabled={disabled || undefined}
      >
        <Checkbox
          id={id}
          className="peer sr-only after:absolute after:inset-0"
          {...(isControlled
            ? { checked: isChecked, onCheckedChange: handleCheckedChange }
            : {
                defaultChecked,
                onCheckedChange: handleCheckedChange,
              })}
          disabled={disabled}
        />
        {showCheck && (
          <motion.span
            initial={false}
            animate={{ width: isChecked ? iconPixelSize : 0 }}
            transition={
              isChecked
                ? {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 0.18,
                    delay: 0,
                  }
                : {
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.18,
                    // Delay collapse slightly on exit so tick can finish exiting
                    delay: 0.06,
                  }
            }
            className={cn(
              "inline-flex items-center justify-center overflow-hidden",
              isChecked ? "mr-1" : "mr-0"
            )}
            aria-hidden="true"
            style={{ height: iconPixelSize }}
          >
            <motion.span
              initial={false}
              animate={isChecked ? { y: 0, opacity: 1 } : { y: 4, opacity: 0 }}
              transition={{
                duration: 0.18,
                ease: "easeOut",
                delay: isChecked ? 0.06 : 0,
              }}
              className="inline-flex text-white"
            >
              <CheckIcon size={iconPixelSize} />
            </motion.span>
          </motion.span>
        )}
        <label
          htmlFor={id}
          className={cn(
            "cursor-pointer select-none after:absolute after:inset-0",
            disabled && "cursor-not-allowed"
          )}
        >
          {label}
        </label>
      </Badge>
    </motion.div>
  );
}
