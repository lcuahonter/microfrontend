import { DatosDelTramiteService } from './datos-del-tramite.service';
import { Solicitud40302Store } from '../estados/tramite40302.store';
import { Solicitud40302Query } from '../estados/tramite40302.query';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

jest.mock('../estados/tramite40302.store');
jest.mock('../estados/tramite40302.query');
jest.mock('@angular/common/http');

describe('DatosDelTramiteService', () => {
  let service: DatosDelTramiteService;
  let mockStore: jest.Mocked<Solicitud40302Store>;
  let mockQuery: jest.Mocked<Solicitud40302Query>;
  let mockHttp: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockStore = new Solicitud40302Store() as any;
    mockQuery = new Solicitud40302Query({} as any) as any;
    mockHttp = new HttpClient({} as any) as any;

    service = new DatosDelTramiteService(mockStore, mockQuery, mockHttp);
  });

  describe('Propiedades de configuración', () => {
    it('debe exponer urlServer y urlServerCatalogos desde ENVIRONMENT', () => {
      // No se puede cambiar ENVIRONMENT en tiempo de ejecución, solo comprobamos que existan las propiedades
      expect(service.urlServer).toBeDefined();
      expect(service.urlServerCatalogos).toBeDefined();
    });
  });

  describe('setInitialValues', () => {
    it('debe actualizar el store con los valores iniciales correctos', () => {
      const spy = jest.spyOn(mockStore, 'update');
      service.setInitialValues();
      expect(spy).toHaveBeenCalledWith({
        cveFolioCaat: '3L6V',
        descTipoCaat: 'Naviero',
        descTipoAgente: 'Agente Naviero',
        directorGeneralNombre: 'HAZEL',
        primerApellido: 'NAVA',
        segundoApellido: 'AVILA',
      });
    });
  });

  describe('getSolicitudState', () => {
    it('debe retornar el observable del estado actual de la solicitud', () => {
      const mockObservable = of({ test: 'valor' } as any);
      mockQuery.select.mockReturnValue(mockObservable);
      const result = service.getSolicitudState();
      expect(result).toBe(mockObservable);
      expect(mockQuery.select).toHaveBeenCalled();
    });
  });

  describe('actualizarEstadoFormulario', () => {
    it('debe actualizar los campos del store con los datos proporcionados', () => {
      const datos = {
        directorGeneralNombre: 'JUAN',
        primerApellido: 'PEREZ',
        segundoApellido: 'LOPEZ',
      } as any;

      mockStore.setDirectorGeneralNombre = jest.fn();
      mockStore.setPrimerApellido = jest.fn();
      mockStore.setSegundoApellido = jest.fn();

      service.actualizarEstadoFormulario(datos);

      expect(mockStore.setDirectorGeneralNombre).toHaveBeenCalledWith('JUAN');
      expect(mockStore.setPrimerApellido).toHaveBeenCalledWith('PEREZ');
      expect(mockStore.setSegundoApellido).toHaveBeenCalledWith('LOPEZ');
    });
  });

  describe('getRegistroTomaMuestrasMercanciasData', () => {
    it('debe llamar a http.get con la ruta correcta y retornar el observable', () => {
      const mockResponse = { cveFolioCaat: '3L6V' } as any;
      (mockHttp.get as jest.Mock).mockReturnValue(of(mockResponse));

      const obs$ = service.getRegistroTomaMuestrasMercanciasData();
      expect(mockHttp.get).toHaveBeenCalledWith('assets/json/40302/registro-transportista.json');
      obs$.subscribe(data => {
        expect(data).toEqual(mockResponse);
      });
    });
  });

  describe('Cobertura de constructor', () => {
    it('debe crear la instancia correctamente', () => {
      expect(service).toBeTruthy();
    });
  });
});