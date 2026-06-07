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

    // 9. Roundabout — Blue circle with three clockwise curved white arrows
    case "roundabout":
      return wrap(
        "Roundabout sign",
        <>
          <defs>
            <marker
              id="rnd-arr"
              markerWidth="10"
              markerHeight="8"
              refX="9"
              refY="4"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <polygon points="0,0 10,4 0,8" fill="#ffffff" />
            </marker>
          </defs>
          <circle cx="60" cy="60" r="56" fill="#1e5aa8" />
          {/* Three clockwise arcs, each ~70°, at 120° spacing, radius=30 from center (60,60) */}
          {/* Arc 1: 5° → 75° */}
          <path
            d="M 89.9,62.6 A 30,30 0 0,1 67.8,88.9"
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            markerEnd="url(#rnd-arr)"
          />
          {/* Arc 2: 125° → 195° */}
          <path
            d="M 42.8,84.5 A 30,30 0 0,1 31.1,52.2"
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            markerEnd="url(#rnd-arr)"
          />
          {/* Arc 3: 245° → 315° */}
          <path
            d="M 47.3,32.8 A 30,30 0 0,1 81.2,38.8"
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            markerEnd="url(#rnd-arr)"
          />
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

    // 14. One-lane bridge give way — White portrait rect, large red arrow UP (left = oncoming priority), small black arrow DOWN (right = you give way)
    case "one-lane-bridge-give-way":
      return wrap(
        "Give way at one-lane bridge sign",
        <>
          <rect x="10" y="4" width="100" height="112" rx="6" fill="#ffffff" stroke="#111111" strokeWidth="4" />
          {/* Large RED arrow UP — left side (oncoming traffic has right of way) */}
          {/* Arrowhead (wider) */}
          <polygon points="35,10 12,44 58,44" fill="#d11f1f" />
          {/* Shaft */}
          <rect x="23" y="42" width="24" height="62" rx="3" fill="#d11f1f" />
          {/* Small BLACK arrow DOWN — right side (you must give way) */}
          {/* Shaft */}
          <rect x="72" y="28" width="16" height="50" rx="3" fill="#111111" />
          {/* Arrowhead (narrower) */}
          <polygon points="80,108 64,82 96,82" fill="#111111" />
        </>
      );

    // 15. One-lane bridge priority — Blue portrait rect, large white arrow UP (left = you have priority), small red arrow DOWN (right = oncoming gives way)
    case "one-lane-bridge-priority":
      return wrap(
        "Priority at one-lane bridge sign",
        <>
          <rect x="10" y="4" width="100" height="112" rx="6" fill="#1e5aa8" stroke="#111111" strokeWidth="4" />
          {/* Large WHITE arrow UP — left side (you have right of way) */}
          <polygon points="35,10 12,44 58,44" fill="#ffffff" />
          <rect x="23" y="42" width="24" height="62" rx="3" fill="#ffffff" />
          {/* Small RED arrow DOWN — right side (oncoming must give way) */}
          <rect x="72" y="28" width="16" height="50" rx="3" fill="#d11f1f" />
          <polygon points="80,108 64,82 96,82" fill="#d11f1f" />
        </>
      );

    default:
      return null;
  }
}
