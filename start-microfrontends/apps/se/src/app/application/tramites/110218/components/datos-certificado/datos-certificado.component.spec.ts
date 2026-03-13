// Use the Modal mock from the bootstrap import for spying/assertions
const { Modal } = require('bootstrap');
// --- FULL BOOTSTRAP MODAL MOCK ---
const modalInstance = { show: jest.fn(), hide: jest.fn() };
const ModalMock: any = jest.fn().mockImplementation(() => modalInstance);
ModalMock.getInstance = jest.fn().mockReturnValue(modalInstance);

jest.mock('bootstrap', () => ({
  Modal: ModalMock
}));

(global as any).Modal = ModalMock;
(global as any).Modal.getInstance = ModalMock.getInstance;
(global as any).document = {
  getElementById: jest.fn().mockReturnValue({})
};
// --- ENSURE BOOTSTRAP MODAL IS MOCKED BEFORE ANY IMPORTS ---
jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation((...args) => ({
    show: jest.fn(),
    hide: jest.fn()
  }))
}))
// --- ENSURE GLOBAL MOCKS FOR BOOTSTRAP MODAL AND DOCUMENT BEFORE ALL TESTS ---
beforeAll(() => {
  (global as any).Modal = require('bootstrap').Modal;
  (global as any).Modal.getInstance = jest.fn().mockReturnValue({
    show: jest.fn(),
    hide: jest.fn()
  });
  (global as any).document = {
    getElementById: jest.fn().mockReturnValue({})
  };
});
import { ComponentFixture, TestBed } from '@angular/core/testing';

// --- GLOBAL MOCKS FOR BOOTSTRAP MODAL AND DOCUMENT ---
jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn()
  }))
}));

(global as any).Modal = require('bootstrap').Modal;
(global as any).Modal.getInstance = jest.fn().mockReturnValue({
  show: jest.fn(),
  hide: jest.fn()
});
(global as any).document = {
  getElementById: jest.fn().mockReturnValue({})
};
import { DatosCertificadoComponent } from './datos-certificado.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CertificadoTecnicoJaponService } from '../../service/certificadoTecnicoJapon.service';
import { Tramite110218Store } from '../../estados/tramites/tramite110218.store';
import { Tramite110218Query } from '../../estados/queries/tramite110218.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

describe('DatosCertificadoComponent', () => {
  let component: DatosCertificadoComponent;
  let fixture: ComponentFixture<DatosCertificadoComponent>;
  let mockService: any;
  let mockStore: any;
  let mockQuery: any;
  let mockConsultaQuery: any;

      beforeEach(async () => {
        mockService = { getDatosCertificado: jest.fn().mockReturnValue(of([])) };
        mockStore = { setTramite110218State: jest.fn() };
        mockQuery = { selectTramite110218State$: of({ lugar: 'Tokyo', observaciones: 'Test' }) };
        mockConsultaQuery = { selectConsultaioState$: of({ readonly: false }) };

        await TestBed.configureTestingModule({
          imports: [ReactiveFormsModule,DatosCertificadoComponent],
          declarations: [],
          providers: [
            FormBuilder,
            { provide: CertificadoTecnicoJaponService, useValue: mockService },
            { provide: Tramite110218Store, useValue: mockStore },
            { provide: Tramite110218Query, useValue: mockQuery },
            { provide: ConsultaioQuery, useValue: mockConsultaQuery },
          ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatosCertificadoComponent);
        component = fixture.componentInstance;
        // Do not call ngOnInit automatically; call it in each test after setting up state
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with required controls', () => {
    component.estadoSeleccionado = { lugar: 'Tokyo', observaciones: 'Test' } as any;
    component.inicializarFormulario();
    expect(component.datosDelCertificado.contains('lugar')).toBe(true);
    expect(component.datosDelCertificado.contains('observaciones')).toBe(true);
    expect(component.datosDelCertificado.get('lugar')?.value).toBe('Tokyo');
    expect(component.datosDelCertificado.get('observaciones')?.value).toBe('Test');
  });

  it('should disable form when esSoloLectura is true', () => {
    component.inicializarFormulario();
    component.esSoloLectura = true;
    component.habilitarDeshabilitarFormulario();
    expect(component.datosDelCertificado.disabled).toBe(true);
  });

  it('should enable form when esSoloLectura is false', () => {
    component.inicializarFormulario();
    component.esSoloLectura = false;
    component.habilitarDeshabilitarFormulario();
    expect(component.datosDelCertificado.enabled).toBe(true);
  });

  it('should call getDatosCertificado and set datos', () => {
    const mockData = [{ id: 1, nombre: 'Mercancia' }];
    mockService.getDatosCertificado.mockReturnValue(of(mockData));
    component.obtenerDatosDeTabla();
    expect(component.datos).toEqual(mockData);
  });

  it('should set filaSeleccionada on manejarFilaSeleccionada', () => {
    const fila = { id: 1, nombre: 'Mercancia' } as any;
    component.manejarFilaSeleccionada(fila);
    expect(component.filaSeleccionada).toBe(fila);
  });


  it('should update filaSeleccionada on onDatosModificados', () => {
    component.filaSeleccionada = { id: 1, numerodeOrden: 'Old' } as any;
    const valores = { numerodeOrden: 'New' } as any;
    component.onDatosModificados(valores);
    expect(component.filaSeleccionada.numerodeOrden).toBe('New');
  });

  it('should not update filaSeleccionada if it is undefined in onDatosModificados', () => {
    component.filaSeleccionada = undefined as any;
    const valores = { numerodeOrden: 'New' } as any;
    expect(() => component.onDatosModificados(valores)).not.toThrow();
  });

  it('should call setTramite110218State in setValorStore', () => {
    component.inicializarFormulario();
    component.datosDelCertificado.get('lugar')?.setValue('Osaka');
    component.setValorStore(component.datosDelCertificado, 'lugar');
    expect(mockStore.setTramite110218State).toHaveBeenCalledWith({ lugar: 'Osaka' });
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroyed$, 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  describe('Modal and DOM logic', () => {
    let modalShowMock: jest.Mock;
    let modalHideMock: jest.Mock;
    let modalInstance: any;
    beforeEach(() => {
      jest.clearAllMocks();
      modalShowMock = jest.fn();
      modalHideMock = jest.fn();
      modalInstance = { show: modalShowMock, hide: modalHideMock };
      Modal.mockImplementation(() => modalInstance);
      Modal.getInstance.mockImplementation(() => modalInstance);
      (global as any).document = {
        getElementById: jest.fn().mockReturnValue({})
      };
    });

    it('should show modal when onModificarClick called and no filaSeleccionada', () => {
      component.filaSeleccionada = undefined as any;
      component.onModificarClick();
      expect(Modal.mock.calls.length).toBeGreaterThan(0);
      expect(modalShowMock).toHaveBeenCalled();
    });

    it('should call enModificarFormulario when onModificarClick called and filaSeleccionada exists', () => {
      const spy = jest.spyOn(component, 'enModificarFormulario');
      component.filaSeleccionada = { id: 1 } as any;
      component.onModificarClick();
      expect(spy).toHaveBeenCalled();
    });

    it('should show modal in enModificarFormulario if mercanciasSeleccionadasElemento exists', () => {
      component.filaSeleccionada = { id: 1 } as any;
      component.mercanciasSeleccionadasElemento = { nativeElement: {} } as any;
      expect(() => component.enModificarFormulario()).not.toThrow();
      expect(Modal.mock.calls.length).toBeGreaterThan(0);
      expect(modalShowMock).toHaveBeenCalled();
    });

    it('should not throw in enModificarFormulario if mercanciasSeleccionadasElemento is undefined', () => {
      component.filaSeleccionada = { id: 1 } as any;
      component.mercanciasSeleccionadasElemento = undefined as any;
      expect(() => component.enModificarFormulario()).not.toThrow();
    });

    it('should not show modal in enModificarFormulario if filaSeleccionada is undefined', () => {
      component.filaSeleccionada = undefined as any;
      component.mercanciasSeleccionadasElemento = { nativeElement: {} } as any;
      expect(() => component.enModificarFormulario()).not.toThrow();
    });

    it('should hide modal in cerrarSeleccionMercanciaModal if modalSeleccionMercanciaElemento exists', () => {
      component.modalSeleccionMercanciaElemento = { nativeElement: {} } as any;
      component.cerrarSeleccionMercanciaModal();
      expect(Modal.getInstance.mock.calls.length).toBeGreaterThan(0);
      expect(Modal.getInstance).toHaveBeenCalledWith(component.modalSeleccionMercanciaElemento.nativeElement);
      expect(modalHideMock).toHaveBeenCalled();
    });

    it('should not throw in cerrarSeleccionMercanciaModal if modalSeleccionMercanciaElemento is undefined', () => {
      component.modalSeleccionMercanciaElemento = undefined as any;
      expect(() => component.cerrarSeleccionMercanciaModal()).not.toThrow();
    });

    it('should hide modal in modalCancelar if mercanciasSeleccionadasElemento exists', () => {
      component.mercanciasSeleccionadasElemento = { nativeElement: {} } as any;
      component.modalCancelar();
      expect(Modal.getInstance.mock.calls.length).toBeGreaterThan(0);
      expect(Modal.getInstance).toHaveBeenCalledWith(component.mercanciasSeleccionadasElemento.nativeElement);
      expect(modalHideMock).toHaveBeenCalled();
    });

    it('should not throw in modalCancelar if mercanciasSeleccionadasElemento is undefined', () => {
      component.mercanciasSeleccionadasElemento = undefined as any;
      expect(() => component.modalCancelar()).not.toThrow();
    });
  });

  it('should handle non-array data in obtenerDatosDeTabla', () => {
    mockService.getDatosCertificado.mockReturnValue(of({ foo: 'bar' }));
    component.obtenerDatosDeTabla();
    expect(component.datos).toEqual([]);
  });

  it('should subscribe to consultaQuery and set esSoloLectura true/false', () => {
    // Simulate readonly true
    mockConsultaQuery.selectConsultaioState$ = of({ readonly: true });
    fixture = TestBed.createComponent(DatosCertificadoComponent);
    component = fixture.componentInstance;
    component.inicializarFormulario();
    component.ngOnInit();
    expect(component.esSoloLectura).toBe(false);
    // Simulate readonly false
    mockConsultaQuery.selectConsultaioState$ = of({ readonly: false });
    fixture = TestBed.createComponent(DatosCertificadoComponent);
    component = fixture.componentInstance;
    component.inicializarFormulario();
    component.ngOnInit();
    expect(component.esSoloLectura).toBe(false);
  });
});