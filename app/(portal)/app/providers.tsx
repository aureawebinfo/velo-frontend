"use client";

import React from "react";
import { EventProvider } from "@/contexts/EventContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <EventProvider>{children}</EventProvider>;
}