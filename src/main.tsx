
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Оптимизирано стартиране на приложението
const startApp = () => {
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    // Изчистване на първоначалния спинер ако съществува
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
    
    // Стартиране на React приложението
    createRoot(rootElement).render(<App />);
  }
};

// Проверка дали DOM е готов
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  // Ако DOM е вече зареден, стартираме приложението веднага
  startApp();
}

// Добавяме функция за ръчно опресняване на страницата след публикуване
window.refreshAfterDeploy = () => {
  if ('serviceWorker' in navigator) {
    // Фукция която изчиства кеша и презарежда приложението
    navigator.serviceWorker.getRegistration().then(registration => {
      if (registration) {
        registration.update().then(() => {
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    });
  } else {
    window.location.reload();
  }
};
