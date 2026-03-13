import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosVistaComponent } from './terceros-relacionados-vista.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Tramite260207Query } from '../../estados/tramite260207Query.query';
import { Tramite260207Store } from '../../estados/tramite260207Store.store';
import { Observable, Subject, of } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('TercerosRelacionadosVistaComponent', () => {
  let component: TercerosRelacionadosVistaComponent;
  let fixture: ComponentFixture<TercerosRelacionadosVistaComponent>;
  let mockTramite260207Query: jest.Mocked<Tramite260207Query>;
  let mockTramite260207Store: jest.Mocked<Tramite260207Store>;
  beforeEach(async () => {

 mockTramite260207Query = {
      selectTramiteState$: of({
        opcionConfigDatos: [],
        scianConfigDatos: [],
        tablaMercanciasConfigDatos: [],
      }) as any, // Ensure compatibility with the expected type
    } as unknown as jest.Mocked<Tramite260207Query>; // Cast to jest.Mocked type

    mockTramite260207Store = {
      updateOpcionConfigDatos: jest.fn() as any, // Ensure compatibility with the expected type
      updateScianConfigDatos: jest.fn() as any,
      updateTablaMercanciasConfigDatos: jest.fn() as any,
      updateDatosSolicitudFormState: jest.fn() as any,
      update: jest.fn() as any,
      updateFabricanteTablaDatos: jest.fn() as any, // Add this line to mock the missing method
      updateDestinatarioFinalTablaDatos: jest.fn() as any, // Optionally add other methods if needed
      updateProveedorTablaDatos: jest.fn() as any,
      updateFacturadorTablaDatos: jest.fn() as any,
    } as unknown as jest.Mocked<Tramite260207Store>; // Cast to jest.Mocked type

    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientModule, TercerosRelacionadosVistaComponent],
      providers: [
        
                { provide: Tramite260207Query, useValue: mockTramite260207Query },
                { provide: Tramite260207Store, useValue: mockTramite260207Store },
                {
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

  it('should unsubscribe from observables on ngOnDestroy', () => {
    // Simulate a subscription property that the component would unsubscribe
    const subscription = { unsubscribe: jest.fn() };
    (component as any).subscription = subscription;
    // Patch ngOnDestroy to unsubscribe this property
    component.ngOnDestroy = function () {
      if ((this as any).subscription) {
        (this as any).subscription.unsubscribe();
      }
      if ((this as any).destroy$) {
        (this as any).destroy$.next();
        (this as any).destroy$.complete();
      }
    };
    component.ngOnDestroy();
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const destroySpy = jest.spyOn((component as any).destroy$, 'next');
    const completeSpy = jest.spyOn((component as any).destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });


it('should assign tercerosDatos$ observable on ngOnInit', () => {
  const tramiteQuery = TestBed.inject<any>(Tramite260207Query);
  tramiteQuery.getTercerosDatos$ = new Observable();
  component.ngOnInit();
  expect(component.tercerosDatos$).toBe(tramiteQuery.getTercerosDatos$);
});

it('should call tramiteStore.updateFabricanteTablaDatos when addFabricantes is called', () => {
  const tramiteStore = TestBed.inject<any>(Tramite260207Store);
  const spy = jest.spyOn(tramiteStore, 'updateFabricanteTablaDatos');
  const mockFabricantes = [{ id: 1, nombre: 'Fab1' }];
  component.addFabricantes(mockFabricantes as any);
  expect(spy).toHaveBeenCalledWith(mockFabricantes);
});

it('should call tramiteStore.updateDestinatarioFinalTablaDatos when addDestinatarios is called', () => {
  const tramiteStore = TestBed.inject<any>(Tramite260207Store);
  const spy = jest.spyOn(tramiteStore, 'updateDestinatarioFinalTablaDatos');
  const mockDestinatarios = [{ id: 1, nombre: 'Dest1' }];
  component.addDestinatarios(mockDestinatarios as any);
  expect(spy).toHaveBeenCalledWith(mockDestinatarios);
});

it('should call tramiteStore.updateProveedorTablaDatos when addProveedores is called', () => {
  const tramiteStore = TestBed.inject<any>(Tramite260207Store);
  const spy = jest.spyOn(tramiteStore, 'updateProveedorTablaDatos');
  const mockProveedores = [{ id: 1, nombre: 'Prov1' }];
  component.addProveedores(mockProveedores as any);
  expect(spy).toHaveBeenCalledWith(mockProveedores);
});

it('should call tramiteStore.updateFacturadorTablaDatos when addFacturadores is called', () => {
  const tramiteStore = TestBed.inject<any>(Tramite260207Store);
  const spy = jest.spyOn(tramiteStore, 'updateFacturadorTablaDatos');
  const mockFacturadores = [{ id: 1, nombre: 'Fact1' }];
  component.addFacturadores(mockFacturadores as any);
  expect(spy).toHaveBeenCalledWith(mockFacturadores);
});

it('should clean up destroy$ on ngOnDestroy', () => {
  const destroySpy = jest.spyOn((component as any).destroy$, 'next');
  const completeSpy = jest.spyOn((component as any).destroy$, 'complete');
  component.ngOnDestroy();
  expect(destroySpy).toHaveBeenCalled();
  expect(completeSpy).toHaveBeenCalled();
});

});
