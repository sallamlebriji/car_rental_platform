import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useFetch } from "../hooks/useFetch";
import { currency, date } from "../utils/format";
import { useThemeSettings } from "../context/ThemeContext";

export default function MyReservationsPage() {
  const { buildClientPath } = useThemeSettings();
  const { data: reservations = [], error, loading } = useFetch("/reservations", []);

  if (error) {
    return (
      <div className="card p-6">
        <p className="text-slate-700">Connectez-vous pour consulter vos reservations.</p>
        <Link className="btn-primary mt-4 inline-flex" to={buildClientPath("/login")}>
          Acceder a l'espace client
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Mes reservations</h1>
        <p className="mt-2 text-slate-500">Suivi des demandes client et de leur statut.</p>
      </div>

      {loading ? (
        <div className="card p-6">Chargement des reservations...</div>
      ) : (
        <DataTable
          columns={[
            { key: "reference", label: "Reference" },
            { key: "car", label: "Voiture", render: (row) => `${row.car.brand} ${row.car.model}` },
            { key: "dates", label: "Dates", render: (row) => `${date(row.startDate)} - ${date(row.endDate)}` },
            { key: "totalPrice", label: "Montant", render: (row) => currency(row.totalPrice) },
            { key: "status", label: "Statut", render: (row) => <StatusBadge status={row.status} /> }
          ]}
          rows={reservations}
        />
      )}
    </div>
  );
}
