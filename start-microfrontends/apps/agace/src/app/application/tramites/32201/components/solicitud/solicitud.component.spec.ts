import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormControl, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;

  const storeMock = {
    setRegimen_0: jest.fn(),
    setTextoGenerico10: jest.fn(),
    setTextoGenerico11: jest.fn(),
    setTextoGenerico12: jest.fn(),
    setTextoGenerico13: jest.fn(),
    setTextoGenerico14: jest.fn(),
    setTextoGenerico15: jest.fn(),
    setTextoGenerico16: jest.fn(),
    setTextoGenerico17: jest.fn(),
    setTextoGenerico18: jest.fn(),
    setTextoGenerico19: jest.fn(),
    setTextoGenerico20: jest.fn(),
    setTextoGenerico21: jest.fn(),
    setTextoGenerico22: jest.fn(),
    setTextoGenerico23: jest.fn(),
    setTextoGenerico24: jest.fn(),
  };
  const queryMock = {
    selectSolicitud$: {
      pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    },
  };
  const consultaioQueryMock = {
    selectConsultaioState$: {
      pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudComponent],
    })
      .overrideComponent(SolicitudComponent, {
        set: {
          providers: [
            { provide: 'tramite32201Store', useValue: storeMock },
            { provide: 'tramite32201Query', useValue: queryMock },
            { provide: 'consultaioQuery', useValue: consultaioQueryMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;

    (component as any).tramite32201Store = storeMock;
    (component as any).tramite32201Query = queryMock;
    (component as any).consultaioQuery = consultaioQueryMock;

    component.solicitudState = {
      regimen_0: false,
      regimen_1: false,
      regimen_2: false,
      regimen_3: false,
      manifiesto: false,
      radio_1: '',
      radio_2: '',
      radio_3: '',
      valorAduana: '',
      textoGenerico10: 0,
      textoGenerico11: 0,
      textoGenerico12: 0,
      textoGenerico13: 0,
      textoGenerico14: 0,
      textoGenerico15: 0,
      textoGenerico16: 0,
      textoGenerico17: 0,
      textoGenerico18: 0,
      textoGenerico19: 0,
      textoGenerico20: 0,
      textoGenerico21: 0,
      textoGenerico22: 0,
      textoGenerico23: 0,
      textoGenerico24: 0,
    } as any;

    component.donanteDomicilio();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setValoresStore with correct parameters', () => {
    const mockForm = new FormGroup({
      testField: new FormControl('testValue'),
    });
    const mockMethod = jest.fn();
    (component as any).tramite32201Store = { testMethod: mockMethod } as any;
    component.setValoresStore(mockForm, 'testField', 'testMethod' as any);
    expect(mockMethod).toHaveBeenCalledWith('testValue');
  });

  it('should set archivoMedicamentos and elgirDeArchivo on file change', () => {
    const file = new File(['dummy'], 'test.xlsx');
    const event = {
      target: {
        files: [file],
      },
    } as any;
    component.elgirArchivo = { value: '' } as any;
    component.onCambioDeArchivo(event);
    expect(component.archivoMedicamentos).toBe(file);
    expect(component.elgirDeArchivo).toBe('test.xlsx');
  });

  it('should set elgirDeArchivo from elgirArchivo if no files', () => {
    component.elgirArchivo = { value: 'someValue' } as any;
    const event = {
      target: {
        files: [],
      },
    } as any;
    component.onCambioDeArchivo(event);
    expect(component.elgirDeArchivo).toBe('someValue');
  });

  it('should set confirmarNotificacion in confirmarModal', () => {
    component.confirmarModal();
    expect(component.confirmarNotificacion).toBeDefined();
    expect(component.confirmarNotificacion.mensaje).toContain('Los registros se realizaron correctamente');
  });

  it('should set errorNotificacion in errorModal', () => {
    component.errorModal();
    expect(component.errorNotificacion).toBeDefined();
    expect(component.errorNotificacion.mensaje).toContain('El número de columnas del archivo es incorrecto');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should not throw if cargarProveedores called without file', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.id = 'cargarProveedores';
    document.body.appendChild(input);
    expect(() => component.cargarProveedores()).not.toThrow();
    document.body.removeChild(input);
  });

  describe('Régimen aduanero validation', () => {
    beforeEach(() => {
      component.esFormularioSoloLectura = false;
      component.donanteDomicilio();
    });

    it('should show popup when regimen_0 is selected but NO other regimes are selected', () => {
      const showPopupSpy = jest.spyOn(component, 'mostrarPopupRegimenAduanero');
      component.solicitudForm.patchValue({
        regimen_0: true,
        regimen_1: false,
        regimen_2: false,
        regimen_3: false,
      });
      expect(showPopupSpy).toHaveBeenCalled();
    });

    it('should set correct notification properties in mostrarPopupRegimenAduanero', () => {
      component.mostrarPopupRegimenAduanero();
      expect(component.confirmarNotificacion).toBeDefined();
      expect(component.confirmarNotificacion.tipoNotificacion).toBe('alert');
      expect(component.confirmarNotificacion.categoria).toBe('warning');
      expect(component.confirmarNotificacion.modo).toBe('action');
      expect(component.confirmarNotificacion.mensaje).toContain('IMMEX');
      expect(component.confirmarNotificacion.txtBtnAceptar).toBe('Acceptar');
      expect(component.confirmarNotificacion.tiempoDeEspera).toBe(5000);
    });

    it('should not configure validation when form is readonly', () => {
      component.esFormularioSoloLectura = true;
      component.donanteDomicilio();
      const showPopupSpy = jest.spyOn(component, 'mostrarPopupRegimenAduanero');
      component.solicitudForm.patchValue({
        regimen_0: true,
        regimen_1: false,
        regimen_2: false,
        regimen_3: false,
      });
      expect(showPopupSpy).not.toHaveBeenCalled();
    });

    it('should show error when regimes 1,2,3 are deselected after being selected', () => {
      component.solicitudForm.patchValue({
        regimen_1: true,
        regimen_2: false,
        regimen_3: false,
      });
      component.solicitudForm.patchValue({
        regimen_1: false,
        regimen_2: false,
        regimen_3: false,
      });
      expect(component.mostrarErrorDeseleccionRegimenes).toBe(true);
    });

    it('should clear error when any of regimes 1,2,3 is selected again', () => {
      component.mostrarErrorDeseleccionRegimenes = true;
      component.solicitudForm.patchValue({
        regimen_1: true,
        regimen_2: false,
        regimen_3: false,
      });
      expect(component.mostrarErrorDeseleccionRegimenes).toBe(false);
    });

    it('should handle confirmation correctly by deselecting regimen_0', () => {
      const deseleccionarSpy = jest.spyOn(component as any, 'deseleccionarRegimen0');
      component.manejarConfirmacionRegimen(true);
      expect(deseleccionarSpy).toHaveBeenCalled();
      expect(component.confirmarNotificacion).toBeNull();
    });

    it('should handle cancellation correctly without deselecting regimen_0', () => {
      const deseleccionarSpy = jest.spyOn(component as any, 'deseleccionarRegimen0');
      component.manejarConfirmacionRegimen(false);
      expect(deseleccionarSpy).not.toHaveBeenCalled();
      expect(component.confirmarNotificacion).toBeNull();
    });
  });

  it('should enable textoGenerico and valorAduana fields when radio_3 is "si"', () => {
    component.donanteDomicilio();
    component.solicitudForm.get('radio_3')?.setValue('si');
    [
      'textoGenerico10', 'textoGenerico11', 'textoGenerico12', 'textoGenerico13',
      'textoGenerico14', 'textoGenerico15', 'textoGenerico16', 'textoGenerico17',
      'textoGenerico18', 'textoGenerico19', 'textoGenerico20', 'textoGenerico21',
      'textoGenerico22', 'textoGenerico23', 'textoGenerico24', 'valorAduana',
    ].forEach((campo) => {
      expect(component.solicitudForm.get(campo)?.enabled).toBe(true);
    });
  });

  it('should disable textoGenerico and valorAduana fields when radio_3 is "no"', () => {
    component.donanteDomicilio();
    component.solicitudForm.get('radio_3')?.setValue('no');
    [
      'textoGenerico10', 'textoGenerico11', 'textoGenerico12', 'textoGenerico13',
      'textoGenerico14', 'textoGenerico15', 'textoGenerico16', 'textoGenerico17',
      'textoGenerico18', 'textoGenerico19', 'textoGenerico20', 'textoGenerico21',
      'textoGenerico22', 'textoGenerico23', 'textoGenerico24', 'valorAduana',
    ].forEach((campo) => {
      expect(component.solicitudForm.get(campo)?.disabled).toBe(true);
    });
  });

  it('should call setTextoGenerico22 in calcularValorComercial', () => {
    component.donanteDomicilio();
    component.solicitudForm.patchValue({
      textoGenerico10: 1,
      textoGenerico13: 2,
      textoGenerico16: 3,
      textoGenerico19: 4,
    });
    const spy = jest.spyOn(component['tramite32201Store'], 'setTextoGenerico22');
    component.calcularValorComercial();
    expect(spy).toHaveBeenCalledWith(10);
  });

  it('should call setTextoGenerico23 in calcularValorAduana', () => {
    component.donanteDomicilio();
    component.solicitudForm.patchValue({
      textoGenerico11: 1,
      textoGenerico14: 2,
      textoGenerico17: 3,
      textoGenerico20: 4,
    });
    const spy = jest.spyOn(component['tramite32201Store'], 'setTextoGenerico23');
    component.calcularValorAduana();
    expect(spy).toHaveBeenCalledWith(10);
  });

  it('should call setTextoGenerico24 in calcularValorPorcentaje', () => {
    component.donanteDomicilio();
    component.solicitudForm.patchValue({
      textoGenerico12: 1,
      textoGenerico15: 2,
      textoGenerico18: 3,
      textoGenerico21: 4,
    });
    const spy = jest.spyOn(component['tramite32201Store'], 'setTextoGenerico24');
    component.calcularValorPorcentaje();
    expect(spy).toHaveBeenCalledWith(10);
  });

  it('should call setTextoGenerico10 and calcularValorComercial in actualizarTextoGenerico10', () => {
    const spySet = jest.spyOn(component['tramite32201Store'], 'setTextoGenerico10');
    const spyCalc = jest.spyOn(component, 'calcularValorComercial');
    const event = { target: { value: 5 } } as any;
    component.actualizarTextoGenerico10(event);
    expect(spySet).toHaveBeenCalledWith(5);
    expect(spyCalc).toHaveBeenCalled();
  });
});
