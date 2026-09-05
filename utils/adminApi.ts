import { apiFetch } from "./apiFetch";

// código nuevo edizon
// Este archivo centraliza todas las funciones de la API que requieren rol ADMIN.
// No tiene UI propia — solo expone funciones listas para usar desde cualquier componente.
// Si alguien quiere construir una página de admin, solo importa estas funciones.

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "COUPLE";
  createdAt?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "COUPLE";
}

export interface AssignUserInput {
  userId: string;
  role: "ADMIN" | "COUPLE";
}

// ---------------------------------------------------------------------------
// Funciones de administración de usuarios
// ---------------------------------------------------------------------------

// código nuevo edizon
// Obtiene la lista de todos los usuarios registrados.
// Solo funciona si el token pertenece a un usuario con rol ADMIN.
// Retorna la lista de usuarios o lanza error si falla.
export async function listUsers(): Promise<User[]> {
  const res = await apiFetch("/users");
  if (!res.ok) throw new Error(`Error al listar usuarios (${res.status})`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// código nuevo edizon
// Crea un nuevo usuario con nombre, email, contraseña y rol.
// Solo funciona si el token pertenece a un usuario con rol ADMIN.
export async function createUser(input: CreateUserInput): Promise<User> {
  const res = await apiFetch("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Error al crear usuario (${res.status})`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Funciones de administración de eventos
// ---------------------------------------------------------------------------

// código nuevo edizon
// Cambia el estado de un evento (PLANNING, ACTIVE, FINISHED).
// Solo funciona si el token pertenece a un usuario con rol ADMIN
// y que sea miembro del evento.
export async function updateEventStatus(
  eventId: string,
  status: "PLANNING" | "ACTIVE" | "FINISHED"
): Promise<void> {
  const res = await apiFetch(`/events/${eventId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Error al cambiar estado del evento (${res.status})`);
}

// ---------------------------------------------------------------------------
// Funciones de membresía de eventos
// ---------------------------------------------------------------------------

// código nuevo edizon
// Asigna un usuario existente a un evento con un rol (ADMIN o COUPLE).
// Solo funciona si el token pertenece a un usuario con rol ADMIN
// y que sea miembro del evento.
export async function assignUserToEvent(
  eventId: string,
  input: AssignUserInput
): Promise<void> {
  const res = await apiFetch(`/events/${eventId}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Error al asignar usuario al evento (${res.status})`);
}

// código nuevo edizon
// Elimina un usuario de un evento.
// Solo funciona si el token pertenece a un usuario con rol ADMIN
// y que sea miembro del evento.
export async function removeUserFromEvent(
  eventId: string,
  userId: string
): Promise<void> {
  const res = await apiFetch(`/events/${eventId}/users/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error al eliminar usuario del evento (${res.status})`);
}
