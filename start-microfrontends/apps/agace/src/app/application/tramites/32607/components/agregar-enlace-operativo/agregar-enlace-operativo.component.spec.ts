import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AgregarEnlaceOperativoComponent } from './agregar-enlace-operativo.component';
import { Solicitud32607Query } from '../../estados/solicitud32607.query';
import { Solicitud32607Store } from '../../estados/solicitud32607.store';
import { SolicitudService } from '../../services/solicitud.service';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgregarEnlaceOperativoComponent', () => {
  let component: AgregarEnlaceOperativoComponent;
  let fixture: ComponentFixture<AgregarEnlaceOperativoComponent>;
  let solicitudServiceMock: any;
  let solicitud32607QueryMock: any;
  let solicitud32607StoreMock: any;

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

    solicitud32607QueryMock = {
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

    solicitud32607StoreMock = {
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
        { provide: Solicitud32607Query, useValue: solicitud32607QueryMock },
        { provide: Solicitud32607Store, useValue: solicitud32607StoreMock },
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
    expect(solicitud32607StoreMock.actualizarRfcTercero).toHaveBeenCalledWith('RFC789');
  });

  it('should call actualizarTelefono on store when actualizarTelefono is called', () => {
    const mockEvent = { target: { value: '5551234567' } } as unknown as Event;
    component.actualizarTelefono(mockEvent);
    expect(solicitud32607StoreMock.actualizarTelefono).toHaveBeenCalledWith('5551234567');
  });

  it('should call actualizarCorreoElectronico on store when actualizarCorreoElectronico is called', () => {
    const mockEvent = { target: { value: 'test@email.com' } } as unknown as Event;
    component.actualizarCorreoElectronico(mockEvent);
    expect(solicitud32607StoreMock.actualizarCorreoElectronico).toHaveBeenCalledWith('test@email.com');
  });

  it('should call actualizarEnlaceCargo on store when agregarEnlaceCargo is called', () => {
    const mockEvent = { target: { value: 'Director' } } as unknown as Event;
    component.agregarEnlaceCargo(mockEvent);
    expect(solicitud32607StoreMock.actualizarEnlaceCargo).toHaveBeenCalledWith('Director');
  });

  it('should call actualizarEnlaceSuplente on store when actualizarEnlaceSuplente is called', () => {
    const mockEvent = { target: { checked: true } } as unknown as Event;
    component.actualizarEnlaceSuplente(mockEvent);
    expect(solicitud32607StoreMock.actualizarEnlaceSuplente).toHaveBeenCalledWith(true);
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
});
