"use client";

import dynamic from "next/dynamic";

const CTASection = dynamic(() => import("@/components/sections/CTASection"), {
  ssr: false,
});

export default CTASection;