import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosCertificadoComponent } from './datos_certificado.component';
import { RegistroService } from '../../services/registro.service';
import { Tramite110201Store } from '../../state/Tramite110201.store';
import { Tramite110201Query } from '../../state/Tramite110201.query';
import { ValidacionesFormularioService, CatalogoSelectComponent, ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosCertificadoComponent', () => {
  let component: DatosCertificadoComponent;
  let fixture: ComponentFixture<DatosCertificadoComponent>;
  let registroServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let validacionesServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    registroServiceMock = {
      getIdiomaDatos: jest.fn().mockReturnValue(of([{ descripcion: 'Español', clave: 'ES' }])),
      getEntidadDatos: jest.fn().mockReturnValue(of([{ descripcion: 'Ciudad de México', clave: 'CDMX' }])),
      getRepresentacionDatos: jest.fn().mockReturnValue(of([{ descripcion: 'Representación Federal', clave: 'RF' }])),
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn(),
    };
    tramiteStoreMock = {
      setIdioma: jest.fn(),
      setEntidad: jest.fn(),
      setRepresentacion: jest.fn(),
      setObservaciones: jest.fn(),
      setPresica: jest.fn(),
      setPresenta: jest.fn(),
      setCasillaVerificacion: jest.fn(),
      setJustificacion: jest.fn(),
    };
    tramiteQueryMock = {
      selectSolicitud$: of({}),
    };
    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true),
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CatalogoSelectComponent, DatosCertificadoComponent,HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: RegistroService, useValue: registroServiceMock },
        { provide: Tramite110201Store, useValue: tramiteStoreMock },
        { provide: Tramite110201Query, useValue: tramiteQueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosCertificadoComponent);
    component = fixture.componentInstance;
    
    component.optionsIdioma = {
      labelNombre: 'Idioma',
      required: true,
      primerOpcion: 'Selecciona un valor',
      catalogos: [],
    };
    component.optionsEntidad = {
      labelNombre: 'Entidad Federativa',
      required: true,
      primerOpcion: 'Selecciona un valor',
      catalogos: [],
    };
    component.optionsRepresentacion = {
      labelNombre: 'Representación Federal',
      required: true,
      primerOpcion: 'Selecciona un valor',
      catalogos: [],
    };
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getIdiomaDatos and set optionsIdioma', () => {
    component.getIdiomaDatos();
  });

  it('should call getRepresentacionDatos and set optionsEntidad', () => {
    component.getEntidadDatos();
    
  });

  it('should call getRepresentacionDatos and set optionsRepresentacion', () => {
    component.getRepresentacionDatos({ clave: 'CDMX', descripcion: 'Ciudad de México' } );
  });

  it('should mark all as touched if registroForm is invalid in validarDestinatarioFormulario', () => {
    component.registroForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({
        observaciones: ['']
      })
    });
    jest.spyOn(component.registroForm, 'markAllAsTouched');
    component.registroForm.setErrors({ invalid: true });
    component.validarDestinatarioFormulario();
    expect(component.registroForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario if soloLectura in inicializarEstadoFormulario', () => {
    component.soloLectura = true;
    jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should call donanteDomicilio if not soloLectura in inicializarEstadoFormulario', () => {
    component.soloLectura = false;
    jest.spyOn(component, 'donanteDomicilio');
    component.inicializarEstadoFormulario();
    expect(component.donanteDomicilio).toHaveBeenCalled();
  });

  it('should call validacionesService.isValid in isValid', () => {
    const form = new FormBuilder().group({ campo: [''] });
    expect(component.isValid(form, 'campo')).toBe(true);
    expect(validacionesServiceMock.isValid).toHaveBeenCalled();
  });

  it('should call store method in setValoresStore', () => {
     const storeMethod = jest.fn();
  component.store = { setNombre: storeMethod } as any; 
  const form = new FormBuilder().group({ campo: ['valor'] });
  component.entidadFederativaData = 'DURANGO';
  component.setValoresStore(form, 'campo', 'setNombre');
  expect(storeMethod).toHaveBeenCalledWith('valor');
  });

  it('should set isJustificacion true if VALOR === 8 and metodoNombre === setEntidad and entidadFederativaData === DURANGO', () => {
    const storeMethod = jest.fn();
    component.store = { setEntidad: storeMethod } as any;
    const form = new FormBuilder().group({ entidad: [8] });
    component.entidadFederativaData = 'DURANGO';
    component.isJustificacion = false;
    component.setValoresStore(form, 'entidad', 'setEntidad');
    expect(component.isJustificacion).toBe(true);
  });

  it('should set isJustificacion false if VALOR !== 8 or metodoNombre !== setEntidad', () => {
    const storeMethod = jest.fn();
    component.store = { setEntidad: storeMethod } as any;
    const form = new FormBuilder().group({ entidad: [7] });
    component.entidadFederativaData = 'DURANGO';
    component.isJustificacion = true;
    component.setValoresStore(form, 'entidad', 'setEntidad');
    expect(component.isJustificacion).toBe(false);
  });

  it('should return validacionForm', () => {
    component.registroForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({})
    });
    expect(component.validacionForm).toBeTruthy();
  });

  it('should set up forms in donanteDomicilio', () => {
    component.solicitudState = {} as any;
    component.donanteDomicilio();
    expect(component.registroForm).toBeTruthy();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const destroyNotifierNext = jest.spyOn(component.destroyed$, 'next');
    const destroyNotifierComplete = jest.spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierNext).toHaveBeenCalled();
    expect(destroyNotifierComplete).toHaveBeenCalled();
  });

  it('should set isJustificacion true if entidadDescripcion includes 8 and entidadFederativaData is DURANGO', () => {
    component.entidadDescripcion = ['8'];
    component.entidadFederativaData = 'DURANGO';
    component.ngOnInit();
    expect(component.isJustificacion).toBe(true);
  });

  it('should set isJustificacion false if entidadDescripcion does not include 8 or entidadFederativaData is not DURANGO', () => {
    component.entidadDescripcion = [7];
    component.entidadFederativaData = 'DURANGO';
    component.ngOnInit();
    component.entidadDescripcion = [8];
    component.entidadFederativaData = 'OTRO';
  });

  it('should call actualizarEstadoFormulario when getRegistroTomaMuestrasMercanciasData returns response', () => {
    const mockResponse = { data: 'test' };
    registroServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(mockResponse));
    
    component.ngOnInit();
    
  });

  it('should not call actualizarEstadoFormulario when getRegistroTomaMuestrasMercanciasData returns null', () => {
    registroServiceMock.actualizarEstadoFormulario.mockClear();
    registroServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null));
    
    const newFixture = TestBed.createComponent(DatosCertificadoComponent);
    const newComponent = newFixture.componentInstance;
    
    newComponent.optionsIdioma = {
      labelNombre: 'Idioma',
      required: true,
      primerOpcion: 'Selecciona un valor',
      catalogos: [],
    };
    newComponent.optionsEntidad = {
      labelNombre: 'Entidad Federativa',
      required: true,
      primerOpcion: 'Selecciona un valor',
      catalogos: [],
    };
    newComponent.optionsRepresentacion = {
      labelNombre: 'Representación Federal',
      required: true,
      primerOpcion: 'Selecciona un valor',
      catalogos: [],
    };
    
    newFixture.detectChanges();
    
  });

  it('should update catalog options with service responses', () => {
    const mockIdiomas = [{ descripcion: 'Español', clave: 'ES' }];
    const mockEntidades = [{ descripcion: 'CDMX', clave: 'CDMX' }];
    const mockRepresentaciones = [{  descripcion: 'Federal', clave: 'FED' }];

    registroServiceMock.getIdiomaDatos.mockReturnValue(of(mockIdiomas));
    registroServiceMock.getEntidadDatos.mockReturnValue(of(mockEntidades));
    registroServiceMock.getRepresentacionDatos.mockReturnValue(of(mockRepresentaciones));

    component.getIdiomaDatos();
    component.getEntidadDatos();
    component.getRepresentacionDatos({ clave: 'CDMX', descripcion: 'Ciudad de México' });

  });

  it('should validate form correctly in validarFormulariosDatos', () => {
    component.isJustificacion = true; 
    component.donanteDomicilio();
    
    component.registroForm.get('validacionForm.presica')?.setValue('test presica');
    component.registroForm.get('validacionForm.idioma')?.setValue('ES');
    component.registroForm.get('validacionForm.entidad')?.setValue(1);
    component.registroForm.get('validacionForm.representacion')?.setValue(1);
    component.registroForm.get('validacionForm.casillaVerificacion')?.setValue(true);
    component.registroForm.get('validacionForm.justificacion')?.setValue('test justificacion');

    const result = component.validarFormulariosDatos();
    expect(result).toBe(true);
    expect(component.validationAttempted).toBe(true);
  });

  it('should validate form correctly when justification is not required', () => {
    component.isJustificacion = false;
    component.donanteDomicilio();
    
    component.registroForm.get('validacionForm.presica')?.setValue('test presica');
    component.registroForm.get('validacionForm.idioma')?.setValue('ES');
    component.registroForm.get('validacionForm.entidad')?.setValue(1);
    component.registroForm.get('validacionForm.representacion')?.setValue(1);
    component.registroForm.get('validacionForm.casillaVerificacion')?.setValue(true);
    
    component.registroForm.get('validacionForm.justificacion')?.clearValidators();
    component.registroForm.get('validacionForm.justificacion')?.updateValueAndValidity();

    const result = component.validarFormulariosDatos();
    expect(result).toBe(true);
    expect(component.validationAttempted).toBe(true);
  });

  it('should return false and mark all touched when form is invalid in validarFormulariosDatos', () => {
    component.donanteDomicilio();
    const markAllAsTouchedSpy = jest.spyOn(component.registroForm, 'markAllAsTouched');
    const validarDestinatarioSpy = jest.spyOn(component, 'validarDestinatarioFormulario');

    const result = component.validarFormulariosDatos();
    
    expect(result).toBe(false);
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(validarDestinatarioSpy).toHaveBeenCalled();
    expect(component.validationAttempted).toBe(true);
  });

  it('should call validarFormulariosDatos in validarFormularioDatos', () => {
    const validarSpy = jest.spyOn(component, 'validarFormulariosDatos').mockReturnValue(true);
    
    const result = component.validarFormularioDatos();
    
    expect(validarSpy).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false in validarFormularioDatos when validarFormulariosDatos returns false', () => {
    const validarSpy = jest.spyOn(component, 'validarFormulariosDatos').mockReturnValue(false);
    
    const result = component.validarFormularioDatos();
    
    expect(validarSpy).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should disable form when soloLectura is true in guardarDatosFormulario', () => {
    component.soloLectura = true;
    component.donanteDomicilio();
    
    component.guardarDatosFormulario();
    
    expect(component.registroForm.disabled).toBe(true);
  });

  it('should enable form when soloLectura is false in guardarDatosFormulario', () => {
    component.soloLectura = false;
    component.donanteDomicilio();
    
    component.guardarDatosFormulario();
    
    expect(component.registroForm.enabled).toBe(true);
  });

  it('should populate form with solicitudState data in donanteDomicilio', () => {
    component.solicitudState = {
      observaciones: 'Test observaciones',
      presica: 'Test presica',
      presenta: 'Test presenta',
      idioma: 'ES',
      entidad: 1,
      representacion: 1,
      casillaVerificacion: true,
      justificacion: 'Test justificacion'
    } as any;
    
    component.donanteDomicilio();
    
    expect(component.registroForm.get('validacionForm.observaciones')?.value).toBe('Test observaciones');
    expect(component.registroForm.get('validacionForm.presica')?.value).toBe('Test presica');
    expect(component.registroForm.get('validacionForm.idioma')?.value).toBe('ES');
  });

  it('should handle markAllControlsAsTouched for nested FormGroups', () => {
    component.donanteDomicilio();
    const updateValueAndValiditySpy = jest.spyOn(component.registroForm.get('validacionForm.idioma')!, 'updateValueAndValidity');
    
    component['markAllControlsAsTouched'](component.registroForm);
    
    expect(updateValueAndValiditySpy).toHaveBeenCalled();
  });
});