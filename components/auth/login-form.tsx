"use client";

// import { AtSignIcon } from "lucide-react";
// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupInput,
// } from "@/components/ui/input-group";
// import AppleIcon from "@/components/icons/apple-icon";
// import GithubIcon from "@/components/icons/github-icon";
import { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  type AuthError,
} from "firebase/auth";
import { auth } from "@/firebase/app";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import GoogleIcon from "@/components/icons/google-icon";
import Link from "next/link";
import { toast } from "sonner";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      provider.addScope("email");

      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setIsLoading(false);
      toast.success("Successfully signed in with Google");
    } catch (error) {
      setIsLoading(false);
      const authError = error as AuthError;

      let errorMessage = "Failed to sign in with Google. Please try again.";

      if (authError.code === "auth/popup-blocked") {
        errorMessage =
          "Popup was blocked. Please allow popups for this site and try again.";
      } else if (authError.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled.";
      } else if (authError.code === "auth/network-request-failed") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (authError.message) {
        errorMessage = authError.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="mx-auto space-y-4 sm:w-sm ">
      <Logo className="lg:hidden w-16 h-auto" />
      <div className="flex flex-col space-y-1">
        <h1 className="font-bold text-2xl tracking-wide">
          Sign In or Join Now!
        </h1>
        <p className="text-base text-muted-foreground">
          login or create your Hezel Brown account.
        </p>
      </div>
      <div className="space-y-2">
        <Button
          className="w-full"
          size="lg"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <GoogleIcon />
          {isLoading ? "Signing in..." : "Continue with Google"}
        </Button>
        {/* <Button className="w-full" size="lg" type="button">
          <AppleIcon />
          Continue with Apple
        </Button>
        <Button className="w-full" size="lg" type="button">
          <GithubIcon />
          Continue with GitHub
        </Button> */}
      </div>

      {/* <div className="flex w-full items-center justify-center">
        <div className="h-px w-full bg-border" />
        <span className="px-2 text-muted-foreground text-xs">OR</span>
        <div className="h-px w-full bg-border" />
      </div> */}

      {/* <form className="space-y-2">
        <p className="text-start text-muted-foreground text-xs">
          Enter your email address to sign in or create an account
        </p>
        <InputGroup>
          <InputGroupInput placeholder="your.email@example.com" type="email" />
          <InputGroupAddon>
            <AtSignIcon />
          </InputGroupAddon>
        </InputGroup>

        <Button className="w-full" type="button">
          Continue With Email
        </Button>
      </form> */}
      <p className="mt-8 text-muted-foreground text-sm">
        By clicking continue, you agree to our{" "}
        <Link
          className="underline underline-offset-4 hover:text-primary"
          href="/legals/terms"
          prefetch={false}
        >
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link
          className="underline underline-offset-4 hover:text-primary"
          href="/legals/privacy"
          prefetch={false}
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default LoginForm;
