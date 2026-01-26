/**
 * MSW Server Setup for React Native
 * Polyfills must be imported before MSW
 */
import './polyfills';
import { setupServer } from 'msw/native';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
