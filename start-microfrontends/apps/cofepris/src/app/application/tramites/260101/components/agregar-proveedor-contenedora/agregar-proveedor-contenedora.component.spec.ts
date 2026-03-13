import { TestBed } from '@angular/core/testing';
import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';
import { Tramite260101Store } from '../../estados/tramite260101Store.store';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { CommonModule } from '@angular/common';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';

describe('AgregarProveedorContenedoraComponent', () => {
  let component: AgregarProveedorContenedoraComponent;
  let fixture: any;
  let mockStore: jest.Mocked<Tramite260101Store>;
  let mockQuery: any;
  let mockActivatedRoute: any;

  const mockTramiteState = {
    proveedorTablaDatos: [{ id: 1, nombre: 'Proveedor 1' }],
    proveedorTablaModificaDatos: [{ id: 2, nombre: 'Proveedor 2' }]
  };

  beforeEach(async () => {
    mockStore = {
      updateProveedorTablaDatos: jest.fn()
    } as any;

    mockQuery = {
      selectTramiteState$: of(mockTramiteState)
    };

    mockActivatedRoute = {
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [AgregarProveedorContenedoraComponent,CommonModule, AgregarProveedorComponent, HttpClientTestingModule],
      providers: [
        provideHttpClientTesting(),
        { provide: Tramite260101Store, useValue: mockStore },
        { provide: Tramite260101Query, useValue: mockQuery },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarProveedorContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tramiteState and proveedorTablaDatos from query', () => {
    expect(component.tramiteState).toEqual(mockTramiteState);
    expect(component.proveedorTablaDatos).toEqual(mockTramiteState.proveedorTablaDatos);
  });

  it('should clear proveedorTablaDatos if update param is false', () => {
    mockActivatedRoute.queryParams = of({ update: 'false' });
    component.ngOnInit();
    expect(component.proveedorTablaDatos).toEqual([]);
  });

  it('should set proveedorTablaDatos from tramiteState.proveedorTablaModificaDatos if update param is true', () => {
    mockActivatedRoute.queryParams = of({ update: 'true' });
    component.ngOnInit();
    expect(component.proveedorTablaDatos).toEqual(mockTramiteState.proveedorTablaModificaDatos);
  });

  it('should call store.updateProveedorTablaDatos when updateProveedorTablaDatos is called', () => {
    const proveedores: Proveedor[] = [];
    component.updateProveedorTablaDatos(proveedores);
    expect(mockStore.updateProveedorTablaDatos).toHaveBeenCalledWith(proveedores);
  });

  it('should not modify proveedorTablaDatos if update param is not present', () => {
    mockActivatedRoute.queryParams = of({});
    component.proveedorTablaDatos = [];
    component.ngOnInit();
    expect(component.proveedorTablaDatos).toEqual([]);
  });

  it('should handle multiple ngOnInit calls with different params', () => {
    mockActivatedRoute.queryParams = of({ update: 'false' });
    component.proveedorTablaDatos = [];
    component.ngOnInit();
    expect(component.proveedorTablaDatos).toEqual([]);

    mockActivatedRoute.queryParams = of({ update: 'true' });
    component.ngOnInit();
    expect(component.proveedorTablaDatos).toEqual(mockTramiteState.proveedorTablaModificaDatos);
  });

  it('should call updateProveedorTablaDatos with correct argument', () => {
    const proveedores: Proveedor[] = [];
    component.updateProveedorTablaDatos(proveedores);
    expect(mockStore.updateProveedorTablaDatos).toHaveBeenCalledWith(proveedores);
  });

});