import { AnimalesVivoContenedoraComponent } from './animales-vivo-contenedora.component';
import { CertificadoZoosanitarioServiceService } from '../../services/220201/certificado-zoosanitario.service';
import { ZoosanitarioQuery } from '../../queries/220201/zoosanitario.query';
import { ZoosanitarioStore } from '../../estados/220201/zoosanitario.store';
import { CatalogosService } from '../../services/220201/catalogos/catalogos.service';
import { FilaSolicitud } from '../../models/220201/capturar-solicitud.model';

describe('AnimalesVivoContenedoraComponent', () => {
  let component: AnimalesVivoContenedoraComponent;
  let mockApiService: any;
  let mockQuery: any;
  let mockStore: any;
  let mockCatalogoService: any;

  beforeEach(() => {
    mockApiService = {};
    mockQuery = { seleccionarState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() } };
    mockStore = { getValue: jest.fn().mockReturnValue({ tablaDatos: [], selectedDatos: [] }), update: jest.fn() };
    mockCatalogoService = {
      obtieneCatalogoSexosActivos: jest.fn().mockReturnValue({ subscribe: jest.fn(cb => cb({ datos: ['M', 'H'] })) }),
      obtieneCatalogoConsultaPaises: jest.fn().mockReturnValue({ subscribe: jest.fn(cb => cb({ datos: ['MX', 'US'] })) }),
      obtieneCatalogoEspecies: jest.fn().mockReturnValue({ subscribe: jest.fn(cb => cb({ datos: ['Bovino'] })) }),
      obtieneCatalogoUnidadesMedidaComerciales: jest.fn().mockReturnValue({ subscribe: jest.fn(cb => cb({ datos: ['KG'] })) }),
      obtieneCatalogoUsosMercancia: jest.fn().mockReturnValue({ subscribe: jest.fn(cb => cb({ datos: ['Consumo'] })) }),
      obtieneCatalogoFraccionesArancelarias: jest.fn().mockReturnValue({ subscribe: jest.fn(cb => cb({ datos: ['0101'] })) }),
      obtieneCatalogoRestricciones: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
      obtieneCatalogoNico: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    };

    component = new AnimalesVivoContenedoraComponent(
      mockApiService,
      mockQuery,
      mockStore,
      mockCatalogoService
    );
  });

  it('debe inicializar catalogosDatos con datos de los servicios', () => {
    expect(component.catalogosDatos.sexoList).toEqual(['M', 'H']);
    expect(component.catalogosDatos.paisOrigenList).toEqual(['MX', 'US']);
    expect(component.catalogosDatos.paisDeProcedenciaList).toEqual(['MX', 'US']);
    expect(component.catalogosDatos.especieList).toEqual(['Bovino']);
    expect(component.catalogosDatos.umcList).toEqual(['KG']);
    expect(component.catalogosDatos.usoList).toEqual(['Consumo']);
    expect(component.catalogosDatos.fraccionArancelariaList).toEqual(['0101']);
  });

  it('createFormularioFromValor debe combinar campos básicos y adicionales', () => {
    const valor: FilaSolicitud = {
      id: 1,
      tipoRequisito: 'A',
      requisito: 'B',
      numeroCertificadoInternacional: '123',
      fraccionArancelaria: '0101',
      descripcionFraccion: 'desc',
      nico: 'N1',
      descripcionNico: 'descN',
      descripcion: 'desc',
      sensibles: [],
      modificado: true,
      cantidadUMT: 5,
      umt: 'U1',
      cantidadUMC: 10,
      umc: 'U2',
      especie: 'Bovino',
      uso: 'Consumo',
      paisDeOrigen: 'MX',
      paisDeProcedencia: 'US',
      noPartida: 'NP',
      tipoDeProducto: 'TP',
      numeroDeLote: 'NL',
      certificadoInternacionalElectronico: 'CIE'
    } as FilaSolicitud;
    const result = (AnimalesVivoContenedoraComponent as any).createFormularioFromValor(valor);
    expect(result.id).toBe(1);
    expect(result.tipoRequisito).toBe('A');
    expect(result.umt).toBe('U1');
    expect(result.cantidadUMT).toBe('5');
    expect(result.umc).toBe('U2');
    expect(result.especie).toBe('Bovino');
    expect(result.uso).toBe('Consumo');
    expect(result.paisDeOrigen).toBe('MX');
    expect(result.paisDeProcedencia).toBe('US');
  });

  it('createDatosFromFormulario debe combinar campos básicos y adicionales', () => {
    const formulario: Partial<FilaSolicitud> = {
      tipoRequisito: 'A',
      requisito: 'B',
      cantidadUMT: '5',
      umt: 'U1',
      cantidadUMC: '10',
      umc: 'U2',
      especie: 'Bovino',
      uso: 'Consumo',
      paisDeOrigen: 'MX',
      paisDeProcedencia: 'US'
    };
    const result = (AnimalesVivoContenedoraComponent as any).createDatosFromFormulario(formulario);
    expect(result.tipoRequisito).toBe('A');
    expect(result.umt).toBe('U1');
    expect(result.cantidadUMT).toBe('5');
    expect(result.umc).toBe('U2');
    expect(result.especie).toBe('Bovino');
    expect(result.uso).toBe('Consumo');
    expect(result.paisDeOrigen).toBe('MX');
    expect(result.paisDeProcedencia).toBe('US');
    expect(result.id).toBeDefined();
  });

  it('agregarDatosFormulario elimina datos seleccionados y actualiza store', () => {
    const mockEvento = { formulario: { tipoRequisito: 'A' } };
    mockStore.getValue.mockReturnValue({
      tablaDatos: [{ id: 1 }, { id: 2 }],
      selectedDatos: [{ id: 1 }]
    });
    component.agregarDatosFormulario(mockEvento as any);
    expect(mockStore.update).toHaveBeenCalled();
  });

  it('ngOnDestroy debe completar destroyNotifier$', () => {
    const spyNext = jest.spyOn(component.destroyNotifier$, 'next');
    const spyComplete = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});