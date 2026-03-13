import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcesoProductivoComponent } from './proceso-productivo.component';
import { CatalogoSelectComponent, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { SolicitudDeRegistroTplService } from '../../services/solicitud-de-registro-tpl.service';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('ProcesoProductivoComponent', () => {
  let component: ProcesoProductivoComponent;
  let fixture: ComponentFixture<ProcesoProductivoComponent>;
  let mockSolicitudDeRegistroTplService: jest.Mocked<SolicitudDeRegistroTplService>;
  let mockServicioDeFormularioService: jest.Mocked<ServicioDeFormularioService>;
  let registerFormSpy: jest.SpyInstance<void, [name: string, form: FormGroup<any>], any>;
  let eliminarControlesDinamicosSpy: jest.SpyInstance;
  let establecerValorDeFormularioSpy: jest.SpyInstance;

  beforeEach(async () => {
    
    mockSolicitudDeRegistroTplService = {
      obtenerDatosEstados: jest.fn().mockReturnValue(of([]))
    } as any;

    mockServicioDeFormularioService = {
      registerForm: jest.fn().mockReturnValue(of(true)),
      setFormValue: jest.fn(),
      removeControl: jest.fn()
    } as any;

    registerFormSpy = jest.spyOn(mockServicioDeFormularioService, 'registerForm');

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TituloComponent, CatalogoSelectComponent, InputRadioComponent, HttpClientTestingModule],
      providers: [
        { provide: SolicitudDeRegistroTplService, useValue: mockSolicitudDeRegistroTplService },
        { provide: ServicioDeFormularioService, useValue: mockServicioDeFormularioService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcesoProductivoComponent);
    component = fixture.componentInstance;
    eliminarControlesDinamicosSpy = jest.spyOn(component, 'eliminarControlesDinamicos');
    establecerValorDeFormularioSpy = jest.spyOn(component, 'establecerValorDeFormulario');
    component.consultaState = {
      readonly: false,
    } as any;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and call methods', () => {
    const obtenerDatosEstadosSpy = jest.spyOn(component, 'obtenerDatosEstados');
    const sobreElCambioDeSeleccionSpy = jest.spyOn(component, 'sobreElCambioDeSeleccion');
    const registerFormSpy = jest.spyOn(mockServicioDeFormularioService, 'registerForm');
    component.ngOnInit();
    expect(component.procesoProductivoForm).toBeTruthy();
    expect(obtenerDatosEstadosSpy).toHaveBeenCalled();
    expect(sobreElCambioDeSeleccionSpy).toHaveBeenCalledWith('1', 'indicar');
    expect(registerFormSpy).toHaveBeenCalledWith('procesoProductivoForm', component.procesoProductivoForm);
  });

  it('should populate paisDeOrigen', () => {
    const mockResponse = [{ id: 1, descripcion: 'Mexico' }];
    mockSolicitudDeRegistroTplService.obtenerDatosEstados.mockReturnValue(of(mockResponse));
    component.obtenerDatosEstados();
    expect(mockSolicitudDeRegistroTplService.obtenerDatosEstados).toHaveBeenCalled();
    expect(component.paisDeOrigen).toEqual(mockResponse);
  });

  it('should complete destroy$ subject', () => {
    const nextSpy = jest.spyOn(component.destroy$, 'next');
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should remove dynamic controls', () => {
    component.procesoProductivoForm = new FormBuilder().group({
      paisDeOrigenDeLaFibra: [''],
      paisEnQueSeRealizoElHilado: [''],
      paisEnQueSeRealizoElTejido: ['']
    });
    component.eliminarControlesDinamicos();
    expect(component.procesoProductivoForm.contains('paisDeOrigenDeLaFibra')).toBe(false);
    expect(component.procesoProductivoForm.contains('paisEnQueSeRealizoElHilado')).toBe(false);
    expect(component.procesoProductivoForm.contains('paisEnQueSeRealizoElTejido')).toBe(false);
    expect(mockServicioDeFormularioService.removeControl).toHaveBeenCalledTimes(3);
  });

  it('should call setFormValue with correct parameters', () => {
    component.establecerValorDeFormulario('indicar', '2');
    expect(mockServicioDeFormularioService.setFormValue).toHaveBeenCalledWith('procesoProductivoForm', { indicar: '2' });
  });

  it('should convert number to string', () => {
    component.establecerValorDeFormulario('indicar', 2);
    expect(mockServicioDeFormularioService.setFormValue).toHaveBeenCalledWith('procesoProductivoForm', { indicar: '2' });
  });

  it('should call establecerValorDeFormulario with event target value', () => {
    const spy = jest.spyOn(component, 'establecerValorDeFormulario');
    const mockEvent = { target: { value: '3' } } as unknown as Event;
    component.eventoDeCambioDeValor(mockEvent, 'indicar');
    expect(spy).toHaveBeenCalledWith('indicar', '3');
  });

  it('should call setFormValue with a string value', () => {
    const campo = 'campoTest';
    const valor = 'stringValue';
    component.establecerValorDeFormulario(campo, valor);
    expect(mockServicioDeFormularioService.setFormValue).toHaveBeenCalledWith('procesoProductivoForm', {
      campoTest: 'stringValue',
    });
  })

  it('should call setFormValue with a number value converted to string', () => {
    const campo = 'campoTest';
    const valor = 123;
    component.establecerValorDeFormulario(campo, valor);
    expect(mockServicioDeFormularioService.setFormValue).toHaveBeenCalledWith('procesoProductivoForm', {
      campoTest: '123',
    });
  });

  it('should call setFormValue with an object value', () => {
    const campo = 'campoTest';
    const valor = { key: 'value' };
    component.establecerValorDeFormulario(campo, valor);
    expect(mockServicioDeFormularioService.setFormValue).toHaveBeenCalledWith('procesoProductivoForm', {
      campoTest: valor,
    });
  });

  it('should call establecerValorDeFormulario with the input value', () => {
    const campo = 'campoTest';
    const mockValue = 'testValue';
    const mockEvent = {
      target: { value: mockValue }
    } as unknown as Event;
    const establecerValorDeFormularioSpy = jest.spyOn(component, 'establecerValorDeFormulario');
    component.eventoDeCambioDeValor(mockEvent, campo);
    expect(establecerValorDeFormularioSpy).toHaveBeenCalledWith(campo, mockValue);
  });

  it('should add paisDeOrigenDeLaFibra and paisEnQueSeRealizoElHilado controls when event is "1"', () => {
    component.sobreElCambioDeSeleccion('1', 'campoTest');
    expect(eliminarControlesDinamicosSpy).toHaveBeenCalled();
    expect(component.procesoProductivoForm.contains('paisDeOrigenDeLaFibra')).toBe(true);
    expect(component.procesoProductivoForm.contains('paisEnQueSeRealizoElHilado')).toBe(true);
    expect(establecerValorDeFormularioSpy).toHaveBeenCalledWith('campoTest', '1');
  });

  it('should initialize the form with value from solicitudDeRegistroState if it exists', () => {
    component.solicitudDeRegistroState = { indicar: '2' };
    jest.spyOn(component, 'obtenerDatosEstados');
    jest.spyOn(component, 'sobreElCambioDeSeleccion');
    component.inicializarFormulario();
    expect(component.procesoProductivoForm.value.indicar).toBe('2');
    expect(component.obtenerDatosEstados).toHaveBeenCalled();
    expect(component.sobreElCambioDeSeleccion).toHaveBeenCalledWith('2', 'indicar');
  });

  it('should initialize the form with default value if solicitudDeRegistroState does not have indicar', () => {
    component.solicitudDeRegistroState = {}; // no indicar
    jest.spyOn(component, 'obtenerDatosEstados');
    jest.spyOn(component, 'sobreElCambioDeSeleccion');
    component.inicializarFormulario();
    expect(component.procesoProductivoForm.value.indicar).toBe('1'); // default from opcionesDeRadioIndicar
    expect(component.obtenerDatosEstados).toHaveBeenCalled();
    expect(component.sobreElCambioDeSeleccion).toHaveBeenCalledWith('1', 'indicar');
  });

  it('should apply Validators.required to the indicar field', () => {
    component.solicitudDeRegistroState = {};
    component.inicializarFormulario();
    const indicarControl = component.procesoProductivoForm.get('indicar');
    indicarControl?.setValue('');
    expect(indicarControl?.valid).toBe(false);
    indicarControl?.setValue('1');
    expect(indicarControl?.valid).toBe(true);
  });
  
})
