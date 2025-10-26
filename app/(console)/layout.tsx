import { SidebarProvider } from "@/components/ui/sidebar";
import StoreProvider from "@/lib/store/store-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Console | Star Manager",
  description: "Manage your starred repositories"
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </StoreProvider>
  );
}
