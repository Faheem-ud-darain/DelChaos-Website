import { renderToString } from 'react-dom/server';
import App from './App.tsx';
import { FAQ } from './data/faq.ts';

export const render = () => renderToString(<App />);
export const faq = FAQ;
