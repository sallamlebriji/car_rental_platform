import { useEffect, useMemo, useState } from "react";
import {
  FileBadge2,
  FileText,
  Gavel,
  GripVertical,
  Plus,
  Save
} from "lucide-react";
import api from "../api/client";
import ControlCenterHero from "../components/ControlCenterHero";
import { useFetch } from "../hooks/useFetch";

function Field({ label, hint, children }) {
  return (
    <label className="space-y-2.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </label>
  );
}

function buildClausesFromText(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function SuperAdminDocumentSettingsPage() {
  const { data: documents, setData } = useFetch("/settings/documents", []);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contractTitle, setContractTitle] = useState("");
  const [clauses, setClauses] = useState([""]);
  const [legalNotice, setLegalNotice] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [signatureClientLabel, setSignatureClientLabel] = useState("Signature client");
  const [signatureAgencyLabel, setSignatureAgencyLabel] = useState("Signature agence");

  useEffect(() => {
    if (!documents) return;
    setContractTitle(documents.contractTemplate || "");
    const parsedClauses = buildClausesFromText(documents.generalTerms);
    setClauses(parsedClauses.length ? parsedClauses : [""]);
    setLegalNotice(documents.legalNotice || "");
    setPrivacyPolicy(documents.privacyPolicy || "");
    setSignatureClientLabel(documents.invoiceTemplate || "Signature client");
    setSignatureAgencyLabel(documents.paymentReceiptTemplate || "Signature agence");
  }, [documents]);

  const normalizedClauses = useMemo(
    () => clauses.map((clause) => clause.trim()).filter(Boolean),
    [clauses]
  );

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const payload = {
      ...documents,
      contractTemplate: contractTitle,
      generalTerms: normalizedClauses.join("\n"),
      legalNotice,
      privacyPolicy,
      invoiceTemplate: signatureClientLabel,
      paymentReceiptTemplate: signatureAgencyLabel
    };

    const response = await api.put("/settings/documents", payload);
    setData(response.data);
    setSaved(true);
    setSaving(false);
  }

  function updateClause(index, value) {
    setClauses((current) => current.map((clause, currentIndex) => (currentIndex === index ? value : clause)));
  }

  function addClause() {
    setClauses((current) => [...current, ""]);
  }

  function removeClause(index) {
    setClauses((current) => (current.length === 1 ? [""] : current.filter((_, currentIndex) => currentIndex !== index)));
  }

  function moveClause(index, direction) {
    setClauses((current) => {
      const next = [...current];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) return current;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  if (!documents) return <div className="card p-8">Chargement...</div>;

  const heroMetrics = [
    {
      label: "Titre du contrat",
      value: contractTitle || "Non defini",
      hint: "Entete principal du contrat PDF.",
      icon: FileText
    },
    {
      label: "Clauses",
      value: normalizedClauses.length,
      hint: "Clauses actives injectees dans le PDF.",
      icon: FileBadge2
    },
    {
      label: "Cadre legal",
      value: legalNotice ? "Actif" : "A completer",
      hint: "Mentions legales et references juridiques.",
      icon: Gavel
    }
  ];

  return (
    <div className="space-y-8">
      <ControlCenterHero
        badge="Cadre contractuel"
        title="Documents"
        description="Parametrez le contrat de location, les clauses, les mentions legales et les signatures du reseau dans une logique de gabarit global."
        metrics={heroMetrics}
        tone="super"
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <FileBadge2 size={18} className="mt-1 text-slate-400" />
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Structure du contrat</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Definissez le titre et les clauses qui seront injectes dans le PDF genere.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <Field label="Titre du contrat" hint="Exemple: Contrat de location Atlas Drive">
                <input className="input" value={contractTitle} onChange={(event) => setContractTitle(event.target.value)} />
              </Field>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Clauses du contrat</p>
                    <p className="text-xs text-slate-500">Chaque ligne ci-dessous devient une clause distincte du contrat.</p>
                  </div>
                  <button type="button" className="btn-secondary gap-2" onClick={addClause}>
                    <Plus size={16} />
                    Ajouter une clause
                  </button>
                </div>

                {clauses.map((clause, index) => (
                  <div key={`${index}-${clause.length}`} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-3 rounded-xl bg-white p-2 text-slate-400">
                        <GripVertical size={16} />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-700">Clause {index + 1}</p>
                          <div className="flex items-center gap-2">
                            <button type="button" className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600" onClick={() => moveClause(index, -1)}>
                              Monter
                            </button>
                            <button type="button" className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600" onClick={() => moveClause(index, 1)}>
                              Descendre
                            </button>
                            <button type="button" className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-600" onClick={() => removeClause(index)}>
                              Supprimer
                            </button>
                          </div>
                        </div>
                        <textarea
                          className="input min-h-24 resize-y"
                          value={clause}
                          onChange={(event) => updateClause(index, event.target.value)}
                          placeholder="Exemple: La circulation du vehicule est limitee au territoire marocain sauf autorisation ecrite."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <Gavel size={18} className="mt-1 text-slate-400" />
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Cadre juridique et signatures</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Completez les mentions legales, la politique de confidentialite et les libelles de signature.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <Field label="Mentions legales" hint="Bloc additionnel a afficher dans le contrat PDF.">
                <textarea className="input min-h-28 resize-y" value={legalNotice} onChange={(event) => setLegalNotice(event.target.value)} />
              </Field>

              <Field label="Politique de confidentialite" hint="Texte reutilisable dans les documents legaux de la plateforme.">
                <textarea className="input min-h-28 resize-y" value={privacyPolicy} onChange={(event) => setPrivacyPolicy(event.target.value)} />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Libelle signature client">
                  <input className="input" value={signatureClientLabel} onChange={(event) => setSignatureClientLabel(event.target.value)} />
                </Field>
                <Field label="Libelle signature agence">
                  <input className="input" value={signatureAgencyLabel} onChange={(event) => setSignatureAgencyLabel(event.target.value)} />
                </Field>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <FileText size={18} className="mt-1 text-slate-400" />
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Apercu du contrat</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Previsualisation du contenu qui sera injecte dans le PDF.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-[1.8rem] bg-slate-950 p-6 text-white">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Modele actif</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight">{contractTitle || "Contrat de location"}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Le PDF reprendra ces clauses dans la section "Conditions generales de location".
                </p>
              </div>

              <div className="space-y-3">
                {normalizedClauses.length ? normalizedClauses.map((clause, index) => (
                  <div key={`${index}-${clause.slice(0, 20)}`} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Clause {index + 1}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{clause}</p>
                  </div>
                )) : (
                  <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Aucune clause valide n'est definie pour le moment.
                  </div>
                )}
              </div>

              <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-800">Signatures</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{signatureClientLabel}</div>
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{signatureAgencyLabel}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-primary min-w-52 gap-2" onClick={handleSave} disabled={saving}>
                <Save size={18} />
                {saving ? "Enregistrement..." : "Enregistrer les documents"}
              </button>
              {saved ? <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">Mise a jour effectuee.</span> : null}
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Les prochains contrats PDF utiliseront automatiquement cette configuration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
