import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitanteComponent } from './solicitante.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Tramite32506Store } from '../../estados/tramite32506.store';
import { Tramite32506Query } from '../../estados/tramite32506.query';
import { AvisoDestruccionService } from '../../services/aviso-destruccion.service';
import { ConsultaioQuery, TituloComponent } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitanteComponent', () => {
  let component: SolicitanteComponent;
  let fixture: ComponentFixture<SolicitanteComponent>;
  let mockStore: any;
  let mockQuery: any;
  let mockAvisoDestruccionService: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockStore = { setDatosSolicitante: jest.fn(()=>of()) };
    mockQuery = { selectSolicitud$: of({ datosSolicitante: {} }) };
    mockAvisoDestruccionService = { obtenerDatosSolicitante: jest.fn().mockReturnValue(of({ rfc: 'RFC123' })) };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, TituloComponent, SolicitanteComponent, HttpClientTestingModule],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Tramite32506Store, useValue: mockStore },
        { provide: Tramite32506Query, useValue: mockQuery },
        { provide: AvisoDestruccionService, useValue: mockAvisoDestruccionService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitanteComponent);
    component = fixture.componentInstance;
    component.tramiteState = { datosSolicitante: {} } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should set esFormularioSoloLectura from consultaioQuery', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(typeof component.esFormularioSoloLectura).toBe('boolean');
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should disable form if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarFormulario = jest.fn(() => {
      component.solicitudForm = new FormBuilder().group({ test: [''] });
    });
    component.guardarDatosFormulario();
    expect(component.solicitudForm.disabled).toBe(true);
  });

  it('should enable form if esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarFormulario = jest.fn(() => {
      component.solicitudForm = new FormBuilder().group({ test: [''] });
    });
    component.guardarDatosFormulario();
    expect(component.solicitudForm.enabled).toBe(true);
  });

  it('should initialize solicitudForm with tramiteState datosSolicitante', () => {
    component.tramiteState = {
      datosSolicitante: {
        rfc: 'RFC123',
        denominacion: 'Denom',
        actividadEconomica: 'Econ',
        correoElectronico: 'test@mail.com',
        pais: 'MX',
        codigoPostal: '12345',
        entidadFederativa: 'CDMX',
        municipio: 'Miguel Hidalgo',
        localidad: 'Polanco',
        colonia: 'Colonia',
        calle: 'Calle',
        nExt: '1',
        nInt: '2',
        lada: '55',
        telefono: '12345678',
        adace: 'ADACE'
      }
    } as any;
    component.inicializarFormulario();
    expect(component.solicitudForm.value.rfc).toBe(null);
    expect(component.solicitudForm.value.denominacion).toBe(null);
  });

  it('should call store.setDatosSolicitante and inicializarFormulario in cargarDatosSolicitante', () => {
    const setDatosSolicitanteSpy = jest.spyOn(component.store, 'setDatosSolicitante');
    const inicializarFormularioSpy = jest.spyOn(component, 'inicializarFormulario');
    component.cargarDatosSolicitante();
    expect(setDatosSolicitanteSpy).toHaveBeenCalled();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should emit continuarEvento', () => {
    const spy = jest.spyOn(component.continuarEvento, 'emit');
    component.continuarEvento.emit('next');
    expect(spy).toHaveBeenCalledWith('next');
  });
});