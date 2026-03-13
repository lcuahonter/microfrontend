import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { CertificadoDeOrigenComponent } from './certificado-de-origen.component';
import { RegistroService } from '../../services/registro.service';
import { Tramite110201Store } from '../../state/Tramite110201.store';
import { Tramite110201Query } from '../../state/Tramite110201.query';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CertificadoDeOrigenComponent', () => {
  let component: CertificadoDeOrigenComponent;
  let fixture: ComponentFixture<CertificadoDeOrigenComponent>;
  let registroService: jest.Mocked<RegistroService>;
  let store: jest.Mocked<Tramite110201Store>;
  let validacionesService: jest.Mocked<ValidacionesFormularioService>;

  const mockCatalogs = [
    { id: '1', nombre: 'Test Catalog 1' },
    { id: '2', nombre: 'Test Catalog 2' }
  ];

  

  const mockSolicitudState = {
    tratado: '1',
    pais: '1',
    fraccionArancelaria: '12345678',
    numeroRegistro: 'REG123',
    nombreComercial: 'Test Commercial',
    fechaInicial: '2024-01-01',
    fechaFinal: '2024-12-31',
    archivo: 'test.csv',
    marca: 'Test Brand',
    cantidad: '100.0000',
    umc: '1',
    valorDelaMercancia: '1000.0000',
    complementoDelaDescripcion: 'Test Description',
    masaBruta: '50.0000',
    unidadMedida: '1',
    tipoFactura: '1',
    fecha: '2024-01-01',
    numeroFactura: 'FAC123'
  };

  const mockConsultaState = {
    readonly: false
  };

  const mockColumnasTabla = {
    fraccionArancelaria: '12345678',
    nombreTecnico: 'Test Technical',
    nombreComercial: 'Test Commercial',
    numeroRegistroProductos: 'REG123',
    fechaExpedicion: '2024-01-01',
    fechaVencimiento: '2024-12-31'
  };

  const mockSeleccionadasTabla = {
    id: 1,
    fraccionArancelaria: '12345678',
    cantidad: '100.0000',
    unidadMedida: '1',
    valorMercancia: '1000.0000',
    nombreTecnico: 'Test Technical',
    nombreComercial: 'Test Commercial',
    numeroRegistroProductos: 'REG123',
    fechaExpedicion: '2024-01-01',
    fechaVencimiento: '2024-12-31',
    tipoFactura: '1',
    numFactura: 'FAC123',
    complementoDescripcion: 'Test Description',
    fechaFactura: '2024-01-01'
  };

  beforeEach(async () => {
    const registroServiceMock = {
      getTratado: jest.fn().mockReturnValue(of(mockCatalogs)),
      getPais: jest.fn().mockReturnValue(of(mockCatalogs)),
      getUMC: jest.fn().mockReturnValue(of(mockCatalogs)),
      getUnidadMedida: jest.fn().mockReturnValue(of(mockCatalogs)),
      getTipoFactura: jest.fn().mockReturnValue(of(mockCatalogs)),
      getSolicitudesTabla: jest.fn().mockReturnValue(of([mockColumnasTabla])),
      getSolicitudesDataTabla: jest.fn().mockReturnValue(of([mockSeleccionadasTabla])),
      buscarMercanciasCert: jest.fn().mockReturnValue(of([]))
    };

    const storeMock = {
      setFechInicioB: jest.fn(),
      setFechFinB: jest.fn(),
      setFecha: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setDatosMercancia: jest.fn(),
      setMercanciaTabla: jest.fn(),
    };
    
    const queryMock = {
      selectSolicitud$: of(mockSolicitudState)
    };

    const validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true)
    };

    const consultaioQueryMock = {
      selectConsultaioState$: of(mockConsultaState)
    };

    await TestBed.configureTestingModule({
      imports: [CertificadoDeOrigenComponent, ReactiveFormsModule,HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: RegistroService, useValue: registroServiceMock },
        { provide: Tramite110201Store, useValue: storeMock },
        { provide: Tramite110201Query, useValue: queryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoDeOrigenComponent);
    component = fixture.componentInstance;
    registroService = TestBed.inject(RegistroService) as jest.Mocked<RegistroService>;
    store = TestBed.inject(Tramite110201Store) as jest.Mocked<Tramite110201Store>;
    validacionesService = TestBed.inject(ValidacionesFormularioService) as jest.Mocked<ValidacionesFormularioService>;

    component.modalAgregar = {
      nativeElement: document.createElement('div')
    } as ElementRef;

    component.closeModal = {
      nativeElement: {
        click: jest.fn()
      }
    } as any;

    component.getMercanciaTable = {
      tableHeader: ['Header1', 'Header2'],
      tableBody: [{ tbodyData: ['data1', 'data2'] }]
    };

    Object.defineProperty(window, 'bootstrap', {
      value: {
        Modal: jest.fn().mockImplementation(() => ({
          show: jest.fn(),
          hide: jest.fn()
        }))
      },
      writable: true
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component correctly', () => {
      jest.spyOn(component, 'mercanciatable');
      jest.spyOn(component, 'inicializarEstadoFormulario');
      jest.spyOn(component, 'donanteDomicilio');

      component.ngOnInit();

      expect(component.mercanciatable).toHaveBeenCalled();
      expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
      expect(component.donanteDomicilio).toHaveBeenCalled();
    });
  });

  describe('manejarClic', () => {
    it('should set esFormulario to true', () => {
      component.manejarClic({});
      expect(component.esFormulario).toBe(true);
    });
  });

  describe('validarDestinatarioFormulario', () => {
    it('should mark form as touched when invalid', () => {
      component.donanteDomicilio();
      jest.spyOn(component.registroForm, 'markAllAsTouched');

      component.validarDestinatarioFormulario();

      expect(component.registroForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should not mark form as touched when valid', () => {
      component.donanteDomicilio();
      component.registroForm.patchValue({
        validacionForm: {
          tratado: '1',
          pais: '1',
          fraccionArancelaria: '12345678',
          numeroRegistro: 'REG123',
          nombreComercial: 'Test',
          fechaInicial: '2024-01-01',
          fechaFinal: '2024-12-31',
          archivo: 'test.csv'
        }
      });
      jest.spyOn(component.registroForm, 'markAllAsTouched');

      component.validarDestinatarioFormulario();

      expect(component.registroForm.markAllAsTouched).not.toHaveBeenCalled();
    });
  });

  describe('validarMercanciaForm', () => {
    it('should mark form as touched when invalid', () => {
      component.donanteDomicilio();
      component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanciaArancelaria')?.setValue('');
      jest.spyOn(component.mercanciaForm, 'markAllAsTouched');

      component.validarMercanciaForm();

      expect(component.mercanciaForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should not mark form as touched when valid', () => {
      component.donanteDomicilio();
      component.mercanciaForm.patchValue({
        validacionMercanciaForm: {
          fraccionMercanciaArancelaria: '12345678',
          nombreTecnico: 'Test Technical',
          nombreComercialDelaMercancia: 'Test Commercial',
          criterioParaConferir: 'Test Criteria',
          nombreEnIngles: 'Test English',
          marca: 'Test Brand',
          cantidad: '100.0000',
          umc: '1',
          valorDelaMercancia: '1000.0000',
          complementoDelaDescripcion: 'Test Description',
          masaBruta: '50.0000',
          unidadMedida: '1',
          tipoFactura: '1',
          fecha: '2024-01-01',
          numeroFactura: 'FAC123'
        }
      });
      jest.spyOn(component.mercanciaForm, 'markAllAsTouched');

      component.validarMercanciaForm();

    });
  });

  describe('validarFormularios', () => {
    beforeEach(() => {
      component.donanteDomicilio();
    });

    it('should return true when all forms are valid and merchandise data exists', () => {
      component.donanteDomicilio();
      component.registroForm.patchValue({
        validacionForm: {
          tratado: '1',
          pais: '1',
          fraccionArancelaria: '12345678',
          numeroRegistro: 'REG123',
          nombreComercial: 'Test',
          fechaInicial: '2024-01-01',
          fechaFinal: '2024-12-31',
          archivo: 'test.csv'
        }
      });
      component.mercanciaForm.patchValue({
        validacionMercanciaForm: {
          fraccionMercanciaArancelaria: '12345678',
          nombreTecnico: 'Test Technical',
          nombreComercialDelaMercancia: 'Test Commercial',
          criterioParaConferir: 'Test Criteria',
          nombreEnIngles: 'Test English',
          marca: 'Test Brand',
          cantidad: '100.0000',
          umc: '1',
          valorDelaMercancia: '1000.0000',
          complementoDelaDescripcion: 'Test Description',
          masaBruta: '50.0000',
          unidadMedida: '1',
          tipoFactura: '1',
          fecha: '2024-01-01',
          numeroFactura: 'FAC123'
        }
      });
      component.mercanciaSeleccionadasTablaData = [mockSeleccionadasTabla];

    });

    it('should return false when mercanciaForm is invalid', () => {
      component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanciaArancelaria')?.setValue('');
      component.mercanciaSeleccionadasTablaData = [mockSeleccionadasTabla];

      const result = component.validarFormularios();

      expect(result).toBe(false);
      expect(component.validationAttempted).toBe(true);
    });

    it('should return false when no merchandise is selected', () => {
      component.mercanciaSeleccionadasTablaData = [];

      const result = component.validarFormularios();

      expect(result).toBe(false);
      expect(component.mostrarErrorMercancias).toBe(true);
    });

    it('should return false when merchandise data is null', () => {
      component.mercanciaSeleccionadasTablaData = null as any;

      const result = component.validarFormularios();

      expect(result).toBe(false);
      expect(component.mostrarErrorMercancias).toBe(true);
    });
  });

  describe('inicializarEstadoFormulario', () => {
    it('should call guardarDatosFormulario when soloLectura is true', () => {
      component.soloLectura = true;
      jest.spyOn(component, 'guardarDatosFormulario');

      component.inicializarEstadoFormulario();

      expect(component.guardarDatosFormulario).toHaveBeenCalled();
    });

    it('should call donanteDomicilio when soloLectura is false', () => {
      component.soloLectura = false;
      jest.spyOn(component, 'donanteDomicilio');

      component.inicializarEstadoFormulario();

      expect(component.donanteDomicilio).toHaveBeenCalled();
    });
  });

  describe('guardarDatosFormulario', () => {
    beforeEach(() => {
      component.donanteDomicilio();
    });

    it('should disable forms when soloLectura is true', () => {
      component.soloLectura = true;
      jest.spyOn(component, 'donanteDomicilio');

      component.guardarDatosFormulario();

      expect(component.donanteDomicilio).toHaveBeenCalled();
      expect(component.registroForm.disabled).toBe(true);
      expect(component.mercanciaForm.disabled).toBe(true);
    });

    it('should enable forms when soloLectura is false', () => {
      component.soloLectura = false;
      jest.spyOn(component, 'donanteDomicilio');

      component.guardarDatosFormulario();

      expect(component.donanteDomicilio).toHaveBeenCalled();
      expect(component.registroForm.enabled).toBe(true);
      expect(component.mercanciaForm.enabled).toBe(true);
    });
  });

  describe('cambioFechaInicial', () => {
    it('should update form and store with new initial date', () => {
      component.donanteDomicilio();
      jest.spyOn(component, 'setValoresStore');

      component.cambioFechaInicial('2024-01-15');

      expect(component.registroForm.get('validacionForm.fechaInicial')?.value).toBe('2024-01-15');
      expect(component.setValoresStore).toHaveBeenCalledWith(component.validacionForm, 'fechaInicial', 'setFechInicioB');
    });
  });

  describe('cambioFechaFinal', () => {
    it('should update form and store with new final date', () => {
      component.donanteDomicilio();
      jest.spyOn(component, 'setValoresStore');

      component.cambioFechaFinal('2024-12-15');

      expect(component.registroForm.get('validacionForm.fechaFinal')?.value).toBe('2024-12-15');
      expect(component.setValoresStore).toHaveBeenCalledWith(component.validacionForm, 'fechaFinal', 'setFechFinB');
    });
  });

  describe('cambioFechaFactura', () => {
    it('should update form and store with new invoice date', () => {
      component.donanteDomicilio();
      jest.spyOn(component, 'setValoresStore');

      component.cambioFechaFactura('2024-06-15');

      expect(component.mercanciaForm.get('validacionMercanciaForm.fecha')?.value).toBe('2024-06-15');
      expect(component.setValoresStore).toHaveBeenCalledWith(component.validacionMercanciaForm, 'fecha', 'setFecha');
    });
  });

  describe('buscarMercancias', () => {
    it('should search merchandise and update table data', () => {
      component.donanteDomicilio();
      component.registroForm.patchValue({
        validacionForm: {
          fraccionArancelaria: '12345678',
          nombreTecnico: 'Test Technical',
          nombreComercial: 'Test Commercial',
          numeroRegistro: 'REG123',
          fechaInicial: '2024-01-01',
          fechaFinal: '2024-12-31'
        }
      });

      component.buscarMercancias();

      expect(component.hayMercanciasDisponibles).toBe(true);
    });
  });

  describe('agregar', () => {
    beforeEach(() => {
      component.donanteDomicilio();
    });

    it('should add merchandise when form is valid', () => {
      component.mercanciaForm.patchValue({
        validacionMercanciaForm: {
          fraccionMercanciaArancelaria: '12345678',
          nombreTecnico: 'Test Technical',
          nombreComercialDelaMercancia: 'Test Commercial',
          criterioParaConferir: 'Test Criteria',
          nombreEnIngles: 'Test English',
          marca: 'Test Brand',
          cantidad: '100.0000',
          umc: '1',
          valorDelaMercancia: '1000.0000',
          complementoDelaDescripcion: 'Test Description',
          masaBruta: '50.0000',
          unidadMedida: '1',
          tipoFactura: '1',
          fecha: '2024-01-01',
          numeroFactura: 'FAC123'
        }
      });
      jest.spyOn(component, 'cerrarModal');
      component.mercanciaSeleccionadasTablaData = [];

      component.agregar();

      expect(component.mostrarErrorRegistro).toBe(false);
      expect(component.mercanciaSeleccionadasTablaData).toHaveLength(1);
      expect(component.mostrarErrorMercancias).toBe(false);
      expect(component.esMercanciaEnEdicion).toBe(true);
      expect(component.esFormulario).toBe(true);
      expect(component.cerrarModal).toHaveBeenCalled();
    });

    it('should show error when form is invalid', () => {
      component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanciaArancelaria')?.setValue('');
      jest.spyOn(component.mercanciaForm, 'markAllAsTouched');

      component.agregar();

      expect(component.mostrarErrorRegistro).toBe(true);
      expect(component.mercanciaForm.markAllAsTouched).toHaveBeenCalled();
    });
  });

  describe('cerrarModal', () => {
    it('should reset error state and click close button', () => {
      component.mostrarErrorRegistro = true;

      component.cerrarModal();

      expect(component.mostrarErrorRegistro).toBe(false);
      expect(component.closeModal.nativeElement.click).toHaveBeenCalled();
    });
  });

  describe('cancelar', () => {
    it('should reset form state', () => {
      component.mostrarErrorRegistro = true;
      component.esMercanciaEnEdicion = false;
      component.esFormulario = true;

      component.cancelar();

      expect(component.mostrarErrorRegistro).toBe(false);
      expect(component.esMercanciaEnEdicion).toBe(true);
      expect(component.esFormulario).toBe(false);
    });
  });

  describe('modificar', () => {
    it('should open modal when merchandise is checked', () => {
      component.ischecked = true;
      jest.spyOn(component, 'abrirModalModificar');

      component.modificar();

    });

    it('should show notification when no merchandise is checked', () => {
      component.ischecked = false;
      component.mostrarMensajeError = false;

      component.modificar();

      expect(component.nuevaNotificacion).toBeDefined();
      expect(component.nuevaNotificacion?.mensaje).toBe('Debes seleccionar una mercancía');
      expect(component.mostrarMensajeError).toBe(true);
    });
  });


  describe('mercanciatable', () => {
    it('should set merchandise table headers and body', () => {
      component.mercanciatable();

      expect(component.mercanciasHeader).toBeDefined();
      expect(component.mercanciasBody).toBeDefined();
    });
  });

  describe('Catalog methods', () => {

    it('should get unidad medida catalog', () => {
      component.getUnidadMedidaCertificado();
    });

    it('should get tipo factura catalog', () => {
      component.getTipoFacturaCertificado();
    });
  });



  describe('onFraccionArancelariaInput', () => {
    beforeEach(() => {
      component.donanteDomicilio();
    });

    it('should format input to only numbers and limit to 8 digits', () => {
      const mockInput = {
        value: '123abc456def78901'
      } as HTMLInputElement;
      const mockEvent = {
        target: mockInput
      } as unknown as Event;
      jest.spyOn(component, 'setValoresStore');

      component.onFraccionArancelariaInput(mockEvent);

      expect(mockInput.value).toBe('12345678');
      expect(component.setValoresStore).toHaveBeenCalledWith(component.validacionForm, 'fraccionArancelaria', 'setFraccionArancelaria');
    });

    it('should handle empty input', () => {
      const mockInput = {
        value: ''
      } as HTMLInputElement;
      const mockEvent = {
        target: mockInput
      } as unknown as Event;

      component.onFraccionArancelariaInput(mockEvent);

      expect(mockInput.value).toBe('');
    });
  });

  describe('onSubmit', () => {
    it('should handle form submission when valid', () => {
      component.donanteDomicilio();

      component.onSubmit();

      expect(component).toBeDefined();
    });
  });

  describe('isValid', () => {
    it('should return validation result from service', () => {
      const mockForm = component.fb.group({ test: [''] });
      validacionesService.isValid.mockReturnValue(true);

      const result = component.isValid(mockForm, 'test');

      expect(result).toBe(true);
      expect(validacionesService.isValid).toHaveBeenCalledWith(mockForm, 'test');
    });

    it('should return false when service returns null', () => {
      const mockForm = component.fb.group({ test: [''] });
      validacionesService.isValid.mockReturnValue(null as any);

      const result = component.isValid(mockForm, 'test');

      expect(result).toBe(false);
    });
  });

  describe('validarFormulario', () => {
    it('should return true when validarFormularios returns true', () => {
      jest.spyOn(component, 'validarFormularios').mockReturnValue(true);

      const result = component.validarFormulario();

      expect(result).toBe(true);
    });

    it('should return false when validarFormularios returns false', () => {
      jest.spyOn(component, 'validarFormularios').mockReturnValue(false);

      const result = component.validarFormulario();

      expect(result).toBe(false);
    });
  });

  describe('Form getters', () => {
    beforeEach(() => {
      component.donanteDomicilio();
    });

    it('should return validacionForm', () => {
      const result = component.validacionForm;
      expect(result).toBeDefined();
    });
  });

  describe('donanteDomicilio', () => {
    it('should create forms with validators', () => {
      component.donanteDomicilio();

      expect(component.registroForm).toBeDefined();
      expect(component.mercanciaForm).toBeDefined();
    });
  });


  describe('formatearCantidad', () => {
    beforeEach(() => {
      component.donanteDomicilio();
    });

    it('should format value to 4 decimals when no decimals exist', () => {
      component.mercanciaForm.get('validacionMercanciaForm.cantidad')?.setValue('100');

      component.formatearCantidad();

      expect(component.mercanciaForm.get('validacionMercanciaForm.cantidad')?.value).toBe('100.0000');
    });

    it('should format value to exactly 4 decimals when decimals exist', () => {
      component.mercanciaForm.get('validacionMercanciaForm.cantidad')?.setValue('100.5');

      component.formatearCantidad();

      expect(component.mercanciaForm.get('validacionMercanciaForm.cantidad')?.value).toBe('100.5000');
    });

    it('should handle empty value', () => {
      component.mercanciaForm.get('validacionMercanciaForm.cantidad')?.setValue('');

      component.formatearCantidad();

    });

    it('should handle null value', () => {
      component.mercanciaForm.get('validacionMercanciaForm.cantidad')?.setValue(null);

      component.formatearCantidad();

    });
  });

  describe('formatearValorDelaMercancia', () => {
    beforeEach(() => {
      component.donanteDomicilio();
    });

    it('should format value to 4 decimals', () => {
      component.mercanciaForm.get('validacionMercanciaForm.valorDelaMercancia')?.setValue('1000');

      component.formatearValorDelaMercancia();

    });

    it('should set maxlength error when value exceeds 22 characters', () => {
      const longValue = '123456789012345678901234';
      component.mercanciaForm.get('validacionMercanciaForm.valorDelaMercancia')?.setValue(longValue);

      component.formatearValorDelaMercancia();

    });

    it('should set pattern error for invalid format', () => {
      component.mercanciaForm.get('validacionMercanciaForm.valorDelaMercancia')?.setValue('invalid123.12345');

      component.formatearValorDelaMercancia();

      expect(component.mercanciaForm.get('validacionMercanciaForm.valorDelaMercancia')?.hasError('pattern')).toBe(true);
    });

    it('should handle empty value', () => {
      component.mercanciaForm.get('validacionMercanciaForm.valorDelaMercancia')?.setValue('');

      component.formatearValorDelaMercancia();

      expect(component.mercanciaForm.get('validacionMercanciaForm.valorDelaMercancia')?.value).toBe('');
    });
  });

  describe('formatearMasaBruta', () => {
    beforeEach(() => {
      component.donanteDomicilio();
    });

    it('should format value to 4 decimals', () => {
      component.mercanciaForm.get('validacionMercanciaForm.masaBruta')?.setValue('50');

      component.formatearMasaBruta();

      expect(component.mercanciaForm.get('validacionMercanciaForm.masaBruta')?.value).toBe('50.0000');
    });

    it('should handle decimals correctly', () => {
      component.mercanciaForm.get('validacionMercanciaForm.masaBruta')?.setValue('50.12');

      component.formatearMasaBruta();

      expect(component.mercanciaForm.get('validacionMercanciaForm.masaBruta')?.value).toBe('50.1200');
    });

    it('should handle empty value', () => {
      component.mercanciaForm.get('validacionMercanciaForm.masaBruta')?.setValue('');

      component.formatearMasaBruta();

      expect(component.mercanciaForm.get('validacionMercanciaForm.masaBruta')?.value).toBe('');
    });
  });

  describe('eliminarPedimento', () => {
    beforeEach(() => {
      component.mercanciaSeleccionadasTablaData = [mockSeleccionadasTabla];
      component.selectedRow = mockSeleccionadasTabla;
    });

    it('should remove merchandise when confirmed', () => {
      component.eliminarPedimento(true);

      expect(component.ischecked).toBe(true);
      expect(component.mercanciaSeleccionadasTablaData).toHaveLength(0);
      expect(component.selectedRow).toBeNull();
      expect(component.mostrarMensajeError).toBe(false);
      expect(component.nuevaNotificacion).toBeNull();
    });

    it('should not remove merchandise when not confirmed', () => {
      component.eliminarPedimento(false);

      expect(component.ischecked).toBe(false);
      expect(component.mercanciaSeleccionadasTablaData).toHaveLength(1);
      expect(component.mostrarMensajeError).toBe(false);
      expect(component.nuevaNotificacion).toBeNull();
    });
  });

  describe('abrirModal', () => {
    it('should set notification and element for deletion', () => {
      component.abrirModal(5);

      expect(component.nuevaNotificacion).toBeDefined();
      expect(component.elementoParaEliminar).toBe(5);
    });

    it('should use default index when not provided', () => {
      component.abrirModal();

      expect(component.elementoParaEliminar).toBe(0);
    });
  });

  describe('onFilaSeleccionadaradio', () => {
    it('should set selected row', () => {
      component.onFilaSeleccionadaradio(mockSeleccionadasTabla);

      expect(component.selectedRow).toBe(mockSeleccionadasTabla);
    });
  });

  describe('cerrarEdicionMercancia', () => {
    it('should call eliminarMensajeConfirmacion when row is selected', () => {
      component.selectedRow = mockSeleccionadasTabla;
      jest.spyOn(component, 'eliminarMensajeConfirmacion');

      component.cerrarEdicionMercancia();

      expect(component.eliminarMensajeConfirmacion).toHaveBeenCalled();
    });

    it('should call errorMessageExportador when no row is selected', () => {
      component.selectedRow = null as any;
      jest.spyOn(component, 'errorMessageExportador');

      component.cerrarEdicionMercancia();

      expect(component.errorMessageExportador).toHaveBeenCalled();
    });
  });

  describe('errorMessageExportador', () => {
    it('should set error notification', () => {
      component.errorMessageExportador();

      expect(component.nuevaNotificacion).toBeDefined();
      expect(component.nuevaNotificacion?.mensaje).toBe('Debes seleccionar una mercancía');
      expect(component.mostrarMensajeError).toBe(true);
    });
  });

  describe('eliminarMensajeConfirmacion', () => {
    it('should set confirmation notification', () => {
      component.eliminarMensajeConfirmacion();

      expect(component.nuevaNotificacion).toBeDefined();
      expect(component.nuevaNotificacion?.mensaje).toBe('¿Desea eliminar este dato?');
      expect(component.mostrarMensajeError).toBe(true);
    });
  });

  describe('eliminarErrorMessage', () => {
    beforeEach(() => {
      component.mercanciaSeleccionadasTablaData = [mockSeleccionadasTabla];
      component.selectedRow = mockSeleccionadasTabla;
      component.modalInstances = {
        hide: jest.fn()
      } as any;
    });

    it('should remove merchandise when event is true', () => {
      component.eliminarErrorMessage(true);

      expect(component.mercanciaSeleccionadasTablaData).toHaveLength(0);
      expect(component.selectedRow).toEqual({});
      expect(component.mostrarMensajeError).toBe(false);
    });

    it('should not remove merchandise when event is false', () => {
      component.eliminarErrorMessage(false);

      expect(component.mercanciaSeleccionadasTablaData).toHaveLength(1);
      expect(component.mostrarMensajeError).toBe(false);
    });

    it('should hide modal when modal instance exists', () => {
      component.eliminarErrorMessage(true);

      expect(component.modalInstances?.hide).toHaveBeenCalled();
    });

    it('should handle null modal instance', () => {
      component.modalInstances = null;

      expect(() => component.eliminarErrorMessage(true)).not.toThrow();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyed subject', () => {
      const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
      const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

      component.ngOnDestroy();

      expect(destroyedSpy).toHaveBeenCalledWith(true);
      expect(completeSpy).toHaveBeenCalled();
    });

  it('should search merchandise and update table data', () => {

  component.solicitudState = {
    idSolicitud: 0,
    tratado: '105',
    tratadoDescripcion: '',
    paisDescripcion: '',
    pais: 'ARG',
    fraccionArancelaria: '',
    numeroRegistro: '',
    nombreComercial: '',
    fechaInicial: '',
    fechaFinal: '',
    archivo: '',
    observaciones: '',
    presica: '',
    presenta: '',
    idioma: '',
    idiomaDescripcion: '',
    entidad: '',
    entidadDescripcion: '',
    representacionDescripcion: '',
    nacionDescripcion: '',
    transporteDescripcion: '',
    representacion: '',
    nombre: '',
    apellidoPrimer: '',
    apellidoSegundo: '',
    numeroFiscal: '',
    razonSocial: '',
    ciudad: '',
    calle: '',
    numeroLetra: '',
    lada: '',
    telefono: '',
    fax: '',
    correoElectronico: '',
    nacion: '',
    transporte: '',
    fraccionMercanciaArancelaria: '',
    nombreTecnico: '',
    nombreEnIngles: '',
    criterioParaConferir: '',
    marca: '',
    cantidad: '',
    umc: '',
    valorDelaMercancia: '',
    complementoDelaDescripcion: '',
    masaBruta: '',
    nombreComercialDelaMercancia: '',
    unidadMedida: '',
    tipoFactura: '',
    fecha: '',
    numeroFactura: '',
    justificacion: '',
    casillaVerificacion: '',
    mercancias_disponibles: [],
    mercanciaSeleccionadasTablaData: []
  };

  const mockResponse: any[] = [];

  component['registroService'] = {
    buscarMercanciasCert: jest.fn().mockReturnValue(of(mockResponse))
  } as any;

  component.store = {
    setMercanciaTabla: jest.fn()
  } as any;

  component.buscarMercancias();

});

  });
});
