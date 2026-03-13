
import { FormBuilder } from '@angular/forms';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
    component = new DatosDeLaSolicitudComponent(
      fb,
      // fitosanitarioStore mock
      { selectDatosSolicitud$: { pipe: jest.fn(() => ({ subscribe: jest.fn() })) } } as any,
      // fitosanitarioQuery mock
      { selectDatosSolicitud$: { pipe: jest.fn(() => ({ subscribe: jest.fn() })) } } as any,
      // fitosanitarioService mock
      { 
        getObraDeArteTabla: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
        getOperacionData: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
        getMovimientoData: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
        getPaisData: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
        getTransporteData: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
        getAduanaData: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
        getMotivoData: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
        getMonedaData: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
        getArancelariaData: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
      } as any,
      // consultaioQuery mock
      { selectConsultaioState$: { pipe: jest.fn(() => ({ subscribe: jest.fn() })) } } as any,
      // Add 7 more mocks/dummy values for the remaining constructor parameters
      {} as any, // mock for parameter 6
      {} as any, // mock for parameter 7
      {} as any, // mock for parameter 8
      {} as any, // mock for parameter 9
      {} as any, // mock for parameter 10
      {} as any, // mock for parameter 11
      {} as any  // mock for parameter 12
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize colapsable to true', () => {
    expect(component.colapsable).toBe(true);
  });

  it('should have opcionDeBotonDeRadio with two options', () => {
    expect(component.opcionDeBotonDeRadio.length).toBe(2);
    expect(component.opcionDeBotonDeRadio[0].label).toBe('Animales Vivos');
    expect(component.opcionDeBotonDeRadio[1].label).toBe('Productos Subproductos');
  });

  it('should have tipoSeleccionsoliMercancias as CHECKBOX', () => {
    expect(component.tipoSeleccionsoliMercancias).toBeDefined();
  });

  it('should have configuracionColumnasoli defined and not empty', () => {
    expect(component.configuracionColumnasoli).toBeDefined();
    expect(component.configuracionColumnasoli.length).toBeGreaterThan(0);
  });

  it('should have configuracionColumnasSolicitud defined and not empty', () => {
    expect(component.configuracionColumnasSolicitud).toBeDefined();
    expect(component.configuracionColumnasSolicitud.length).toBeGreaterThan(0);
  });

  it('should have messageDeError as empty string by default', () => {
    expect(component.messageDeError).toBe('');
  });

  it('should have filasSeleccionadas as a Set', () => {
    expect(component.filasSeleccionadas instanceof Set).toBe(true);
  });

  it('should have esFormularioSoloLectura as false by default', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });
});