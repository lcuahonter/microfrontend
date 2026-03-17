import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsableInspeccionEnPuntoComponent } from './responsable-inspeccion-en-punto.component';
import { FormGroup, ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ResponsableInspeccionEnPuntoComponent', () => {
  let component: ResponsableInspeccionEnPuntoComponent;
  let fixture: ComponentFixture<ResponsableInspeccionEnPuntoComponent>;
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
        nombre: '',
        primerapellido: '',
        segundoapellido: '',
        mercancia: '',
        tipocontenedor: ''
      })
    };

    const mockSolicitudService = {
      getDataResponsableInspeccion: jest.fn().mockReturnValue(of({
        tipoContenedor: {
          labelNombre: 'Tipo de Contenedor',
          catalogos: [],
          required: false,
          primerOpcion: 'Selecciona'
        }
      }))
    };

    await TestBed.configureTestingModule({
      imports: [
        ResponsableInspeccionEnPuntoComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ControlContainer, useValue: mockControlContainer },
        { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
        { provide: 'Solicitud220503Query', useValue: mockSolicitudQuery },
        { provide: 'Solicitud220503Store', useValue: {} },
        { provide: 'SolicitudPantallasService', useValue: mockSolicitudService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsableInspeccionEnPuntoComponent);
    component = fixture.componentInstance;
    component.claveDeControl = 'testControl';
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener el input claveDeControl', () => {
    expect(component.claveDeControl).toBe('testControl');
  });

  it('debe tener grupoFormularioPadre definido', () => {
    expect(component.grupoFormularioPadre).toBeDefined();
    expect(component.grupoFormularioPadre).toBe(mockParentFormGroup);
  });

  it('debe agregar el grupo de formulario al formulario padre al inicializar', () => {
    component.inicializarFormulario();
    const formGroup = component.grupoFormularioPadre.get('testControl');
    expect(formGroup).toBeDefined();
    expect(formGroup instanceof FormGroup).toBe(true);
  });

  it('debe tener valores por defecto en el grupo de formulario después de inicializar', () => {
    component.inicializarFormulario();
    const formGroup = component.grupoFormularioPadre.get('testControl') as FormGroup;
    expect(formGroup.value.nombre).toBe('');
    expect(formGroup.value.primerapellido).toBe('');
    expect(formGroup.value.segundoapellido).toBe('');
    expect(formGroup.value.mercancia).toBe('');
    expect(formGroup.value.tipocontenedor).toBe('');
  });

  it('debe validar el formulario correctamente', () => {
    component.inicializarFormulario();
    const result = component.validarFormularios();
    expect(typeof result).toBe('boolean');
  });

  it('debe regresar falso cuando el grupo de formulario no existe', () => {
    component.claveDeControl = 'nonExistentControl';
    const result = component.validarFormularios();
    expect(result).toBe(false);
  });
});
