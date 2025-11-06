// import { AtSignIcon } from "lucide-react";
// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupInput,
// } from "@/components/ui/input-group";
// import AppleIcon from "@/components/icons/apple-icon";
// import GithubIcon from "@/components/icons/github-icon";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import GoogleIcon from "@/components/icons/google-icon";
import Link from "next/link";

const LoginForm = () => {
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
        <Button className="w-full" size="lg" type="button">
          <GoogleIcon />
          Continue with Google
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
