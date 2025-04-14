
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Компонент, който връща скрола в началото на страницата при промяна на маршрута
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Когато се промени pathname, връщаме скрола най-горе
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Компонентът не рендерира нищо
}
