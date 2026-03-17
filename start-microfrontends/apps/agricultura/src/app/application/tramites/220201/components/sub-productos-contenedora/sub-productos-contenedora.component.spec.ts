import { SubProductosContenedoraComponent } from './sub-productos-contenedora.component';
import { FilaSolicitud } from '../../models/220201/capturar-solicitud.model';
import { ProductoDetallaEventos } from '../../../../shared/models/datos-de-la-solicitue.model';

describe('SubProductosContenedoraComponent', () => {
  let component: SubProductosContenedoraComponent;

  beforeEach(() => {
    // Mock services with minimal implementation
    const mockApiService = {} as any;
    const mockQuery = { seleccionarState$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) } } as any;
    const mockStore = { update: jest.fn() } as any;
    const mockCatalogoService = {} as any;

    component = new SubProductosContenedoraComponent(
      mockApiService,
      mockQuery,
      mockStore,
      mockCatalogoService
    );
  });

  it('should initialize catalogosDatos with empty arrays', () => {
    expect(component.catalogosDatos.tipoRequisitoList).toEqual([]);
    expect(component.catalogosDatos.requisitoList).toEqual([]);
  });

  it('should emit cerrar event', () => {
    const spy = jest.spyOn(component.cerrar, 'emit');
    component.cerrar.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set cantidadRegistros input', () => {
    component.cantidadRegistros = 5;
    expect(component.cantidadRegistros).toBe(5);
  });

  describe('static methods', () => {
    const baseFila: FilaSolicitud = {
      id: 123,
      tipoRequisito: 'A',
      requisito: 'B',
      numeroCertificadoInternacional: 'C',
      fraccionArancelaria: 'D',
      descripcionFraccion: 'E',
      nico: 'F',
      descripcionNico: 'G',
      descripcion: 'H',
      cantidadUMT: 10,
      umt: 'I',
      cantidadUMC: 20,
      umc: 'J',
      especie: 'K',
      uso: 'L',
      paisDeOrigen: 'M',
      paisDeProcedencia: 'N',
      sexo: '',
      presentacion: 'O',
      cantidadPresentacion: '',
      tipoPresentacion: 'P',
      tipoPlanta: 'Q',
      plantaAutorizadaOrigen: 'R',
      noPartida: '',
      tipoDeProducto: 'S',
      numeroDeLote: 'T',
      certificadoInternacionalElectronico: 'U'
    };

    it('createFormularioFromValor should combine basic and additional fields', () => {
      // @ts-ignore
      const result = SubProductosContenedoraComponent['createFormularioFromValor'](baseFila);
      expect(result.id).toBe(123);
      expect(result.tipoRequisito).toBe('A');
      expect(result.umt).toBe('I');
      expect(result.presentacion).toBe('O');
    });

    it('getBasicFields should return basic fields with defaults', () => {
      // @ts-ignore
      const result = SubProductosContenedoraComponent['getBasicFields']({});
      expect(typeof result.id).toBe('number');
      expect(result.tipoRequisito).toBe('');
    });

    it('getAdditionalFields should return additional fields as string', () => {
      // @ts-ignore
      const result = SubProductosContenedoraComponent['getAdditionalFields']({ cantidadUMT: 5, umt: 'X' });
      expect(result.cantidadUMT).toBe('5');
      expect(result.umt).toBe('X');
    });

    it('createDatosFromFormulario should combine basic and additional data fields', () => {
      // @ts-ignore
      const result = SubProductosContenedoraComponent['createDatosFromFormulario']({ id: 1, umt: 'Z' });
      expect(result.id).toBe(1);
      expect(result.umt).toBe('Z');
    });

    it('getBasicDataFields should return basic data fields with defaults', () => {
      // @ts-ignore
      const result = SubProductosContenedoraComponent['getBasicDataFields']({});
      expect(typeof result.id).toBe('number');
      expect(result.noPartida).toBe('');
    });

    it('getAdditionalDataFields should return additional data fields with defaults', () => {
      // @ts-ignore
      const result = SubProductosContenedoraComponent['getAdditionalDataFields']({});
      expect(result.umt).toBe('');
      expect(result.presentacion).toBe('');
    });
  });

  it('agregarDatosFormulario should call updateStoreWithDatos', () => {
    const evento: ProductoDetallaEventos = { formulario: { id: 1 } } as any;
    // @ts-ignore
    component['updateStoreWithDatos'] = jest.fn();
    component.agregarDatosFormulario(evento);
    // @ts-ignore
    expect(component['updateStoreWithDatos']).toHaveBeenCalled();
  });
});