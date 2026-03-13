import { SoloLetrasNumerosDirective } from './alfanumerico-formato.directive';

describe('SoloLetrasNumerosDirective', () => {
  let directive: SoloLetrasNumerosDirective;

  beforeEach(() => {
    directive = new SoloLetrasNumerosDirective();
  });

  const runTest = (key: string, shouldPrevent: boolean) => {
    const event = {
      key,
      preventDefault: jest.fn(),
      ctrlKey: false,
      metaKey: false,
    } as unknown as KeyboardEvent;

    directive.onKeyPress(event);

    if (shouldPrevent) {
      expect(event.preventDefault).toHaveBeenCalled();
    } else {
      expect(event.preventDefault).not.toHaveBeenCalled();
    }
  };

  it('should allow only alphanumeric characters [a-zA-Z0-9]', () => {
    const valid = ['a', 'Z', '0', '9', 'B', 'y', '5'];
    const invalid = [
      '!', '@', '#', ' ', '-', '_', '.', ',', 'á', 'ñ', 'ü', 'ç',
      '(', ')', '*', '+', '=', '/', '\\', '|', '[', ']', '{', '}',
      ':', ';', '"', "'", '<', '>', '?', '`', '~'
    ];

    valid.forEach(key => runTest(key, false));
    invalid.forEach(key => runTest(key, true));
  });
});