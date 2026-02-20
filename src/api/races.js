const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Courses d'un coureur connecté — GET /race/my-races
 */
export const fetchMyRaces = async (token) => {
  const res = await fetch(`${API_URL}/race/my-races`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(
      data.message || "Erreur lors de la récupération des courses",
    );
  return data; // { races: [...], total: n }
};

/**
 * Toutes les courses (public) — GET /race
 * Utilisé côté organisateur pour filtrer par owner
 */
export const fetchAllRaces = async () => {
  const res = await fetch(`${API_URL}/race`);
  const data = await res.json();
  if (!res.ok)
    throw new Error(
      data.message || "Erreur lors de la récupération des courses",
    );
  return Array.isArray(data) ? data : [];
};

/**
 * Détail d'une course — GET /race/:id
 */
export const fetchRace = async (id, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_URL}/race/${id}`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Course introuvable");
  return data;
};
