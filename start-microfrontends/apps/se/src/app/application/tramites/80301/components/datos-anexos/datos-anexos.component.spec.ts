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
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.obtenerFraccionesExportacion = jest.fn().mockReturnValue(observableOf({}));
    component.solicitudService.obtenerFraccionesImportacion = jest.fn().mockReturnValue(observableOf({}));
  });

  it('debe ejecutar #obtenerFraccionesExportacion()', () => {
    component.obtenerFraccionesExportacion();
    expect(component.solicitudService.obtenerFraccionesExportacion).toHaveBeenCalled();
  });

  it('debe ejecutar #obtenerFraccionesImportacion()', () => {
    component.obtenerFraccionesImportacion();
    expect(component.solicitudService.obtenerFraccionesImportacion).toHaveBeenCalled();
  });

  it('debería ejecutar #ngOnDestroy()', () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});