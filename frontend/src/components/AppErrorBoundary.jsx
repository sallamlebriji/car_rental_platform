import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || "Une erreur inconnue a bloque l'affichage."
    };
  }

  componentDidCatch(error) {
    console.error("AppErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-soft">
            <h1 className="text-3xl font-semibold text-slate-900">Erreur d'affichage</h1>
            <p className="mt-4 text-slate-600">
              L'application a rencontre une erreur React. Rechargez la page. Si le probleme continue, le message ci-dessous nous indique quoi corriger.
            </p>
            <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-emerald-300">
              {this.state.errorMessage}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
