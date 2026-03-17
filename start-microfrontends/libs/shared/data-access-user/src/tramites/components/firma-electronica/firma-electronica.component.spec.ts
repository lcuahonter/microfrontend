import { FirmaElectronicaComponent } from './firma-electronica.component';
import { FirmaElectronicaService } from '../../../core/services/shared/firma-electronica/firma-electronica.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { ValidacionesFormularioService } from '../../../core/services/shared/validaciones-formulario/validaciones-formulario.service';
import { OperationType, FileType } from '../../../core/enums/firma-electronica.enum';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('FirmaElectronicaComponent', () => {
  let component: FirmaElectronicaComponent;
  let fixture: ComponentFixture<FirmaElectronicaComponent>;
  let firmaService: jest.Mocked<FirmaElectronicaService>;
  let toastrService: jest.Mocked<ToastrService>;

  const emitValido = jest.fn();
  const emitDatosFirma = jest.fn();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmaElectronicaComponent],
      providers: [
        FormBuilder,
        { 
          provide: FirmaElectronicaService, 
          useValue: { 
            firmarCadena: jest.fn(),
            obtenerCadenaOriginal: jest.fn(),
            enviarFirma: jest.fn()
          } 
        },
        { 
          provide: ToastrService, 
          useValue: { 
            error: jest.fn(), 
            success: jest.fn() 
          } 
        },
        { 
          provide: ValidacionesFormularioService, 
          useValue: { 
            isValid: () => true,
            getErrorMessage: jest.fn()
          } 
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FirmaElectronicaComponent);
    component = fixture.componentInstance;

    firmaService = TestBed.inject(FirmaElectronicaService) as jest.Mocked<FirmaElectronicaService>;
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;

    component.valido.subscribe(emitValido);
    component.datosFirma.subscribe(emitDatosFirma);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe emitir valido true y datosFirma si la firma es exitosa (caso no login)', async () => {
    component.tipo = 'FIRMA';
    component.cadenaOriginal = 'original';
    component.FormCertificado.setValue({ password: '123456' });

    const input = document.createElement('input');
    input.id = 'password';
    document.body.appendChild(input);

    component.cerInputElement = input;
    component.keyInputElement = input;

    firmaService.firmarCadena.mockResolvedValue({
      firma: 'firma123',
      certificado: 'cert123',
      serialNumber: 'cert123',
      rfc: 'ABC010203XX1',
      fechaFin: '2030-01-01',
    });

    await component.onSubmit();

    expect(emitValido).toHaveBeenCalledWith(true);
    expect(emitDatosFirma).toHaveBeenCalledWith({
      firma: 'firma123',
      certSerialNumber: 'cert123',
      rfc: 'ABC010203XX1',
      fechaFin: '2030-01-01',
    });
  });

  it('debe mostrar error si campos están incompletos', async () => {
    component.tipo = 'FIRMA';
    component.FormCertificado.setValue({ password: '' });

    await component.onSubmit();

    expect(toastrService.error).toHaveBeenCalledWith('Por favor complete todos los campos');
  });

  describe('handleFile', () => {
    it('debe aceptar .cer y .key válidos', () => {
      // Mock para archivo .cer
      const certFile = new File(['contenido'], 'archivo.cer', { type: 'application/x-x509-ca-cert' });
      const certInput = document.createElement('input');
      Object.defineProperty(certInput, 'files', { 
        value: [certFile],
        writable: false
      });

      const certEvent = { target: certInput } as unknown as Event;
      component.handleFile(FileType.CERTIFICATE, certEvent);
      
      expect(component.certFileObj).toBeDefined();
      expect(component.certFileObj).toEqual(certFile);
      expect(component.cerInputElement).toBe(certInput);

      // Mock para archivo .key
      const keyFile = new File(['contenido'], 'archivo.key', { type: 'application/x-pem-file' });
      const keyInput = document.createElement('input');
      Object.defineProperty(keyInput, 'files', { 
        value: [keyFile],
        writable: false
      });

      const keyEvent = { target: keyInput } as unknown as Event;
      component.handleFile(FileType.PRIVATE_KEY, keyEvent);
      
      expect(component.keyFileObj).toBeDefined();
      expect(component.keyFileObj).toEqual(keyFile);
      expect(component.keyInputElement).toBe(keyInput);
    });

    it('debe rechazar archivos con extensiones incorrectas', () => {
      const mockToastrError = jest.spyOn(toastrService, 'error');
      
      // Test para archivo .cer inválido
      const invalidCertFile = new File(['contenido'], 'archivo.txt', { type: 'text/plain' });
      const certInput = document.createElement('input');
      Object.defineProperty(certInput, 'files', { value: [invalidCertFile] });

      const certEvent = { target: certInput } as unknown as Event;
      component.handleFile(FileType.CERTIFICATE, certEvent);
      
      expect(component.certFileObj).toBeUndefined();
      expect(mockToastrError).toHaveBeenCalledWith('El archivo debe ser un certificado (.cer)');

      // Test para archivo .key inválido
      const invalidKeyFile = new File(['contenido'], 'archivo.txt', { type: 'text/plain' });
      const keyInput = document.createElement('input');
      Object.defineProperty(keyInput, 'files', { value: [invalidKeyFile] });

      const keyEvent = { target: keyInput } as unknown as Event;
      component.handleFile(FileType.PRIVATE_KEY, keyEvent);
      
      expect(component.keyFileObj).toBeUndefined();
      expect(mockToastrError).toHaveBeenCalledWith('El archivo debe ser una llave privada (.key)');
    });
  });

  it('onSubmit debe emitir valido false y mostrar error si falla firmaService', async () => {
    component.tipo = 'NO_LOGIN';
    component.cadenaOriginal = 'original';
    component.FormCertificado.setValue({ password: '123456' });

    const input = document.createElement('input');
    input.id = 'password';
    document.body.appendChild(input);

    component.cerInputElement = input;
    component.keyInputElement = input;

    firmaService.firmarCadena.mockRejectedValue(new Error('Error de firma'));

    await component.onSubmit();

    expect(emitValido).toHaveBeenCalledWith(false);
    expect(toastrService.error).toHaveBeenCalledWith('Error de firma');
  });
});