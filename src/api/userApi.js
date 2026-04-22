import { apiFetch } from './client.js';

/**
 * Fetch public user profile along with their posts.
 * @param {string} userId
 */
export async function fetchUserProfile(userId) {
  return apiFetch(`/users/${userId}`);
}
