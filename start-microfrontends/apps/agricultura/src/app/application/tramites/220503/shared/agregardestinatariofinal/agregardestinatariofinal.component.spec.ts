import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregardestinatariofinalComponent } from './agregardestinatariofinal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Solocitud220503Service } from '../../services/service220503.service';
import { Solicitud220503Store } from '../../estados/tramites220503.store';

describe('AgregardestinatariofinalComponent', () => {
  let component: AgregardestinatariofinalComponent;
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
        { provide: Solocitud220503Service, useValue: mockCertificadoService },
        { provide: Solicitud220503Store, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregardestinatariofinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores por defecto', () => {
    expect(component.destinatarioForm).toBeDefined();
    expect(component.destinatarioForm.value.tipoMercancia).toBe('yes');
  });

  it('debe llamar los métodos del store al guardar si el formulario es válido', () => {
    component.destinatarioForm.patchValue({
      tipoMercancia: 'yes',
      razonSocial: 'Empresa',
      pais: 'MX',
      domicilio: 'Calle 1',
    });
    component.onGuardarDestinatarioFinal();
    expect(mockStore.updatedatosForma).toHaveBeenCalled();
    expect(mockStore.actualizarSelectedExdora).toHaveBeenCalled();
  });

  it('debe limpiar el formulario al llamar limpiar', () => {
    component.destinatarioForm.patchValue({ razonSocial: 'Test' });
    component.onLimpiarDestinatario();
    expect(component.destinatarioForm.value.tipoMercancia).toBe('yes');
  });

  it('debe emitir cerrar al cancelar', () => {
    jest.spyOn(component.cerrar, 'emit');
    component.onCancelarDestinatario();
    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('debe actualizar los validadores al cambiar el valor del radio', () => {
    component.destinatarioForm.patchValue({ tipoMercancia: 'no' });
    component.enCambioValorRadio();
    expect(component.destinatarioForm.get('nombre')?.validator).toBeTruthy();
  });
});
