/**
 * Authentication utilities for token and session management
 */
import { redirect } from 'react-router-dom';

/** Extract minutes from milliseconds */
export function getMinutes(duration) {
  return Math.floor((duration / 1000 / 60) % 60);
}

/** Extract seconds from milliseconds */
export function getSeconds(duration) {
  return Math.floor((duration / 1000) % 60);
}

/** Get stored expiration timestamp */
export function getExpiration() {
  return localStorage.getItem('expiration');
}

/** Set session expiration to 15 minutes from now */
export function setExpiration() {
  const expiration = new Date();
  // const timeZone = 1; // timeZone: Berlin
  // const timeZoneOffset = date.getTimezoneOffset() * 60 * 1000;
  // const expiration = date.setTime(date.getTime() + timeZoneOffset);
  expiration.setSeconds(expiration.getSeconds() + 15 * 60); // convert 15 minutes to seconds
  localStorage.setItem('expiration', expiration.toISOString());
  //return expiration.toISOString();
}

/** Calculate remaining session time in milliseconds */
export function getTokenDuration() {
  const savedExpirarionDate = localStorage.getItem('expiration');
  const expirationDate = new Date(savedExpirarionDate); // convert to Date format
  //const expirationDate = new Date(expiration);
  const now = new Date(); // get current moment
  const duration = expirationDate.getTime() - now.getTime(); // (unit: ms)
  return duration;
}

/** Get auth token from storage, returns 'EXPIRED' if session timed out */
export function getAuthToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  const tokenDuration = getTokenDuration();
  if (tokenDuration < 0) {
    return 'EXPIRED';
  }
  return token;
}

/** Route loader - returns current auth token */
export function tokenLoader() {
  return getAuthToken();
}

/** Route loader - redirects to login if no valid token */
export function checkTokenLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect('/login');
  }

  return token;
}

/** Check if user must complete forced password reset */
export function getForcedResetStatus() {
  const isReset = localStorage.getItem('isReset');
  if (isReset || isReset === '1') {
    return null;
  }
  return isReset;
}
