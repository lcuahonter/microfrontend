import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { DatosAnexosComponent } from './datos-anexos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of as observableOf, throwError } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80316Query } from '../../estados/tramite80316.query';
import { Tramite80316Store } from '../../estados/tramite80316.store';

describe('DatosAnexosComponent', () => {
  let fixture !: ComponentFixture<DatosAnexosComponent>;
  let component!: DatosAnexosComponent;
  let solicitudService: any;
  let toastr: any;
  let tramite80316Query: any;
  let tramite80316Store: any;

  beforeEach(() => {
    solicitudService = {
      obtenerFraccionesExportacion: jest.fn().mockReturnValue(observableOf({ datos: [{ claveProductoExportacion: '123', complemento: { descripcion: 'desc' }, tipoFraccion: 'A' }] })),
      obtenerFraccionesImportacion: jest.fn().mockReturnValue(observableOf({ datos: [{ fraccionPadre: 'padre', cveFraccion: 'cve', descripcion: 'desc', tipoFraccion: 'B' }] })),
      obteneFraccionSensible: jest.fn().mockReturnValue(observableOf([{ id: 1, descripcion: 'sens' }])),
    };
    toastr = { error: jest.fn() };
    tramite80316Query = { selectSolicitud$: observableOf({ buscarIdSolicitud: ['id'] }) };
    tramite80316Store = { setFraccionesExportacion: jest.fn(), setFraccionesImportacion: jest.fn() };

    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, ToastrModule, HttpClientTestingModule ],
      declarations: [ ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
         provideToastr({
                  positionClass: 'toast-top-right',
                }),
        { provide: SolicitudService, useValue: solicitudService },
        { provide: ToastrService, useValue: toastr },
        { provide: Tramite80316Query, useValue: tramite80316Query },
        { provide: Tramite80316Store, useValue: tramite80316Store }
      ]
    }).overrideComponent(DatosAnexosComponent, {
    }).compileComponents();
    fixture = TestBed.createComponent(DatosAnexosComponent);
    component = fixture.debugElement.componentInstance;
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.obtenerAnexo = jest.fn().mockReturnValue(observableOf({}));

  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should call obteneComplimentariaExportacion and set datosAnexo', () => {
    component.buscarIdSolicitud = ['id'];
    component.obteneComplimentariaExportacion();
    expect(solicitudService.obtenerFraccionesExportacion).toHaveBeenCalledWith(['id']);
    expect(component.datosAnexo.length).toBeGreaterThan(0);
    expect(tramite80316Store.setFraccionesExportacion).toHaveBeenCalled();
  });

  it('should call obteneComplimentariaImportacion and set datosImportacion', () => {
    component.buscarIdSolicitud = ['id'];
    component.obteneComplimentariaImportacion();
    expect(solicitudService.obtenerFraccionesImportacion).toHaveBeenCalledWith(['id']);
    expect(component.datosImportacion.length).toBeGreaterThan(0);
    expect(tramite80316Store.setFraccionesImportacion).toHaveBeenCalled();
  });

  it('should call obteneFraccionSensible and set datosFraccionSensible', () => {
    component.obteneFraccionSensible();
    expect(solicitudService.obteneFraccionSensible).toHaveBeenCalled();
    expect(component.datosFraccionSensible.length).toBeGreaterThan(0);
  });

  it('should show error if obteneFraccionSensible fails', () => {
    solicitudService.obteneFraccionSensible.mockReturnValueOnce(throwError(() => new Error('fail')));
    component.obteneFraccionSensible();
    expect(toastr.error).toHaveBeenCalledWith('Error al cargar');
  });

  it('debería ejecutar #ngOnDestroy()', () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const spy = jest.spyOn(component.destroyNotifier$, 'next');
    const spyComplete = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});