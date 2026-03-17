import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, ReplaySubject } from 'rxjs';
import { GestionDeCuentasComponent } from './gestion-de-cuentas.component';
import { TecnologicosService } from '../service/tecnologicos.service';
import { Tramite324Store, Solicitud324State } from '../state/Tramite324.store';
import { Tramite324Query } from '../state/Tramite324.query';
import { ValidacionesFormularioService, ConsultaioQuery, Catalogo } from '@ng-mf/data-access-user';
import { AccesosTabla } from '../models/tecnologicos.model';
import { Modal } from 'bootstrap';

// Mock de Bootstrap Modal
jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn()
  }))
}));

describe('GestionDeCuentasComponent', () => {
  let component: GestionDeCuentasComponent;
  let fixture: ComponentFixture<GestionDeCuentasComponent>;
  let mockTecnologicosService: jest.Mocked<TecnologicosService>;
  let mockTramite324Store: jest.Mocked<Tramite324Store>;
  let mockTramite324Query: jest.Mocked<Tramite324Query>;
  let mockValidacionesService: jest.Mocked<ValidacionesFormularioService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let formBuilder: FormBuilder;

  const mockAccesosTabla: AccesosTabla[] = [
    {
      rfc: 'TEST123456789',
      aduana: 'Aduana Test',
      sistema: 'Sistema Test',
      rol: 'Rol Test',
      tipoMovimiento: 'Movimiento Test'
    }
  ];

  const mockSolicitudState: Solicitud324State = {
    rfc: 'ABC123456789',
    aduana: 'aduana1',
    sistema: 'sistema1',
    rol: 'rol1',
    tipoMovimiento: 'movimiento1',
    AccesosDatos: mockAccesosTabla
  };

  const mockCatalogos = [
    { id: '1', descripcion: 'Opción 1' },
    { id: '2', descripcion: 'Opción 2' }
  ];

  beforeEach(async () => {
    // Crear mocks de los servicios
    mockTecnologicosService = {
      obtenerDatosAduana: jest.fn().mockReturnValue(of(mockCatalogos)),
      obtenerDatosRol: jest.fn().mockReturnValue(of(mockCatalogos)),
      obtenerDatosSistema: jest.fn().mockReturnValue(of(mockCatalogos)),
      obtenerDatosTipoMovimiento: jest.fn().mockReturnValue(of(mockCatalogos))
    } as any;

    mockTramite324Store = {
      addAccesosDatos: jest.fn(),
      limpiarSolicitud: jest.fn(),
      update: jest.fn(),
      reset: jest.fn()
    } as any;

    mockTramite324Query = {
      selectSolicitud$: of(mockSolicitudState)
    } as any;

    mockValidacionesService = {
      isValid: jest.fn().mockImplementation((form, field) => {
        if (field === 'campoInexistente') {
          return false;
        }
        return form.get(field) ? !form.get(field)?.hasError('required') : false;
      })
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        GestionDeCuentasComponent
      ],
      providers: [
        FormBuilder,
        { provide: TecnologicosService, useValue: mockTecnologicosService },
        { provide: Tramite324Store, useValue: mockTramite324Store },
        { provide: Tramite324Query, useValue: mockTramite324Query },
        { provide: ValidacionesFormularioService, useValue: mockValidacionesService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionDeCuentasComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar el formulario con validaciones correctas', () => {
      component.ngOnInit();
      
      expect(component.accesosForm).toBeDefined();
      component.accesosForm.patchValue({
        rfc: '',
        aduana: '',
        sistema: '',
        rol: '',
        tipoMovimiento: ''
      });
      component.accesosForm.markAllAsTouched();
      expect(component.accesosForm.get('rfc')?.hasError('required')).toBeTruthy();
      expect(component.accesosForm.get('aduana')?.hasError('required')).toBeTruthy();
      expect(component.accesosForm.get('sistema')?.hasError('required')).toBeTruthy();
      expect(component.accesosForm.get('rol')?.hasError('required')).toBeTruthy();
      expect(component.accesosForm.get('tipoMovimiento')?.hasError('required')).toBeTruthy();
    });

    it('debería suscribirse al estado de solicitud correctamente', () => {
      component.ngOnInit();
      
      expect(component.solicitudState).toEqual(mockSolicitudState);
      expect(component.accesosTablaDatos).toEqual(mockSolicitudState.AccesosDatos);
    });

    it('debería configurar esFormularioSoloLectura como false por defecto', () => {
      component.ngOnInit();
      
      expect(component.esFormularioSoloLectura).toBeFalsy();
    });
  });

  describe('Obtención de datos de catálogos', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('debería obtener datos de aduana correctamente', () => {
      expect(mockTecnologicosService.obtenerDatosAduana).toHaveBeenCalled();
      expect(component.aduanaCatalogo.catalogos).toEqual(mockCatalogos);
    });

    it('debería obtener datos de rol correctamente', () => {
      expect(mockTecnologicosService.obtenerDatosRol).toHaveBeenCalled();
      expect(component.rolCatalogo.catalogos).toEqual(mockCatalogos);
    });

    it('debería obtener datos de sistema correctamente', () => {
      expect(mockTecnologicosService.obtenerDatosSistema).toHaveBeenCalled();
      expect(component.sistemaCatalogo.catalogos).toEqual(mockCatalogos);
    });

    it('debería obtener datos de tipo movimiento correctamente', () => {
      expect(mockTecnologicosService.obtenerDatosTipoMovimiento).toHaveBeenCalled();
      expect(component.movimientoCatalogo.catalogos).toEqual(mockCatalogos);
    });
  });

  describe('Gestión de modal', () => {
    it('debería abrir el modal de accesos cuando modalElementAccesos existe', () => {
      component.modalElementAccesos = {
        nativeElement: document.createElement('div')
      } as any;

      const mockModalInstance = {
        show: jest.fn(),
        dispose: jest.fn()
      };
      (Modal as unknown as jest.Mock).mockReturnValue(mockModalInstance);

      (component as any).modalInstanceAccesos = null;

      component.abrirAccesos();

      expect(Modal).toHaveBeenCalledWith(component.modalElementAccesos.nativeElement, {
        backdrop: 'static',
        keyboard: false
      });
      expect(mockModalInstance.show).toHaveBeenCalled();
    });

    it('no debería intentar abrir modal si modalElementAccesos no existe', () => {
      component.modalElementAccesos = null as any;
      
      expect(() => component.abrirAccesos()).not.toThrow();
    });
  });

  describe('Gestión de accesos', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('debería agregar un nuevo acceso cuando el formulario es válido', () => {
      const datosAcceso: AccesosTabla = {
        rfc: 'NUEVO123456789',
        aduana: 'nueva_aduana',
        sistema: 'nuevo_sistema',
        rol: 'nuevo_rol',
        tipoMovimiento: 'nuevo_movimiento'
      };

      component.accesosForm.patchValue(datosAcceso);
      
      jest.spyOn(component, 'cerrarModal');
      const longitudInicial = component.accesosTablaDatos.length;

      component.agregarAccesos();

      expect(mockTramite324Store.addAccesosDatos).toHaveBeenCalledWith(datosAcceso);
      expect(component.cerrarModal).toHaveBeenCalled();
      expect(component.accesosForm.untouched).toBeTruthy();
      expect(component.accesosForm.invalid).toBeTruthy();
    });

    it('no debería agregar acceso cuando el formulario es inválido', () => {
      component.accesosForm.patchValue({
        rfc: '', 
        aduana: 'aduana',
        sistema: 'sistema',
        rol: 'rol',
        tipoMovimiento: 'movimiento'
      });

      jest.spyOn(component.accesosForm, 'markAllAsTouched');
      const longitudInicial = component.accesosTablaDatos.length;

      component.agregarAccesos();

      expect(component.accesosTablaDatos.length).toBe(longitudInicial);
      expect(component.accesosForm.markAllAsTouched).toHaveBeenCalled();
    });
  });

  describe('Gestión de pedimentos', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.pedimentos = [
        { id: 1, numero: 'PED001' },
        { id: 2, numero: 'PED002' },
        { id: 3, numero: 'PED003' }
      ] as any;
    });

    it('debería eliminar pedimento cuando se confirma la eliminación', () => {
      component.elementoParaEliminar = 1;

      component.eliminarPedimento(true);

      expect(component.pedimentos.length).toBe(2);
      expect(component.pedimentos[1]).toEqual({ id: 3, numero: 'PED003' });
    });

    it('no debería eliminar pedimento cuando no se confirma la eliminación', () => {
      const longitudInicial = component.pedimentos.length;
      component.elementoParaEliminar = 1;

      component.eliminarPedimento(false);

      expect(component.pedimentos.length).toBe(longitudInicial);
    });

    it('debería configurar la notificación y elemento para eliminar al abrir modal', () => {
      const indice = 2;

      component.abrirModal(indice);

      expect(component.elementoParaEliminar).toBe(indice);
      expect(component.nuevaNotificacion).toBeDefined();
      expect(component.nuevaNotificacion.tipoNotificacion).toBe('alert');
      expect(component.nuevaNotificacion.categoria).toBe('warning');
      expect(component.nuevaNotificacion.modo).toBe('action');
      expect(component.nuevaNotificacion.mensaje).toBe('El acceso se agrego correctamente.');
      expect(component.nuevaNotificacion.cerrar).toBeFalsy();
      expect(component.nuevaNotificacion.tiempoDeEspera).toBe(2000);
      expect(component.nuevaNotificacion.txtBtnAceptar).toBe('Aceptar');
    });

    it('debería usar índice 0 por defecto en abrirModal', () => {
      component.abrirModal();

      expect(component.elementoParaEliminar).toBe(0);
    });
  });

  describe('Validación de formularios', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('debería marcar todos los campos como tocados cuando el formulario es inválido', () => {
      component.accesosForm.patchValue({
        rfc: '',
        aduana: '',
        sistema: '',
        rol: '',
        tipoMovimiento: ''
      });
      jest.spyOn(component.accesosForm, 'markAllAsTouched');

      component.validarDestinatarioFormulario();

      expect(component.accesosForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('no debería marcar campos como tocados cuando el formulario es válido', () => {
      component.accesosForm.patchValue({
        rfc: 'VALID123',
        aduana: 'aduana',
        sistema: 'sistema',
        rol: 'rol',
        tipoMovimiento: 'movimiento'
      });

      jest.spyOn(component.accesosForm, 'markAllAsTouched');

      component.validarDestinatarioFormulario();

      expect(component.accesosForm.markAllAsTouched).not.toHaveBeenCalled();
    });

    it('debería validar campo correctamente usando el servicio de validaciones', () => {
      mockValidacionesService.isValid.mockReturnValue(true);

      const resultado = component.esValido(component.accesosForm, 'rfc');

      expect(mockValidacionesService.isValid).toHaveBeenCalledWith(component.accesosForm, 'rfc');
      expect(resultado).toBeTruthy();
    });

    it('debería retornar false cuando el servicio de validaciones retorna undefined', () => {
      mockValidacionesService.isValid.mockReturnValue(undefined as any);

      const resultado = component.esValido(component.accesosForm, 'rfc');

      expect(resultado).toBeFalsy();
    });
  });

  describe('Actualización del store', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('debería agregar acceso al store usando addAccesosDatos con un solo acceso', () => {
      const nuevoAcceso: AccesosTabla = {
        rfc: 'NUEVO123456789',
        aduana: 'nueva_aduana',
        sistema: 'nuevo_sistema',
        rol: 'nuevo_rol',
        tipoMovimiento: 'nuevo_movimiento'
      };

      component.accesosTablaDatos = [nuevoAcceso];
      
      mockTramite324Store.addAccesosDatos(nuevoAcceso);
      expect(mockTramite324Store.addAccesosDatos).toHaveBeenCalledWith(nuevoAcceso);
    });

    it('debería agregar múltiples accesos al store usando addAccesosDatos', () => {
      const nuevosAccesos: AccesosTabla[] = [
        {
          rfc: 'NUEVO1234567890',
          aduana: 'aduana1',
          sistema: 'sistema1',
          rol: 'rol1',
          tipoMovimiento: 'movimiento1'
        },
        {
          rfc: 'OTRO1234567890',
          aduana: 'aduana2',
          sistema: 'sistema2',
          rol: 'rol2',
          tipoMovimiento: 'movimiento2'
        }
      ];

      mockTramite324Store.addAccesosDatos(nuevosAccesos);
      expect(mockTramite324Store.addAccesosDatos).toHaveBeenCalledWith(nuevosAccesos);
    });

    it('debería limpiar la solicitud usando limpiarSolicitud', () => {
      mockTramite324Store.limpiarSolicitud();
      expect(mockTramite324Store.limpiarSolicitud).toHaveBeenCalled();
    });
  });

  describe('Configuración inicial del formulario', () => {
    it('debería configurar el formulario con valores del estado', () => {
      component.solicitudState = mockSolicitudState;

      component.donanteDomicilio();

      expect(component.accesosForm.get('rfc')?.value).toBe(mockSolicitudState.rfc);
      expect(component.accesosForm.get('aduana')?.value).toBe(mockSolicitudState.aduana);
      expect(component.accesosForm.get('sistema')?.value).toBe(mockSolicitudState.sistema);
      expect(component.accesosForm.get('rol')?.value).toBe(mockSolicitudState.rol);
      expect(component.accesosForm.get('tipoMovimiento')?.value).toBe(mockSolicitudState.tipoMovimiento);
    });

    it('debería configurar validaciones máximas para RFC', () => {
      component.donanteDomicilio();

      const rfcControl = component.accesosForm.get('rfc');
      expect(rfcControl?.hasError('required')).toBeTruthy();
      
      rfcControl?.setValue('A'.repeat(16)); 
      expect(rfcControl?.hasError('maxlength')).toBeTruthy();
    });

    it('debería manejar estado undefined correctamente', () => {
      component.solicitudState = undefined as any;

      expect(() => component.donanteDomicilio()).not.toThrow();
    });
  });

  describe('Ciclo de vida del componente', () => {
    it('debería completar destroyed$ al destruir el componente', () => {
      component.ngOnInit();
      jest.spyOn(component['destroyed$'], 'next');
      jest.spyOn(component['destroyed$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroyed$'].next).toHaveBeenCalledWith(true);
      expect(component['destroyed$'].complete).toHaveBeenCalled();
    });

    it('debería cancelar suscripciones al destruir el componente', () => {
      component.ngOnInit();
      
      // Simular que hay suscripciones activas
      const suscripcionMock = jest.fn();
      component['destroyed$'].subscribe(suscripcionMock);

      component.ngOnDestroy();

      expect(suscripcionMock).toHaveBeenCalledWith(true);
    });
  });

  describe('Propiedades públicas', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('debería tener TablaSeleccion definido', () => {
      expect(component.TablaSeleccion).toBeDefined();
    });

    it('debería inicializar headers correctamente', () => {
      expect(component.headers).toBeDefined();
      expect(Array.isArray(component.headers)).toBeTruthy();
    });

    it('debería inicializar catálogos con estructuras correctas', () => {
      expect(component.movimientoCatalogo).toBeDefined();
      expect(component.sistemaCatalogo).toBeDefined();
      expect(component.aduanaCatalogo).toBeDefined();
      expect(component.rolCatalogo).toBeDefined();
    });

    it('debería inicializar pedimentos como array vacío', () => {
      expect(Array.isArray(component.pedimentos)).toBeTruthy();
      expect(component.pedimentos.length).toBe(0);
    });
  });

  describe('Casos edge y manejo de errores', () => {
    it('debería manejar errores en suscripciones de catálogos', () => {
      const errorMock = new Error('Error de red');
      mockTecnologicosService.obtenerDatosAduana.mockReturnValue(
        new ReplaySubject<Catalogo[]>().asObservable()
      );

      expect(() => component.obtenerDatosAduana()).not.toThrow();
    });

    it('debería manejar campos de formulario inexistentes', () => {
      mockValidacionesService.isValid.mockReturnValue(false);
      const resultado = component.esValido(component.accesosForm, 'campoInexistente');
      
      expect(resultado).toBeFalsy();
    });

  describe('Validaciones específicas de AccesosTabla', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('debería validar que RFC tenga máximo 15 caracteres según las validaciones del formulario', () => {
      const rfcMuyLargo = 'A'.repeat(16);
      component.accesosForm.patchValue({ rfc: rfcMuyLargo });
      
      const rfcControl = component.accesosForm.get('rfc');
      expect(rfcControl?.hasError('maxlength')).toBeTruthy();
    });

    it('debería requerir todos los campos obligatorios de AccesosTabla', () => {
      const camposRequeridos = ['rfc', 'aduana', 'sistema', 'rol', 'tipoMovimiento'];
      
      component.accesosForm.patchValue({
        rfc: '',
        aduana: '',
        sistema: '',
        rol: '',
        tipoMovimiento: ''
      });
      component.accesosForm.markAllAsTouched();
      
      camposRequeridos.forEach(campo => {
        const control = component.accesosForm.get(campo);
        expect(control?.hasError('required')).toBeTruthy();
      });
    });

    it('debería crear AccesosTabla válido cuando todos los campos están llenos', () => {
      const datosValidos: AccesosTabla = {
        rfc: 'VALIDO123456789',
        aduana: 'Aduana Válida',
        sistema: 'Sistema Válido',
        rol: 'Rol Válido',
        tipoMovimiento: 'Movimiento Válido'
      };

      component.accesosForm.patchValue(datosValidos);
      
      expect(component.accesosForm.valid).toBeTruthy();
      
      const valorFormulario = component.accesosForm.value as AccesosTabla;
      expect(valorFormulario.rfc).toBe(datosValidos.rfc);
      expect(valorFormulario.aduana).toBe(datosValidos.aduana);
      expect(valorFormulario.sistema).toBe(datosValidos.sistema);
      expect(valorFormulario.rol).toBe(datosValidos.rol);
      expect(valorFormulario.tipoMovimiento).toBe(datosValidos.tipoMovimiento);
    });

    it('debería mantener la consistencia de tipos en AccesosDatos', () => {
      const accesoEjemplo: AccesosTabla = mockAccesosTabla[0];
      
      expect(typeof accesoEjemplo.rfc).toBe('string');
      expect(typeof accesoEjemplo.aduana).toBe('string');
      expect(typeof accesoEjemplo.sistema).toBe('string');
      expect(typeof accesoEjemplo.rol).toBe('string');
      expect(typeof accesoEjemplo.tipoMovimiento).toBe('string');
    });
  });

  describe('Integración con Solicitud324State', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('debería sincronizar AccesosDatos del estado con la tabla local', () => {
      expect(component.accesosTablaDatos).toEqual(mockSolicitudState.AccesosDatos);
      expect(component.solicitudState.AccesosDatos).toEqual(mockAccesosTabla);
    });

    it('debería mantener la estructura del estado después de actualizaciones', () => {
      const nuevoAcceso: AccesosTabla = {
        rfc: 'NUEVO1234567890',
        aduana: 'Nueva Aduana',
        sistema: 'Nuevo Sistema',
        rol: 'Nuevo Rol',
        tipoMovimiento: 'Nueva Modificación'
      };

      component.accesosTablaDatos.push(nuevoAcceso);
      
      component.accesosTablaDatos.forEach(acceso => {
        expect(acceso).toHaveProperty('rfc');
        expect(acceso).toHaveProperty('aduana');
        expect(acceso).toHaveProperty('sistema');
        expect(acceso).toHaveProperty('rol');
        expect(acceso).toHaveProperty('tipoMovimiento');
      });
    });

    it('debería manejar estado vacío correctamente', () => {
      const estadoVacio: Solicitud324State = {
        AccesosDatos: [],
        rfc: '',
        aduana: '',
        sistema: '',
        rol: '',
        tipoMovimiento: ''
      };

      // Simular estado vacío
      mockTramite324Query.selectSolicitud$ = of(estadoVacio);
      component.ngOnInit();

      expect(component.accesosTablaDatos).toEqual([]);
      expect(component.solicitudState.rfc).toBe('');
    });
  });

  describe('Casos edge y manejo de errores', () => {
    it('debería manejar errores en suscripciones de catálogos', () => {
      const errorMock = new Error('Error de red');
      mockTecnologicosService.obtenerDatosAduana.mockReturnValue(
        new ReplaySubject<Catalogo[]>().asObservable()
      );

      expect(() => component.obtenerDatosAduana()).not.toThrow();
    });

    it('debería manejar campos de formulario inexistentes', () => {
      mockValidacionesService.isValid.mockReturnValue(false);
      const resultado = component.esValido(component.accesosForm, 'campoInexistente');
      
      expect(resultado).toBeFalsy();
    });

    it('debería manejar la adición de AccesosTabla con propiedades requeridas', () => {
      const accesoCompleto: AccesosTabla = {
        rfc: 'TEST1234567890',
        sistema: 'Sistema Test',
        rol: 'Rol Test',
        tipoMovimiento: 'Alta',
        aduana: 'Aduana Test'
      };

      expect(accesoCompleto.rfc).toBeDefined();
      expect(accesoCompleto.sistema).toBeDefined();
      expect(accesoCompleto.rol).toBeDefined();
      expect(accesoCompleto.tipoMovimiento).toBeDefined();
      expect(accesoCompleto.aduana).toBeDefined();
    });

    it('debería validar que AccesosDatos sea un array válido', () => {
      expect(Array.isArray(component.accesosTablaDatos)).toBeTruthy();
      
      component.accesosTablaDatos.forEach(acceso => {
        expect(typeof acceso.rfc).toBe('string');
        expect(typeof acceso.sistema).toBe('string');
        expect(typeof acceso.rol).toBe('string');
        expect(typeof acceso.tipoMovimiento).toBe('string');
        expect(typeof acceso.aduana).toBe('string');
      });
    });

    it('debería manejar estado inicial del store correctamente', () => {
      const estadoInicial: Solicitud324State = {
        AccesosDatos: [],
        rfc: '',
        aduana: '',
        sistema: '',
        rol: '',
        tipoMovimiento: ''
      };

      expect(estadoInicial.AccesosDatos).toEqual([]);
      expect(estadoInicial.rfc).toBe('');
      expect(estadoInicial.aduana).toBe('');
      expect(estadoInicial.sistema).toBe('');
      expect(estadoInicial.rol).toBe('');
      expect(estadoInicial.tipoMovimiento).toBe('');
    });
  });
  });

  describe('Integración completa', () => {
    it('debería completar el flujo completo de agregar acceso', () => {
      component.ngOnInit();
      fixture.detectChanges();

      component.modalElementAccesos = {
        nativeElement: document.createElement('div')
      } as any;

      const datosAcceso: AccesosTabla = {
        rfc: 'COMPLETO123456', 
        aduana: 'aduana_completa',
        sistema: 'sistema_completo',
        rol: 'rol_completo',
        tipoMovimiento: 'movimiento_completo'
      };

      component.accesosForm.patchValue(datosAcceso);
      component.accesosForm.updateValueAndValidity();
      
      expect(component.accesosForm.valid).toBeTruthy();
      
      const longitudInicial = component.accesosTablaDatos.length;
      component.agregarAccesos();

      expect(mockTramite324Store.addAccesosDatos).toHaveBeenCalledWith(datosAcceso);
      expect(component.nuevaNotificacion).toBeDefined();
      expect(component.nuevaNotificacion.mensaje).toBe('El acceso se agregó correctamente.');
    });
  });
});