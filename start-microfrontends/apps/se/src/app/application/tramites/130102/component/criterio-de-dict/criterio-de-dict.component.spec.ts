import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriterioDeDictComponent } from './criterio-de-dict.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Tramite130102Store } from '../../../../estados/tramites/tramite130102.store';
import { Tramite130102Query } from '../../../../estados/queries/tramite130102.query';
import { FormularioRegistroService } from '../../services/octava-temporal.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import SolicitudMercanciaValues from 'libs/shared/theme/assets/json/130102/solicitud_mercancia.json';

describe('CriterioDeDictComponent', () => {
  let component: CriterioDeDictComponent;
  let fixture: ComponentFixture<CriterioDeDictComponent>;
  let mockTramiteStore: any;
  let mockTramiteQuery: any;
  let mockFormularioService: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockTramiteStore = {
      setSolicitudMercancia: jest.fn(),
    };

    mockTramiteQuery = {
      selectSolicitud$: of({ solicitudMercancia: 'ABC' }),
    };

    mockFormularioService = {
      registrarFormulario: jest.fn(),
    };

    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CriterioDeDictComponent],
      providers: [
        FormBuilder,
        { provide: Tramite130102Store, useValue: mockTramiteStore },
        { provide: Tramite130102Query, useValue: mockTramiteQuery },
        { provide: FormularioRegistroService, useValue: mockFormularioService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CriterioDeDictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch solicitud mercancia', () => {
    const mockCatalog = { id: 1, descripcion: 'Test' };
    component.fetchSolicitudMercancia(mockCatalog);
    expect(component.seleccionadaSolicitudMercancia).toEqual(mockCatalog);
  });



  it('should initialize the form with value from query', () => {
    component.inicializarFormulario();
    expect(component.frmCriterioDictamen.get('solicitudMercancia')?.value).toBe('ABC');
  });

  it('should disable form when esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarFormulario();
    expect(component.frmCriterioDictamen.disabled).toBe(true);
  });

  it('should enable or disable form based on esFormularioSoloLectura in guardarDatosFormulario()', () => {
    component.frmCriterioDictamen = component['fb'].group({
      solicitudMercancia: ['ABC'],
    });

    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.frmCriterioDictamen.disabled).toBe(true);

    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.frmCriterioDictamen.enabled).toBe(true);
  });

  it('should initialize state form properly when not read-only', () => {
    component.esFormularioSoloLectura = false;
    jest.spyOn(component as any, 'inicializarFormulario');
    component.inicializarEstadoFormulario();
    expect((component as any).inicializarFormulario).toHaveBeenCalled();
  });

  it('should initialize state form properly when read-only', () => {
    component.esFormularioSoloLectura = true;
    jest.spyOn(component as any, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect((component as any).guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should register form on ngOnInit', () => {
    const spy = jest.spyOn(component['formularioRegistroService'], 'registrarFormulario');
    component.frmCriterioDictamen = component['fb'].group({
      solicitudMercancia: ['test'],
    });
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith('frmCriterioDictamen', component.frmCriterioDictamen);
  });
});
