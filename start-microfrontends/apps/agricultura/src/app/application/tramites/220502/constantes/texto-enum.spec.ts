import { TEXTOS, FECHA_INSPECCION_INPUT } from './texto-enum';

describe('TEXTOS', () => {
    test('should have the correct TEXTOS_SOLICITUD message', () => {
        expect(TEXTOS.TEXTOS_SOLICITUD).toBe(
            'Al dar doble clic en el registro seleccionado creará una nueva solicitud con los mismos datos de la solicitud elegida.'
        );
    });

    test('should have the correct SECCION_LEYENDA_CONFIRMAR_TEXTOS message', () => {
        expect(TEXTOS.SECCION_LEYENDA_CONFIRMAR_TEXTOS).toBe(
            'Debes declarar la cantidad que ingresa en parcialidad por cada fracción arancelaria. La columna "Saldo pendiente" mostrará el saldo disponible para las siguientes parcialidades.'
        );
    });
});

describe('FECHA_INSPECCION_INPUT', () => {
    test('should have the correct labelNombre', () => {
        expect(FECHA_INSPECCION_INPUT.labelNombre).toBe('Fecha de inspección');
    });

    test('should be required', () => {
        expect(FECHA_INSPECCION_INPUT.required).toBe(true);
    });

    test('should not be enabled (habilitado should be false)', () => {
        expect(FECHA_INSPECCION_INPUT.habilitado).toBe(false);
    });
});