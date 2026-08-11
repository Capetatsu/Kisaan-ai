import React, { useState, useEffect, useRef, useCallback } from "react";
import KisaanMascot from "@/components/mascot/KisaanMascot";
import FarmerFriend from "@/components/mascot/FarmerFriend";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  const [zoomDone, setZoomDone] = useState(false);
  const [targetStyle, setTargetStyle] = useState(null);
  const inlineRef = useRef(null);

  const measureTarget = useCallback(() => {
    if (!inlineRef.current) return;
    const rect = inlineRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dx = (rect.left + rect.width / 2 - vw / 2);
    const dy = (rect.top + rect.height / 2 - vh / 2);
    setTargetStyle({
      finalX: dx,
      finalY: dy,
      finalScale: rect.width / 64,
    });
  }, []);

  useEffect(() => {
    measureTarget();
    window.addEventListener("resize", measureTarget);
    return () => window.removeEventListener("resize", measureTarget);
  }, [measureTarget]);

  useEffect(() => {
    const t = setTimeout(() => setZoomDone(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10 relative overflow-hidden">
      {/* Huge mascot that zooms from filling the screen to the inline position */}
      {!zoomDone && targetStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="auth-mascot-zoom"
            style={{
              "--final-x": `${targetStyle.finalX}px`,
              "--final-y": `${targetStyle.finalY}px`,
              "--final-scale": targetStyle.finalScale,
            }}
          >
            <KisaanMascot mood="happy" className="w-16 h-16" />
          </div>
        </div>
      )}

      {/* playful background blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 animate-fade-up stagger-5" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-water/10 animate-fade-up stagger-6" />
      <div className="pointer-events-none absolute top-1/3 -left-20 h-48 w-48 rounded-full bg-sun/10 animate-fade-up stagger-7" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div ref={inlineRef} className={`transition-opacity duration-500 ${zoomDone ? "opacity-100" : "opacity-0"}`}>
              <KisaanMascot mood="happy" className="w-16 h-16 animate-float-soft drop-shadow" />
            </div>
            <span className="text-2xl font-extrabold font-heading tracking-tight animate-fade-up stagger-2" style={{ animationDelay: "0.3s" }}>
              Kisaan<span className="text-primary"> AI</span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-3">
            {Icon && (
              <span className="grid place-items-center h-12 w-12 rounded-2xl bg-primary text-white border-4 border-primary-edge shadow-duo animate-fade-up stagger-3" style={{ animationDelay: "0.5s" }}>
                <Icon className="w-6 h-6" strokeWidth={2.6} aria-hidden="true" />
              </span>
            )}
            <div className="text-left">
              <h1 className="text-2xl font-extrabold font-heading tracking-tight leading-tight animate-fade-up stagger-3" style={{ animationDelay: "0.5s" }}>{title}</h1>
              {subtitle && <p className="text-muted-foreground text-sm font-semibold animate-fade-up stagger-4" style={{ animationDelay: "0.7s" }}>{subtitle}</p>}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl border-2 border-border shadow-lift p-6 animate-fade-up stagger-4" style={{ animationDelay: "0.9s" }}>
          {children}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 animate-fade-up stagger-5" style={{ animationDelay: "1.1s" }}>
          <FarmerFriend variant="wave" className="w-10 h-10" />
          {footer && <div className="text-sm text-muted-foreground font-semibold">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
