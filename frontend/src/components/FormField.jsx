export default function FormField({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[0.8rem] font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
