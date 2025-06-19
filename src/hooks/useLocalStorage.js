import { useState } from 'react';

/**
 * 로컬스토리지에 key로 저장된 값을 읽고, 업데이트하는 커스텀 훅
 * @param {string} key - 로컬스토리지에 저장할 키 이름
 * @param {*} initialValue - 키가 없을 때 사용할 기본값
 * @returns [storedValue, setValue] 형태로 반환
 */
export function useLocalStorage(key, initialValue) {
  // 초기값을 로컬스토리지에서 가져오되, 없으면 initialValue 사용
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null
        ? JSON.parse(item)
        : initialValue;
    } catch (error) {
      console.warn('useLocalStorage get error:', error);
      return initialValue;
    }
  });

  // 값을 업데이트하고 로컬스토리지에도 반영하는 함수
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('useLocalStorage set error:', error);
    }
  };

  return [storedValue, setValue];
}