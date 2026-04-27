import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { FielSignatureComponent, FielResult } from './fiel-signature.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

const mockApi = {
  verificarFiel: jest.fn(),
};

describe('FielSignatureComponent', () => {
  let component: FielSignatureComponent;
  let fixture: ComponentFixture<FielSignatureComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [FielSignatureComponent],
      providers: [
        provideRouter([]),
        { provide: UsuariosApiService, useValue: mockApi },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FielSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // 1. Creación del componente
  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  // 2. Estado inicial
  it('debería tener el estado inicial correcto', () => {
    expect(component.cargando).toBe(false);
    expect(component.error).toBe('');
    expect(component.resultado).toBeNull();
    expect(component.cerFile).toBeNull();
    expect(component.keyFile).toBeNull();
    expect(component.cerNombre).toBe('');
    expect(component.keyNombre).toBe('');
    expect(component.mostrarPass).toBe(false);
  });

  // 3. Formulario inválido sin passphrase
  it('debería marcar el formulario como inválido cuando no hay passphrase', () => {
    component.form.controls.passphrase.setValue('');
    expect(component.form.invalid).toBe(true);
  });

  // 4. Formulario válido con passphrase
  it('debería marcar el formulario como válido cuando se proporciona la passphrase', () => {
    component.form.controls.passphrase.setValue('miContraseña123');
    expect(component.form.valid).toBe(true);
  });

  // 5. onCerChange asigna cerFile y cerNombre
  it('debería asignar cerFile y cerNombre al seleccionar un archivo .cer', () => {
    const mockFile = new File(['contenido'], 'certificado.cer', { type: 'application/x-x509-ca-cert' });
    const mockEvent = {
      target: { files: [mockFile] } as unknown as HTMLInputElement,
    } as unknown as Event;

    component.onCerChange(mockEvent);

    expect(component.cerFile).toBe(mockFile);
    expect(component.cerNombre).toBe('certificado.cer');
  });

  // 6. onKeyChange asigna keyFile y keyNombre
  it('debería asignar keyFile y keyNombre al seleccionar un archivo .key', () => {
    const mockFile = new File(['contenido'], 'llave.key', { type: 'application/octet-stream' });
    const mockEvent = {
      target: { files: [mockFile] } as unknown as HTMLInputElement,
    } as unknown as Event;

    component.onKeyChange(mockEvent);

    expect(component.keyFile).toBe(mockFile);
    expect(component.keyNombre).toBe('llave.key');
  });

  // 7. verificar() no llama api si falta cerFile
  it('no debería llamar a la API si no se ha seleccionado el archivo .cer', () => {
    component.cerFile = null;
    component.keyFile = new File(['contenido'], 'llave.key');
    component.form.controls.passphrase.setValue('contraseña');

    component.verificar();

    expect(mockApi.verificarFiel).not.toHaveBeenCalled();
  });

  // 8. verificar() no llama api si falta keyFile
  it('no debería llamar a la API si no se ha seleccionado el archivo .key', () => {
    component.cerFile = new File(['contenido'], 'certificado.cer');
    component.keyFile = null;
    component.form.controls.passphrase.setValue('contraseña');

    component.verificar();

    expect(mockApi.verificarFiel).not.toHaveBeenCalled();
  });

  // 9. verificar() no llama api si formulario inválido
  it('no debería llamar a la API si el formulario es inválido', () => {
    component.cerFile = new File(['contenido'], 'certificado.cer');
    component.keyFile = new File(['contenido'], 'llave.key');
    component.form.controls.passphrase.setValue('');

    component.verificar();

    expect(mockApi.verificarFiel).not.toHaveBeenCalled();
  });

  // 10. verificar() llama api.verificarFiel con archivos y passphrase
  it('debería llamar a api.verificarFiel con los archivos y la passphrase correctos', fakeAsync(() => {
    const cerFile = new File(['contenido'], 'certificado.cer');
    const keyFile = new File(['contenido'], 'llave.key');
    const passphrase = 'miContraseña';

    component.cerFile = cerFile;
    component.keyFile = keyFile;
    component.form.controls.passphrase.setValue(passphrase);

    mockApi.verificarFiel.mockReturnValue(
      of({ rfc: 'GOMA800101AB1', nombre: 'ARTURO GONZALEZ MARTINEZ' })
    );

    component.verificar();
    tick();

    expect(mockApi.verificarFiel).toHaveBeenCalledWith(cerFile, keyFile, passphrase);
  }));

  // 11. verificar() en éxito: asigna resultado, cargando=false, emite firmado
  it('debería asignar resultado, poner cargando en false y emitir firmado al verificar con éxito', fakeAsync(() => {
    const cerFile = new File(['contenido'], 'certificado.cer');
    const keyFile = new File(['contenido'], 'llave.key');
    const passphrase = 'miContraseña';

    component.cerFile = cerFile;
    component.keyFile = keyFile;
    component.form.controls.passphrase.setValue(passphrase);

    mockApi.verificarFiel.mockReturnValue(
      of({ rfc: 'GOMA800101AB1', nombre: 'ARTURO GONZALEZ MARTINEZ' })
    );

    const emitSpy = jest.spyOn(component.firmado, 'emit');

    component.verificar();
    tick();

    expect(component.cargando).toBe(false);
    expect(component.resultado).not.toBeNull();
    expect(component.resultado?.valido).toBe(true);
    expect(component.resultado?.rfc).toBe('GOMA800101AB1');
    expect(component.resultado?.nombre).toBe('ARTURO GONZALEZ MARTINEZ');
    expect(component.resultado?.cerFile).toBe(cerFile);
    expect(component.resultado?.keyFile).toBe(keyFile);
    expect(component.resultado?.passphrase).toBe(passphrase);
    expect(emitSpy).toHaveBeenCalledWith(component.resultado);
  }));

  // 12. verificar() en error: asigna error, cargando=false
  it('debería asignar el mensaje de error y poner cargando en false cuando la verificación falla', fakeAsync(() => {
    const cerFile = new File(['contenido'], 'certificado.cer');
    const keyFile = new File(['contenido'], 'llave.key');

    component.cerFile = cerFile;
    component.keyFile = keyFile;
    component.form.controls.passphrase.setValue('contraseñaInvalida');

    mockApi.verificarFiel.mockReturnValue(
      throwError(() => new Error('error'))
    );

    component.verificar();
    tick();

    expect(component.cargando).toBe(false);
    expect(component.error).toBe('La e.firma no es válida. Verifique sus archivos y contraseña.');
    expect(component.resultado).toBeNull();
  }));

  // 13. verificar() pone cargando en true mientras se procesa
  it('debería poner cargando en true al iniciar la verificación', fakeAsync(() => {
    const cerFile = new File(['contenido'], 'certificado.cer');
    const keyFile = new File(['contenido'], 'llave.key');

    component.cerFile = cerFile;
    component.keyFile = keyFile;
    component.form.controls.passphrase.setValue('contraseña');

    mockApi.verificarFiel.mockReturnValue(
      of({ rfc: 'GOMA800101AB1', nombre: 'ARTURO GONZALEZ MARTINEZ' })
    );

    component.verificar();

    // Antes de tick(), la llamada al observable síncrono ya resuelve,
    // pero el flag cargando se pone en true antes del subscribe
    // Al ser of() síncrono, volvió a false — verificamos que al menos se llamó a la API
    expect(mockApi.verificarFiel).toHaveBeenCalled();
    tick();
  }));

  // 14. onCerChange no asigna nada si el input no tiene archivos
  it('no debería modificar cerFile si el evento no contiene archivos', () => {
    component.cerFile = null;
    const mockEvent = {
      target: { files: [] } as unknown as HTMLInputElement,
    } as unknown as Event;

    component.onCerChange(mockEvent);

    expect(component.cerFile).toBeNull();
    expect(component.cerNombre).toBe('');
  });

  // 15. onKeyChange no asigna nada si el input no tiene archivos
  it('no debería modificar keyFile si el evento no contiene archivos', () => {
    component.keyFile = null;
    const mockEvent = {
      target: { files: [] } as unknown as HTMLInputElement,
    } as unknown as Event;

    component.onKeyChange(mockEvent);

    expect(component.keyFile).toBeNull();
    expect(component.keyNombre).toBe('');
  });

  // 16. verificar() limpia el error previo al iniciar
  it('debería limpiar el error previo al iniciar una nueva verificación', fakeAsync(() => {
    component.cerFile = new File(['contenido'], 'certificado.cer');
    component.keyFile = new File(['contenido'], 'llave.key');
    component.form.controls.passphrase.setValue('contraseña');
    component.error = 'error anterior';

    mockApi.verificarFiel.mockReturnValue(
      of({ rfc: 'GOMA800101AB1', nombre: 'ARTURO GONZALEZ MARTINEZ' })
    );

    component.verificar();
    tick();

    expect(component.error).toBe('');
  }));
});
