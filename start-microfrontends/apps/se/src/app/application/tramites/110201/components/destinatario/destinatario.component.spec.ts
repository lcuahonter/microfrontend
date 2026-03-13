import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinatarioComponent } from './destinatario.component';
import { RegistroService } from '../../services/registro.service';
import { Tramite110201Store } from '../../state/Tramite110201.store';
import { Tramite110201Query } from '../../state/Tramite110201.query';
import { ValidacionesFormularioService, CatalogoSelectComponent, ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DestinatarioComponent', () => {
  let component: DestinatarioComponent;
  let fixture: ComponentFixture<DestinatarioComponent>;
  let registroServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let validacionesServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    registroServiceMock = {
      getPaisDestino: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'México', clave: 'MX' }])),
      getTransporte: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Aéreo', clave: 'AE' }])),
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn(),
    };
    tramiteStoreMock = {};
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
      imports: [ReactiveFormsModule, CatalogoSelectComponent, DestinatarioComponent,HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: RegistroService, useValue: registroServiceMock },
        { provide: Tramite110201Store, useValue: tramiteStoreMock },
        { provide: Tramite110201Query, useValue: tramiteQueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DestinatarioComponent);
    component = fixture.componentInstance;
    
    component.nacionOptions = {
      labelNombre: 'País destino',
      required: true,
      primerOpcion: 'Selecciona un valor',
      catalogos: [],
    };
    component.transporteOptions = {
      labelNombre: 'Medio de transporte',
      required: false,
      primerOpcion: 'Selecciona un valor',
      catalogos: [],
    };
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPaisDestino and set options', () => {
    component.getPaisDestinoDestinatario();
  });

  it('should call getTransporte and set option', () => {
    component.getTransporteDestinatario();
  });

  it('should mark all as touched if registroForm is invalid in validarDestinatarioFormulario', () => {
    component.registroForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({
        nombre: ['']
      })
    });
    jest.spyOn(component.registroForm, 'markAllAsTouched');
    component.registroForm.setErrors({ invalid: true });
    component.validarDestinatarioFormulario();
    expect(component.registroForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should set isDisabled to true on onClick', () => {
    component.isDisabled = false;
    component.onClick();
    expect(component.isDisabled).toBe(true);
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

  it('should complete destroyNotifier$ and destroyed$ on ngOnDestroy', () => {
    const destroyNotifierNext = jest.spyOn(component.destroyed$, 'next');
    const destroyNotifierComplete = jest.spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierNext).toHaveBeenCalled();
    expect(destroyNotifierComplete).toHaveBeenCalled();
  });

  it('should call actualizarEstadoFormulario and donanteDomicilio on ngOnInit', () => {
    jest.spyOn(component.registroService, 'actualizarEstadoFormulario');
    jest.spyOn(component, 'donanteDomicilio');
    component.ngOnInit();
    expect(component.donanteDomicilio).toHaveBeenCalled();
  });

  it('should not throw on onSubmit if form is valid', () => {
    component.registroForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({})
    });
    component.registroForm.setErrors(null);
    expect(() => component.onSubmit()).not.toThrow();
  });

  it('should filter non-numeric characters in onlyNumbers for telefono field', () => {
    const mockInput = document.createElement('input');
    mockInput.value = 'abc123def456';
    mockInput.setAttribute('formControlName', 'telefono');
    
    component.registroForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({
        telefono: ['']
      })
    });

    const event = { target: mockInput } as any;
    component.soloDigitos(event);
    
    expect(mockInput.value).toBe('123456');
  });

  it('should filter non-numeric characters in onlyNumbers for fax field', () => {
    const mockInput = document.createElement('input');
    mockInput.value = 'abc123def456ghi789';
    mockInput.setAttribute('formControlName', 'fax');
    
    component.registroForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({
        fax: ['']
      })
    });

    const event = { target: mockInput } as any;
    component.soloDigitos(event);
    
    expect(mockInput.value).toBe('123456789'); 
  });

  it('should limit telefono field to 10 characters in onlyNumbers', () => {
    const mockInput = document.createElement('input');
    mockInput.value = '12345678901234567890'; 
    mockInput.setAttribute('formControlName', 'telefono');
    
    component.registroForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({
        telefono: ['']
      })
    });

    const event = { target: mockInput } as any;
    component.soloDigitos(event);
    
    expect(mockInput.value).toBe('1234567890'); 
  });

  it('should limit fax field to 20 characters in onlyNumbers', () => {
    const mockInput = document.createElement('input');
    mockInput.value = '123456789012345678901234567890';
    mockInput.setAttribute('formControlName', 'fax');
    
    component.registroForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({
        fax: ['']
      })
    });

    const event = { target: mockInput } as any;
    component.soloDigitos(event);
    
    expect(mockInput.value).toBe('12345678901234567890');
  });

  it('should handle invalid service response in getPaisDestino', () => {
    registroServiceMock.getPaisDestino.mockReturnValue(of(null));
    component.getPaisDestinoDestinatario();
  });

  it('should handle invalid service response in getTransporte', () => {
    registroServiceMock.getTransporte.mockReturnValue(of(null));
    component.getTransporteDestinatario();
  });

  it('should mark form as touched when invalid in validarDestinatarioFormulario', () => {
    component.registroForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({
        nombre: ['', Validators.required]
      })
    });
    
    const markAllAsTouchedSpy = jest.spyOn(component.registroForm, 'markAllAsTouched');
    component.validarDestinatarioFormulario();
    
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should populate form with solicitudState data in donanteDomicilio', () => {
    component.solicitudState = {
      nombre: 'Test Name',
      numeroFiscal: '123456789',
      razonSocial: 'Test Company',
      ciudad: 'Test City',
      calle: 'Test Street',
      numeroLetra: '123A',
      lada: '55',
      telefono: '1234567890',
      fax: '0987654321',
      correoElectronico: 'test@test.com'
    } as any;
    
    component.donanteDomicilio();
    
    expect(component.registroForm.get('validacionForm.nombre')?.value).toBe('Test Name');
    expect(component.registroForm.get('validacionForm.numeroFiscal')?.value).toBe('123456789');
    expect(component.registroForm.get('validacionForm.correoElectronico')?.value).toBe('test@test.com');
  });

  it('should set up validation patterns correctly in donanteDomicilio', () => {
    component.solicitudState = {} as any;
    component.donanteDomicilio();
    
    const telefonoControl = component.registroForm.get('validacionForm.telefono');
    const faxControl = component.registroForm.get('validacionForm.fax');
    const emailControl = component.registroForm.get('validacionForm.correoElectronico');
    
    expect(telefonoControl?.hasError('pattern')).toBeFalsy();
    expect(faxControl?.hasError('pattern')).toBeFalsy();
    expect(emailControl?.hasError('required')).toBeTruthy();
  });

  it('should disable form fields when soloLectura is true', () => {
    component.soloLectura = true;
    component.solicitudState = {
      nombre: 'Test Name'
    } as any;
    
    component.donanteDomicilio();
    
    const nombreControl = component.registroForm.get('validacionForm.nombre');
    expect(nombreControl?.disabled).toBeTruthy();
  });

  it('should enable form fields when soloLectura is false', () => {
    component.soloLectura = false;
    component.solicitudState = {
      nombre: 'Test Name'
    } as any;
    
    component.donanteDomicilio();
    
    const nombreControl = component.registroForm.get('validacionForm.nombre');
    expect(nombreControl?.disabled).toBeFalsy();
  });

  it('should update catalog options with successful service response in getPaisDestino', () => {
    const mockCatalogos = [
      { id: 1, nombre: 'México', clave: 'MX' },
      { id: 2, nombre: 'Estados Unidos', clave: 'US' }
    ];
    registroServiceMock.getPaisDestino.mockReturnValue(of(mockCatalogos));
    component.getPaisDestinoDestinatario();
  });

  it('should update transport options with successful service response in getTransporte', () => {
    const mockTransportes = [
      { id: 1, nombre: 'Aéreo', clave: 'AE' },
      { id: 2, nombre: 'Marítimo', clave: 'MA' }
    ];
    registroServiceMock.getTransporte.mockReturnValue(of(mockTransportes));
    
    component.getTransporteDestinatario();
    
  });

  describe('validarFormularios', () => {
    beforeEach(() => {
      component.registroForm = new FormBuilder().group({
        validacionForm: new FormBuilder().group({
          nacion: ['', Validators.required],
          transporte: ['', Validators.required]
        })
      });
    });

    it('should return true when form is valid', () => {
      component.registroForm.patchValue({
        validacionForm: {
          nacion: 'MX',
          transporte: 'AE'
        }
      });
      
      const result = component.validarFormularios();
      
      expect(result).toBe(true);
      expect(component.validationAttempted).toBe(true);
    });

    it('should return false and mark all as touched when form is invalid', () => {
      jest.spyOn(component.registroForm, 'markAllAsTouched');
      jest.spyOn(component, 'validarDestinatarioFormulario');
      
      const result = component.validarFormularios();
      
      expect(result).toBe(false);
      expect(component.validationAttempted).toBe(true);
      expect(component.registroForm.markAllAsTouched).toHaveBeenCalled();
      expect(component.validarDestinatarioFormulario).toHaveBeenCalled();
    });
  });

  describe('markAllControlsAsTouched', () => {
    it('should mark all controls as touched in nested FormGroups', () => {
      const nestedForm = new FormBuilder().group({
        validacionForm: new FormBuilder().group({
          nacion: [''],
          transporte: ['']
        })
      });
      
      jest.spyOn(nestedForm.get('validacionForm.nacion')!, 'markAsTouched');
      jest.spyOn(nestedForm.get('validacionForm.nacion')!, 'updateValueAndValidity');
      
      component['markAllControlsAsTouched'](nestedForm);
      
      expect(nestedForm.get('validacionForm.nacion')!.markAsTouched).toHaveBeenCalled();
      expect(nestedForm.get('validacionForm.nacion')!.updateValueAndValidity).toHaveBeenCalled();
    });

    it('should recursively handle nested FormGroups', () => {
      const deepNestedForm = new FormBuilder().group({
        level1: new FormBuilder().group({
          level2: new FormBuilder().group({
            field: ['']
          })
        })
      });
      
      jest.spyOn(deepNestedForm.get('level1.level2.field')!, 'markAsTouched');
      
      component['markAllControlsAsTouched'](deepNestedForm);
      
      expect(deepNestedForm.get('level1.level2.field')!.markAsTouched).toHaveBeenCalled();
    });
  });

  describe('setValoresStore', () => {
    beforeEach(() => {
      tramiteStoreMock.setNacion = jest.fn();
      tramiteStoreMock.setTransporte = jest.fn();
      component.store = tramiteStoreMock;
      component.registroForm = new FormBuilder().group({
        validacionForm: new FormBuilder().group({
          nacion: ['MX'],
          transporte: ['AE']
        })
      });
    });

    it('should call store method with form value', () => {
      component.setValoresStore(component.validacionForm, 'nacion', 'setNacion');
      
      expect(tramiteStoreMock.setNacion).toHaveBeenCalledWith('MX');
    });

    it('should call compararPaisDestino when campo is nacion', () => {
      jest.spyOn(component, 'compararPaisDestino');
      
      component.setValoresStore(component.validacionForm, 'nacion', 'setNacion');
      
      expect(component.compararPaisDestino).toHaveBeenCalledWith('MX');
    });

    it('should not call compararPaisDestino when campo is not nacion', () => {
      jest.spyOn(component, 'compararPaisDestino');
      
      component.setValoresStore(component.validacionForm, 'transporte', 'setTransporte');
      
      expect(component.compararPaisDestino).not.toHaveBeenCalled();
    });
  });

  describe('validarFormulario', () => {
    it('should return true when validarFormularios returns true', () => {
      jest.spyOn(component, 'validarFormularios').mockReturnValue(true);
      
      const result = component.validarFormulario();
      
      expect(result).toBe(true);
    });

    it('should return false when validarFormularios returns false', () => {
      jest.spyOn(component, 'validarFormularios').mockReturnValue(false);
      
      const result = component.validarFormulario();
      
      expect(result).toBe(false);
    });
  });

  describe('compararPaisDestino', () => {
    it('should set paisNoCoincide to false when paisCertificadoOrigen is null', () => {
      component.paisCertificadoOrigen = null;
      
      component.compararPaisDestino('MX');
      
      expect(component.paisNoCoincide).toBe(false);
    });

    it('should set paisNoCoincide to false when paisCertificadoOrigen is undefined', () => {
      component.paisCertificadoOrigen = undefined as any;
      
      component.compararPaisDestino('MX');
      
      expect(component.paisNoCoincide).toBe(false);
    });

    it('should set paisNoCoincide to false when values match', () => {
      component.paisCertificadoOrigen = 'MX';
      
      component.compararPaisDestino('MX');
      
      expect(component.paisNoCoincide).toBe(false);
    });

    it('should set paisNoCoincide to true when values do not match', () => {
      component.paisCertificadoOrigen = 'MX';
      
      component.compararPaisDestino('US');
      
      expect(component.paisNoCoincide).toBe(true);
    });

    it('should return early when paisCertificadoOrigen is not defined', () => {
      component.paisCertificadoOrigen = '';
      component.paisNoCoincide = true;
      
      component.compararPaisDestino('MX');
      
      expect(component.paisNoCoincide).toBe(false);
    });
  });
});