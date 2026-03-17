import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { REG_X, REGEX_RFC } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';
import { AgregarEnlaceOperativoComponent } from './agregar-enlace-operativo.component';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';
import { Solicitud32604Store } from '../../estados/solicitud32604.store';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockToastrService {
  success = jest.fn();
  error = jest.fn();
  info = jest.fn();
  warning = jest.fn();
}


describe('AgregarEnlaceOperativoComponent', () => {
  let component: AgregarEnlaceOperativoComponent;
  let fixture: ComponentFixture<AgregarEnlaceOperativoComponent>;
  let empresasComercializadorasServiceMock: any;
  let solicitud32604QueryMock: any;
  let solicitud32604StoreMock: any;

  beforeEach(() => {
    empresasComercializadorasServiceMock = {
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

    solicitud32604QueryMock = {
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

    solicitud32604StoreMock = {
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

    TestBed.configureTestingModule({
      imports: [
        AgregarEnlaceOperativoComponent,
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: EmpresasComercializadorasService, useValue: empresasComercializadorasServiceMock },
        { provide: Solicitud32604Query, useValue: solicitud32604QueryMock },
        { provide: Solicitud32604Store, useValue: solicitud32604StoreMock },
        { provide: ToastrService, useClass: MockToastrService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarEnlaceOperativoComponent);
    component = fixture.componentInstance;
    component.esFormularioSoloLectura = true;
    component.agregarEnlaceOperativoForm = new FormBuilder().group({
      agregarEnlaceRfcTercero: [{ value: 'RFC123', disabled: true }],
      agregarEnlaceRfc: [{ value: 'RFC456', disabled: true }],
      agregarEnlaceNombre: [{ value: 'John', disabled: true }],
      agregarEnlaceApellidoPaterno: [{ value: 'Doe', disabled: true }],
      agregarEnlaceApellidoMaterno: [{ value: 'Smith', disabled: true }],
      agregarEnlaceCiudadEstado: [{ value: 'City, State', disabled: true }],
      agregarEnlaceCargo: ['Manager'],
      agregarEnlaceTelefono: ['1234567890'],
      agregarEnlaceCorreoElectronico: ['john.doe@example.com'],
      agregarEnlaceSuplente: [false],
    });
    fixture.detectChanges();
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
        agregarEnlaceRfc: [{ value: '', disabled: true }],
        agregarEnlaceNombre: [{ value: '', disabled: true }],
        agregarEnlaceApellidoPaterno: [{ value: '', disabled: true }],
        agregarEnlaceApellidoMaterno: [{ value: '', disabled: true }],
        agregarEnlaceCiudadEstado: [{ value: '', disabled: true }],
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
        agregarEnlaceCorreoElectronico: ['']
      });
    });
    component.guardarDatosFormulario();
    expect(component.agregarEnlaceOperativoForm.enabled).toBe(true);
  });

  it('noEsValido should return true if control is invalid and touched', () => {
  component.agregarEnlaceOperativoForm = component['fb'].group({
    agregarEnlaceTelefono: ['', Validators.required]
  });
  const telefonoControl = component.agregarEnlaceOperativoForm.get('agregarEnlaceTelefono');
  telefonoControl?.setValue('');
  telefonoControl?.markAsTouched();
  telefonoControl?.updateValueAndValidity();
  expect(component.noEsValido('agregarEnlaceTelefono')).toBeTruthy();
  });

  it('noEsValido should return undefined if control does not exist', () => {
    expect(component.noEsValido('campoInexistente')).toBeUndefined();
  });
  
  it('should call actualizarRfcTercero on store when actualizarRfcTercero is called', () => {
    const mockEvent = { target: { value: 'RFC789' } } as unknown as Event;
    component.actualizarRfcTercero(mockEvent);
    expect(solicitud32604StoreMock.actualizarRfcTercero).toHaveBeenCalledWith('RFC789');
  });

  it('should call actualizarTelefono on store when actualizarTelefono is called', () => {
    const mockEvent = { target: { value: '5551234567' } } as unknown as Event;
    component.actualizarTelefono(mockEvent);
    expect(solicitud32604StoreMock.actualizarTelefono).toHaveBeenCalledWith('5551234567');
  });

  it('should call actualizarCorreoElectronico on store when actualizarCorreoElectronico is called', () => {
    const mockEvent = { target: { value: 'test@email.com' } } as unknown as Event;
    component.actualizarCorreoElectronico(mockEvent);
    expect(solicitud32604StoreMock.actualizarCorreoElectronico).toHaveBeenCalledWith('test@email.com');
  });

  it('should call actualizarEnlaceCargo on store when agregarEnlaceCargo is called', () => {
    const mockEvent = { target: { value: 'Director' } } as unknown as Event;
    component.agregarEnlaceCargo(mockEvent);
    expect(solicitud32604StoreMock.actualizarEnlaceCargo).toHaveBeenCalledWith('Director');
  });

  it('should call actualizarEnlaceSuplente on store when actualizarEnlaceSuplente is called', () => {
    const mockEvent = { target: { checked: true } } as unknown as Event;
    component.actualizarEnlaceSuplente(mockEvent);
    expect(solicitud32604StoreMock.actualizarEnlaceSuplente).toHaveBeenCalledWith(true);
  });


  it('should call empresasComercializadorasService.conseguirRepresentanteLegalDatos on buscarTerceroNacionalIDC', () => {
    component.agregarEnlaceOperativoForm.get('rfcTercero')?.setValue('RFC123');
    empresasComercializadorasServiceMock.conseguirRepresentanteLegalDatos();
    expect(
      empresasComercializadorasServiceMock.conseguirRepresentanteLegalDatos
    ).toHaveBeenCalled();
  });


  it('should emit agregarEnlaceOperativo event on aceptarEnlaceSuplente', fakeAsync(() => {
    const validRFC = 'ABC123456T12';
    component.agregarEnlaceOperativoForm = component['fb'].group({
      agregarEnlaceRfcTercero: [validRFC, [Validators.required, Validators.pattern(REGEX_RFC), Validators.maxLength(15)]],
      agregarEnlaceRfc: [validRFC, [Validators.required, Validators.pattern(REGEX_RFC)]],
      agregarEnlaceNombre: ['Nombre456', [Validators.required]],
      agregarEnlaceApellidoPaterno: ['ApellidoP456', [Validators.required]],
      agregarEnlaceApellidoMaterno: ['ApellidoM456'],
      agregarEnlaceCiudadEstado: ['Ciudad456'],
      agregarEnlaceCargo: ['Cargo456', [Validators.maxLength(250)]],
      agregarEnlaceTelefono: ['1234567890', [Validators.pattern(REG_X.SOLO_NUMEROS), Validators.maxLength(30)]],
      agregarEnlaceCorreoElectronico: ['correo456@example.com', [Validators.email, Validators.maxLength(320)]],
      agregarEnlaceSuplente: [false]
    });
    Object.keys(component.agregarEnlaceOperativoForm.controls).forEach(key => {
      component.agregarEnlaceOperativoForm.get(key)?.enable();
    });
    component.agregarEnlaceOperativoForm.updateValueAndValidity();
    let emittedValue: any;
    component.agregarEnlaceOperativo.subscribe((value) => {
      emittedValue = value;
    });
    fixture.detectChanges();
    tick();
    expect(component.agregarEnlaceOperativoForm.valid).toBe(true);
    component.aceptarEnlaceSuplente();
    fixture.detectChanges();
    tick(300);
    expect(emittedValue).toBeDefined();
    expect(emittedValue.rfc).toBe(validRFC);
    expect(emittedValue.nombre).toBe('Nombre456');
    expect(emittedValue.cargo).toBe('Cargo456');
    expect(emittedValue.telefono).toBe('1234567890');
    expect(emittedValue.correo).toBe('correo456@example.com');
  }));


  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
    it('should set nuevaNotificacion and show error modal when RFC is invalid', () => {
      component.agregarEnlaceOperativoForm = new FormBuilder().group({
        agregarEnlaceRfcTercero: ['INVALID']
      });
      component.buscarTerceroNacionalIDC();
      expect(component.nuevaNotificacion).toBeDefined();
      expect(component.nuevaNotificacion.categoria).toBe('danger');
    });

    it('should disable form if esFormularioSoloLectura is true', () => {
      component.esFormularioSoloLectura = true;
      component.agregarEnlaceOperativoForm = new FormBuilder().group({
        agregarEnlaceRfcTercero: ['RFC123']
      });
      component.guardarDatosFormulario();
      expect(component.agregarEnlaceOperativoForm.disabled).toBe(true);
    });

    it('should enable form if esFormularioSoloLectura is false', () => {
      component.esFormularioSoloLectura = false;
      component.agregarEnlaceOperativoForm = new FormBuilder().group({
        agregarEnlaceRfcTercero: ['RFC123']
      });
      component.guardarDatosFormulario();
      expect(component.agregarEnlaceOperativoForm.enabled).toBe(true);
    });
});
