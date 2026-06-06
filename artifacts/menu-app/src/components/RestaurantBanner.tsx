export function RestaurantBanner() {
    return (
        <div
            className="relative w-full overflow-hidden flex flex-col items-center justify-center px-10 pt-12 pb-9 text-center"
            style={{
                background: `
          radial-gradient(ellipse 80% 60% at 50% 38%, rgba(30,80,45,0.28) 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 18% 80%, rgba(20,60,35,0.18) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 82% 20%, rgba(25,70,40,0.15) 0%, transparent 60%),
          linear-gradient(155deg, #071510 0%, #0a1a10 40%, #0d2018 65%, #091409 100%)
        `,
                isolation: "isolate",
            }}
        >
            {/* Gold frame border — same */}
            <div
                className="absolute inset-0 rounded-xl pointer-events-none z-10"
                style={{ border: "1px solid rgba(212,160,50,0.22)" }}
            />

            {/* Glow spots — pine green */}
            <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[340px] h-[230px] rounded-full pointer-events-none z-0"
                style={{ background: "radial-gradient(circle,rgba(30,90,50,.22) 0%,transparent 70%)", filter: "blur(70px)" }} />
            <div className="absolute bottom-[-55px] left-[4%] w-[220px] h-[170px] rounded-full pointer-events-none z-0"
                style={{ background: "radial-gradient(circle,rgba(20,65,38,.18) 0%,transparent 70%)", filter: "blur(70px)" }} />
            <div className="absolute bottom-[-55px] right-[4%] w-[220px] h-[170px] rounded-full pointer-events-none z-0"
                style={{ background: "radial-gradient(circle,rgba(20,65,38,.18) 0%,transparent 70%)", filter: "blur(70px)" }} />

            {/* Corner decorations — same */}
            {[
                "top-[22px] left-[26px]",
                "top-[22px] right-[26px] scale-x-[-1]",
                "bottom-[22px] left-[26px] scale-y-[-1]",
                "bottom-[22px] right-[26px] scale-[-1]",
            ].map((pos, i) => (
                <svg key={i} className={`absolute z-20 opacity-25 ${pos}`} width="54" height="54" viewBox="0 0 54 54" fill="none">
                    <path d="M4 50L4 4L50 4" stroke="#d4a032" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="4" cy="4" r="2.5" fill="#d4a032" opacity=".7" />
                </svg>
            ))}

            {/* ── ALL CONTENT BELOW IS 100% UNCHANGED ── */}
            <div className="relative z-20 flex flex-col items-center w-full">
                <span className="text-4xl mb-2 leading-none"
                    style={{ color: "#d4a032", filter: "drop-shadow(0 0 16px rgba(212,160,50,.55))" }}>
                    ੴ
                </span>
                <h1
                    className="font-bold tracking-wide leading-tight mb-1"
                    style={{
                        fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
                        fontSize: "clamp(2.1rem, 5.2vw, 3.8rem)",
                        letterSpacing: ".08em",
                        background: "linear-gradient(175deg,#f5e6a0 0%,#d4a032 32%,#b8842a 58%,#e8c96a 82%,#c8961e 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 2px 20px rgba(212,160,50,.38))",
                    }}
                >
                    Sher-E-Punjab
                </h1>
                <p className="mb-5"
                    style={{
                        fontFamily: "'EB Garamond', Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "clamp(.84rem,1.4vw,1.05rem)",
                        color: "#c8a050",
                        letterSpacing: ".16em",
                        opacity: .78,
                    }}>
                    — Pure Vegetarian —
                </p>
                <Divider className="max-w-[460px] mb-4" />
                <div className="flex items-center gap-4 mb-3">
                    {["Breakfast", "Lunch", "Dinner"].map((m, i) => (
                        <>
                            <span key={m} style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(.62rem,1.1vw,.78rem)", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "#c8a050", opacity: .86 }}>
                                {m}
                            </span>
                            {i < 2 && <div className="w-[3px] h-[3px] rounded-full opacity-40" style={{ background: "#d4a032" }} />}
                        </>
                    ))}
                </div>
                <p className="mb-5"
                    style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: "clamp(.7rem,1.1vw,.88rem)", color: "rgba(220,185,120,.56)", letterSpacing: ".1em" }}>
                    Kitty Party &nbsp;·&nbsp; Birthday Party &nbsp;·&nbsp; Conference Hall &nbsp;·&nbsp; Outdoor Catering
                </p>
                <Divider className="max-w-[300px] mb-4" />
                <div className="inline-flex items-center gap-2 px-[18px] py-[5px] rounded-full"
                    style={{ border: "1px solid rgba(212,160,50,.26)" }}>
                    <Dot /><span style={{ fontFamily: "'Cinzel',serif", fontSize: ".6rem", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(212,160,50,.52)" }}>Est. Jaipur · Since 1990</span><Dot />
                </div>
            </div>

            <div className="relative z-20 flex flex-col items-center gap-1 mt-6">
                <Divider className="max-w-[380px] mb-3" />
                <span style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: "clamp(.78rem,1.3vw,.92rem)", color: "rgba(212,160,50,.62)", letterSpacing: ".06em" }}>
                    Shop No. 5-6, Sec. No.2, SFS, Agarwal Farm, Mansarovar, Jaipur
                </span>
                <span style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(.68rem,1.1vw,.8rem)", fontWeight: 600, letterSpacing: ".12em", color: "rgba(212,160,50,.52)" }}>
                    Contact: 9314199992 &nbsp;·&nbsp; 9351009993
                </span>
            </div>
        </div>
    );
}

// Helper components
function Divider({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 w-full ${className}`}>
            <div className="flex-1 h-px opacity-50" style={{ background: "linear-gradient(90deg,transparent,#d4a032 30%,#d4a032 70%,transparent)" }} />
            <div className="w-[6px] h-[6px] rotate-45 opacity-70 flex-shrink-0" style={{ background: "#d4a032" }} />
            <div className="flex-1 h-px opacity-50" style={{ background: "linear-gradient(90deg,transparent,#d4a032 30%,#d4a032 70%,transparent)" }} />
        </div>
    );
}

function Dot() {
    return <div className="w-[3px] h-[3px] rounded-full" style={{ background: "rgba(212,160,50,.38)" }} />;
}