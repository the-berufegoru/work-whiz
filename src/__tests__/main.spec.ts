import { describe, it, expect } from '@jest/globals';

describe('Hello World Test Suite', () => {
  it('should return hello world', () => {
    const message = 'Hello, World!';
    expect(message).toBe('Hello, World!');
  });
});
