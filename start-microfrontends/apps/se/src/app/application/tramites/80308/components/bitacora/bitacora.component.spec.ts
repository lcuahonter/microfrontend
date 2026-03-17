import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { BitacoraComponent } from './bitacora.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

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

});
  it('debería establecer datos y llamar a setDatosBitacora si la respuesta es válida', () => {
    const mockData = { datos: [{ id: 1 }] };
    const mockStore = { setDatosBitacora: jest.fn() };
    const mockService = {
      obtenerBitacora80308: jest.fn().mockReturnValue(observableOf(mockData))
    };
    const mockToastr = { error: jest.fn() };
    // Patch esValidArray and esValidObject to always return true
    jest.spyOn(require('@libs/shared/data-access-user/src/core/utils/utilerias'), 'esValidArray').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src/core/utils/utilerias'), 'esValidObject').mockReturnValue(true);
    const c = new BitacoraComponent(mockService as any, mockToastr as any, mockStore as any);
    expect(c.datos.length).toBe(1);
    expect(mockStore.setDatosBitacora).toHaveBeenCalled();
  });

  it('no debe establecer datos si la respuesta no es válida', () => {
    const mockData = { datos: [] };
    const mockStore = { setDatosBitacora: jest.fn() };
    const mockService = {
      obtenerBitacora80308: jest.fn().mockReturnValue(observableOf(mockData))
    };
    const mockToastr = { error: jest.fn() };
    jest.spyOn(require('@libs/shared/data-access-user/src/core/utils/utilerias'), 'esValidArray').mockReturnValue(false);
    jest.spyOn(require('@libs/shared/data-access-user/src/core/utils/utilerias'), 'esValidObject').mockReturnValue(true);
    const c = new BitacoraComponent(mockService as any, mockToastr as any, mockStore as any);
    expect(c.datos.length).toBe(0);
    expect(mockStore.setDatosBitacora).not.toHaveBeenCalled();
  });

  it('debe llamar a toastr.error si ocurre un error en el servicio', () => {
    const mockStore = { setDatosBitacora: jest.fn() };
    const mockService = {
      obtenerBitacora80308: jest.fn().mockReturnValue({
        pipe: () => ({
          subscribe: (_success: any, error: any) => error()
        })
      })
    };
    const mockToastr = { error: jest.fn() };
    jest.spyOn(require('@libs/shared/data-access-user/src/core/utils/utilerias'), 'esValidArray').mockReturnValue(false);
    jest.spyOn(require('@libs/shared/data-access-user/src/core/utils/utilerias'), 'esValidObject').mockReturnValue(false);
    new BitacoraComponent(mockService as any, mockToastr as any, mockStore as any);
    expect(mockToastr.error).toHaveBeenCalled();
  });