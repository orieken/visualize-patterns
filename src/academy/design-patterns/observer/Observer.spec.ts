import { describe, it, expect } from 'vitest';
import { NewsAgency, NewsChannel } from './Observer';

describe('Observer Pattern (Reference)', () => {
  it('should notify subscribers', () => {
    const agency = new NewsAgency();
    const c1 = new NewsChannel();
    const c2 = new NewsChannel();

    agency.subscribe(c1);
    agency.subscribe(c2);

    agency.notify('Breaking News!');

    expect(c1.latestNews).toBe('Breaking News!');
    expect(c2.latestNews).toBe('Breaking News!');

    agency.unsubscribe(c2);
    agency.notify('Update');

    expect(c1.latestNews).toBe('Update');
    expect(c2.latestNews).toBe('Breaking News!'); // Not updated
  });
});
