import { Link } from "react-router-dom";

// Small CSS-only 3D cube: 6 faces, slow rotation, decorative.
export function Cube({ size = 56 }) {
  const half = size / 2;
  const faces = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(270deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`
  ];

  return (
    <div className="scene-3d" style={{ width: size, height: size }} aria-hidden="true">
      <div className="preserve-3d anim-cube relative" style={{ width: size, height: size }}>
        {faces.map((transform) => (
          <span
            key={transform}
            className="absolute inset-0 rounded-md border"
            style={{
              transform,
              borderColor: "color-mix(in srgb, var(--primary-color) 35%, transparent)",
              background: "linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 14%, transparent), color-mix(in srgb, var(--secondary-color) 10%, transparent))"
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Useful empty state: illustration, clear message, one primary action (optional).
export default function EmptyState({
  title = "Rien a afficher pour le moment",
  description,
  actionLabel,
  actionTo,
  onAction,
  compact = false
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? "px-6 py-10" : "px-6 py-16"}`}>
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        <span
          className="anim-breathe absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary-color) 18%, transparent), transparent 70%)" }}
        />
        <Cube size={44} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{description}</p> : null}
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="btn-primary mt-6">{actionLabel}</Link>
      ) : null}
      {actionLabel && !actionTo && onAction ? (
        <button type="button" onClick={onAction} className="btn-primary mt-6">{actionLabel}</button>
      ) : null}
    </div>
  );
}
