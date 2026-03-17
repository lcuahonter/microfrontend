import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { ExpedicionCertificadosAsignacionService } from '../../services/expedicion-certificados-asignacion/expedicion-certificados-asignacion.service';
import { Tramite120202Store } from '../../../../estados/tramites/tramite120202.store';
import { Tramite120202Query } from '../../../../estados/queries/tramite120202.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let service: ExpedicionCertificadosAsignacionService;
  let store: Tramite120202Store;
  let query: Tramite120202Query;
  let consultaQuery: ConsultaioQuery;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DatosComponent],
      providers: [
        ExpedicionCertificadosAsignacionService,
        Tramite120202Store,
        Tramite120202Query,
        { provide: ConsultaioQuery, useValue: { selectConsultaioState$: of({ update: false, id_solicitud: '1' }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ExpedicionCertificadosAsignacionService);
    store = TestBed.inject(Tramite120202Store);
    query = TestBed.inject(Tramite120202Query);
    consultaQuery = TestBed.inject(ConsultaioQuery);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should set consultaState and esDatosRespuesta', () => {
    component.consultaState = undefined as any;
    component.ngOnInit();
    expect(component.consultaState).toBeDefined();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('ngOnInit should call guardarDatosFormulario if update is true', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    (consultaQuery as any).selectConsultaioState$ = of({ update: true, id_solicitud: '2' });
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith('2');
  });

  it('storeMethodMap should call correct store methods', () => {
    const spy1 = jest.spyOn(store, 'setAsignacionOficioNumeroForm');
    component.setValoresStore({ formGroupName: 'asignacionOficioNumeroForm', campo: 'foo', valor: 'bar', storeStateName: '' });
    expect(spy1).toHaveBeenCalledWith('foo', 'bar');
  });

  it('setValoresStore should do nothing for invalid group', () => {
    expect(() => component.setValoresStore({ formGroupName: 'invalid', campo: 'foo', valor: 'bar', storeStateName: '' })).not.toThrow();
  });

  it('updateStoreValues should call setters', () => {
    const spy = jest.spyOn(store, 'setAsignacionOficioNumeroForm');
    component.updateStoreValues({ asignacionOficioNumeroForm: { foo: 'bar' } } as any);
    expect(spy).toHaveBeenCalled();
  });

  it('guardarDatosFormulario should update store on response', () => {
    jest.spyOn(service, 'getMostrarSolicitud').mockReturnValue(
      of({
        id: 1,
        descripcion: 'desc',
        codigo: '00',
        datos: [{ foo: 'bar' }],
        data: ''
      })
    );
    jest.spyOn(service, 'reversePayload').mockReturnValue({ idSolicitud: 1 });
    const spy = jest.spyOn(store, 'update');
    component.guardarDatosFormulario('1');
    expect(spy).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('seleccionaTab should set indice', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('mostrarErrorEvent should emit', () => {
    const spy = jest.spyOn(component.mostrarErrorDirecto, 'emit');
    component.mostrarErrorEvent(true);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('mostrarNumFolioAsignacionErrorEvent should emit', () => {
    const spy = jest.spyOn(component.mostrarNumFolioAsignacionErrorDirecto, 'emit');
    component.mostrarNumFolioAsignacionErrorEvent({ mostrarError: true, valor: 'x' });
    expect(spy).toHaveBeenCalledWith({ mostrarError: true, valor: 'x' });
  });

  it('validarFormularios should return false if solicitante is missing', () => {
    component.solicitante = undefined as any;
    expect(component.validarFormularios()).toBe(false);
  });

  it('validarFormularios should return false if solicitante.form.invalid', () => {
    component.solicitante = { form: { invalid: true, markAllAsTouched: jest.fn() } } as any;
    component.expedicionCertificadosAsignacionDirectaComponent = { validarFormulario: jest.fn().mockReturnValue(true) } as any;
    expect(component.validarFormularios()).toBe(false);
  });

  it('validarFormularios should return false if expedicionCertificadosAsignacionDirectaComponent is missing', () => {
    component.solicitante = { form: { invalid: false, markAllAsTouched: jest.fn() } } as any;
    component.expedicionCertificadosAsignacionDirectaComponent = undefined as any;
    expect(component.validarFormularios()).toBe(false);
  });

  it('validarFormularios should return false if expedicionCertificadosAsignacionDirectaComponent.validarFormulario is false', () => {
    component.solicitante = { form: { invalid: false, markAllAsTouched: jest.fn() } } as any;
    component.expedicionCertificadosAsignacionDirectaComponent = { validarFormulario: jest.fn().mockReturnValue(false) } as any;
    expect(component.validarFormularios()).toBe(false);
  });

  it('validarFormularios should return true if all valid', () => {
    component.solicitante = { form: { invalid: false, markAllAsTouched: jest.fn() } } as any;
    component.expedicionCertificadosAsignacionDirectaComponent = { validarFormulario: jest.fn().mockReturnValue(true) } as any;
    expect(component.validarFormularios()).toBe(true);
  });

  it('mostrarAgregarErrorEvento should emit', () => {
    const spy = jest.spyOn(component.mostrarAgregarErrorDirecto, 'emit');
    component.mostrarAgregarErrorEvento(true);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('ngOnDestroy should complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});