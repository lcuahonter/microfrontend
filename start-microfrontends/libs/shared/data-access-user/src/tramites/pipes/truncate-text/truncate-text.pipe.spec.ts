import { TruncateText } from './truncate-text.pipe';

describe('TruncateText', () => {
  let pipe: TruncateText;

  beforeEach(() => {
    pipe = new TruncateText();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the original text when it is shorter than the limit', () => {
    const text = 'Hello World';
    const limit = 20;
    const result = pipe.transform(text, limit);
    expect(result).toBe('Hello World');
  });

  it('should return the original text when it equals the limit', () => {
    const text = 'Hello World';
    const limit = 11;
    const result = pipe.transform(text, limit);
    expect(result).toBe('Hello World');
  });

  it('should truncate text and add ellipsis when it exceeds the limit', () => {
    const text = 'This is a very long text that needs to be truncated';
    const limit = 20;
    const result = pipe.transform(text, limit);
    expect(result).toBe('This is a very long…');
    expect(result.length).toBe(20);
  });

  it('should handle empty string', () => {
    const text = '';
    const limit = 10;
    const result = pipe.transform(text, limit);
    expect(result).toBe('');
  });

  it('should handle null value', () => {
    const text = null as any;
    const limit = 10;
    const result = pipe.transform(text, limit);
    expect(result).toBeNull();
  });

  it('should handle undefined value', () => {
    const text = undefined as any;
    const limit = 10;
    const result = pipe.transform(text, limit);
    expect(result).toBeUndefined();
  });

  it('should truncate correctly with limit of 1', () => {
    const text = 'Hello';
    const limit = 1;
    const result = pipe.transform(text, limit);
    expect(result).toBe('…');
  });

  it('should handle special characters', () => {
    const text = 'Texto con ñ, á, é, í, ó, ú y símbolos @#$%';
    const limit = 15;
    const result = pipe.transform(text, limit);
    expect(result).toBe('Texto con ñ, á…');
  });
});
