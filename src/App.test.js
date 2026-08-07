import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import i18n from './i18n';

beforeEach(() => {
  global.fetch = jest.fn(() => new Promise(() => {}));
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders the hero name', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  );
  expect(screen.getByText(/Amine MEKKI/i)).toBeInTheDocument();
});
