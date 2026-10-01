import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext(null);
const CLIENT_AGENCY_STORAGE_KEY = "client_agency_id";

function extractAgencySlug(pathname) {
  const match = pathname.match(/^\/agency\/([^/]+)/);
  return match?.[1] || "";
}

function buildPortalBasePath(agencySlug) {
  return agencySlug ? `/agency/${agencySlug}` : "";
}

function buildClientPathname(pathname, portalBasePath) {
  if (!portalBasePath) return pathname;
  const normalized = pathname === "/" ? "" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${portalBasePath}${normalized}`;
}

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const [agencies, setAgencies] = useState([]);
  const [activeAgencyId, setActiveAgencyId] = useState("");
  const [settings, setSettings] = useState({
    agencies: [],
    activeAgency: null,
    activeAgencyId: "",
    agency: null,
    visual: null,
    loading: true
  });

  const pathAgencySlug = extractAgencySlug(location.pathname);

  useEffect(() => {
    let active = true;

    api.get("/agencies/public/list")
      .then((response) => {
        if (!active) return;
        setAgencies(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        if (!active) return;
        setAgencies([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!agencies.length) return;

    const searchParams = new URLSearchParams(location.search);
    const agencyIdFromQuery = searchParams.get("agency");
    const agencyIdFromStorage = localStorage.getItem(CLIENT_AGENCY_STORAGE_KEY);
    const agencyIdFromUser = user?.agency?.id;
    const agencyIdFromPath = pathAgencySlug
      ? agencies.find((agency) => agency.slug === pathAgencySlug)?.id
      : "";

    const resolvedAgencyId = user?.type === "CLIENT" && agencyIdFromUser
      ? agencyIdFromUser
      : agencyIdFromPath || [agencyIdFromQuery, agencyIdFromUser, agencyIdFromStorage, agencies[0]?.id]
        .find((candidate) => candidate && agencies.some((agency) => agency.id === candidate));

    if (resolvedAgencyId && resolvedAgencyId !== activeAgencyId) {
      setActiveAgencyId(resolvedAgencyId);
    }
  }, [activeAgencyId, agencies, location.pathname, location.search, pathAgencySlug, user]);

  useEffect(() => {
    if (!activeAgencyId) {
      setSettings((current) => ({ ...current, agencies, loading: false }));
      return;
    }

    let active = true;
    setSettings((current) => ({ ...current, agencies, activeAgencyId, loading: true }));

    Promise.all([
      api.get(`/settings/agency?agencyId=${activeAgencyId}`),
      api.get(`/settings/visual?agencyId=${activeAgencyId}`)
    ])
      .then(([agencyResponse, visualResponse]) => {
        if (!active) return;

        const activeAgency = agencies.find((agency) => agency.id === activeAgencyId) || null;
        const merged = {
          agencies,
          activeAgencyId,
          activeAgency,
          agency: agencyResponse.data,
          visual: visualResponse.data,
          loading: false
        };

        setSettings(merged);
        localStorage.setItem(CLIENT_AGENCY_STORAGE_KEY, activeAgencyId);

        document.documentElement.style.setProperty("--primary-color", visualResponse.data?.primaryColor || "#0f766e");
        document.documentElement.style.setProperty("--secondary-color", visualResponse.data?.secondaryColor || "#f59e0b");
      })
      .catch(() => {
        if (!active) return;
        setSettings((current) => ({
          ...current,
          agencies,
          activeAgencyId,
          activeAgency: agencies.find((agency) => agency.id === activeAgencyId) || null,
          loading: false
        }));
      });

    return () => {
      active = false;
    };
  }, [activeAgencyId, agencies]);

  const value = useMemo(
    () => {
      const activeAgencySlug = settings.activeAgency?.slug || pathAgencySlug || "";
      const portalBasePath = buildPortalBasePath(activeAgencySlug);
      const isPortalScoped = Boolean(pathAgencySlug);
      const isAgencyLocked = isPortalScoped || (user?.type === "CLIENT" && Boolean(user?.agency?.id));

      function buildClientPath(pathname) {
        const nextPathname = buildClientPathname(pathname, portalBasePath);
        if (isPortalScoped || !activeAgencyId) {
          return nextPathname;
        }

        const separator = nextPathname.includes("?") ? "&" : "?";
        return `${nextPathname}${separator}agency=${activeAgencyId}`;
      }

      return {
        ...settings,
        agencies,
        activeAgencyId,
        setActiveAgencyId,
        activeAgencySlug,
        portalBasePath,
        isPortalScoped,
        isAgencyLocked,
        buildClientPath
      };
    },
    [activeAgencyId, agencies, pathAgencySlug, settings, user]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeSettings() {
  return useContext(ThemeContext);
}
