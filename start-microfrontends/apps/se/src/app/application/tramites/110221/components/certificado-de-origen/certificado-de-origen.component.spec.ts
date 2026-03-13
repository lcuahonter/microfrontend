
import { FormBuilder, FormGroup } from '@angular/forms';
import { DestinatarioComponent } from '../destinatario/destinatario.component';

describe('DestinatarioComponent', () => {
  let component: DestinatarioComponent;
  let mockStore: any;

  beforeEach(() => {
    // Create mocks for injected services
    mockStore = { 
      setRepresentanteLegalForm: jest.fn(), 
      setDomicilioForm: jest.fn(), 
      setDestinatarioForm: jest.fn(), 
      actualizarEstado: jest.fn() 
    };
    const mockQuery = { selectSolicitud$: { pipe: jest.fn(() => ({ subscribe: jest.fn() })) } };
    const mockConsultaioQuery = { selectConsultaioState$: { pipe: jest.fn(() => ({ subscribe: jest.fn() })) } };
    const mockValidacionesService = { isValid: jest.fn(() => true) };
    const mockValidarInicialmenteCertificadoService = { getPaisDestino: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })) };

    component = new DestinatarioComponent(
      mockValidarInicialmenteCertificadoService as any,
      new FormBuilder(),
      mockStore as any,
      mockQuery as any,
      mockValidacionesService as any,
      mockConsultaioQuery as any
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false when validatorCheck is called with no form', () => {
    (component as any).destinatarioForm = undefined as unknown as FormGroup;
    expect(component.validatorCheck()).toBe(false);
  });

});
