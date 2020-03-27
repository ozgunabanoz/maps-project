import { useState, useEffect, useCallback } from 'react';

let logOutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);

    const tokenExpDate =
      expirationDate ||
      new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpDate);

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remTime =
        tokenExpirationDate.getTime() - new Date().getTime();

      logOutTimer = setTimeout(logout, remTime);
    } else {
      clearTimeout(logOutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId };
};
