import { Link, useLocation } from "react-router-dom";
import { currency } from "../utils/format";
import { useThemeSettings } from "../context/ThemeContext";

export default function ReservationSuccessPage() {
  const { state } = useLocation();
  const { buildClientPath } = useThemeSettings();
  const cataloguePath = buildClientPath("/cars");
  const reservationsPath = buildClientPath("/my-reservations");

  return (
    <div className="mx-auto max-w-2xl card p-8 text-center">
      <h1 className="text-4xl font-semibold">Reservation enregistree</h1>
      <p className="mt-4 text-slate-600">Votre demande a bien ete envoyee a l'agence.</p>
      {state ? (
        <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left">
          <p><strong>Reference:</strong> {state.reference}</p>
          <p><strong>Total:</strong> {currency(state.totalPrice)}</p>
          <p><strong>Avance:</strong> {currency(state.advanceAmount)}</p>
          <p><strong>Statut:</strong> {state.status}</p>
        </div>
      ) : null}
      <div className="mt-8 flex justify-center gap-3">
        <Link to={cataloguePath} className="btn-secondary">Retour catalogue</Link>
        <Link to={reservationsPath} className="btn-primary">Mes reservations</Link>
      </div>
    </div>
  );
}
