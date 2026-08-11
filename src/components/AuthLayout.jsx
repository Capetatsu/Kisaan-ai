import React from "react";
import KisaanMascot from "@/components/mascot/KisaanMascot";
import FarmerFriend from "@/components/mascot/FarmerFriend";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10 relative overflow-hidden">
      {/* playful background blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-water/10" />
      <div className="pointer-events-none absolute top-1/3 -left-20 h-48 w-48 rounded-full bg-sun/10" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-5">
            <KisaanMascot mood="happy" className="w-16 h-16 animate-float-soft drop-shadow" />
            <span className="text-2xl font-extrabold font-heading tracking-tight">
              Kisaan<span className="text-primary"> AI</span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-3">
            {Icon && (
              <span className="grid place-items-center h-12 w-12 rounded-2xl bg-primary text-white border-4 border-primary-edge shadow-duo">
                <Icon className="w-6 h-6" strokeWidth={2.6} aria-hidden="true" />
              </span>
            )}
            <div className="text-left">
              <h1 className="text-2xl font-extrabold font-heading tracking-tight leading-tight">{title}</h1>
              {subtitle && <p className="text-muted-foreground text-sm font-semibold">{subtitle}</p>}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl border-2 border-border shadow-lift p-6">
          {children}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          <FarmerFriend variant="wave" className="w-10 h-10" />
          {footer && <div className="text-sm text-muted-foreground font-semibold">{footer}</div>}
        </div>
      </div>
    </div>
  );
}