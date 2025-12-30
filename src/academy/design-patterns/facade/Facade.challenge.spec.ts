import { describe, it, expect } from 'vitest';
import { ConverterFacade } from './FacadeChallenge';

describe('Facade Challenge', () => {
  it('should convert video', () => {
    const converter = new ConverterFacade();
    const result = converter.convert('vid.mp4', 'ogg');
    expect(result).toContain('Converting vid.mp4 to ogg'); 
  });
});
