import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelSolicitudModificacionComponent } from './datos-del-solicitud-modificacion.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';
import { TOAST_CONFIG, DefaultGlobalConfig, ToastrService } from 'ngx-toastr';

describe('DatosDelSolicitudModificacionComponent', () => {
  let componente: DatosDelSolicitudModificacionComponent;
  let fixture: ComponentFixture<DatosDelSolicitudModificacionComponent>;
  let mockEstablecimientoService: any;
  let mockDomicilioEstablecimientoStore: any;
  let mockDomicilioEstablecimientoQuery: any;
  let mockConsultaioQuery: any;
  const mockToastrService = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    show: jest.fn()
  };

  beforeEach(async () => {
    mockEstablecimientoService = {
      getMercancias: jest.fn().mockReturnValue(of([{ id: 1 }])),
      getScianTablaDatos: jest.fn().mockReturnValue(of([{ id: 2 }])),
      getSciandata: jest.fn().mockReturnValue(of([{ clave: 'A' }])),
      getEstadodata: jest.fn().mockReturnValue(of([{ clave: 'B' }])),
      getJustificationData: jest.fn().mockReturnValue(of([{ nombre: 'X' }]))
    };
    mockDomicilioEstablecimientoStore = { update: jest.fn() };
    mockDomicilioEstablecimientoQuery = {
      select: jest.fn().mockReturnValue(of({}))
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DatosDelSolicitudModificacionComponent,
        require('@angular/common/http/testing').HttpClientTestingModule
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: 'EstablecimientoService', useValue: mockEstablecimientoService },
        { provide: 'DatosDelSolicituteSeccionStateStore', useValue: mockDomicilioEstablecimientoStore },
        { provide: 'DatosDelSolicituteSeccionQuery', useValue: mockDomicilioEstablecimientoQuery },
        { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery },
        { provide: TOAST_CONFIG, useValue: DefaultGlobalConfig },
        { provide: ToastrService, useValue: mockToastrService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelSolicitudModificacionComponent);
    componente = fixture.componentInstance;
    const fb = TestBed.inject(FormBuilder);
    componente.domicilioEstablecimiento = fb.group({
      ideGenerica: [''],
      observaciones: [''],
      establecimientoRFCResponsableSanitario: [''],
      establecimientoRazonSocial: [''],
      establecimientoCorreoElectronico: [''],
      establecimientoEstados: [''],
      descripcionMunicipio: [''],
      localidad: [''],
      establishomentoColonias: [''],
      calle: [''],
      lada: [''],
      telefono: [''],
      establecimientoDomicilioCodigoPostal: ['']
    });
    componente.scianForm = fb.group({
      scian: [''],
      descripcionScian: ['']
    });
    componente.solicitudEstablecimientoForm = fb.group({
      noLicenciaSanitaria: [''],
      avisoCheckbox: [false],
      licenciaSanitaria: [''],
      regimen: [''],
      aduanasEntradas: [''],
      aifaCheckbox: [false]
    });
    componente.formMercancias = fb.group({
      clasificacion: [''],
      especificarClasificacionProducto: [''],
      denominacionEspecifica: [''],
      denominacionDistintiva: [''],
      denominacionComun: [''],
      tipoDeProducto: [''],
      estadoFisico: [''],
      estadoFormaFarmaceutica: [''],
      fraccionArancelaria: [''],
      descripcionFraccion: [''],
      cantidadUMT: [''],
      UMT: [''],
      cantidadUMC: [''],
      UMC: [''],
      presentacion: ['']
    });
    componente.personaparas = [];
    componente.mercanciasTablaDatos = [];
    componente.scianJson = [];
    componente.estado = [];
    componente.genericOptions = [];
    componente.pedimentos = [{
      patente: 0,
      pedimento: 0,
      aduana: 0,
      idTipoPedimento: 0,
      descTipoPedimento: '',
      numero: '',
      comprobanteValor: '',
      pedimentoValidado: false
    }, {
      patente: 0,
      pedimento: 0,
      aduana: 0,
      idTipoPedimento: 0,
      descTipoPedimento: '',
      numero: '',
      comprobanteValor: '',
      pedimentoValidado: false
    }];
    componente.elementoParaEliminar = 1;
    componente.colapsable1 = true;
    componente.colapsable = false;
    componente.colapsableDos = false;
    componente.colapsableTres = false;
    (componente as any).destroy$ = new Subject<void>();
    componente.modalInstance = { show: jest.fn(), hide: jest.fn() } as any;
    componente.establecimientoModalInstance = { show: jest.fn(), hide: jest.fn() } as any;
    componente.modalAddAgentMercanciasInstance = { show: jest.fn(), hide: jest.fn() } as any;
    componente.nuevaNotificacion = { cerrar: false } as any;
    componente.mostrarNumeroYFecha = true;
    componente.mostrarScianBotones = true;
    componente.mostrarAlerta = true;
    componente.showCodigoPostalCorreoElectronico = true;
    componente.showPreFillingOptions = true;
    componente.showAifaCheckbox = true;
    componente.mostrarBotonCopiarDatos = true;
    componente.hideRepresentanteLegal = true;
    componente.fechaCaducidadInput = { fecha: '' } as any;
    componente.crosListaDePaises = ['MX', 'US'];
    componente.seleccionarOrigenDelPais = ['MX'];
    componente.seleccionarOrigenDelPaisDos = ['US'];
    componente.seleccionarOrigenDelPaisTres = ['CA'];
    componente.validationMessages = { campo: 'Mensaje de error' };
    componente.datosData = [];
    componente.configuracionTabla = [];
    componente.mercanciasTabla = [];
    componente.mercanciasTablaDatos = [];
    componente.personaparas = [];
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería alternar colapsable1', () => {
    const valorInicial = componente.colapsable1;
    componente.mostrarColapsable();
    expect(componente.colapsable1).toBe(!valorInicial);
  });

  it('debería alternar colapsable', () => {
    const valorInicial = componente.colapsable;
    componente.mostrar_colapsable();
    expect(componente.colapsable).toBe(!valorInicial);
  });

  it('debería alternar colapsableDos', () => {
    const valorInicial = componente.colapsableDos;
    componente.mostrar_colapsableDos();
    expect(componente.colapsableDos).toBe(!valorInicial);
  });

  it('debería alternar colapsableTres', () => {
    const valorInicial = componente.colapsableTres;
    componente.mostrar_colapsableTres();
    expect(componente.colapsableTres).toBe(!valorInicial);
  });

  it('debería abrir y cerrar el modal SCIAN', () => {
    componente.modalInstance = {
      show: jest.fn(),
      hide: jest.fn()
    } as any;

    componente.openScianModal();
    expect(componente.modalInstance.show).toHaveBeenCalled();
    componente.closeScianModal();
    expect(componente.modalInstance.hide).toHaveBeenCalled();
  });

  it('debería abrir y cerrar el modal de mercancía', () => {
    componente.modalAddAgentMercanciasInstance = {
      show: jest.fn(),
      hide: jest.fn()
    } as any;

    componente.abrirModalMercancia();
    expect(componente.modalAddAgentMercanciasInstance.show).toHaveBeenCalled();
    componente.cerrarModalMercancía();
    expect(componente.modalAddAgentMercanciasInstance.hide).toHaveBeenCalled();
  });

  it('debería abrir el modal de establecimiento', () => {
    componente.abrirModal = jest.fn();
    componente.openEstablecimientoModal();
    expect(componente.establecimientoModalInstance.show).toHaveBeenCalled();
    expect(componente.abrirModal).toHaveBeenCalled();
  });

  it('debería alternar el campo noLicenciaSanitaria', () => {
    const control = componente.solicitudEstablecimientoForm.get('noLicenciaSanitaria');
    control?.enable();
    componente.toggleNoLicenciaSanitaria({ target: { checked: true } } as any);
    expect(control?.disabled).toBe(true);
    componente.toggleNoLicenciaSanitaria({ target: { checked: false } } as any);
    expect(control?.enabled).toBe(true);
  });

  it('debería limpiar el formulario SCIAN', () => {
    componente.scianForm.patchValue({ scian: 'A', descripcionScian: 'B' });
    componente.limpiarScianForm();
    expect(componente.scianForm.value).toEqual({ scian: '', descripcionScian: null });
  });

  it('debería guardar una mercancía válida', () => {
    Object.keys(componente.formMercancias.controls).forEach(key => {
      componente.formMercancias.get(key)?.setValue('valor');
    });
    componente.cerrarModalMercancía = jest.fn();
    componente.guardarMarcancia();
    expect(componente.mercanciasTablaDatos.length).toBeGreaterThan(0);
    expect(componente.cerrarModalMercancía).toHaveBeenCalled();
  });

  it('no debería guardar una mercancía inválida', () => {
    componente.formMercancias.reset();
    componente.formMercancias.get('clasificacion')?.setErrors({ required: true });
    componente.cerrarModalMercancía = jest.fn();
    componente.guardarMarcancia();
    expect(componente.mercanciasTablaDatos.length).toBe(0);
  });

  it('debería eliminar un pedimento si borrar es true', () => {
    componente.elementoParaEliminar = 1;
    componente.eliminarPedimento(true);
    expect(componente.pedimentos.length).toBe(1);
  });

  it('no debería eliminar un pedimento si borrar es false', () => {
    componente.elementoParaEliminar = 1;
    componente.eliminarPedimento(false);
    expect(componente.pedimentos.length).toBe(2);
  });

  it('debería abrir el modal y setear notificación y elemento', () => {
    componente.abrirModal(2);
    expect(componente.nuevaNotificacion).toBeDefined();
    expect(componente.elementoParaEliminar).toBe(2);
  });

  it('debería obtener mensaje de error si el control es requerido', () => {
    const control = componente.formMercancias.get('clasificacion');
    control?.setErrors({ required: true });
    control?.markAsTouched();
    componente.validationMessages['clasificacion'] = 'Campo requerido';
    const mensaje = componente.getErrorMessage('clasificacion');
    expect(mensaje).toBeDefined();
    expect(mensaje).toBe('Campo requerido');
  });

  it('debería retornar null si no hay error en getErrorMessage', () => {
    const mensaje = componente.getErrorMessage('clasificacion');
    expect(mensaje).toBeNull();
  });

  it('debería ejecutar enCambioDeControl y actualizar el store', () => {
    const spy = jest.spyOn<any, any>(componente['domicilioEstablecimientoStore'], 'update');
    componente.scianForm.get('scian')?.setValue('valor');
    componente.enCambioDeControl('scianForm', 'scian');
    expect(spy).toHaveBeenCalled();
  });

  it('debería limpiar destroy$ en ngOnDestroy', () => {
    const destroy$ = (componente as any).destroy$;
    const spyNext = jest.spyOn(destroy$, 'next');
    const spyComplete = jest.spyOn(destroy$, 'complete');
    componente.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('debería agregar y eliminar controles de número y fecha', () => {
    const fb = TestBed.inject(FormBuilder);
    componente.formMercancias.addControl('numeroRegistro', fb.control(''));
    componente.formMercancias.addControl('fechaCaducidad', fb.control(''));
    componente.eliminarNumeroYFechaControls();
    expect(componente.formMercancias.get('numeroRegistro')).toBeNull();
    expect(componente.formMercancias.get('fechaCaducidad')).toBeNull();
    componente.agregarNumeroYFechaControls();
    expect(componente.formMercancias.get('numeroRegistro')).toBeDefined();
    expect(componente.formMercancias.get('fechaCaducidad')).toBeDefined();
  });

  it('debería establecer deshabilitado en observaciones', () => {
    componente.domicilioEstablecimiento.get('ideGenerica')?.setValue('modificacion');
    componente.establecerDeshabilitado();
    componente.domicilioEstablecimiento.get('ideGenerica')?.setValue('otro');
    componente.establecerDeshabilitado();
  });

  it('debería cerrar el modal si existe', () => {
    componente.modalInstance = { show: jest.fn(), hide: jest.fn() } as any;
    componente.cerrarModal();
    expect(componente.modalInstance.hide).toHaveBeenCalled();
  });

  it('debería no cerrar el modal si no existe', () => {
    componente.modalInstance = undefined as any;
    expect(() => componente.cerrarModal()).not.toThrow();
  });

  it('debería cambiar la fecha final', () => {
    const fb = TestBed.inject(FormBuilder);
    componente.formMercancias.addControl('fechaCaducidad', fb.control(''));
    componente.cambioFechaFinal('2025-01-01');
    expect(componente.formMercancias.get('fechaCaducidad')?.value).toBe('2025-01-01');
  });

  
it('getErrorMessage retorna null si el control no existe', () => {
  expect(componente.getErrorMessage('noExiste')).toBeNull();
});

it('enCambioDeControl no hace nada si el formName es desconocido', () => {
  // Espía el store para asegurarse que no se llama
  const spy = jest.spyOn(componente['domicilioEstablecimientoStore'], 'update');
  componente.enCambioDeControl('formDesconocido', 'campo');
  expect(spy).not.toHaveBeenCalled();
});
it('guardarScian NO agrega si el formulario es inválido', () => {
    componente.scianForm.reset();
    componente.scianForm.get('scian')?.setErrors({ required: true });
    const closeSpy = jest.spyOn(componente, 'closeScianModal');
    componente.guardarScian();
    expect(componente.personaparas.length).toBe(0);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('guardarMarcancia NO agrega si el formulario es inválido', () => {
    componente.formMercancias.reset();
    componente.formMercancias.get('clasificacion')?.setErrors({ required: true });
    const closeSpy = jest.spyOn(componente, 'cerrarModalMercancía');
    componente.guardarMarcancia();
    expect(componente.mercanciasTablaDatos.length).toBe(0);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('cerrarModal no lanza error si modalInstance es undefined', () => {
    componente.modalInstance = undefined as any;
    expect(() => componente.cerrarModal()).not.toThrow();
  });

  it('enCambioDeControl actualiza el store para todos los forms válidos', () => {
    const spy = jest.spyOn(componente['domicilioEstablecimientoStore'], 'update');
    componente.scianForm.get('scian')?.setValue('valor');
    componente.enCambioDeControl('scianForm', 'scian');
    expect(spy).toHaveBeenCalled();

    componente.domicilioEstablecimiento.get('ideGenerica')?.setValue('valor');
    componente.enCambioDeControl('domicilioEstablecimiento', 'ideGenerica');
    expect(spy).toHaveBeenCalled();

    componente.solicitudEstablecimientoForm.get('noLicenciaSanitaria')?.setValue('valor');
    componente.enCambioDeControl('solicitudEstablecimientoForm', 'noLicenciaSanitaria');
    expect(spy).toHaveBeenCalled();
  });
});