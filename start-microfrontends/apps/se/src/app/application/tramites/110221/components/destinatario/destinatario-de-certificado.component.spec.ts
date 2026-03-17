//@ts-nocheck
import { Tramite110221Store } from '../../estados/tramite110221.store';

import { DestinatarioDeCertificadoComponent } from './destinatario-de-certificado.component';
import { FormBuilder, FormGroup } from '@angular/forms';

describe('DestinatarioDeCertificadoComponent', () => {
  let component: DestinatarioDeCertificadoComponent;
  let store: Tramite110221Store;


  beforeEach(() => {
    // Create mocks for injected services
    providers: [
        FormBuilder,
        Tramite110221Store,
      ]
    const mockStore = { 
      setRepresentanteLegalForm: jest.fn(), 
      setDomicilioForm: jest.fn(), 
      setDestinatarioForm: jest.fn(), 
      actualizarEstado: jest.fn() 
    };
    const mockQuery = { selectSolicitud$: { pipe: jest.fn(() => ({ subscribe: jest.fn() })) } };
    const mockConsultaioQuery = { selectConsultaioState$: { pipe: jest.fn(() => ({ subscribe: jest.fn() })) } };
    const mockValidacionesService = { isValid: jest.fn(() => true) };
    const mockValidarInicialmenteCertificadoService = { getPaisDestino: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })) };

    component = new DestinatarioDeCertificadoComponent(
      mockValidarInicialmenteCertificadoService as any,
      new FormBuilder(),
      mockStore as any,
      mockQuery as any,
      mockValidacionesService as any,
      mockConsultaioQuery as any
    );
  });


  it('should call setFormValida', () => {
    component.setFormValida(true);
   
  });


  it('should call setFormValidaExportador', () => {
    component.setFormValidaExportador(false);
  });


  it('should call setFormValidaDestinatario', () => {
    component.setFormValidaDestinatario(true);
  });


  it('should call validateAllForms with all valid/invalid branches', () => {
    const validForm = new FormGroup({});
    Object.defineProperty(validForm, 'valid', { get: () => true });
    const invalidForm = new FormGroup({});
    Object.defineProperty(invalidForm, 'valid', { get: () => false });
    component.destinatarioComponent = { markAllFieldsTouched: jest.fn(), formDestinatario: validForm } as any;
    component.datosDelDestinatarioComponent = { markAllFieldsTouched: jest.fn(), formDatosDelDestinatario: validForm } as any;
    component.representanteLegalExportadorComponent = { markAllFieldsTouched: jest.fn(), form: validForm } as any;
    expect(component.validateAllForms()).toBe(true);
    component.destinatarioComponent = { markAllFieldsTouched: jest.fn(), formDestinatario: invalidForm } as any;
    expect(component.validateAllForms()).toBe(false);
    component.destinatarioComponent = undefined;
    expect(component.validateAllForms()).toBe(false);
    component.destinatarioComponent = { markAllFieldsTouched: jest.fn(), formDestinatario: validForm } as any;
    component.datosDelDestinatarioComponent = undefined;
    expect(component.validateAllForms()).toBe(false);
    component.datosDelDestinatarioComponent = { markAllFieldsTouched: jest.fn(), formDatosDelDestinatario: validForm } as any;
    component.representanteLegalExportadorComponent = undefined;
    expect(component.validateAllForms()).toBe(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false when validatorCheck is called with no form', () => {
    (component as any).destinatarioForm = undefined as unknown as FormGroup;
    expect(component.validatorCheck()).toBe(false);
  });

});
