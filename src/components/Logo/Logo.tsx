import './Logo.css'

/** Orange tile with a ring buoy, used as the system mark. */
export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <span className="logo-tile" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 40 40" width={size * 0.62} height={size * 0.62}>
        <circle cx="20" cy="20" r="14" fill="none" stroke="#fff" strokeWidth="8" />
        <circle
          cx="20"
          cy="20"
          r="14"
          fill="none"
          stroke="#e53935"
          strokeWidth="8"
          strokeDasharray="11 11"
          strokeDashoffset="5.5"
        />
        <circle cx="20" cy="20" r="18" fill="none" stroke="#c62828" strokeWidth="0.8" opacity="0.5" />
        <circle cx="20" cy="20" r="10" fill="none" stroke="#c62828" strokeWidth="0.8" opacity="0.5" />
      </svg>
    </span>
  )
}
