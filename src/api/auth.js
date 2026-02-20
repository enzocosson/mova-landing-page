const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Connexion — retourne { access_token, role, _id, firstname, lastname, profileImage }
 */
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || data.message || "Erreur de connexion");
  return data;
};

/**
 * Inscription — retourne { accessToken, role, userId, email, firstname, lastname }
 */
export const registerUser = async ({ name, email, password, role }) => {
  // Mapping des rôles frontend → backend
  const roleMap = {
    runner: "coureur",
    spectator: "visitor",
    organizer: "organisateur",
  };
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      role: roleMap[role] || "coureur",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");
  return data;
};

/**
 * Vérification du token stocké
 */
export const verifyToken = async (token) => {
  const res = await fetch(`${API_URL}/auth/verify-token`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Token invalide");
  return data;
};

/**
 * Vérifier une invitation par token (public)
 */
export const checkInvitation = async (inviteToken) => {
  const res = await fetch(`${API_URL}/invitations/token/${inviteToken}`);
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Invitation invalide ou expirée");
  return data;
};

/**
 * Vérifier si un email est déjà enregistré (public)
 */
export const checkEmail = async (email) => {
  const res = await fetch(
    `${API_URL}/auth/check-email?email=${encodeURIComponent(email)}`,
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Erreur lors de la vérification");
  return data; // { exists: boolean, role: string }
};

/**
 * Connexion avec token d'invitation — accepte la course automatiquement
 */
export const loginWithInvitation = async (email, password, invitationToken) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, invitationToken }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || data.message || "Mot de passe incorrect");
  return data;
};

/**
 * Inscription avec token d'invitation — crée le compte et rejoint la course
 */
export const registerWithInvitation = async ({
  email,
  password,
  firstname,
  lastname,
  invitationToken,
}) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      firstname,
      lastname,
      invitationToken,
      role: "coureur",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");
  return data;
};
