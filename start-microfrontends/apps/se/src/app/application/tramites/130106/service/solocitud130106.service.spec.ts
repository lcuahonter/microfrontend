import { TestBed } from '@angular/core/testing';
import { Solocitud130106Service } from './service130106.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tramite130106Store } from '../../../estados/tramites/tramite130106.store';
import { CatalogoServices } from '@libs/shared/data-access-user/src/core/services/shared/catalogo.service';
import { Tramite130106Query } from '../../../estados/queries/tramite130106.query';

const mockState = {
  idSolicitud: 1,
  regimen: '',
  clasificacion: '',
  solicitudDescripcion: '',
  producto: '',
  fraccion: '',
  cantidad: '',
  valorFacturaUSD: '',
  unidadMedida: '',
  cantidadPartidasDeLaMercancia: '',
  descripcionPartidasDeLaMercancia: '',
  valorPartidaUSDPartidasDeLaMercancia: '',
  cantidadTotal: '',
  valorTotalUSD: '',
  bloque: '',
  usoEspecifico: '',
  justificacionImportacionExportacion: '',
  observaciones: '',
  entidad: '',
  representacion: '',
  filaSeleccionada: [],
  tableBodyData: [],
  mostrarTabla: false,
  defaultSelect: '',
  defaultProducto: '',
  fechasSeleccionadas: [],
  solicitud: '',
  factura: '',
  umt: '',
  mercanciaCantidad: '',
  mercanciaFactura: '',
  descripcion: '',
  especifico: '',
  justificacion: '',
  disponible: '',
  seleccionado: '',
  selectRangoDias: [],
  valorPartidaUSD: 0,
};

describe('Solocitud130106Service', () => {
  let service: Solocitud130106Service;
  let http: any;
  let store: any;
  let catalogoServices: any;
  let query: any;

  beforeEach(() => {
    http = { get: jest.fn(), post: jest.fn() };
    store = {
      setRegimen: jest.fn(),
      setClasificacion: jest.fn(),
      setSolicitudDescripcion: jest.fn(),
      setFraccion: jest.fn(),
      setCantidad: jest.fn(),
      setFactura: jest.fn(),
      setUmt: jest.fn(),
      setMercanciaCantidad: jest.fn(),
      setMercanciaFactura: jest.fn(),
      setDescripcion: jest.fn(),
      setEspecifico: jest.fn(),
      setJustificacion: jest.fn(),
      setObservaciones: jest.fn(),
      setEntidad: jest.fn(),
      setRepresentacion: jest.fn(),
      setBloque: jest.fn(),
      setDisponible: jest.fn(),
      setSeleccionado: jest.fn(),
      setSolicitud: jest.fn(),
      setProducto: jest.fn(),
      updateSelectRangoDias: jest.fn(),
    };
    catalogoServices = {
      regimenesCatalogo: jest.fn().mockReturnValue(of({ datos: [] })),
      getClasificacionRegimen: jest.fn().mockReturnValue(of({ datos: [] })),
      getFraccionesCatalogo: jest.fn().mockReturnValue(of({ datos: [] })),
      unidadesMedidaTarifariaCatalogo: jest.fn().mockReturnValue(of({ datos: [] })),
      tratadosAcuerdoCatalogo: jest.fn().mockReturnValue(of({ datos: [] })),
      entidadesFederativasCatalogo: jest.fn().mockReturnValue(of({ datos: [] })),
      representacionFederalCatalogo: jest.fn().mockReturnValue(of({ datos: [] })),
      getpaisesBloqueCatalogo: jest.fn().mockReturnValue(of({ datos: [] })),
    };
    query = { selectSolicitud$: of(mockState) };
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: Tramite130106Store, useValue: store },
        { provide: CatalogoServices, useValue: catalogoServices },
        { provide: Tramite130106Query, useValue: query },
      ],
    });
    service = new Solocitud130106Service(http, store, catalogoServices, query);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('actualizarEstadoFormulario should update all store fields', () => {
    service.actualizarEstadoFormulario(mockState as any);
    expect(store.setRegimen).toHaveBeenCalledWith('');
    expect(store.setClasificacion).toHaveBeenCalledWith('');
    expect(store.setSolicitudDescripcion).toHaveBeenCalledWith('');
    expect(store.setFraccion).toHaveBeenCalledWith('');
    expect(store.setCantidad).toHaveBeenCalledWith('');
    expect(store.setFactura).toHaveBeenCalledWith('');
    expect(store.setUmt).toHaveBeenCalledWith('');
    expect(store.setMercanciaCantidad).toHaveBeenCalledWith('');
    expect(store.setMercanciaFactura).toHaveBeenCalledWith('');
    expect(store.setDescripcion).toHaveBeenCalledWith('');
    expect(store.setEspecifico).toHaveBeenCalledWith('');
    expect(store.setJustificacion).toHaveBeenCalledWith('');
    expect(store.setObservaciones).toHaveBeenCalledWith('');
    expect(store.setEntidad).toHaveBeenCalledWith('');
    expect(store.setRepresentacion).toHaveBeenCalledWith('');
    expect(store.setBloque).toHaveBeenCalledWith('');
    expect(store.setDisponible).toHaveBeenCalledWith('');
    expect(store.setSeleccionado).toHaveBeenCalledWith('');
    expect(store.setSolicitud).toHaveBeenCalledWith('');
    expect(store.setProducto).toHaveBeenCalledWith('');
    expect(store.updateSelectRangoDias).toHaveBeenCalledWith([]);
  });

  it('getRegistroTomaMuestrasMercanciasData should call http.get', () => {
    http.get.mockReturnValue(of(mockState));
    service.getRegistroTomaMuestrasMercanciasData().subscribe(res => {
      expect(res).toEqual(mockState);
    });
    expect(http.get).toHaveBeenCalledWith('assets/json/130106/serviciosExtraordinarios.json');
  });

  it('getRegimenes should call catalogoServices.regimenesCatalogo', () => {
    service.getRegimenes('130106').subscribe(res => {
      expect(res).toEqual([]);
    });
    expect(catalogoServices.regimenesCatalogo).toHaveBeenCalledWith('130106');
  });

  it('getClasificacionRegimen should call catalogoServices.getClasificacionRegimen', () => {
    service.getClasificacionRegimen('130106').subscribe(res => {
      expect(res).toEqual([]);
    });
    expect(catalogoServices.getClasificacionRegimen).toHaveBeenCalledWith('130106', '01');
  });

  it('getFraccionesArancelarias should call catalogoServices.getFraccionesCatalogo', () => {
    service.getFraccionesArancelarias('130106').subscribe(res => {
      expect(res).toEqual([]);
    });
    expect(catalogoServices.getFraccionesCatalogo).toHaveBeenCalledWith('130106');
  });

  it('getUMTCatalogo should call catalogoServices.unidadesMedidaTarifariaCatalogo', () => {
    service.getUMTCatalogo('id', 'fraccion').subscribe(res => {
      expect(res).toEqual([]);
    });
    expect(catalogoServices.unidadesMedidaTarifariaCatalogo).toHaveBeenCalledWith('id', 'fraccion');
  });

  it('getBloque should call catalogoServices.tratadosAcuerdoCatalogo', () => {
    service.getBloque('130106').subscribe(res => {
      expect(res).toEqual([]);
    });
    expect(catalogoServices.tratadosAcuerdoCatalogo).toHaveBeenCalledWith('130106', 'TITRAC.TA');
  });

  it('getEntidadFederativa should call catalogoServices.entidadesFederativasCatalogo', () => {
    service.getEntidadFederativa('130106').subscribe(res => {
      expect(res).toEqual([]);
    });
    expect(catalogoServices.entidadesFederativasCatalogo).toHaveBeenCalledWith('130106');
  });

  it('getRepresentacionFederal should call catalogoServices.representacionFederalCatalogo', () => {
    service.getRepresentacionFederal('130106', 'SIN').subscribe(res => {
      expect(res).toEqual([]);
    });
    expect(catalogoServices.representacionFederalCatalogo).toHaveBeenCalledWith('130106', 'SIN');
  });

  it('getPaisesPorBloque should call catalogoServices.getpaisesBloqueCatalogo', () => {
    service.getPaisesPorBloque('130106', 1).subscribe(res => {
      expect(res).toEqual([]);
    });
    expect(catalogoServices.getpaisesBloqueCatalogo).toHaveBeenCalledWith('130106', '1');
  });

  it('guardarDatosPost should call http.post', () => {
    http.post.mockReturnValue(of({ codigo: '00' }));
    service.guardarDatosPost({ test: 1 }).subscribe(res => {
      expect(res.codigo).toBe('00');
    });
    expect(http.post).toHaveBeenCalled();
  });

  it('getAllState should return selectSolicitud$', () => {
    service.getAllState().subscribe(res => {
      expect(res).toEqual(mockState);
    });
  });

  it('getUMTService should call catalogoServices.unidadesMedidaTarifariaCatalogo', () => {
    service.getUMTService('id', 'fraccion').subscribe(res => {
      expect(res).toEqual([]);
    });
    expect(catalogoServices.unidadesMedidaTarifariaCatalogo).toHaveBeenCalledWith('id', 'fraccion');
  });

  it('getPayloadDatos should transform tableBodyData', () => {
    const item = { ...mockState, tableBodyData: [{ cantidad: '2', descripcion: 'desc', precioUnitarioUSD: '10', totalUSD: '20' }], cantidad: '5', descripcion: 'desc2', valorFacturaUSD: '100', fraccion: 'FRA', unidadMedida: 'UM' };
    const result = service.getPayloadDatos(item as any);
    expect(result).toEqual([
      {
        unidadesSolicitadas: 2,
        unidadesAutorizadas: 5,
        descripcionSolicitada: 'desc',
        descripcionAutorizada: 'desc2',
        importeUnitarioUSD: 10,
        importeTotalUSD: 20,
        autorizada: true,
        importeUnitarioUSDAutorizado: 10,
        importeTotalUSDAutorizado: 100,
        fraccionArancelariaClave: 'FRA',
        unidadMedidaClave: 'UM',
      },
    ]);
  });
});
