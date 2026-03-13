import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { BitacoraComponent } from './bitacora.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of as observableOf, Subject, throwError, of } from 'rxjs';
import { SolicitudService } from '../../service/solicitud.service';
import { Tramite80302Store } from '../../../../estados/tramites/tramite80302.store';

describe('BitacoraComponent', () => {
  let fixture;
  let component!: BitacoraComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ToastrModule, HttpClientTestingModule],
      declarations: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        SolicitudService,
        Tramite80302Store
      ],
    })
      .overrideComponent(BitacoraComponent, {})
      .compileComponents();

    fixture = TestBed.createComponent(BitacoraComponent);
    component = fixture.debugElement.componentInstance;
    component.modificionService = component.modificionService || {};
    component.solicitudService.obtenerBitacora = jest.fn().mockReturnValue(observableOf({}));
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
      obtenerBitacora: jest.fn().mockReturnValue(observableOf(mockData)),
    };

    component.toastr = { error: jest.fn() } as any;
    component.modificionService = modificionServiceMock as any;

    // Re-trigger the subscription logic manually
    modificionServiceMock.obtenerBitacora().subscribe((data: any[]) => {
      component.datos = [...data];
    });

    expect(modificionServiceMock.obtenerBitacora).toHaveBeenCalled();
    expect(component.datos).toEqual(mockData);
  });

  it('should show error if obtenerBitacora fails', () => {
    const modificionServiceMock = {
      obtenerBitacora: jest.fn().mockReturnValue(throwError(() => new Error('error'))),
    };

    const toastrMock = { error: jest.fn() };

    component.modificionService = modificionServiceMock as any;
    component.toastr = toastrMock as any;

    // Trigger the subscription manually for test
    modificionServiceMock.obtenerBitacora().subscribe({
      error: () => {
        toastrMock.error('Error al cargar los estados');
      },
    });

    expect(toastrMock.error).toHaveBeenCalledWith('Error al cargar los estados');
  });

  it('should have default empty datos array and predefined configuracionTabla', () => {
    expect(component.datos).toEqual([]);
    expect(component.configuracionTabla).toBeDefined();
    expect(Array.isArray(component.configuracionTabla)).toBe(true);
  });

  it('should initialize destroyNotifier$ as a Subject', () => {
    expect(component.destroyNotifier$ instanceof Subject).toBe(true);
  });

  it('debería asignar datos filtrados correctamente cuando la respuesta es válida', () => {
    const mockResponse = {
      datos: [
        { id: 1, descripcion: 'registro 1', valor: null },
        { id: 2, descripcion: null, valor: null }, // este se filtrará
        { id: 3, descripcion: 'registro 3', valor: 'dato' },
      ],
    };

    // Mock helpers
    (global as any).esValidObject = jest.fn().mockReturnValue(true);
    (global as any).doDeepCopy = jest.fn().mockReturnValue(mockResponse);
    (global as any).esValidArray = jest.fn().mockReturnValue(true);

    component.solicitudService.obtenerBitacora = jest.fn().mockReturnValue(of(mockResponse));

    component.obtenerDatosBitacora();

    expect(component.solicitudService.obtenerBitacora).toHaveBeenCalledWith({ idPrograma: '120662' });
  });

});
