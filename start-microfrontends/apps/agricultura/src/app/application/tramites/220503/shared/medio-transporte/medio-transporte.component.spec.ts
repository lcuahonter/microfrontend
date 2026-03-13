import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedioTransporteComponent } from './medio-transporte.component';
import { ReactiveFormsModule, FormGroup, ControlContainer } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('MedioTransporteComponent', () => {
  let component: MedioTransporteComponent;
  let fixture: ComponentFixture<MedioTransporteComponent>;
  let mockParentFormGroup: FormGroup;

  beforeEach(async () => {
    mockParentFormGroup = new FormGroup({});

    const mockControlContainer = {
      control: mockParentFormGroup
    };

    const mockConsultaQuery = {
      selectConsultaioState$: of({
        readonly: false,
        loading: false,
        error: null
      })
    };

    const mockSolicitudQuery = {
      selectSolicitud$: of({
        transporteIdMedio: '',
        identificacionTransporte: '',
        esSolicitudFerros: '',
        totalDeGuiasAmparadas: ''
      })
    };

    const mockSolicitudStore = {
      setEsSolicitudFerros: jest.fn(),
      setTransporteIdMedio: jest.fn(),
      setIdentificacionTransporte: jest.fn(),
      setTotalDeGuiasAmparadas: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MedioTransporteComponent, ReactiveFormsModule],
      providers: [
        { provide: ControlContainer, useValue: mockControlContainer },
        { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
        { provide: 'Solicitud220503Query', useValue: mockSolicitudQuery },
        { provide: 'Solicitud220503Store', useValue: mockSolicitudStore }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MedioTransporteComponent);
    component = fixture.componentInstance;
    component.claveDeControl = 'transporteForm';
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener las propiedades de entrada definidas', () => {
    expect(component.claveDeControl).toBeDefined();
    expect(component.hMercanciaTabla).toBeDefined();
    expect(component.dMercanciaBody).toBeDefined();
    expect(component.mediodetransporte).toBeDefined();
  });

  it('debe tener valores por defecto en las propiedades', () => {
    expect(component.claveDeControl).toBe('transporteForm');
    expect(component.hMercanciaTabla).toEqual([]);
    expect(component.dMercanciaBody).toEqual([]);
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(component.enCambioValor).toBe(0);
  });

  it('debe tener grupoFormularioPadre definido', () => {
    expect(component.grupoFormularioPadre).toBeDefined();
    expect(component.grupoFormularioPadre).toBe(mockParentFormGroup);
  });

  it('debe inicializar el grupo de formulario al llamar inicializarFormulario', () => {
    component.inicializarFormulario();
    const formGroup = component.grupoFormularioPadre.get('transporteForm');
    expect(formGroup).toBeDefined();
    expect(formGroup).toBeInstanceOf(FormGroup);
  });

  it('debe validar el formulario correctamente', () => {
    component.inicializarFormulario();
    const result = component.validarFormularios();
    expect(typeof result).toBe('boolean');
  });

  it('debe actualizar enCambioValor al llamar enCambioDeValor', () => {
    const testValue = 'testValue';
    component.enCambioDeValor(testValue);
    expect(component.enCambioValor).toBe(testValue);
  });
});
