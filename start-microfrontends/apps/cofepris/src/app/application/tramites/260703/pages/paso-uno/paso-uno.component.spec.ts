import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { FormBuilder } from '@angular/forms';
import { Service260702Service } from '../../../../shared/services/shared2607/service260702.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solicitud260702Store } from '../../../../shared/estados/stores/shared2607/tramites260702.store';
import { Solicitud260702Query } from '../../../../shared/estados/queries/shared2607/tramites260702.query';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let service260702Service: Service260702Service;
  let consultaQuery: ConsultaioQuery;
  let solicitud260703Store: Solicitud260702Store;
  let solicitud260703Query: Solicitud260702Query;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: Service260702Service, useValue: { getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})), actualizarEstadoFormulario: jest.fn() } },
        { provide: ConsultaioQuery, useValue: { selectConsultaioState$: of({ readonly: false, update: false }) } },
        { provide: Solicitud260702Store, useValue: { setFormValidity: jest.fn() } },
        { provide: Solicitud260702Query, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    service260702Service = TestBed.inject(Service260702Service);
    consultaQuery = TestBed.inject(ConsultaioQuery);
    solicitud260703Store = TestBed.inject(Solicitud260702Store);
    solicitud260703Query = TestBed.inject(Solicitud260702Query);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el estado correctamente en ngOnInit y activar esDatosRespuesta', () => {
    component.consultaState = { readonly: false, update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería llamar guardarDatosFormulario si update es true en ngOnInit', () => {
    component.consultaState = { readonly: false, update: true } as any;
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('debería llamar a service260702Service.getRegistroTomaMuestrasMercanciasData y actualizarEstadoFormulario en guardarDatosFormulario', () => {
    const spyActualizar = jest.spyOn(service260702Service, 'actualizarEstadoFormulario');
    (service260702Service.getRegistroTomaMuestrasMercanciasData as any).mockReturnValueOnce(of({ test: 'ok' }));
    component.guardarDatosFormulario();
    expect(spyActualizar).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería seleccionar la pestaña correctamente', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debería emitir el evento de validez del formulario al llamar onFormValidityChange', () => {
    const spy = jest.spyOn(solicitud260703Store, 'setFormValidity');
    component.onFormValidityChange(true);
    expect(spy).toHaveBeenCalledWith('datosDelSolicitude', true);
    component.onFormValidityChange(false);
    expect(spy).toHaveBeenCalledWith('datosDelSolicitude', false);
  });

  it('debería validar los formularios correctamente', () => {
    component.datosdelasolicitudComponent = { validarFormularios: () => true } as any;
    expect(component.validarFormularios()).toBe(true);

    component.datosdelasolicitudComponent = { validarFormularios: () => false } as any;
    expect(component.validarFormularios()).toBe(false);

    component.datosdelasolicitudComponent = undefined as any;
    expect(component.validarFormularios()).toBe(false);
  });

  it('debería destruir correctamente el componente y limpiar notificadorDestruccion$', () => {
    const spyNext = jest.spyOn((component as any).notificadorDestruccion$, 'next');
    const spyComplete = jest.spyOn((component as any).notificadorDestruccion$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});