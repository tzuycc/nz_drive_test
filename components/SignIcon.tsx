import React from "react";

export default function SignIcon({
  sign,
  className,
}: {
  sign: string;
  className?: string;
}) {
  const wrap = (label: string, children: React.ReactNode) => (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label={label}
      className={className ?? "mx-auto h-32 w-32"}
    >
      {children}
    </svg>
  );

  switch (sign) {
    // 1. Stop — Red octagon + white STOP text
    case "stop":
      return wrap(
        "Stop sign",
        <>
          {/* Regular octagon: 8 vertices calculated at 22.5° intervals, inset ~10px */}
          <polygon
            points="43,8 77,8 107,38 107,82 77,112 43,112 13,82 13,38"
            fill="#d11f1f"
          />
          <polygon
            points="43,8 77,8 107,38 107,82 77,112 43,112 13,82 13,38"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
          />
          <text
            x="60"
            y="60"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="22"
            fontWeight="700"
            fill="#ffffff"
            letterSpacing="1"
          >
            STOP
          </text>
        </>
      );

    // 2. Give way — Downward-pointing triangle, white fill, thick red border
    case "give-way":
      return wrap(
        "Give way sign",
        <>
          <polygon
            points="60,108 6,14 114,14"
            fill="#ffffff"
            stroke="#d11f1f"
            strokeWidth="8"
          />
        </>
      );

    // 3. Speed 50
    case "speed-50":
      return wrap(
        "50 km/h speed limit sign",
        <>
          <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#d11f1f" strokeWidth="11" />
          <text
            x="60"
            y="62"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="40"
            fontWeight="700"
            fill="#111111"
          >
            50
          </text>
        </>
      );

    // 4. Speed 100
    case "speed-100":
      return wrap(
        "100 km/h speed limit sign",
        <>
          <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#d11f1f" strokeWidth="11" />
          <text
            x="60"
            y="62"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="28"
            fontWeight="700"
            fill="#111111"
          >
            100
          </text>
        </>
      );

    // 5. Derestriction — white circle, thin black ring, diagonal slash upper-right to lower-left
    case "derestriction":
      return wrap(
        "End of speed limit (derestriction) sign",
        <>
          <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#111111" strokeWidth="5" />
          {/* Diagonal line from upper-right to lower-left */}
          <line
            x1="90"
            y1="18"
            x2="30"
            y2="102"
            stroke="#111111"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </>
      );

    // 6. No entry — Red circle, white horizontal bar
    case "no-entry":
      return wrap(
        "No entry sign",
        <>
          <circle cx="60" cy="60" r="54" fill="#d11f1f" />
          <rect x="20" y="50" width="80" height="20" rx="3" fill="#ffffff" />
        </>
      );

    // 7. No left turn — white circle + red ring + left-turn arrow + red diagonal slash
    case "no-left-turn":
      return wrap(
        "No left turn sign",
        <>
          <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#d11f1f" strokeWidth="9" />
          {/* Left-turn arrow: shaft goes up then curves left */}
          <path
            d="M66,82 L66,52 Q66,38 52,38 L44,38"
            fill="none"
            stroke="#111111"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrowhead pointing left */}
          <polygon points="44,38 56,30 56,46" fill="#111111" />
          {/* Red diagonal slash upper-left to lower-right */}
          <line
            x1="22"
            y1="22"
            x2="98"
            y2="98"
            stroke="#d11f1f"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </>
      );

    // 8. Railway crossing — white X (St Andrew's cross) with black outline on white bg
    case "railway-crossing":
      return wrap(
        "Railway level crossing sign",
        <>
          <rect x="4" y="4" width="112" height="112" rx="4" fill="#ffffff" stroke="#111111" strokeWidth="3" />
          {/* Two diagonal bars forming an X */}
          {/* Top-left to bottom-right bar */}
          <rect
            x="50"
            y="10"
            width="20"
            height="100"
            rx="6"
            fill="#ffffff"
            stroke="#111111"
            strokeWidth="3"
            transform="rotate(45 60 60)"
          />
          {/* Top-right to bottom-left bar */}
          <rect
            x="50"
            y="10"
            width="20"
            height="100"
            rx="6"
            fill="#ffffff"
            stroke="#111111"
            strokeWidth="3"
            transform="rotate(-45 60 60)"
          />
        </>
      );

    // 9. Roundabout — Blue circle with three white arrows in a ring
    case "roundabout":
      return wrap(
        "Roundabout sign",
        <>
          <circle cx="60" cy="60" r="56" fill="#1e5aa8" />
          {/* Central white ring suggestion */}
          <circle cx="60" cy="60" r="16" fill="none" stroke="#ffffff" strokeWidth="4" />
          {/* Three white arrowheads at 0°, 120°, 240° around the ring */}
          {/* Arrow at top (pointing right/clockwise) */}
          <g transform="rotate(0 60 60)">
            <polygon points="60,20 70,36 50,36" fill="#ffffff" />
          </g>
          <g transform="rotate(120 60 60)">
            <polygon points="60,20 70,36 50,36" fill="#ffffff" />
          </g>
          <g transform="rotate(240 60 60)">
            <polygon points="60,20 70,36 50,36" fill="#ffffff" />
          </g>
        </>
      );

    // 10. Crossroads — Yellow diamond + black plus cross
    case "crossroads":
      return wrap(
        "Crossroads ahead warning sign",
        <>
          {/* Diamond = square rotated 45° */}
          <rect
            x="12"
            y="12"
            width="96"
            height="96"
            rx="4"
            fill="#f5c400"
            stroke="#111111"
            strokeWidth="4"
            transform="rotate(45 60 60)"
          />
          {/* Plus/cross: horizontal bar */}
          <rect x="30" y="52" width="60" height="16" rx="3" fill="#111111" />
          {/* Plus/cross: vertical bar */}
          <rect x="52" y="30" width="16" height="60" rx="3" fill="#111111" />
        </>
      );

    // 11. Pedestrian crossing — Blue square + white walking person stick figure
    case "pedestrian-crossing":
      return wrap(
        "Pedestrian crossing sign",
        <>
          <rect x="4" y="4" width="112" height="112" rx="10" fill="#1e5aa8" />
          {/* Head */}
          <circle cx="62" cy="28" r="9" fill="#ffffff" />
          {/* Torso */}
          <line x1="62" y1="37" x2="62" y2="68" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          {/* Left leg (forward) */}
          <line x1="62" y1="68" x2="46" y2="92" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
          {/* Right leg (back) */}
          <line x1="62" y1="68" x2="74" y2="92" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
          {/* Left arm (forward) */}
          <line x1="62" y1="45" x2="44" y2="60" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          {/* Right arm (back) */}
          <line x1="62" y1="45" x2="78" y2="55" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
        </>
      );

    // 12. Accident — Orange rectangle with "ACCIDENT" text
    case "accident":
      return wrap(
        "Accident (crash ahead) sign",
        <>
          <rect x="6" y="28" width="108" height="64" rx="8" fill="#f57c00" />
          <text
            x="60"
            y="58"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="17"
            fontWeight="700"
            fill="#111111"
          >
            ACCIDENT
          </text>
        </>
      );

    // 13. Road works — Orange diamond + worker stick figure with shovel
    case "road-works":
      return wrap(
        "Road works ahead warning sign",
        <>
          {/* Diamond */}
          <rect
            x="12"
            y="12"
            width="96"
            height="96"
            rx="4"
            fill="#f57c00"
            stroke="#111111"
            strokeWidth="4"
            transform="rotate(45 60 60)"
          />
          {/* Worker head */}
          <circle cx="58" cy="38" r="8" fill="#111111" />
          {/* Worker torso */}
          <line x1="58" y1="46" x2="58" y2="70" stroke="#111111" strokeWidth="5" strokeLinecap="round" />
          {/* Worker legs */}
          <line x1="58" y1="70" x2="48" y2="88" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
          <line x1="58" y1="70" x2="68" y2="88" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
          {/* Worker arm holding shovel */}
          <line x1="58" y1="52" x2="72" y2="58" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
          {/* Shovel handle (diagonal line) */}
          <line x1="72" y1="58" x2="88" y2="42" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
          {/* Shovel blade */}
          <rect x="83" y="34" width="12" height="10" rx="2" fill="#111111" transform="rotate(-45 89 39)" />
        </>
      );

    // 14. One-lane bridge give way — White portrait rect + red arrow up (left) + black arrow down (right)
    case "one-lane-bridge-give-way":
      return wrap(
        "Give way at one-lane bridge sign",
        <>
          <rect x="14" y="4" width="92" height="112" rx="4" fill="#ffffff" stroke="#111111" strokeWidth="4" />
          {/* Red arrow UP on left (larger = oncoming priority) */}
          {/* Shaft */}
          <rect x="26" y="32" width="18" height="60" rx="3" fill="#d11f1f" />
          {/* Arrowhead */}
          <polygon points="35,12 18,36 52,36" fill="#d11f1f" />
          {/* Black arrow DOWN on right (smaller = you give way) */}
          {/* Shaft */}
          <rect x="76" y="30" width="14" height="50" rx="3" fill="#111111" />
          {/* Arrowhead */}
          <polygon points="83,108 70,86 96,86" fill="#111111" />
        </>
      );

    // 15. One-lane bridge priority — Blue portrait rect + white arrow up + red arrow down
    case "one-lane-bridge-priority":
      return wrap(
        "Priority at one-lane bridge sign",
        <>
          <rect x="14" y="4" width="92" height="112" rx="4" fill="#1e5aa8" stroke="#111111" strokeWidth="4" />
          {/* White arrow UP on left (larger = you have priority) */}
          {/* Shaft */}
          <rect x="26" y="32" width="18" height="60" rx="3" fill="#ffffff" />
          {/* Arrowhead */}
          <polygon points="35,12 18,36 52,36" fill="#ffffff" />
          {/* Red arrow DOWN on right (smaller = oncoming gives way) */}
          {/* Shaft */}
          <rect x="76" y="30" width="14" height="50" rx="3" fill="#d11f1f" />
          {/* Arrowhead */}
          <polygon points="83,108 70,86 96,86" fill="#d11f1f" />
        </>
      );

    default:
      return null;
  }
}
