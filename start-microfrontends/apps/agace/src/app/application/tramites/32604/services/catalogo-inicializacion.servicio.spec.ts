import { TestBed } from '@angular/core/testing';
import { CatalogoInicializacionService } from './catalogo-inicializacion.servicio';

describe('CatalogoInicializacionService', () => {
  let service: CatalogoInicializacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogoInicializacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize sector productivo catalog', () => {
    const catalog = CatalogoInicializacionService.inicializarSectorProductivo();
    expect(catalog).toEqual({
      catalogos: [],
      labelNombre: 'Sector Productivo',
      primerOpcion: 'Seleccione una opción',
      required: false
    });
  });

  it('should initialize servicio catalog', () => {
    const catalog = CatalogoInicializacionService.inicializarServicio();
    expect(catalog).toEqual({
      catalogos: [],
      labelNombre: 'Servicio',
      primerOpcion: 'Seleccione una opción',
      required: false
    });
  });

  it('should initialize bimestre catalog', () => {
    const catalog = CatalogoInicializacionService.inicializarBimestre();
    expect(catalog).toEqual({
      catalogos: [],
      labelNombre: 'Bimestre',
      primerOpcion: 'Seleccione una opción',
      required: false
    });
  });

  it('should initialize indique todos catalog', () => {
    const catalog = CatalogoInicializacionService.inicializarIndiqueTodos();
    expect(catalog).toEqual({
      catalogos: [],
      labelNombre: '',
      primerOpcion: 'Seleccione una opción',
      required: false
    });
  });

  it('should initialize all catalogs', () => {
    const catalogs = CatalogoInicializacionService.inicializarTodosCatalogos();
    expect(catalogs).toHaveProperty('sectorProductivo');
    expect(catalogs).toHaveProperty('servicio');
    expect(catalogs).toHaveProperty('bimestre');
    expect(catalogs).toHaveProperty('indiqueTodos');
    expect(catalogs.sectorProductivo.labelNombre).toBe('Sector Productivo');
    expect(catalogs.servicio.labelNombre).toBe('Servicio');
  });
});