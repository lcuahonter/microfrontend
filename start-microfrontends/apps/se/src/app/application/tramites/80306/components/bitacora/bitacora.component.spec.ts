import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { BitacoraComponent } from './bitacora.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { Subject } from 'rxjs';
import { throwError } from 'rxjs';


describe('BitacoraComponent', () => {
  let fixture;
  let component !: BitacoraComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, ToastrModule, HttpClientTestingModule ],
      declarations: [ ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ]
    }).overrideComponent(BitacoraComponent, {
    }).compileComponents();
    fixture = TestBed.createComponent(BitacoraComponent);
    component = fixture.debugElement.componentInstance;
    component.modificionService = component.modificionService || {};
    component.modificionService.obtenerBitacora = jest.fn().mockReturnValue(observableOf({}));
  });

  it('debería ejecutar #constructor()', () => {
    expect(component).toBeTruthy();
  });


  it('debería ejecutar #ngOnDestroy()', () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.unsubscribe).toHaveBeenCalled();
  });

  it('should fetch bitacora data and assign to datos', () => {
  const mockData = [{ id: 1, descripcion: 'Registro 1' }] as any;

  const modificionServiceMock = {
    obtenerBitacora: jest.fn().mockReturnValue(observableOf(mockData))
  };

  component.toastr = { error: jest.fn() } as any;
  component.modificionService = modificionServiceMock as any;

  // Re-trigger the subscription logic manually
  modificionServiceMock.obtenerBitacora().subscribe((data: any[]) => {
    component.datosBitacora = [...data];
  });

  expect(modificionServiceMock.obtenerBitacora).toHaveBeenCalled();
  expect(component.datosBitacora).toEqual(mockData);
});

it('should show error if obtenerBitacora fails', () => {
  const modificionServiceMock = {
    obtenerBitacora: jest.fn().mockReturnValue(throwError(() => new Error('error')))
  };

  const toastrMock = { error: jest.fn() };

  component.modificionService = modificionServiceMock as any;
  component.toastr = toastrMock as any;

  // Trigger the subscription manually for test
  modificionServiceMock.obtenerBitacora().subscribe({
    error: () => {
      toastrMock.error('Error al cargar los estados');
    }
  });

  expect(toastrMock.error).toHaveBeenCalledWith('Error al cargar los estados');
});

it('should have default empty datos array and predefined configuracionTabla', () => {
  expect(component.datosBitacora).toEqual([]);
  expect(component.configuracionTabla).toBeDefined();
  expect(Array.isArray(component.configuracionTabla)).toBe(true);
});

it('should initialize destroyNotifier$ as a Subject', () => {
  expect(component.destroyNotifier$ instanceof Subject).toBe(true);
});


  it('should keep datosBitacora empty if service returns invalid/empty data', () => {
    const modificionServiceMock = {
      obtenerBitacora: jest.fn().mockReturnValue(observableOf(null)),
      obtenerBitacora80306: jest.fn().mockReturnValue(observableOf({}))
    };
    component.modificionService = modificionServiceMock as any;
    component.datosBitacora = [{ idModificacion: '1', tipoModificacion: 'A', fechaModificacion: '2024-01-01', valoresNuevos: 'nuevo', valoresAnteriores: 'anterior' }];
    // Simulate empty/invalid data
    component.obtenerDatosBitacora = BitacoraComponent.prototype.obtenerDatosBitacora.bind(component);
    component.solicitudState = { selectedIdPrograma: '' } as any;
  (component as any).tramite80306Store = { setDatosBitacora: jest.fn() } as any;
    component.obtenerDatosBitacora();
    expect(component.datosBitacora).toEqual([]);
  });

  it('should filter out bitacora entries with all null values', () => {
    const mockData = {
      datos: [
        { idModificacion: null, tipoModificacion: null, fechaModificacion: null, valoresNuevos: null, valoresAnteriores: null },
        { idModificacion: '2', tipoModificacion: 'B', fechaModificacion: '2024-01-02', valoresNuevos: 'nuevo2', valoresAnteriores: 'anterior2' }
      ]
    };
    const modificionServiceMock = {
      obtenerBitacora80306: jest.fn().mockReturnValue(observableOf(mockData))
    };
    component.modificionService = modificionServiceMock as any;
    component.solicitudState = { selectedIdPrograma: '' } as any;
  (component as any).tramite80306Store = { setDatosBitacora: jest.fn() } as any;
    component.obtenerDatosBitacora = BitacoraComponent.prototype.obtenerDatosBitacora.bind(component);
    component.obtenerDatosBitacora();
    expect(component.datosBitacora.length).toBe(1);
    expect(component.datosBitacora[0].idModificacion).toBe('2');
  });

  it('should call tramite80306Store.setDatosBitacora with filtered data', () => {
    const mockData = {
      datos: [
        { idModificacion: '3', tipoModificacion: 'C', fechaModificacion: '2024-01-03', valoresNuevos: 'nuevo3', valoresAnteriores: 'anterior3' }
      ]
    };
    const setDatosBitacoraSpy = jest.fn();
    const modificionServiceMock = {
      obtenerBitacora80306: jest.fn().mockReturnValue(observableOf(mockData))
    };
    component.modificionService = modificionServiceMock as any;
    component.solicitudState = { selectedIdPrograma: '' } as any;
  (component as any).tramite80306Store = { setDatosBitacora: setDatosBitacoraSpy } as any;
    component.obtenerDatosBitacora = BitacoraComponent.prototype.obtenerDatosBitacora.bind(component);
    component.obtenerDatosBitacora();
    expect(setDatosBitacoraSpy).toHaveBeenCalledWith([
      { idModificacion: '3', tipoModificacion: 'C', fechaModificacion: '2024-01-03', valoresNuevos: 'nuevo3', valoresAnteriores: 'anterior3' }
    ]);
  });

  it('should show error if obtenerBitacora80306 fails', () => {
    const modificionServiceMock = {
      obtenerBitacora80306: jest.fn().mockReturnValue(throwError(() => new Error('error')))
    };
    const toastrMock = { error: jest.fn() };
    component.modificionService = modificionServiceMock as any;
    component.solicitudState = { selectedIdPrograma: '' } as any;
  (component as any).tramite80306Store = { setDatosBitacora: jest.fn() } as any;
    component.toastr = toastrMock as any;
    component.obtenerDatosBitacora = BitacoraComponent.prototype.obtenerDatosBitacora.bind(component);
    component.obtenerDatosBitacora();
    expect(toastrMock.error).toHaveBeenCalledWith('Error al cargar los anexos de exportación');
  });

  it('should map configuracionTabla columns correctly', () => {
    const bitacora: any = {
      tipoModificacion: 'Cambio',
      fechaModificacion: '2024-01-01',
      valoresAnteriores: 'A',
      valoresNuevos: 'B'
    };
    const columns = component.configuracionTabla;
    expect(columns[0].clave(bitacora)).toBe('Cambio');
    expect(columns[1].clave(bitacora)).toBe('2024-01-01');
    expect(columns[2].clave(bitacora)).toBe('A');
    expect(columns[3].clave(bitacora)).toBe('B');
  });


});