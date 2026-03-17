/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CancelacionExtraordinariosPageComponent } from './cancelacion-extraordinarios-page.component';
import { BtnContinuarComponent, SolicitanteComponent, SolicitanteService, WizardComponent } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { AccionBoton } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';

// Mock de Bootstrap Modal
jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn(),
  })),
}));

describe('CancelacionExtraordinariosPageComponent', () => {
  let component: CancelacionExtraordinariosPageComponent;
  let fixture: ComponentFixture<CancelacionExtraordinariosPageComponent>;
  let mockWizardComponent: jest.Mocked<WizardComponent>;
  let mockPasoUnoComponent: jest.Mocked<PasoUnoComponent>;
  let mockModalInstance: jest.Mocked<Modal>;
  let mockModalElement: Partial<ElementRef>;

  beforeEach(async () => {
    // Crear mocks
    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    mockPasoUnoComponent = {
      isFormValid: jest.fn(),
    } as any;

    mockModalElement = {
      nativeElement: document.createElement('div')
    };

    mockModalInstance = {
      show: jest.fn(),
      hide: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [CancelacionExtraordinariosPageComponent, PasoUnoComponent, PasoDosComponent],
      imports: [WizardComponent, BtnContinuarComponent, SolicitanteComponent, HttpClientTestingModule],
      providers: [SolicitanteService]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelacionExtraordinariosPageComponent);
    component = fixture.componentInstance;

    // Configurar mocks de ViewChild
    component.wizardComponent = mockWizardComponent;
    component.pasoUnoComponent = mockPasoUnoComponent;
    component.modalConfirmarCancelarSolicitud = mockModalElement as ElementRef;
    component.modalConfirmar = mockModalElement as ElementRef;

    // Mock del constructor Modal para devolver nuestra instancia mock
    (Modal as unknown as jest.Mock).mockImplementation(() => mockModalInstance);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Creación del componente
  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  // Inicialización con valores por defecto
  it('debería inicializar con valores por defecto correctos', () => {
    expect(component.indice).toBe(1);
    expect(component.valorIndicePendiente).toBeNull();
    expect(component.pantallasPasos).toBeDefined();
    expect(component.pantallasPasos.length).toBeGreaterThan(0);
  });

  // Configuración de datosPasos
  it('debería inicializar datosPasos con valores correctos', () => {
    expect(component.datosPasos).toEqual({
      nroPasos: component.pantallasPasos.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Guardar y firmar',
    });
  });

  // Longitud de pantallasPasos
  it('debería tener pantallasPasos con longitud mayor a cero', () => {
    expect(component.pantallasPasos.length).toBeGreaterThan(0);
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
  });

  // getValorIndice - almacenar valor pendiente
  it('debería almacenar valorIndicePendiente cuando getValorIndice es llamado', () => {
    const mockAccionBoton: AccionBoton = { accion: 'cont', valor: 2 };
    mockPasoUnoComponent.isFormValid.mockReturnValue(true);

    component.getValorIndice(mockAccionBoton);

    expect(component.valorIndicePendiente).toEqual(mockAccionBoton);
  });

  // getValorIndice - formulario válido
  it('debería llamar abrirModal() cuando el formulario es válido', () => {
    const mockAccionBoton: AccionBoton = { accion: 'cont', valor: 2 };
    mockPasoUnoComponent.isFormValid.mockReturnValue(true);
    const spyAbrirModal = jest.spyOn(component, 'abrirModal');

    component.getValorIndice(mockAccionBoton);

    expect(mockPasoUnoComponent.isFormValid).toHaveBeenCalled();
    expect(spyAbrirModal).toHaveBeenCalled();
  });

  // getValorIndice - formulario inválido
  it('debería mostrar modal de advertencia cuando el formulario es inválido', () => {
    const mockAccionBoton: AccionBoton = { accion: 'cont', valor: 2 };
    mockPasoUnoComponent.isFormValid.mockReturnValue(false);

    component.getValorIndice(mockAccionBoton);

    expect(mockPasoUnoComponent.isFormValid).toHaveBeenCalled();
    expect(Modal).toHaveBeenCalledWith(mockModalElement.nativeElement);
    expect(mockModalInstance.show).toHaveBeenCalled();
  });

  // getValorIndice - no abrir modal principal con formulario inválido
  it('no debería llamar abrirModal() cuando el formulario es inválido', () => {
    const mockAccionBoton: AccionBoton = { accion: 'cont', valor: 2 };
    mockPasoUnoComponent.isFormValid.mockReturnValue(false);
    const spyAbrirModal = jest.spyOn(component, 'abrirModal');

    component.getValorIndice(mockAccionBoton);

    expect(spyAbrirModal).not.toHaveBeenCalled();
  });

  // getValorIndice - diferentes valores de AccionBoton
  it('debería manejar diferentes valores de AccionBoton', () => {
    const casosPrueba = [
      { accion: 'cont', valor: 1 },
      { accion: 'prev', valor: 1 },
      { accion: 'cont', valor: 2 }
    ];

    casosPrueba.forEach((caso) => {
      mockPasoUnoComponent.isFormValid.mockReturnValue(true);
      component.getValorIndice(caso as AccionBoton);
      expect(component.valorIndicePendiente).toEqual(caso);
    });
  });

  // abrirModal - crear y mostrar modal
  it('debería crear y mostrar modal cuando modalConfirmarCancelarSolicitud existe', () => {
    component.abrirModal();

    expect(Modal).toHaveBeenCalledWith(mockModalElement.nativeElement);
    expect(mockModalInstance.show).toHaveBeenCalled();
    expect(component.modalInstance).toBe(mockModalInstance);
  });

  // abrirModal - elemento modal null
  it('no debería crear modal cuando modalConfirmarCancelarSolicitud es null', () => {
    component.modalConfirmarCancelarSolicitud = null as any;

    component.abrirModal();

    expect(Modal).not.toHaveBeenCalled();
    expect(mockModalInstance.show).not.toHaveBeenCalled();
  });

  // abrirModal - elemento modal undefined
  it('no debería lanzar error cuando modalConfirmarCancelarSolicitud es undefined', () => {
    component.modalConfirmarCancelarSolicitud = undefined as any;

    expect(() => component.abrirModal()).not.toThrow();
  });

  // abrirModalSi - ocultar modal
  it('debería ocultar la instancia del modal cuando existe en abrirModalSi', () => {
    component.modalInstance = mockModalInstance;
    component.valorIndicePendiente = { accion: 'cont', valor: 2 };

    component.abrirModalSi();

    expect(mockModalInstance.hide).toHaveBeenCalled();
  });

  // abrirModalSi - actualizar índice
  it('debería actualizar indice cuando valorIndicePendiente tiene valor válido', () => {
    const indiceEsperado = 2;
    component.modalInstance = mockModalInstance;
    component.valorIndicePendiente = { accion: 'cont', valor: indiceEsperado };

    component.abrirModalSi();

    expect(component.indice).toBe(indiceEsperado);
  });

  // abrirModalSi - navegación siguiente
  it('debería llamar wizardComponent.siguiente() cuando accion es "cont"', () => {
    component.modalInstance = mockModalInstance;
    component.valorIndicePendiente = { accion: 'cont', valor: 2 };

    component.abrirModalSi();

    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  // abrirModalSi - navegación anterior
  it('debería llamar wizardComponent.atras() cuando accion no es "cont"', () => {
    component.modalInstance = mockModalInstance;
    component.valorIndicePendiente = { accion: 'prev', valor: 1 };

    component.abrirModalSi();

    expect(mockWizardComponent.atras).toHaveBeenCalled();
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  // abrirModalSi - valores fuera de rango
  it('no debería actualizar indice cuando valor está fuera del rango válido', () => {
    const indiceOriginal = component.indice;
    const valoresInvalidos = [0, 3, 4, -1];
    
    valoresInvalidos.forEach(valor => {
      component.indice = indiceOriginal;
      component.modalInstance = mockModalInstance;
      component.valorIndicePendiente = { accion: 'cont', valor: valor };

      component.abrirModalSi();

      expect(component.indice).toBe(indiceOriginal);
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    });
  });

  // abrirModalSi - valorIndicePendiente null
  it('no debería llamar métodos del wizard cuando valorIndicePendiente es null', () => {
    component.modalInstance = mockModalInstance;
    component.valorIndicePendiente = null;

    component.abrirModalSi();

    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  // abrirModalSi - wizardComponent null
  it('no debería llamar métodos del wizard cuando wizardComponent es null', () => {
    component.wizardComponent = null as any;
    component.modalInstance = mockModalInstance;
    component.valorIndicePendiente = { accion: 'cont', valor: 2 };

    component.abrirModalSi();

    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  // abrirModalSi - modalInstance faltante
  it('debería manejar modalInstance faltante de manera elegante', () => {
    component.modalInstance = null as any;
    component.valorIndicePendiente = { accion: 'cont', valor: 2 };

    expect(() => component.abrirModalSi()).not.toThrow();
  });

  // abrirModalAceptar - ocultar modal
  it('debería ocultar el modal cuando existe en abrirModalAceptar', () => {
    component.modalInstance = mockModalInstance;

    component.abrirModalAceptar();

    expect(mockModalInstance.hide).toHaveBeenCalled();
  });

  // abrirModalAceptar - modalInstance null
  it('debería manejar modalInstance null sin errores en abrirModalAceptar', () => {
    component.modalInstance = null as any;

    expect(() => component.abrirModalAceptar()).not.toThrow();
  });

  // abrirModalAceptar - modalInstance undefined
  it('debería manejar modalInstance undefined sin errores en abrirModalAceptar', () => {
    component.modalInstance = undefined as any;

    expect(() => component.abrirModalAceptar()).not.toThrow();
  });

  // Valores límite en abrirModalSi
  it('debería manejar valores límite de valor correctamente en abrirModalSi', () => {
    const casosPrueba = [
      { valor: 0, deberiaActualizar: false, descripcion: 'valor = 0 (debajo del rango)' },
      { valor: 1, deberiaActualizar: true, descripcion: 'valor = 1 (mínimo válido)' },
      { valor: 2, deberiaActualizar: true, descripcion: 'valor = 2 (máximo válido)' },
      { valor: 3, deberiaActualizar: false, descripcion: 'valor = 3 (encima del rango)' },
      { valor: -1, deberiaActualizar: false, descripcion: 'valor = -1 (negativo)' },
      { valor: 100, deberiaActualizar: false, descripcion: 'valor = 100 (muy encima del rango)' }
    ];

    casosPrueba.forEach(({ valor, deberiaActualizar, descripcion }) => {
      const indiceOriginal = 1;
      component.indice = indiceOriginal;
      component.modalInstance = mockModalInstance;
      component.valorIndicePendiente = { accion: 'cont', valor };

      component.abrirModalSi();

      if (deberiaActualizar) {
        expect(component.indice).toBe(valor);
      } else {
        expect(component.indice).toBe(indiceOriginal);
      }
    });
  });

  // Flujo completo exitoso
  it('debería completar el flujo completo: validación de formulario -> confirmación modal -> navegación', () => {
    const mockAccionBoton: AccionBoton = { accion: 'cont', valor: 2 };
    
    // Paso 1: Formulario válido activa modal principal
    mockPasoUnoComponent.isFormValid.mockReturnValue(true);
    component.getValorIndice(mockAccionBoton);
    
    expect(component.valorIndicePendiente).toEqual(mockAccionBoton);
    expect(mockModalInstance.show).toHaveBeenCalled();

    // Paso 2: Usuario confirma la acción
    component.abrirModalSi();
    
    expect(mockModalInstance.hide).toHaveBeenCalled();
    expect(component.indice).toBe(2);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
  });

  // Flujo formulario inválido
  it('debería manejar flujo de formulario inválido: validación -> modal de advertencia', () => {
    const mockAccionBoton: AccionBoton = { accion: 'cont', valor: 2 };
    
    // Formulario inválido activa modal de advertencia
    mockPasoUnoComponent.isFormValid.mockReturnValue(false);
    component.getValorIndice(mockAccionBoton);
    
    expect(component.valorIndicePendiente).toEqual(mockAccionBoton);
    expect(Modal).toHaveBeenCalledWith(mockModalElement.nativeElement);
    expect(mockModalInstance.show).toHaveBeenCalled();
  });

  // Flujo con abrirModalAceptar
  it('debería manejar flujo completo con abrirModalAceptar', () => {
    const mockAccionBoton: AccionBoton = { accion: 'cont', valor: 2 };
    
    // Formulario inválido -> modal de advertencia
    mockPasoUnoComponent.isFormValid.mockReturnValue(false);
    component.getValorIndice(mockAccionBoton);
    expect(mockModalInstance.show).toHaveBeenCalled();
    
    // Usuario acepta el modal de advertencia
    component.abrirModalAceptar();
    expect(mockModalInstance.hide).toHaveBeenCalled();
  });

  // Error en creación de Modal
  it('debería manejar fallo del constructor Modal de manera elegante', () => {
    (Modal as unknown as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Fallo en la creación del modal');
    });

    expect(() => component.abrirModal()).toThrow('Fallo en la creación del modal');
  });

  // pasoUnoComponent undefined
  it('debería manejar pasoUnoComponent undefined en getValorIndice', () => {
    component.pasoUnoComponent = undefined as any;
    const mockAccionBoton: AccionBoton = { accion: 'cont', valor: 2 };

    expect(() => component.getValorIndice(mockAccionBoton)).toThrow();
  });

  // Estado consistente durante navegación
  it('debería mantener estado correcto durante la navegación', () => {
    // Estado inicial
    expect(component.indice).toBe(1);
    expect(component.valorIndicePendiente).toBeNull();

    // Establecer acción pendiente
    const accionBoton: AccionBoton = { accion: 'cont', valor: 2 };
    mockPasoUnoComponent.isFormValid.mockReturnValue(true);
    
    component.getValorIndice(accionBoton);
    expect(component.valorIndicePendiente).toEqual(accionBoton);

    // Ejecutar navegación
    component.abrirModalSi();
    expect(component.indice).toBe(2);
  });

  // Múltiples llamadas a getValorIndice
  it('debería manejar múltiples llamadas a getValorIndice correctamente', () => {
    const primeraAccion: AccionBoton = { accion: 'cont', valor: 1 };
    const segundaAccion: AccionBoton = { accion: 'cont', valor: 2 };

    mockPasoUnoComponent.isFormValid.mockReturnValue(true);

    // Primera llamada
    component.getValorIndice(primeraAccion);
    expect(component.valorIndicePendiente).toEqual(primeraAccion);

    // Segunda llamada debería sobrescribir
    component.getValorIndice(segundaAccion);
    expect(component.valorIndicePendiente).toEqual(segundaAccion);
  });

  // Propiedades inicializadas correctamente
  it('debería tener propiedades inicializadas correctamente', () => {
    expect(component.pantallasPasos).toBeDefined();
    expect(Array.isArray(component.pantallasPasos)).toBe(true);
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Guardar y firmar');
  });

  // Consistencia entre indice y datosPasos
  it('debería mantener consistencia entre indice y datosPasos', () => {
    expect(component.datosPasos.indice).toBe(component.indice);
  });
});
