import { TercerospageComponent } from './tercerospage.component';

describe('TercerospageComponent', () => {
  let componente: TercerospageComponent;

  const consultaQueryMock = {
    selectConsultaioState$: {
      pipe: () => ({
        subscribe: jest.fn()
      })
    }
  };

  const certificadoServiceMock = {
    getAllDatosForma: jest.fn().mockReturnValue({
      pipe: () => ({
        subscribe: jest.fn()
      })
    }),
    updateTercerosRelacionado: jest.fn()
  };

  const tercerosServiceMock = {
    obtenerSelectorList: jest.fn().mockReturnValue({
      pipe: () => ({
        subscribe: jest.fn()
      })
    })
  };

  const storeMock = {
    actualizarSelectedTerceros: jest.fn(),
    actualizarSelectedExdora: jest.fn(),
    updatedatosForma: jest.fn()
  };

  beforeEach(() => {
    componente = new TercerospageComponent(
      consultaQueryMock as any,
      certificadoServiceMock as any,
      tercerosServiceMock as any,
      storeMock as any
    );
  });

  it('debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debe retornar true desde validarFormulario cuando tercerosRelacionados.validarFormulario retorna true', () => {
    componente.tercerosRelacionados = {
      validarFormulario: jest.fn().mockReturnValue(true)
    } as any;

    const resultado = componente.validarFormulario();
    expect(resultado).toBe(true);
  });

  it('debe inicializar con valores por defecto', () => {
    expect(componente.personas).toEqual([]);
    expect(componente.datosForma).toEqual([]);
    expect(componente.catalogosDatos).toEqual({});
    expect(componente.esFormularioSoloLectura).toBe(false);
  });
});
