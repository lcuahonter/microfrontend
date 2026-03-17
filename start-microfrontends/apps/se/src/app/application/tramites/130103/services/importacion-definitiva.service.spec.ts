import { ImportacionDefinitivaService } from './importacion-definitiva.service';
import { HttpClient } from '@angular/common/http';
import { CatalogoServices } from '@libs/shared/data-access-user/src';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';
import { Tramite130103Store } from '../../../estados/tramites/tramite130103.store';
import { Tramite130103Query } from '../../../estados/queries/tramite130103.query';

describe('ImportacionDefinitivaService', () => {
  let service: ImportacionDefinitivaService;
  let http: any;
  let tramite130103Store: any;
  let catalogoServices: any;
  let tramite130103Query: any;
  let httpService: any;

  beforeEach(() => {
    http = { get: jest.fn(), post: jest.fn() };
    tramite130103Store = { actualizarEstado: jest.fn() };
    catalogoServices = {
      regimenesCatalogo: jest.fn(),
      catalogoUnidadMedida: jest.fn(),
      catalogoFraccionDivisiones: jest.fn(),
      catalogoEsquemaRegla: jest.fn(),
      clasificacionRegimenCatalogo: jest.fn(),
      fraccionesArancelariasCatalogo: jest.fn(),
      unidadesMedidasTarifariasCatalogo: jest.fn(),
      entidadesFederativasCatalogo: jest.fn(),
      representacionFederalCatalogo: jest.fn(),
      todosPaisesSeleccionados: jest.fn(),
      tratadosAcuerdoCatalogo: jest.fn(),
      getpaisesBloqueCatalogo: jest.fn(),
      getFraccionesArancelariasAutoCompleteCatalogo: jest.fn()
    };
    tramite130103Query = { selectSolicitud$: of({}), solicitud$: of({}) };
    httpService = { post: jest.fn() };
    service = new ImportacionDefinitivaService(
      http as HttpClient,
      tramite130103Store as Tramite130103Store,
      catalogoServices as CatalogoServices,
      tramite130103Query as Tramite130103Query,
      httpService as HttpCoreService
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getImportacionDefinitivaData should call http.get', () => {
    http.get.mockReturnValue(of({}));
    service.getImportacionDefinitivaData().subscribe();
    expect(http.get).toHaveBeenCalledWith('assets/json/130103/importacion-definitiva.json');
  });

  it('actualizarEstadoFormulario should call tramite130103Store.actualizarEstado', () => {
    const datos = { producto: 'test' };
    service.actualizarEstadoFormulario(datos as any);
    expect(tramite130103Store.actualizarEstado).toHaveBeenCalledWith(datos);
  });

  it('getRegimenCatalogo should call catalogoServices.regimenesCatalogo and map response', (done) => {
    catalogoServices.regimenesCatalogo.mockReturnValue(of({ datos: [1, 2] }));
    service.getRegimenCatalogo('id').subscribe(res => {
      expect(res).toEqual([1, 2]);
      done();
    });
  });

  it('getUnidadMedidaCatalogo should call catalogoServices.catalogoUnidadMedida and map response', (done) => {
    catalogoServices.catalogoUnidadMedida.mockReturnValue(of({ datos: [3, 4] }));
    service.getUnidadMedidaCatalogo('id').subscribe(res => {
      expect(res).toEqual([3, 4]);
      done();
    });
  });

  it('getFraccionDivisionesCatalogo should call catalogoServices.catalogoFraccionDivisiones and map response', (done) => {
    catalogoServices.catalogoFraccionDivisiones.mockReturnValue(of({ datos: [5, 6] }));
    service.getFraccionDivisionesCatalogo('id').subscribe(res => {
      expect(res).toEqual([5, 6]);
      done();
    });
  });

  it('getEsquemaReglaCatalogo should call catalogoServices.catalogoEsquemaRegla and map response', (done) => {
    catalogoServices.catalogoEsquemaRegla.mockReturnValue(of({ datos: [7, 8] }));
    service.getEsquemaReglaCatalogo('id').subscribe(res => {
      expect(res).toEqual([7, 8]);
      done();
    });
  });

  it('getClasificacionRegimenCatalogo should call catalogoServices.clasificacionRegimenCatalogo and map response', (done) => {
    catalogoServices.clasificacionRegimenCatalogo.mockReturnValue(of({ datos: [9, 10] }));
    service.getClasificacionRegimenCatalogo('id').subscribe(res => {
      expect(res).toEqual([9, 10]);
      done();
    });
  });

  it('getFraccionCatalogoService should call catalogoServices.fraccionesArancelariasCatalogo and map response', (done) => {
    catalogoServices.fraccionesArancelariasCatalogo.mockReturnValue(of({ datos: [11, 12] }));
    service.getFraccionCatalogoService('id').subscribe(res => {
      expect(res).toEqual([11, 12]);
      done();
    });
  });

  it('getUMTService should call catalogoServices.unidadesMedidasTarifariasCatalogo and map response', (done) => {
    catalogoServices.unidadesMedidasTarifariasCatalogo.mockReturnValue(of({ datos: [13, 14] }));
    service.getUMTService('id', 'fraccion').subscribe(res => {
      expect(res).toEqual([13, 14]);
      done();
    });
  });

  it('getEntidadesFederativasCatalogo should call catalogoServices.entidadesFederativasCatalogo and map response', (done) => {
    catalogoServices.entidadesFederativasCatalogo.mockReturnValue(of({ datos: [15, 16] }));
    service.getEntidadesFederativasCatalogo('id').subscribe(res => {
      expect(res).toEqual([15, 16]);
      done();
    });
  });

  it('getRepresentacionFederalCatalogo should call catalogoServices.representacionFederalCatalogo and map response', (done) => {
    catalogoServices.representacionFederalCatalogo.mockReturnValue(of({ datos: [17, 18] }));
    service.getRepresentacionFederalCatalogo('id', 'cve').subscribe(res => {
      expect(res).toEqual([17, 18]);
      done();
    });
  });

  it('getTodosPaisesSeleccionados should call catalogoServices.todosPaisesSeleccionados and map response', (done) => {
    catalogoServices.todosPaisesSeleccionados.mockReturnValue(of({ datos: [19, 20] }));
    service.getTodosPaisesSeleccionados('id').subscribe(res => {
      expect(res).toEqual([19, 20]);
      done();
    });
  });

  it('getBloqueService should call catalogoServices.tratadosAcuerdoCatalogo and map response', (done) => {
    catalogoServices.tratadosAcuerdoCatalogo.mockReturnValue(of({ datos: [21, 22] }));
    service.getBloqueService('tramite').subscribe(res => {
      expect(res).toEqual([21, 22]);
      done();
    });
  });

  it('getMostrarPartidasService should call http.get', () => {
    http.get.mockReturnValue(of({}));
    service.getMostrarPartidasService(1).subscribe();
    expect(http.get).toHaveBeenCalled();
  });

  it('getPaisesPorBloqueService should call catalogoServices.getpaisesBloqueCatalogo and map response', (done) => {
    catalogoServices.getpaisesBloqueCatalogo.mockReturnValue(of({ datos: [23, 24] }));
    service.getPaisesPorBloqueService('tramite', 'id').subscribe(res => {
      expect(res).toEqual([23, 24]);
      done();
    });
  });

  it('getFraccionDescripcionPartidasDeLaMercanciaService should call catalogoServices.getFraccionesArancelariasAutoCompleteCatalogo and map response', (done) => {
    catalogoServices.getFraccionesArancelariasAutoCompleteCatalogo.mockReturnValue(of({ datos: [25, 26] }));
    service.getFraccionDescripcionPartidasDeLaMercanciaService('tramite', 'id').subscribe(res => {
      expect(res).toEqual([25, 26]);
      done();
    });
  });

  it('guardarDatosPost should call http.post', () => {
    http.post.mockReturnValue(of({}));
    service.guardarDatosPost({ test: 'data' }).subscribe();
    expect(http.post).toHaveBeenCalled();
  });

  it('buscarDatosPost should call httpService.post', () => {
    httpService.post.mockReturnValue(of({}));
    service.buscarDatosPost({ test: 'data' }).subscribe();
    expect(httpService.post).toHaveBeenCalled();
  });

  it('getAllState should return tramite130103Query.selectSolicitud$', (done) => {
    service.getAllState().subscribe(res => {
      expect(res).toEqual({});
      done();
    });
  });

  it('getPayloadDatos should handle tableBodyData', () => {
    const item = { tableBodyData: [{ test: 1 }] } as any;
    const result = service.getPayloadDatos(item);
    expect(Array.isArray(result) || typeof result === 'object').toBe(true);
  });

  it('guardarPayloadDatos should return an object', () => {
    const item = { tableBodyData: [{ test: 1 }] } as any;
    const result = service.guardarPayloadDatos(item);
    expect(typeof result === 'object').toBe(true);
  });
});
