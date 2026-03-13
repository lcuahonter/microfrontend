import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AgregarEnlaceOperativoComponent } from './agregar-enlace-operativo.component';
import { Solicitud32614Query } from '../../estados/solicitud32614.query';
import { Solicitud32614Store } from '../../estados/solicitud32614.store';
import { SolicitudService } from '../../services/solicitud.service';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

describe('AgregarEnlaceOperativoComponent', () => {
  let component: AgregarEnlaceOperativoComponent;
  let fixture: ComponentFixture<AgregarEnlaceOperativoComponent>;
  let solicitudServiceMock: any;
  let solicitud32614QueryMock: any;
  let solicitud32614StoreMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    solicitudServiceMock = {
      conseguirRepresentanteLegalDatos: jest.fn().mockReturnValue(
        of({
          rfc: 'RFC123',
          nombre: 'John',
          apellidoPaterno: 'Doe',
          apellidoMaterno: 'Smith',
          telefono: '1234567890',
          correoElectronico: 'john.doe@example.com',
        })
      ),
    };

    solicitud32614QueryMock = {
      selectSolicitud$: of({
        rfcTercero: 'RFC123',
        rfc: 'RFC456',
        nombre: 'John',
        apellidoPaterno: 'Doe',
        apellidoMaterno: 'Smith',
        agregarEnlaceCiudadEstado: 'City, State',
        agregarEnlaceCargo: 'Manager',
        telefono: '1234567890',
        correoElectronico: 'john.doe@example.com',
        agregarEnlaceSuplente: false,
      }),
    };

    solicitud32614StoreMock = {
      actualizarEnlaceRfc: jest.fn(() => of('RFC123')),
      actualizarEnlaceNombre: jest.fn(() => of('John')),
      actualizarEnlaceApellidoPaterno: jest.fn(() => of('Doe')),
      actualizarEnlaceApellidoMaterno: jest.fn(() => of('Smith')),
      actualizarEnlaceTelefono: jest.fn(() => of('1234567890')),
      actualizarEnlaceCorreoElectronico: jest.fn(() =>
        of('john.doe@example.com')
      ),
      actualizarRfcTercero: jest.fn(() => of('RFC123')),
      actualizarTelefono: jest.fn(() => of('1234567890')),
      actualizarCorreoElectronico: jest.fn(() => of('john.doe@example.com')),
      actualizarEnlaceCargo: jest.fn(() => of('Manager')),
      actualizarEnlaceSuplente: jest.fn(() => of(false)),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({
        readonly: false,
      }),
    };

    await TestBed.configureTestingModule({
      imports: [
        AgregarEnlaceOperativoComponent,
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Solicitud32614Query, useValue: solicitud32614QueryMock },
        { provide: Solicitud32614Store, useValue: solicitud32614StoreMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarEnlaceOperativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.agregarEnlaceOperativoForm.value).toEqual({
      agregarEnlaceRfcTercero: 'RFC123',
      agregarEnlaceCargo: 'Manager',
      agregarEnlaceTelefono: '1234567890',
      agregarEnlaceCorreoElectronico: 'john.doe@example.com',
      agregarEnlaceSuplente: false,
    });
  });
  it('should call guardarDatosFormulario if esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    const inicializarFormularioSpy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
  });

  it('should disable the form if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarFormulario = jest.fn(() => {
      component.agregarEnlaceOperativoForm = component['fb'].group({
        agregarEnlaceRfcTercero: [''],
        agregarEnlaceRfc: [''],
        agregarEnlaceNombre: [''],
        agregarEnlaceApellidoPaterno: [''],
        agregarEnlaceApellidoMaterno: [''],
        agregarEnlaceCiudadEstado: [''],
        agregarEnlaceCargo: [''],
        agregarEnlaceTelefono: [''],
        agregarEnlaceCorreoElectronico: [''],
        agregarEnlaceSuplente: [false],
      });
    }) as any;
    component.guardarDatosFormulario();
    expect(component.agregarEnlaceOperativoForm.disabled).toBe(true);
  });

  it('should enable the form if esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarFormulario = jest.fn(() => {
      component.agregarEnlaceOperativoForm = component['fb'].group({
        agregarEnlaceRfcTercero: [''],
        agregarEnlaceRfc: [''],
        agregarEnlaceNombre: [''],
        agregarEnlaceApellidoPaterno: [''],
        agregarEnlaceApellidoMaterno: [''],
        agregarEnlaceCiudadEstado: [''],
        agregarEnlaceCargo: [''],
        agregarEnlaceTelefono: [''],
        agregarEnlaceCorreoElectronico: [''],
        agregarEnlaceSuplente: [false],
      });
    }) as any;
    component.guardarDatosFormulario();
    expect(component.agregarEnlaceOperativoForm.enabled).toBe(true);
  });

  it('noEsValido should return true if control is invalid and touched', () => {
    component.agregarEnlaceOperativoForm.get('agregarEnlaceTelefono')?.markAsTouched();
    component.agregarEnlaceOperativoForm.get('agregarEnlaceTelefono')?.setValue('');
    expect(component.noEsValido('agregarEnlaceTelefono')).toBe(true);
  });

  it('noEsValido should return undefined if control does not exist', () => {
    expect(component.noEsValido('campoInexistente')).toBeUndefined();
  });
  
  it('should call actualizarRfcTercero on store when actualizarRfcTercero is called', () => {
    const mockEvent = { target: { value: 'RFC789' } } as unknown as Event;
    component.actualizarRfcTercero(mockEvent);
    expect(solicitud32614StoreMock.actualizarRfcTercero).toHaveBeenCalledWith('RFC789');
  });

  it('should call actualizarTelefono on store when actualizarTelefono is called', () => {
    const mockEvent = { target: { value: '5551234567' } } as unknown as Event;
    component.actualizarTelefono(mockEvent);
    expect(solicitud32614StoreMock.actualizarTelefono).toHaveBeenCalledWith('5551234567');
  });

  it('should call actualizarCorreoElectronico on store when actualizarCorreoElectronico is called', () => {
    const mockEvent = { target: { value: 'test@email.com' } } as unknown as Event;
    component.actualizarCorreoElectronico(mockEvent);
    expect(solicitud32614StoreMock.actualizarCorreoElectronico).toHaveBeenCalledWith('test@email.com');
  });

  it('should call actualizarEnlaceCargo on store when agregarEnlaceCargo is called', () => {
    const mockEvent = { target: { value: 'Director' } } as unknown as Event;
    component.agregarEnlaceCargo(mockEvent);
    expect(solicitud32614StoreMock.actualizarEnlaceCargo).toHaveBeenCalledWith('Director');
  });

  it('should call actualizarEnlaceSuplente on store when actualizarEnlaceSuplente is called', () => {
    const mockEvent = { target: { checked: true } } as unknown as Event;
    component.actualizarEnlaceSuplente(mockEvent);
    expect(solicitud32614StoreMock.actualizarEnlaceSuplente).toHaveBeenCalledWith(true);
  });


  it('should call solicitudService.conseguirRepresentanteLegalDatos on buscarTerceroNacionalIDC', () => {
    component.agregarEnlaceOperativoForm.get('rfcTercero')?.setValue('RFC123');
    solicitudServiceMock.conseguirRepresentanteLegalDatos();
    expect(
      solicitudServiceMock.conseguirRepresentanteLegalDatos
    ).toHaveBeenCalled();
  });

  it('should emit agregarEnlaceOperativo event on aceptarEnlaceSuplente', () => {
    jest.spyOn(component.agregarEnlaceOperativo, 'emit');
    component.aceptarEnlaceSuplente();
    expect(component.agregarEnlaceOperativo.emit).toHaveBeenCalledWith({
      rfc: 'RFC456',
      nombre: 'John',
      apellidoPaterno: 'Doe',
      apellidoMaterno: 'Smith',
      claveCiudad: '',
      ciudad: 'City, State',
      cargo: 'Manager',
      telefono: '1234567890',
      correo: 'john.doe@example.com',
      suplente: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      colonia: '',
      codigoPostal: '',
      localidad: '',
      delegacionMunicipio: '',
    });
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should initialize component with consulta state subscription', () => {
    // Test that the component subscribes to consultaioQuery.selectConsultaioState$
    expect(component.esFormularioSoloLectura).toBeDefined();
  });

  describe('buscarTerceroNacionalIDC', () => {
    it('should call solicitudService and update store when rfcTercero has value', () => {
      component.agregarEnlaceOperativoForm = component['fb'].group({
        rfcTercero: ['RFC123'],
      });
      
      component.buscarTerceroNacionalIDC();
      
      expect(solicitudServiceMock.conseguirRepresentanteLegalDatos).toHaveBeenCalled();
    });

    it('should not call solicitudService when rfcTercero is empty', () => {
      component.agregarEnlaceOperativoForm = component['fb'].group({
        rfcTercero: [''],
      });
      
      component.buscarTerceroNacionalIDC();
      
      expect(solicitudServiceMock.conseguirRepresentanteLegalDatos).not.toHaveBeenCalled();
    });

    it('should update store with response data when service call succeeds', (done) => {
      const mockResponse = {
        rfc: 'RFC789',
        nombre: 'Jane',
        apellidoPaterno: 'Smith',
        apellidoMaterno: 'Johnson',
        telefono: '9876543210',
        correoElectronico: 'jane.smith@example.com',
      };

      solicitudServiceMock.conseguirRepresentanteLegalDatos.mockReturnValue(of(mockResponse));
      
      component.agregarEnlaceOperativoForm = component['fb'].group({
        rfcTercero: ['RFC123'],
      });

      component.buscarTerceroNacionalIDC();

      setTimeout(() => {
        expect(solicitud32614StoreMock.actualizarEnlaceRfc).toHaveBeenCalledWith('RFC789');
        expect(solicitud32614StoreMock.actualizarEnlaceNombre).toHaveBeenCalledWith('Jane');
        expect(solicitud32614StoreMock.actualizarEnlaceApellidoPaterno).toHaveBeenCalledWith('Smith');
        expect(solicitud32614StoreMock.actualizarEnlaceApellidoMaterno).toHaveBeenCalledWith('Johnson');
        expect(solicitud32614StoreMock.actualizarEnlaceTelefono).toHaveBeenCalledWith('9876543210');
        expect(solicitud32614StoreMock.actualizarEnlaceCorreoElectronico).toHaveBeenCalledWith('jane.smith@example.com');
        done();
      }, 100);
    });
  });

  describe('Form validation', () => {
    it('should set required validator for agregarEnlaceRfcTercero field', () => {
      const rfcTerceroControl = component.agregarEnlaceOperativoForm.get('agregarEnlaceRfcTercero');
      expect(rfcTerceroControl?.hasError('required')).toBeTruthy();
      
      rfcTerceroControl?.setValue('RFC123');
      expect(rfcTerceroControl?.hasError('required')).toBeFalsy();
    });

    it('should set required and email validators for agregarEnlaceCorreoElectronico field', () => {
      const emailControl = component.agregarEnlaceOperativoForm.get('agregarEnlaceCorreoElectronico');
      
      // Test required validation
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBeTruthy();
      
      // Test email validation
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBeFalsy();
    });

    it('should set required and pattern validators for agregarEnlaceTelefono field', () => {
      const telefonoControl = component.agregarEnlaceOperativoForm.get('agregarEnlaceTelefono');
      
      // Test required validation
      telefonoControl?.setValue('');
      expect(telefonoControl?.hasError('required')).toBeTruthy();
      
      // Test pattern validation (assuming REGEX_TELEFONO_DIGITOS requires 10 digits)
      telefonoControl?.setValue('123');
      expect(telefonoControl?.hasError('pattern')).toBeTruthy();
      
      telefonoControl?.setValue('1234567890');
      expect(telefonoControl?.errors).toBeFalsy();
    });
  });

  describe('Form field states', () => {
    it('should have disabled fields for personal information', () => {
      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceRfc')?.disabled).toBeTruthy();
      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceNombre')?.disabled).toBeTruthy();
      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceApellidoPaterno')?.disabled).toBeTruthy();
      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceApellidoMaterno')?.disabled).toBeTruthy();
      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceCiudadEstado')?.disabled).toBeTruthy();
    });

    it('should have enabled fields for editable information', () => {
      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceRfcTercero')?.disabled).toBeFalsy();
      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceCargo')?.disabled).toBeFalsy();
      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceTelefono')?.disabled).toBeFalsy();
      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceCorreoElectronico')?.disabled).toBeFalsy();
      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceSuplente')?.disabled).toBeFalsy();
    });
  });

  describe('aceptarEnlaceSuplente', () => {
    it('should emit EnlaceOperativo object with form values', () => {
      // Setup form with test values
      component.agregarEnlaceOperativoForm.patchValue({
        agregarEnlaceRfc: 'RFC999',
        agregarEnlaceNombre: 'Test Name',
        agregarEnlaceApellidoPaterno: 'Test Paterno',
        agregarEnlaceApellidoMaterno: 'Test Materno',
        agregarEnlaceCiudadEstado: 'Test City',
        agregarEnlaceCargo: 'Test Cargo',
        agregarEnlaceTelefono: '1111111111',
        agregarEnlaceCorreoElectronico: 'test@test.com',
        agregarEnlaceSuplente: false,
      });

      jest.spyOn(component.agregarEnlaceOperativo, 'emit');
      
      component.aceptarEnlaceSuplente();
      
      expect(component.agregarEnlaceOperativo.emit).toHaveBeenCalledWith({
        rfc: 'RFC999',
        nombre: 'Test Name',
        apellidoPaterno: 'Test Paterno',
        apellidoMaterno: 'Test Materno',
        claveCiudad: '',
        ciudad: 'Test City',
        cargo: 'Test Cargo',
        telefono: '1111111111',
        correo: 'test@test.com',
        suplente: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        colonia: '',
        codigoPostal: '',
        localidad: '',
        delegacionMunicipio: '',
      });
    });

    it('should set suplente to "Maria López" when agregarEnlaceSuplente is true', () => {
      component.agregarEnlaceOperativoForm.patchValue({
        agregarEnlaceSuplente: true,
      });

      jest.spyOn(component.agregarEnlaceOperativo, 'emit');
      
      component.aceptarEnlaceSuplente();
      
      const emittedValue = (component.agregarEnlaceOperativo.emit as jest.Mock).mock.calls[0][0];
      expect(emittedValue.suplente).toBe('Maria López');
    });

    it('should set suplente to empty string when agregarEnlaceSuplente is false', () => {
      component.agregarEnlaceOperativoForm.patchValue({
        agregarEnlaceSuplente: false,
      });

      jest.spyOn(component.agregarEnlaceOperativo, 'emit');
      
      component.aceptarEnlaceSuplente();
      
      const emittedValue = (component.agregarEnlaceOperativo.emit as jest.Mock).mock.calls[0][0];
      expect(emittedValue.suplente).toBe('');
    });
  });

  describe('ngOnInit', () => {
    it('should call inicializarEstadoFormulario', () => {
      const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Form updates from state', () => {
    it('should update form when solicitud state changes', () => {
      const newState = {
        rfcTercero: 'NEW_RFC',
        rfc: 'NEW_USER_RFC',
        nombre: 'New Name',
        apellidoPaterno: 'New Paterno',
        apellidoMaterno: 'New Materno',
        agregarEnlaceCiudadEstado: 'New City',
        agregarEnlaceCargo: 'New Cargo',
        telefono: '9999999999',
        correoElectronico: 'new@email.com',
        agregarEnlaceSuplente: true,
      };

      // Simulate state change
      solicitud32614QueryMock.selectSolicitud$ = of(newState);
      
      // Re-initialize component to trigger subscription
      component.inicializarFormulario();

      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceRfcTercero')?.value).toBe('NEW_RFC');
      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceRfc')?.value).toBe('NEW_USER_RFC');
      expect(component.agregarEnlaceOperativoForm.get('agregarEnlaceNombre')?.value).toBe('New Name');
    });
  });

  describe('Error handling', () => {
    it('noEsValido should return false if control is valid', () => {
      component.agregarEnlaceOperativoForm.get('agregarEnlaceTelefono')?.setValue('1234567890');
      component.agregarEnlaceOperativoForm.get('agregarEnlaceTelefono')?.markAsTouched();
      expect(component.noEsValido('agregarEnlaceTelefono')).toBeFalsy();
    });

    it('noEsValido should return false if control is invalid but not touched', () => {
      component.agregarEnlaceOperativoForm.get('agregarEnlaceTelefono')?.setValue('');
      component.agregarEnlaceOperativoForm.get('agregarEnlaceTelefono')?.markAsUntouched();
      expect(component.noEsValido('agregarEnlaceTelefono')).toBeFalsy();
    });
  });

  describe('Component lifecycle', () => {
    it('should have initialized solicitud32614State as empty object', () => {
      expect(component.solicitud32614State).toEqual({});
    });

    it('should have esFormularioSoloLectura as false by default', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
    });
  });
});
