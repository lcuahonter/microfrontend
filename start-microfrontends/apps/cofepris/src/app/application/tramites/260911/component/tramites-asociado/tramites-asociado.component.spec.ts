import { TestBed } from '@angular/core/testing';
import { TramitesAsociadosService } from '../../services/datos-de-la-solicitud/tramites-asociados.service';
import { TramitesAsociadoComponent } from './tramites-asociado.component';
import { of, throwError } from 'rxjs';
 
describe('TramitesAsociadoComponent', () => {
  let component: TramitesAsociadoComponent;
  let service: TramitesAsociadosService;
 
  beforeEach(() => {
    const mockService = {
      enListaDeAsociados: jest.fn().mockReturnValue(of([
        { id: 1, folioTrámite: '12345', tipoTrámite: 'Tipo1', estatus: 'Activo', fechaAltaDeRegistro: '2025-03-19' },
        { id: 2, folioTrámite: '67890', tipoTrámite: 'Tipo2', estatus: 'Inactivo', fechaAltaDeRegistro: '2025-03-18' },
      ]))
    };
 
    TestBed.configureTestingModule({
      providers: [
        { provide: TramitesAsociadosService, useValue: mockService }
      ]
    }).compileComponents();
 
    service = TestBed.inject(TramitesAsociadosService);
    component = new TramitesAsociadoComponent(service);
  });
 
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
 
  it('should initialize table configuration', () => {
    expect(component.configuracionTabla).toBeDefined();
    expect(component.configuracionTabla.length).toBe(5);
  });
 
  it('should initialize configuracionTabla with correct column definitions', () => {
    const expectedConfiguracionTabla = [
      { encabezado: '', clave: expect.any(Function), orden: 1 },
      { encabezado: 'Folio trámite', clave: expect.any(Function), orden: 2 },
      { encabezado: 'Tipo trámite', clave: expect.any(Function), orden: 3 },
      { encabezado: 'Estatus', clave: expect.any(Function), orden: 4 },
      { encabezado: 'Fecha alta de registro', clave: expect.any(Function), orden: 5 },
    ];
 
    expect(component.configuracionTabla).toBeDefined();
    expect(component.configuracionTabla.length).toBe(5);
 
   
    component.configuracionTabla.forEach((col, index) => {
      expect(col.encabezado).toBe(expectedConfiguracionTabla[index].encabezado);
      expect(col.orden).toBe(expectedConfiguracionTabla[index].orden);
      expect(col.clave).toEqual(expectedConfiguracionTabla[index].clave);
 
      
      const mockItem = {
        id: 1,
        folioTramite: '12345',
        tipoTramite: 'Tipo1',
        estatus: 'Activo',
        fechaAltaDeRegistro: '2025-03-19',
      };
 
      switch (index) {
        case 0:
          expect(col.clave(mockItem)).toBe(mockItem.id);
          break;
        case 1:
          expect(col.clave(mockItem)).toBe(mockItem.folioTramite);
          break;
        case 2:
        expect(col.clave(mockItem)).toBe(mockItem.tipoTramite);
        break;
        case 3:
          expect(col.clave(mockItem)).toBe(mockItem.estatus);
          break;
        case 4:
          expect(col.clave(mockItem)).toBe(mockItem.fechaAltaDeRegistro);
          break;
      }
    });
  });
 
  it('should call getAsociadosList on ngOnInit', () => {
    const spy = jest.spyOn(component, 'obtenerListaDeAsociados');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
 
  it('should populate acuseTablaDatos with data from the service', () => {
    component.obtenerListaDeAsociados();
    expect(service.enListaDeAsociados).toHaveBeenCalled();
    expect(component.acuseTablaDatos.length).toBe(2);
    expect(component.acuseTablaDatos[0].folioTramite).toBe(undefined);
  });
 
  it('should handle empty data from the service', () => {
    jest.spyOn(service, 'enListaDeAsociados').mockReturnValue(of([]));
    component.obtenerListaDeAsociados();
    expect(component.acuseTablaDatos.length).toBe(0);
  });
 
  it('should handle errors from the service gracefully', () => {
    jest.spyOn(service, 'enListaDeAsociados').mockReturnValue(throwError(() => new Error('Service error')));
    component.obtenerListaDeAsociados();
    expect(component.acuseTablaDatos).toEqual([]);
  });
 
  it('should have default values for properties', () => {
    expect(component.acuseTablaDatos).toEqual([]);
    expect(component.configuracionTabla).toBeDefined();
  });
 
  it('should update table data when getAsociadosList is called', () => {
    component.obtenerListaDeAsociados();
    expect(component.acuseTablaDatos.length).toBe(2);
    expect(component.acuseTablaDatos[1].folioTramite).toBe(undefined);
  });
});