import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosVistaComponent } from './terceros-relacionados-vista.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TercerosRelacionadosVistaComponent', () => {
  let component: TercerosRelacionadosVistaComponent;
  let fixture: ComponentFixture<TercerosRelacionadosVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TercerosRelacionadosVistaComponent, HttpClientTestingModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            params: {},
            queryParams: {}
          }
        }
      }]

    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize fabricantes$ observable on ngOnInit', () => {
    expect(component.fabricanteTablaDatos).toBeDefined();
  });

  it('should initialize destinatarios$ observable on ngOnInit', () => {
    expect(component.destinatarioFinalTablaDatos).toBeDefined();
  });

  it('should initialize proveedores$ observable on ngOnInit', () => {
    expect(component.proveedorTablaDatos).toBeDefined();
  });

  it('should initialize facturadores$ observable on ngOnInit', () => {
    expect(component.facturadorTablaDatos).toBeDefined();
  });
  
  it('should call tramiteStore.updateFabricanteTablaDatos when addFabricantes is called', () => {
    const mockFabricantes = [{ nombre: 'Fabricante 1' }] as any;
    const updateSpy = jest.spyOn((component as any).tramiteStore, 'updateFabricanteTablaDatos');
    component.addFabricantes(mockFabricantes);
    expect(updateSpy).toHaveBeenCalledWith(mockFabricantes);
  });

  it('should call tramiteStore.updateDestinatarioFinalTablaDatos when addDestinatarios is called', () => {
    const mockDestinatarios = [{ nombre: 'Destinatario 1' }] as any;
    const updateSpy = jest.spyOn((component as any).tramiteStore, 'updateDestinatarioFinalTablaDatos');
    component.addDestinatarios(mockDestinatarios);
    expect(updateSpy).toHaveBeenCalledWith(mockDestinatarios);
  });

  it('should call tramiteStore.updateProveedorTablaDatos when addProveedores is called', () => {
    const mockProveedores = [{ nombre: 'Proveedor 1' }] as any;
    const updateSpy = jest.spyOn((component as any).tramiteStore, 'updateProveedorTablaDatos');
    component.addProveedores(mockProveedores);
    expect(updateSpy).toHaveBeenCalledWith(mockProveedores);
  });

  it('should call tramiteStore.updateFacturadorTablaDatos when addFacturadores is called', () => {
    const mockFacturadores = [{ nombre: 'Facturador 1' }] as any;
    const updateSpy = jest.spyOn((component as any).tramiteStore, 'updateFacturadorTablaDatos');
    component.addFacturadores(mockFacturadores);
    expect(updateSpy).toHaveBeenCalledWith(mockFacturadores);
  });

  it('should emit and complete destroy$ on ngOnDestroy', () => {
    const destroy$ = (component as any).destroy$;
    const nextSpy = jest.spyOn(destroy$, 'next').mockImplementation(() => {});
    const completeSpy = jest.spyOn(destroy$, 'complete').mockImplementation(() => {});
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should have elementosRequeridos defined', () => {
    expect(component.elementosRequeridos).toBeDefined();
    expect(Array.isArray(component.elementosRequeridos)).toBe(true);
  });

  it('should have formularioDeshabilitado default to false', () => {
    expect(component.formularioDeshabilitado).toBe(false);
  });
});
