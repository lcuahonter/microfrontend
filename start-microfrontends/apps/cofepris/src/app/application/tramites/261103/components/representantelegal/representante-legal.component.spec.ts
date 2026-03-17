import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentanteLegalComponent } from './representante-legal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261103.query';
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261103.store';
import { DatosProcedureState } from '../../../../estados/tramites/tramites261103.store';
import { ModificacionPermisoImportacionMedicamentosService } from '../../services/modificacion-permiso-importacion-medicamentos.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

jest.mock('../../services/modificacion-permiso-importacion-medicamentos.service');

describe('RepresentanteLegalComponent', () => {
  let component: RepresentanteLegalComponent;
  let fixture: ComponentFixture<RepresentanteLegalComponent>;
  let mockStore: DatosProcedureStore;
  let mockQuery: DatosProcedureQuery;
  let mockConsultaioQuery: ConsultaioQuery;
  let destroy$: Subject<void>;

  const mockState: DatosProcedureState = {
    ideGenerica1: '',
    observaciones: '',
    denominacion: '',
    codigo: '',
    estado: '',
    municipio: '',
    localidad: '',
    colonia: '',
    calle: '',
    correo: '',
    sanitario: '',
    lada: '',
    telefono: '',
    funcionamiento: '',
    licencia: '',
    representanteLegalRFC: '',
    representanteLegalNombre: 'Juan',
    buscar: '',
    representanteLegalApPaterno: '',
    representanteLegalApMaterno: '',
    regimen: '',
    informacionConfidencial: '',
    aduanas: '1',
    claveDeReferencia: '',
    cadenaPagoDependencia: '',
    bancoClave: '',
    llaveDePago: '',
    fecPago: '',
    impPago: '',
  };

  beforeEach(async () => {
    mockStore = {
      establecerDatos: jest.fn()
    } as unknown as DatosProcedureStore;

    mockQuery = {
      selectProrroga$: of(mockState)
    } as unknown as DatosProcedureQuery;

    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    } as unknown as ConsultaioQuery;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RepresentanteLegalComponent],
      providers: [
        FormBuilder,
        { provide: DatosProcedureStore, useValue: mockStore },
        { provide: DatosProcedureQuery, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.componentInstance;
    destroy$ = new Subject<void>();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', async () => {
    // Set up the component state with mock data
    component['seccionState'] = mockState;
    
    // Call ngOnInit to initialize the form
    component.ngOnInit();
    
    // Wait for the form to be created
    await fixture.whenStable();
    
    expect(component.domicilioEstablecimiento).toBeDefined();
    expect(component.domicilioEstablecimiento.controls['representanteLegalNombre'].value).toBe('Juan');
  });

  it('should set form as read-only if esFormularioSoloLectura is true', async () => {
    // Set up the component state
    component['seccionState'] = mockState;
    component.esFormularioSoloLectura = true;
    
    // Initialize the form
    component.establecerdomicilioEstablecimiento();
    
    // Wait for form to be created
    await fixture.whenStable();
    
    expect(component.domicilioEstablecimiento.disabled).toBe(true);
  });

  it('should call store.establecerDatos in setValoresStore()', () => {
    component.domicilioEstablecimiento = component['fb'].group({
      representanteLegalNombre: ['Carlos']
    });
    component.setValoresStore(component.domicilioEstablecimiento, 'representanteLegalNombre');
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({ representanteLegalNombre: 'Carlos' });
  });

  it('should call destroy$.next and destroy$.complete on ngOnDestroy()', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should return true for isValid when service returns true', () => {
    // Create a simple form for testing
    component.domicilioEstablecimiento = component['fb'].group({
      representanteLegalNombre: ['Carlos', []]
    });
    
    // Mock the static method
    jest.spyOn(ModificacionPermisoImportacionMedicamentosService, 'isValid').mockReturnValue(true);
    
    const result = component.isValid('representanteLegalNombre');
    expect(result).toBe(true);
  });

  it('should initialize state with obtenerDatosFormulario', () => {
    component.obtenerDatosFormulario();
    expect(component['seccionState']).toEqual(mockState);
  });

  it('should call both obtenerDatosFormulario and establecerdomicilioEstablecimiento in inicializarEstadoFormulario()', () => {
    const obtenerSpy = jest.spyOn(component, 'obtenerDatosFormulario');
    const establecerSpy = jest.spyOn(component, 'establecerdomicilioEstablecimiento');
    component.inicializarEstadoFormulario();
    expect(obtenerSpy).toHaveBeenCalled();
    expect(establecerSpy).toHaveBeenCalled();
  });
});
