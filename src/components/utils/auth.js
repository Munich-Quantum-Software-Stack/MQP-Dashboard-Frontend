import { redirect } from 'react-router-dom';

export function getMinutes(duration) {
  return Math.floor((duration / 1000 / 60) % 60);
}
export function getSeconds(duration) {
  return Math.floor((duration / 1000) % 60);
}

export function getExpiration() {
  return localStorage.getItem('expiration');
}
export function setExpiration() {
  const expiration = new Date();
  // const timeZone = 1; // timeZone: Berlin
  // const timeZoneOffset = date.getTimezoneOffset() * 60 * 1000;
  // const expiration = date.setTime(date.getTime() + timeZoneOffset);
  expiration.setSeconds(expiration.getSeconds() + 15 * 60); // convert 15 minutes to seconds
  localStorage.setItem('expiration', expiration.toISOString());
  //return expiration.toISOString();
}

export function getTokenDuration() {
  const savedExpirarionDate = localStorage.getItem('expiration');
  const expirationDate = new Date(savedExpirarionDate); // convert to Date format
  //const expirationDate = new Date(expiration);
  const now = new Date(); // get current moment
  const duration = expirationDate.getTime() - now.getTime(); // (unit: ms)
  return duration;
}

/*
 * Token
 */
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

export function tokenLoader() {
  return getAuthToken();
}

export function checkTokenLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect('/login');
  }

  return token;
}

/*
 * IsForcedReset
 */

export function getForcedResetStatus() {
  const isReset = localStorage.getItem('isReset');
  if (isReset || isReset === '1') {
    return null;
  }
  return isReset;
}
