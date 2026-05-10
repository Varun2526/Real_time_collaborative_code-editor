/**
 * Role-based permission helpers for KodaX.
 * Provides clean utility functions for checking user roles
 * and determining what actions a user can perform in a room.
 *
 * Role hierarchy: Owner > Moderator > Member
 */

import { ROLES } from './constants.js';

/**
 * Finds a user's membership entry within a room's members array.
 *
 * @param {Array} members - Room members array from the API
 * @param {string} userId - The user's ID to find
 * @returns {object|undefined} The member object if found
 */
export const findMember = (members, userId) => {
  if (!members || !userId) return undefined;
  return members.find(
    (m) => (m.user?._id || m.user?.id || m.user) === userId
  );
};

/**
 * Gets the role of a user in a room.
 *
 * @param {Array} members - Room members array
 * @param {string} userId - The user's ID
 * @returns {string|null} Role string or null if not a member
 */
export const getUserRole = (members, userId) => {
  const member = findMember(members, userId);
  return member?.role || null;
};

// ─── Role Check Helpers ───────────────────────────────────────────────────────

/** @returns {boolean} True if the user is the room owner */
export const isOwner = (members, userId) =>
  getUserRole(members, userId) === ROLES.OWNER;

/** @returns {boolean} True if the user is a moderator */
export const isModerator = (members, userId) =>
  getUserRole(members, userId) === ROLES.MODERATOR;

/** @returns {boolean} True if the user is a regular member */
export const isMember = (members, userId) =>
  getUserRole(members, userId) === ROLES.MEMBER;

/** @returns {boolean} True if the user has any role in the room */
export const isRoomMember = (members, userId) =>
  getUserRole(members, userId) !== null;

// ─── Permission Check Helpers ─────────────────────────────────────────────────

/**
 * Can the user edit code and chat in this room?
 * All members (owner, moderator, member) can edit.
 */
export const canEdit = (members, userId) =>
  isRoomMember(members, userId);

/**
 * Can the user approve/reject join requests?
 * Only owners and moderators can manage requests.
 */
export const canManageRequests = (members, userId) => {
  const role = getUserRole(members, userId);
  return role === ROLES.OWNER || role === ROLES.MODERATOR;
};

/**
 * Can the user remove members from the room?
 * Owners and moderators can remove, but not the owner themselves.
 */
export const canRemoveMembers = (members, userId) => {
  const role = getUserRole(members, userId);
  return role === ROLES.OWNER || role === ROLES.MODERATOR;
};

/**
 * Can the user promote/demote other members?
 * Only the owner has this privilege.
 */
export const canManageRoles = (members, userId) =>
  isOwner(members, userId);

/**
 * Can the user transfer room ownership?
 * Only the current owner can transfer.
 */
export const canTransferOwnership = (members, userId) =>
  isOwner(members, userId);

/**
 * Can the user update room settings?
 * Owners and moderators can update settings.
 */
export const canUpdateSettings = (members, userId) => {
  const role = getUserRole(members, userId);
  return role === ROLES.OWNER || role === ROLES.MODERATOR;
};

/**
 * Can the user delete the room?
 * Only the owner can delete.
 */
export const canDeleteRoom = (members, userId) =>
  isOwner(members, userId);

/**
 * Can the user perform a specific action on a target member?
 * Prevents invalid actions like promoting the owner or removing yourself.
 *
 * @param {string} action - 'promote' | 'demote' | 'remove' | 'transfer'
 * @param {Array} members - Room members array
 * @param {string} actorId - The user performing the action
 * @param {string} targetId - The user being acted upon
 * @returns {boolean}
 */
export const canPerformAction = (action, members, actorId, targetId) => {
  if (actorId === targetId) return false; // Can't act on yourself

  const actorRole = getUserRole(members, actorId);
  const targetRole = getUserRole(members, targetId);

  if (!actorRole || !targetRole) return false;

  switch (action) {
    case 'promote':
      return actorRole === ROLES.OWNER && targetRole === ROLES.MEMBER;
    case 'demote':
      return actorRole === ROLES.OWNER && targetRole === ROLES.MODERATOR;
    case 'remove':
      return (
        (actorRole === ROLES.OWNER && targetRole !== ROLES.OWNER) ||
        (actorRole === ROLES.MODERATOR && targetRole === ROLES.MEMBER)
      );
    case 'transfer':
      return actorRole === ROLES.OWNER && targetRole !== ROLES.OWNER;
    default:
      return false;
  }
};
