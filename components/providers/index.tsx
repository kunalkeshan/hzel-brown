import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AuthProvider } from "./auth-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NuqsAdapter>
        <AuthProvider>{children}</AuthProvider>
      </NuqsAdapter>
    </>
  );
};

export default Providers;
