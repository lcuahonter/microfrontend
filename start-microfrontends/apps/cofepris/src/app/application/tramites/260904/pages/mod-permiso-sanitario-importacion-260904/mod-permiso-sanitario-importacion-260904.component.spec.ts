import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModPermisoSanitarioImportacion260904Component } from './mod-permiso-sanitario-importacion-260904.component';

describe('ModPermisoSanitarioImportacion260904Component', () => {
  let component: ModPermisoSanitarioImportacion260904Component;
  let cdrMock: any;
  let tramite260912StoreMock: any;

  beforeEach(() => {
    cdrMock = { detectChanges: jest.fn() };
    tramite260912StoreMock = {
      _select: jest.fn()
    };
    component = new ModPermisoSanitarioImportacion260904Component(cdrMock, tramite260912StoreMock);
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.pasoUnoComponent = {
      validateRequiredFields: jest.fn().mockReturnValue(true),
      markAllFieldsTouched: jest.fn(),
      getPagoDeDerechosComponent: jest.fn()
    } as any;
    component.pagoDeDerechosComponent = {
      pagoDeDerechosForm: {
        controls: {},
      }
    } as any;
  });

  describe('ngAfterViewInit', () => {
    it('should call updateAnteriorButtonVisibility', () => {
      const spy = jest.spyOn(component, 'updateAnteriorButtonVisibility');
      component.ngAfterViewInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('inSubTabOfMain1', () => {
    it('should return true if indice is 1 and subTabIndex > 1', () => {
      component.indice = 1;
      component.subTabIndex = 2;
      expect(component.inSubTabOfMain1).toBe(true);
    });
    it('should return false if indice is not 1', () => {
      component.indice = 2;
      component.subTabIndex = 2;
      expect(component.inSubTabOfMain1).toBe(false);
    });
    it('should return false if subTabIndex is 1', () => {
      component.indice = 1;
      component.subTabIndex = 1;
      expect(component.inSubTabOfMain1).toBe(false);
    });
  });

  describe('shouldShowContinuarButton', () => {
    it('should always return true', () => {
      expect(component.shouldShowContinuarButton).toBe(true);
    });
  });

  describe('updateAnteriorButtonVisibility', () => {
    it('should set ocultarBtnAnterior true if indice is 1', () => {
      component.indice = 1;
      component.updateAnteriorButtonVisibility();
      expect(component.ocultarBtnAnterior).toBe(true);
    });
    it('should set ocultarBtnAnterior false if indice is not 1', () => {
      component.indice = 2;
      component.updateAnteriorButtonVisibility();
      expect(component.ocultarBtnAnterior).toBe(false);
    });
    it('should update datosPasos.indice and nroPasos', () => {
      component.indice = 3;
      component.pasos = [{}, {}, {}] as any;
      component.updateAnteriorButtonVisibility();
      expect(component.datosPasos.indice).toBe(3);
      expect(component.datosPasos.nroPasos).toBe(3);
    });
  });

  describe('getValorIndice', () => {
    it('should increment indice and call siguiente for cont action at last subTabIndex of step 1', () => {
      component.indice = 1;
      component.subTabIndex = 5;
      const event = { accion: 'cont', valor: 5 };
      component.getValorIndice(event);
      expect(component.indice).toBe(2);
      expect(component.subTabIndex).toBe(1);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    });

    it('should increment indice and call siguiente for cont action at step > 1', () => {
      component.indice = 2;
      component.subTabIndex = 1;
      const event = { accion: 'cont', valor: 1 };
      component.getValorIndice(event);
      expect(component.indice).toBe(3);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    });

    it('should decrement subTabIndex for atras action when subTabIndex > 1', () => {
      component.indice = 1;
      component.subTabIndex = 3;
      const event = { accion: 'atras', valor: 3 };
      component.getValorIndice(event);
      expect(component.subTabIndex).toBe(2);
    });

    it('should decrement indice and set subTabIndex to 5 for atras action at indice > 1 and subTabIndex == 1', () => {
      component.indice = 2;
      component.subTabIndex = 1;
      const event = { accion: 'atras', valor: 1 };
      component.getValorIndice(event);
      expect(component.indice).toBe(1);
      expect(component.subTabIndex).toBe(5);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });
  });

  describe('onContinuar', () => {
    it('should call handlePagoTabContinue if event.valor === 4', () => {
      const spy = jest.spyOn<any, any>(component as any, 'handlePagoTabContinue');
      component.onContinuar({ accion: 'cont', valor: 4 });
      expect(spy).toHaveBeenCalled();
    });

    it('should set message if required fields are invalid', () => {
      (component.pasoUnoComponent.validateRequiredFields as jest.Mock).mockReturnValue(false);
      tramite260912StoreMock._select.mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({}) }) });
      component.onContinuar({ accion: 'cont', valor: 2 });
      expect(component.message).toBe('¡Error de registro! Faltan campos por capturer');
    });

    it('should show payment modal if payment fields are not filled and hasTriedPagoValidation is false', () => {
      tramite260912StoreMock._select.mockReturnValue({
        pipe: () => ({
          subscribe: (cb: any) => cb({
            claveDeReferencia: null,
            cadenaPagoDependencia: null,
            clave: null,
            llaveDePago: null,
            fecPago: null,
            impPago: null
          })
        })
      });
      component.hasTriedPagoValidation = false;
      component.onContinuar({ accion: 'cont', valor: 2 });
      expect(component.showPaymentModal).toBe(true);
      expect(component.lastContinueEvent).toEqual({ accion: 'cont', valor: 2 });
      expect(cdrMock.detectChanges).toHaveBeenCalled();
    });

    it('should call getValorIndice if all fields are valid and payment fields are filled', () => {
      tramite260912StoreMock._select.mockReturnValue({
        pipe: () => ({
          subscribe: (cb: any) => cb({
            claveDeReferencia: 'a',
            cadenaPagoDependencia: 'b',
            clave: 'c',
            llaveDePago: 'd',
            fecPago: 'e',
            impPago: 'f'
          })
        })
      });
      const spy = jest.spyOn(component, 'getValorIndice');
      component.onContinuar({ accion: 'cont', valor: 2 });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onPaymentModalYes', () => {
    it('should set error message if other fields are invalid', () => {
      (component.pasoUnoComponent.getPagoDeDerechosComponent as jest.Mock).mockReturnValue({
        pagoDeDerechosForm: {
          controls: {},
          valid: true,
          value: { a: 'x' }
        }
      });
      jest.spyOn(component as any, 'validateAllRequiredFields').mockReturnValue(false);
      component.onPaymentModalYes();
      expect(component.message).toBe('¡Error de registro! Faltan campos por capturer');
      expect(component.hasTriedPagoValidation).toBe(false);
      expect(component.showPaymentModal).toBe(false);
    });

    it('should set error message if pagoValid is false', () => {
      (component.pasoUnoComponent.getPagoDeDerechosComponent as jest.Mock).mockReturnValue({
        pagoDeDerechosForm: {
          controls: {},
          valid: false,
          value: { a: '' }
        }
      });
      jest.spyOn(component as any, 'validateAllRequiredFields').mockReturnValue(true);
      component.onPaymentModalYes();
      expect(component.message).toBe('Todos los campos de pago son requeridos');
      expect(component.hasTriedPagoValidation).toBe(false);
      expect(component.showPaymentModal).toBe(false);
    });

    it('should proceed and call getValorIndice if all valid and lastContinueEvent exists', () => {
      (component.pasoUnoComponent.getPagoDeDerechosComponent as jest.Mock).mockReturnValue({
        pagoDeDerechosForm: {
          controls: {},
          valid: true,
          value: { a: 'x' }
        }
      });
      jest.spyOn(component as any, 'validateAllRequiredFields').mockReturnValue(true);
      const spy = jest.spyOn(component, 'getValorIndice');
      component.lastContinueEvent = { accion: 'cont', valor: 2 };
      component.onPaymentModalYes();
      expect(component.message).toBeUndefined();
      expect(component.hasTriedPagoValidation).toBe(true);
      expect(component.showPaymentModal).toBe(false);
      expect(spy).toHaveBeenCalledWith({ accion: 'cont', valor: 2 });
      expect(component.lastContinueEvent).toBeNull();
    });
  });

  describe('onPaymentModalNo', () => {
    it('should set showPaymentModal to false and update subTabIndex', (done) => {
      const pagoDeDerechosFormMock = {
        controls: {
          a: { markAsTouched: jest.fn(), markAsDirty: jest.fn(), updateValueAndValidity: jest.fn() }
        }
      };
      const pagoDeDerechosComponentMock = {
        pagoDeDerechosForm: pagoDeDerechosFormMock,
        mostrarErroresDeCampoPago: false
      };
      (component.pasoUnoComponent.getPagoDeDerechosComponent as jest.Mock).mockReturnValue(pagoDeDerechosComponentMock);

      component.showPaymentModal = true;
      component.lastContinueEvent = { accion: 'cont', valor: 2 };
      component.hasTriedPagoValidation = true;
      component.subTabIndex = 1;

      component.onPaymentModalNo();

      expect(component.showPaymentModal).toBe(false);
      expect(component.lastContinueEvent).toBeNull();
      expect(component.hasTriedPagoValidation).toBe(false);
      expect(component.subTabIndex).toBe(4);

      setTimeout(() => {
        expect(pagoDeDerechosComponentMock.mostrarErroresDeCampoPago).toBe(true);
        expect(cdrMock.detectChanges).toHaveBeenCalled();
        done();
      }, 350);
    });
  });

  describe('forceMarkPagoFields', () => {
    it('should mark all controls as touched, dirty, and set errors if message and value is empty', () => {
      const ctrlMock = {
        value: '',
        markAsTouched: jest.fn(),
        markAsDirty: jest.fn(),
        updateValueAndValidity: jest.fn(),
        setErrors: jest.fn()
      };
      component.pagoDeDerechosComponent = {
        pagoDeDerechosForm: {
          controls: { a: ctrlMock }
        }
      } as any;
      (component as any).forceMarkPagoFields('msg');
      expect(ctrlMock.markAsTouched).toHaveBeenCalled();
      expect(ctrlMock.markAsDirty).toHaveBeenCalled();
      expect(ctrlMock.updateValueAndValidity).toHaveBeenCalled();
      expect(ctrlMock.setErrors).toHaveBeenCalledWith({ required: true, custom: 'msg' });
    });
  });

  describe('onPagoFieldsCleared', () => {
    it('should reset hasTriedPagoValidation', () => {
      component.hasTriedPagoValidation = true;
      component.onPagoFieldsCleared();
      expect(component.hasTriedPagoValidation).toBe(false);
    });
  });

  describe('onPasoUnoTabChanged', () => {
    it('should update subTabIndex, datosPasos, hide modal, and reset errors', () => {
      const pagoDeDerechosComponentMock = { mostrarErroresDeCampoPago: true };
      (component.pasoUnoComponent.getPagoDeDerechosComponent as jest.Mock).mockReturnValue(pagoDeDerechosComponentMock);
      component.showPaymentModal = true;
      component.lastContinueEvent = { accion: 'cont', valor: 2 };
      component.onPasoUnoTabChanged(3);
      expect(component.subTabIndex).toBe(3);
      expect(component.datosPasos.txtBtnSig).toBe('Continuar');
      expect(component.showPaymentModal).toBe(false);
      expect(component.lastContinueEvent).toBeNull();
      expect(pagoDeDerechosComponentMock.mostrarErroresDeCampoPago).toBe(false);
    });
  });

  describe('getPaymentFields', () => {
    it('should extract payment fields from state', () => {
      const state = {
        claveDeReferencia: 'a',
        cadenaPagoDependencia: 'b',
        clave: 'c',
        llaveDePago: 'd',
        fecPago: 'e',
        impPago: 'f'
      };
      expect((ModPermisoSanitarioImportacion260904Component as any).getPaymentFields(state)).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    });
  });
});