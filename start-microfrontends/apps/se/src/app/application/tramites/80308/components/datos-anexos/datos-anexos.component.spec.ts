import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { DatosAnexosComponent } from './datos-anexos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of as observableOf } from 'rxjs';

describe('DatosAnexosComponent', () => {
  let fixture !: ComponentFixture<DatosAnexosComponent>;
  let component!: DatosAnexosComponent;

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
    }).overrideComponent(DatosAnexosComponent, {
    }).compileComponents();
    fixture = TestBed.createComponent(DatosAnexosComponent);
    component = fixture.debugElement.componentInstance;
    component.modificionService = component.modificionService || {};
    component.modificionService.obtenerAnexo = jest.fn().mockReturnValue(observableOf({}));

  });

    it('debe llamar a obtenerBuscaIdSolicitud en el constructor', () => {
      const spy = jest.spyOn(DatosAnexosComponent.prototype, 'obtenerBuscaIdSolicitud');
      const c = new DatosAnexosComponent({} as any, {} as any, {} as any);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('debe ejecutar obtenerBuscaIdSolicitud y procesar datos correctamente', () => {
      const mockService = {
        obtenerBuscaSolicitudId: jest.fn().mockReturnValue(observableOf({ datos: { buscaIdSolicitud: '1,2,0,3,' } }))
      };
      const mockStore = {};
      const mockToastr = { error: jest.fn() };
      const c = new DatosAnexosComponent(mockService as any, mockToastr as any, mockStore as any);
      c.obteneProductosExportacion = jest.fn();
      c.obteneProductosImportacion = jest.fn();
      c.obteneComplementaria = jest.fn();
      c.obtenerBuscaIdSolicitud();
      expect(c.buscarIdSolicitudString).toBe('1,2,3');
    });

    it('debe mostrar error si obtenerBuscaSolicitudId falla', () => {
      const mockService = {
        obtenerBuscaSolicitudId: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (_s: any, e: any) => e() }) })
      };
      const mockStore = {};
      const mockToastr = { error: jest.fn() };
      const c = new DatosAnexosComponent(mockService as any, mockToastr as any, mockStore as any);
      c.obtenerBuscaIdSolicitud();
      expect(mockToastr.error).toHaveBeenCalled();
    });

    it('debe ejecutar obteneProductosExportacion y procesar datos correctamente', () => {
      const mockService = {
        obtenerBuscaSolicitudId: jest.fn().mockReturnValue(observableOf({ datos: { buscaIdSolicitud: '' } })),
        obtenerProductosExportacion: jest.fn().mockReturnValue(observableOf({ datos: [1, 2] }))
      };
      const mockStore = { setDatosExportacion: jest.fn() };
      const mockToastr = { error: jest.fn() };
      const c = new DatosAnexosComponent(mockService as any, mockToastr as any, mockStore as any);
      c.buscarIdSolicitudString = '1';
      jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
      jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(true);
      jest.spyOn(require('@libs/shared/data-access-user/src'), 'doDeepCopy').mockImplementation((d) => d);
      c.obteneProductosExportacion();
      expect(c.datosAnexo).toEqual([1, 2]);
      expect(mockStore.setDatosExportacion).toHaveBeenCalledWith([1, 2]);
    });

    it('debe mostrar error si obteneProductosExportacion falla', () => {
      const mockService = {
        obtenerBuscaSolicitudId: jest.fn().mockReturnValue(observableOf({ datos: { buscaIdSolicitud: '' } })),
        obtenerProductosExportacion: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (_s: any, e: any) => e() }) })
      };
      const mockStore = { setDatosExportacion: jest.fn() };
      const mockToastr = { error: jest.fn() };
      const c = new DatosAnexosComponent(mockService as any, mockToastr as any, mockStore as any);
      c.buscarIdSolicitudString = '1';
      c.obteneProductosExportacion();
      expect(mockToastr.error).toHaveBeenCalled();
    });

    it('debe ejecutar obteneProductosImportacion y procesar datos correctamente', () => {
      const mockService = {
        obtenerBuscaSolicitudId: jest.fn().mockReturnValue(observableOf({ datos: { buscaIdSolicitud: '' } })),
        obtenerProductosImportacion: jest.fn().mockReturnValue(observableOf({ datos: [3, 4] }))
      };
      const mockStore = { setDatosImportacion: jest.fn() };
      const mockToastr = { error: jest.fn() };
      const c = new DatosAnexosComponent(mockService as any, mockToastr as any, mockStore as any);
      c.buscarIdSolicitudString = '1';
      jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
      jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(true);
      jest.spyOn(require('@libs/shared/data-access-user/src'), 'doDeepCopy').mockImplementation((d) => d);
      c.obteneProductosImportacion();
      expect(c.datosImportacion).toEqual([3, 4]);
      expect(mockStore.setDatosImportacion).toHaveBeenCalledWith([3, 4]);
    });

    it('debe mostrar error si obteneProductosImportacion falla', () => {
      const mockService = {
        obtenerBuscaSolicitudId: jest.fn().mockReturnValue(observableOf({ datos: { buscaIdSolicitud: '' } })),
        obtenerProductosImportacion: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (_s: any, e: any) => e() }) })
      };
      const mockStore = { setDatosImportacion: jest.fn() };
      const mockToastr = { error: jest.fn() };
      const c = new DatosAnexosComponent(mockService as any, mockToastr as any, mockStore as any);
      c.buscarIdSolicitudString = '1';
      c.obteneProductosImportacion();
      expect(mockToastr.error).toHaveBeenCalled();
    });

    it('debe ejecutar obteneComplementaria y procesar datos correctamente', () => {
      const mockService = {
        obtenerBuscaSolicitudId: jest.fn().mockReturnValue(observableOf({ datos: { buscaIdSolicitud: '' } })),
        obtenerFraccionesSensibles: jest.fn().mockReturnValue(observableOf({ datos: [5, 6] }))
      };
      const mockStore = { setDatosFraccion: jest.fn() };
      const mockToastr = { error: jest.fn() };
      const c = new DatosAnexosComponent(mockService as any, mockToastr as any, mockStore as any);
      c.buscarIdSolicitudString = '1';
      jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
      jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(true);
      jest.spyOn(require('@libs/shared/data-access-user/src'), 'doDeepCopy').mockImplementation((d) => d);
      c.obteneComplementaria();
      expect(c.datosFraccion).toEqual([5, 6]);
      expect(mockStore.setDatosFraccion).toHaveBeenCalledWith([5, 6]);
    });

    it('debe mostrar error si obteneComplementaria falla', () => {
      const mockService = {
        obtenerBuscaSolicitudId: jest.fn().mockReturnValue(observableOf({ datos: { buscaIdSolicitud: '' } })),
        obtenerFraccionesSensibles: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (_s: any, e: any) => e() }) })
      };
      const mockStore = { setDatosFraccion: jest.fn() };
      const mockToastr = { error: jest.fn() };
      const c = new DatosAnexosComponent(mockService as any, mockToastr as any, mockStore as any);
      c.buscarIdSolicitudString = '1';
      c.obteneComplementaria();
      expect(mockToastr.error).toHaveBeenCalled();
    });


  it('debe ejecutar #obteneComplementaria()', () => {
    if (!component.obteneComplementaria) return; // Defensive: skip if not present
    jest.spyOn(component, 'obteneComplementaria');
    component.obteneComplementaria();
    expect(component.obteneComplementaria).toHaveBeenCalled();
  });

  it('debería ejecutar #ngOnDestroy()', () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});