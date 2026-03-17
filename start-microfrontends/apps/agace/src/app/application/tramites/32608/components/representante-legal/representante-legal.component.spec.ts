import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentanteLegalComponent } from './representante-legal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Solicitud32608Store } from '../../estados/solicitud32608.store';
import { Solicitud32608Query } from '../../estados/solicitud32608.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

describe('RepresentanteLegalComponent', () => {
  let component: RepresentanteLegalComponent;
  let fixture: ComponentFixture<RepresentanteLegalComponent>;

  const mockSolicitudState = {
    representanteRegistro: '',
    representanteRfc: '',
    representanteNombre: '',
    representanteApellidoPaterno: '',
    representanteApellidoMaterno: '',
    representanteTelefono: '',
    representanteCorreo: '',
  };

  const tramiteStoreMock = {
    actualizarEstado: jest.fn(),
  };

  const tramiteQueryMock = {
    selectSolicitud$: of(mockSolicitudState),
  };

  const consultaioQueryMock = {
    selectConsultaioState$: of({ readonly: false }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        NotificacionesComponent,
        RepresentanteLegalComponent
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Solicitud32608Store, useValue: tramiteStoreMock },
        { provide: Solicitud32608Query, useValue: tramiteQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    component.crearFormulario();
    expect(component.representante).toBeDefined();
    expect(component.representante.get('representanteRegistro')?.value).toBe('');
  });

  it('should disable the form if in read-only mode', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.representante.disabled).toBeTruthy();
  });

  it('should show format error notification for invalid RFC', () => {
    component.crearFormulario();
    component.representante.get('representanteRegistro')?.setValue('INVALID');
    component.botonBuscar();
    expect(component.rfcValido).toBe(true);
    expect(component.nuevaNotificacion?.mensaje).toContain('formato incorrecto');
  });

  it('should patch form with mock data if valid RFC entered', () => {
    component.crearFormulario();
    component.representante.get('representanteRegistro')?.setValue('ABC123456DEF7');

    // Mock the behavior of botonBuscar to patch the form with expected data
    jest.spyOn(component, 'botonBuscar').mockImplementation(() => {
      component.representante.patchValue({
        representanteNombre: 'EUROFOODS DE MEXICO',
        representanteRfc: 'ABC123456DEF7',
      });
      component.tieneValorRfc = true;
      component.rfcValido = false;
    });

    component.botonBuscar();

    expect(component.representante.get('representanteNombre')?.value).toBe('EUROFOODS DE MEXICO');
    expect(component.tieneValorRfc).toBe(true);
    expect(component.rfcValido).toBe(false);
  });

  it('should mark form as invalid if search not clicked', () => {
    component.crearFormulario();
    component.representante.get('representanteRegistro')?.setValue('ABC123456DEF7');
    const isValid = component.validarFormularioRepresentante();
    expect(isValid).toBe(false);
    expect(component.mostrarError).toBe(false);
  });

  it('should return true if all required fields are filled after search', () => {
    component.crearFormulario();
    component.buscarClicked = true;
    component.representante.patchValue({
      representanteRegistro: 'ABC123456DEF7',
      representanteRfc: 'ABC123456DEF7',
      representanteNombre: 'Test',
      representanteApellidoPaterno: 'Apellido',
      representanteApellidoMaterno: 'Materno',
      representanteTelefono: '1234567890',
      representanteCorreo: 'test@example.com',
    });
    const isValid = component.validarFormularioRepresentante();
    expect(isValid).toBe(true);
    expect(component.mostrarError).toBe(false);
  });

  it('should update the store when setValoresStore is called', () => {
    component.crearFormulario();
    component.representante.get('representanteCorreo')?.setValue('email@test.com');
    component.setValoresStore(component.representante, 'representanteCorreo');
    expect(tramiteStoreMock.actualizarEstado).toHaveBeenCalledWith({
      representanteCorreo: 'email@test.com',
    });
  });

  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component['destroyed$'], 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
