import { apiFetch } from './client.js';

/**
 * Fetch the Local Network feed (latest + trending).
 * @param {number} page - Page number (1-indexed)
 */
export async function fetchPosts(page = 1) {
  return apiFetch(`/posts?page=${page}&limit=20`);
}

/**
 * Create a new Local Network post.
 * @param {{ type: string, caption: string, image: string|null, locationText: string, locationCoords: { lat: number, lng: number } }} payload
 */
export async function createPost(payload) {
  return apiFetch('/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Toggle like on a post.
 * @param {string} postId
 */
export async function toggleLike(postId) {
  return apiFetch(`/posts/${postId}/like`, { method: 'POST' });
}

/**
 * Add a comment to a post.
 * @param {string} postId
 * @param {string} text
 */
export async function addComment(postId, text) {
  return apiFetch(`/posts/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

/**
 * Delete a post (must be owner).
 */
export async function deletePost(postId) {
  return apiFetch(`/posts/${postId}`, { method: 'DELETE' });
}

/**
 * Update the status of an issue post.
 */
export async function updatePostStatus(postId, status) {
  return apiFetch(`/posts/${postId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}
