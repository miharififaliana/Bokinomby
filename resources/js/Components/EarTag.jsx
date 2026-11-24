const BARS = [6, 3, 2, 7, 3, 5, 2, 8, 4, 2, 6, 3, 3, 7, 2, 5, 8, 2, 4, 6, 3, 7, 2, 4];

export default function EarTag({
    number = 'BK-0248',
    label = 'BOKINOMBY · REGISTRE BOVIN',
    title,
    rows = [],
    footer,
    className = '',
}) {
    return (
        <div className={`relative aspect-[380/560] w-full ${className}`}>
            <svg
                viewBox="0 0 380 560"
                className="h-full w-full drop-shadow-[0_36px_70px_rgba(25,38,31,0.22)]"
                aria-hidden="true"
            >
                <path
                    d="M64 60H316A34 34 0 0 1 350 94V392A34 34 0 0 1 338 416L210 548A28 28 0 0 1 170 548L42 416A34 34 0 0 1 30 392V94A34 34 0 0 1 64 60Z"
                    fill="#F6F2E7"
                    stroke="#19261F"
                    strokeWidth="3"
                />
                <circle cx="190" cy="106" r="20" fill="#B08A4F" />
                <circle cx="190" cy="106" r="10" fill="#F6F2E7" />
                <path
                    d="M54 470H326"
                    stroke="#19261F"
                    strokeOpacity="0.14"
                    strokeDasharray="2 6"
                />
            </svg>

            <div className="absolute inset-0 flex flex-col px-[12%] pb-[9%] pt-[28%]">
                <div className="flex-1">
                    <p className="text-[9px] font-semibold tracking-[0.18em] text-base-content/55">
                        {label}
                    </p>

                    <p className="mt-2 font-display text-[clamp(1.5rem,4.6vw,2.6rem)] leading-[0.95] tracking-tight text-base-content">
                        {number}
                    </p>

                    {title && (
                        <p className="mt-2 max-w-[90%] truncate text-xs font-medium text-base-content/70">
                            {title}
                        </p>
                    )}

                    {rows.length > 0 && (
                        <dl className="mt-5">
                            {rows.map(([term, value]) => (
                                <div
                                    key={term}
                                    className="flex items-baseline justify-between gap-3 border-t border-base-content/15 py-2"
                                >
                                    <dt className="text-[9px] uppercase tracking-[0.12em] text-base-content/45">
                                        {term}
                                    </dt>
                                    <dd className="truncate text-[11px] font-medium text-base-content/80">
                                        {value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>

                <div>
                    <div className="mb-2 flex items-center gap-[3px]">
                        {BARS.map((width, index) => (
                            <span
                                key={index}
                                className="h-7 bg-base-content/70"
                                style={{ width: `${width / 2.2}px` }}
                            />
                        ))}
                    </div>

                    <p className="text-[8px] tracking-[0.16em] text-base-content/40">
                        {footer ?? 'IDENTIFICATION · LOCALISATION · SANTÉ'}
                    </p>
                </div>
            </div>
        </div>
    );
}
