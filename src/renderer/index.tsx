import { Provider } from 'jotai';
import { createRoot } from 'react-dom/client';
import { App } from './app';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <Provider>
    <App />
  </Provider>
);
