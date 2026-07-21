"use client";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const AnimatedAuroraBackground = ({
  className,
  children,
  ...props
}: React.HTMLProps<HTMLDivElement> & { children: ReactNode }) => {
  return (
    <div
      className={cn(
        "relative flex flex-col w-full bg-gradient-to-br from-[#081729] via-[#05224c] to-[#023579] overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Aurora Blobs - using CarBrain brand colors to keep the blue theme */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#00bbea]/20 blur-[120px] animate-aurora" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#005c8a]/30 blur-[150px] animate-aurora-reverse" />
        <div className="absolute top-[20%] right-[30%] w-[50%] h-[50%] rounded-full bg-[#00c6ef]/15 blur-[100px] animate-aurora delay-700" />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col flex-1">{children}</div>
    </div>
  );
};
