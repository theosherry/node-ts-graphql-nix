import { greet } from './index';

test('greet says hello', () => {
  expect(greet('Theo')).toBe('Hello, Theo');
});
