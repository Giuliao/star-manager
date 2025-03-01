"use client";
import {
  selectedContentRefresh as _ctxSelectedContentRefresh,
} from "@/lib/store/star-slice";
import { useAppSelector } from "@/lib/hooks/use-store";
import Loading from "./loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  const ctxSelectedContentRefresh = useAppSelector(_ctxSelectedContentRefresh);
  return ctxSelectedContentRefresh ? <Loading /> : <>{children}</>
}
