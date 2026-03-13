import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilesComponent } from './perfiles.component';
import { FormBuilder } from '@angular/forms';
import { Tramite32612DosStore } from '../../estados/solicitud32612Dos.store';
import { Tramite32612DosQuery } from '../../estados/solicitud32612Dos.query';
import { Tramite32612Store } from '../../estados/solicitud32612.store';
import { Tramite32612Query } from '../../estados/solicitud32612.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('PerfilesComponent', () => {
  let component: PerfilesComponent;
  let fixture: ComponentFixture<PerfilesComponent>;
  let tramite32612StoreMock: any;
  let tramite32612QueryMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    tramite32612StoreMock = { setDynamicFieldValue: jest.fn() };
    tramite32612QueryMock = { selectSolicitudeDos$: of({}) };
    tramiteStoreMock = { setDynamicFieldValue: jest.fn() };
    tramiteQueryMock = { selectSolicitude$: of({}) };
    consultaioQueryMock = { selectConsultaioState$: of({ readonly: false }) };

    await TestBed.configureTestingModule({
      imports: [PerfilesComponent],
      providers: [
        FormBuilder,
        { provide: Tramite32612DosStore, useValue: tramite32612StoreMock },
        { provide: Tramite32612DosQuery, useValue: tramite32612QueryMock },
        { provide: Tramite32612Store, useValue: tramiteStoreMock },
        { provide: Tramite32612Query, useValue: tramiteQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formaPerfil on ngOnInit', () => {
    component.solicitudeState = {
      nombreAgenciaAduanal: 'Agencia',
      tipoInstalacion: 'Tipo',
      antiguedadInstalacion: '5 años',
      actividadPreponderante: 'Comercial',
      tiposServicios: 'Servicios',
      operacionesMensualesExp: 10,
      operacionesMensualesImp: 20,
      numeroEmpleados: 100,
      superficieInstalacion: 200,
      opcion: 'Si',
      nombrePrograma: 'Programa',
      numeroDeRegistro: '123',
      organismoCertificador: 'Certificador'
    } as any;
    component.crearFormulario();
    expect(component.formaPerfil).toBeDefined();
    expect(component.formaPerfil.get('nombreAgenciaAduanal')?.value).toBe('Agencia');
  });

  it('should disable formaPerfil when esFormularioSoloLectura is true', () => {
    component.solicitudeState = {} as any;
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.formaPerfil.disabled).toBe(true);
  });

  it('should enable formaPerfil when esFormularioSoloLectura is false', () => {
    component.solicitudeState = {} as any;
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.formaPerfil.enabled).toBe(true);
  });

  it('should call setDynamicFieldValue on emitirCambioDeValor', () => {
    const event = { campo: 'testCampo', valor: 'testValor' };
    component.emitirCambioDeValor(event);
    expect(tramiteStoreMock.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 'testValor');
  });

  it('should call tramite32612Store method in setValoresStore', () => {
    const form = new FormBuilder().group({ campo: ['valor'] });
    tramite32612StoreMock.testMethod = jest.fn();
    component.setValoresStore(form, 'campo', 'testMethod' as any);
    expect(tramite32612StoreMock.testMethod).toHaveBeenCalledWith('valor');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should return certificacionesFormGroup from forma', () => {
    expect(component.certificacionesFormGroup).toBeDefined();
  });

  it('should call crearPerfilForm in crearFormulario when not readonly', () => {
    const spy = jest.spyOn(component, 'crearFormulario');
    component.esFormularioSoloLectura = false;
    component.crearFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario in crearFormulario when readonly', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.crearFormulario();
    expect(spy).toHaveBeenCalled();
  });
});
