import "jasmine";
import {sum} from './main';

describe('main', () => {
  it('shoud return the sum of two numbers', () => {
    const result = sum(1, 2);
    expect(result).toBe(3);
  });
});