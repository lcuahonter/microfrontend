import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { FormBuilder } from '@angular/forms';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaService } from '../../service/consulta.service';
import { Solicitud260702Store } from '../../../../shared/estados/stores/shared2607/tramites260702.store';
import { Solicitud260702Query } from '../../../../shared/estados/queries/shared2607/tramites260702.query';
import { of, ReplaySubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let consultaQuery: ConsultaioQuery;
  let consultaService: ConsultaService;
  let solicitudStore: Solicitud260702Store;
  let solicitudQuery: Solicitud260702Query;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: ConsultaioQuery, useValue: { selectConsultaioState$: of({ update: false }) } },
        { provide: ConsultaService, useValue: { getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ test: 'ok' })), actualizarEstadoFormulario: jest.fn() } },
        { provide: Solicitud260702Store, useValue: { setContinuarTriggered: jest.fn(), setFormValidity: jest.fn() } },
        { provide: Solicitud260702Query, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    consultaQuery = TestBed.inject(ConsultaioQuery);
    consultaService = TestBed.inject(ConsultaService);
    solicitudStore = TestBed.inject(Solicitud260702Store);
    solicitudQuery = TestBed.inject(Solicitud260702Query);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el estado correctamente en ngOnInit y activar esDatosRespuesta', () => {
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
    expect(solicitudStore.setContinuarTriggered).toHaveBeenCalledWith(false);
  });

  it('debería llamar guardarDatosFormularios si update es true en ngOnInit', () => {
    component.consultaState = { update: true } as any;
    const spy = jest.spyOn(component, 'guardarDatosFormularios');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('debería llamar a consultaService.getRegistroTomaMuestrasMercanciasData y actualizarEstadoFormulario en guardarDatosFormularios', () => {
    const spyActualizar = jest.spyOn(consultaService, 'actualizarEstadoFormulario');
    (consultaService.getRegistroTomaMuestrasMercanciasData as any).mockReturnValueOnce(of({ test: 'ok' }));
    component.guardarDatosFormularios();
    expect(spyActualizar).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería cambiar el índice al seleccionar una pestaña', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('debería emitir el evento de validez del formulario al llamar onFormValidityChange', () => {
    const spy = jest.spyOn(solicitudStore, 'setFormValidity');
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

  it('debería destruir correctamente el componente y limpiar destroyed$', () => {
    const spyNext = jest.spyOn<any, any>(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn<any, any>(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalledWith(true);
    expect(spyComplete).toHaveBeenCalled();
  });
});