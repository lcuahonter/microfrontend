import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregardestinatariofinalComponent } from './agregardestinatariofinal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { AcuiculturaStore } from '../../estados/220203/sanidad-certificado.store';

describe('AgregardestinatariofinalComponent', () => {
  let componente: AgregardestinatariofinalComponent;
  let fixture: ComponentFixture<AgregardestinatariofinalComponent>;

  const mockCertificadoService = {
    getAllDatosForma: jest.fn().mockReturnValue(of({ seletedExdora: {} }))
  };

  const mockStore = {
    updatedatosForma: jest.fn(),
    actualizarSelectedExdora: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregardestinatariofinalComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        { provide: ImportacionDeAcuiculturaService, useValue: mockCertificadoService },
        { provide: AcuiculturaStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregardestinatariofinalComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debe inicializar el formulario con valores por defecto', () => {
    expect(componente.destinatarioForm).toBeDefined();
    expect(componente.destinatarioForm.value.tipoMercancia).toBe('yes');
  });

  it('debe llamar los métodos del store cuando el formulario es válido al guardar', () => {
    componente.destinatarioForm.patchValue({
      tipoMercancia: 'yes',
      razonSocial: 'Empresa',
      pais: 'MX',
      domicilio: 'Calle 1',
    });
    componente.onGuardarDestinatarioFinal();
    expect(mockStore.updatedatosForma).toHaveBeenCalled();
    expect(mockStore.actualizarSelectedExdora).toHaveBeenCalled();
  });

  it('debe reiniciar el formulario al limpiar', () => {
    componente.destinatarioForm.patchValue({ razonSocial: 'Test' });
    componente.onLimpiarDestinatario();
    expect(componente.destinatarioForm.value.tipoMercancia).toBe('yes');
  });

  it('debe emitir cerrar al cancelar', () => {
    jest.spyOn(componente.cerrar, 'emit');
    componente.onCancelarDestinatario();
    expect(componente.cerrar.emit).toHaveBeenCalled();
  });

  it('debe actualizar los validadores en enCambioValorRadio', () => {
    componente.destinatarioForm.patchValue({ tipoMercancia: 'no' });
    componente.enCambioValorRadio();
    expect(componente.destinatarioForm.get('nombre')?.validator).toBeTruthy();
  });
});
