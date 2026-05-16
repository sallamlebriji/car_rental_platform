export default function AgencyScopeSelector({
  agencies = [],
  value,
  onChange,
  label = "Agence cible",
  helper = "Choisissez l'agence sur laquelle appliquer ces reglages."
}) {
  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white/85 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-1 text-sm text-slate-500">{helper}</p>
        </div>
        <div className="w-full lg:max-w-md">
          <select className="input" value={value || ""} onChange={(event) => onChange(event.target.value)}>
            {agencies.map((agency) => (
              <option key={agency.id} value={agency.id}>
                {agency.name} {agency.city ? `- ${agency.city}` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
