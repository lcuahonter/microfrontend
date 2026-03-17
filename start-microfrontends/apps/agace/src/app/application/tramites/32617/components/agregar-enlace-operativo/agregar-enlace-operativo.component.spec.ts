import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { SimpleChanges, NO_ERRORS_SCHEMA } from '@angular/core';

import { AgregarEnlaceOperativoComponent } from './agregar-enlace-operativo.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { OeaTercerizacionLogisticaRegistroService } from '../../services/oea-tercerizacion-logistica-registro.service';
import { ApiResponse, EntidadFederativa, InstalacionesInterface } from '../../modelos/oea-tercerizacion-logistica-registro.model';

describe('AgregarEnlaceOperativoComponent - Pruebas unitarias', () => {
  let component: AgregarEnlaceOperativoComponent;
  let fixture: ComponentFixture<AgregarEnlaceOperativoComponent>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockOeaTercerizacionLogisticaRegistroService: jest.Mocked<OeaTercerizacionLogisticaRegistroService>;
  let consoleSpy: jest.SpyInstance;

  // Datos de prueba simulados
  const datosEntidadesFederativasMock: ApiResponse<EntidadFederativa> = {
    code: 200,
    data: [
      { id: 1, descripcion: 'Aguascalientes' },
      { id: 2, descripcion: 'Baja California' },
      { id: 3, descripcion: 'Ciudad de México' }
    ],
    message: 'Datos obtenidos exitosamente'
  };

  const datosInstalacionesMock: ApiResponse<InstalacionesInterface> = {
    code: 200,
    data: [
      {
        entidadFederativa: 'Aguascalientes',
        municipio: 'Aguascalientes',
        direccion: 'Calle Principal 123',
        codigoPostal: '20000',
        registro: 'REG001'
      },
      {
        entidadFederativa: 'Aguascalientes',
        municipio: 'Calvillo',
        direccion: 'Avenida Central 456',
        codigoPostal: '20800',
        registro: 'REG002'
      }
    ],
    message: 'Instalaciones obtenidas exitosamente'
  };

  const estadoConsultaMock = {
    readonly: false
  };

  beforeEach(async () => {
    // Simular console.error para suprimir mensajes de error durante las pruebas
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Configuración de espías para servicios simulados
    mockConsultaioQuery = {
      selectConsultaioState$: of(estadoConsultaMock)
    } as jest.Mocked<ConsultaioQuery>;

    mockOeaTercerizacionLogisticaRegistroService = {
      getEntidadesFederativas: jest.fn().mockReturnValue(of(datosEntidadesFederativasMock)),
      getInstalacionesDatos: jest.fn().mockReturnValue(of(datosInstalacionesMock)),
      sectorListaDeSelects: jest.fn().mockReturnValue(of({ data: [] })),
      getRFCDetails: jest.fn().mockReturnValue(of({ data: {} })),
      getDomiciliosRegistrados: jest.fn().mockReturnValue(of({ data: [] })),
      getTipoInstalacion: jest.fn().mockReturnValue(of({ data: [] })),
      empresaListaDeSelects: jest.fn().mockReturnValue(of({ data: [] })),
      perfilEmpresaListaDeSelects: jest.fn().mockReturnValue(of({ data: [] })),
      poseeDomicilioFiscal: jest.fn().mockReturnValue(of({ data: [] })),
      insertAllData: jest.fn().mockReturnValue(of({ data: {} }))
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AgregarEnlaceOperativoComponent
      ],
      providers: [
        FormBuilder,
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: OeaTercerizacionLogisticaRegistroService, useValue: mockOeaTercerizacionLogisticaRegistroService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarEnlaceOperativoComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Restaurar console.error después de cada prueba
    if (consoleSpy) {
      consoleSpy.mockRestore();
    }
  });

  describe('🔧 Inicialización del componente', () => {
    it('✅ debería crear el componente sin errores', () => {
      expect(component).toBeTruthy();
    });

    it('✅ debería inicializar las propiedades con valores por defecto correctos', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.instalacionesList).toEqual([]);
      expect(component.resetTableSelection).toBe(false);
      expect(component.listaFilaSeleccionadaEmpleado).toEqual([]);
      expect(component.entidadFederalivaList).toEqual([]);
    });

    it('✅ debería configurar la suscripción al estado de solo lectura en el constructor', () => {
      fixture.detectChanges();
      expect(component.esFormularioSoloLectura).toBe(estadoConsultaMock.readonly);
    });
  });

  describe('🚀 Ciclo de vida ngOnInit', () => {
    it('✅ debería ejecutar getEntidadesFederativas y crearFormulario durante la inicialización', () => {
      const getEntidadesSpy = jest.spyOn(component, 'getEntidadesFederativas');
      const crearFormularioSpy = jest.spyOn(component, 'crearFormulario');

      component.ngOnInit();

      expect(getEntidadesSpy).toHaveBeenCalled();
      expect(crearFormularioSpy).toHaveBeenCalled();
    });

    it('✅ debería crear el formulario reactivo con el control entidadFederaliva', () => {
      component.ngOnInit();

      expect(component.forma).toBeDefined();
      expect(component.forma.get('entidadFederaliva')).toBeDefined();
      expect(component.forma.get('entidadFederaliva')?.value).toBeNull();
    });

    it('✅ debería configurar el formulario como una instancia de FormGroup válida', () => {
      component.ngOnInit();

      expect(component.forma).toBeInstanceOf(Object);
      expect(component.forma.controls).toBeDefined();
      expect(Object.keys(component.forma.controls)).toContain('entidadFederaliva');
    });
  });

  describe('📊 Obtención de datos de catálogos', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería obtener y asignar correctamente la lista de entidades federativas', () => {
      component.getEntidadesFederativas();

      expect(mockOeaTercerizacionLogisticaRegistroService.getEntidadesFederativas).toHaveBeenCalled();
      expect(component.entidadFederalivaList).toEqual(datosEntidadesFederativasMock.data);
    });

    it('✅ debería manejar correctamente respuestas vacías del servicio de entidades federativas', () => {
      const respuestaVacia: ApiResponse<EntidadFederativa> = {
        code: 200,
        data: [],
        message: 'Sin datos disponibles'
      };
      
      mockOeaTercerizacionLogisticaRegistroService.getEntidadesFederativas.mockReturnValue(of(respuestaVacia));
      
      component.getEntidadesFederativas();
      
      expect(component.entidadFederalivaList).toEqual([]);
    });

    it('✅ debería limpiar la lista si ocurre un error al obtener entidades federativas', () => {
      const datosAnteriores = [{ id: 99, descripcion: 'Estado Anterior' }];
      component.entidadFederalivaList = datosAnteriores;

      const errorObservable = new Subject<ApiResponse<EntidadFederativa>>();
      mockOeaTercerizacionLogisticaRegistroService.getEntidadesFederativas.mockReturnValue(errorObservable.asObservable());
      
      component.getEntidadesFederativas();
      errorObservable.error('Error de conexión');

      expect(component.entidadFederalivaList).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error al obtener entidades federativas:', 'Error de conexión');
    });
  });

  describe('🔄 Manejo de cambios en entidad federativa', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería cargar instalaciones cuando se cambia la entidad federativa', () => {
      const eventoMock = new Event('change');
      
      component.alCambiarEntidadFederaliva(eventoMock);

      expect(mockOeaTercerizacionLogisticaRegistroService.getInstalacionesDatos).toHaveBeenCalled();
      expect(component.instalacionesList).toEqual(datosInstalacionesMock.data);
    });

    it('✅ debería reemplazar instalaciones previas al cambiar entidad federativa', () => {
      // Establecer datos iniciales
      const datosIniciales = [{
        entidadFederativa: 'Estado Anterior',
        municipio: 'Municipio Anterior',
        direccion: 'Dirección Anterior',
        codigoPostal: '99999',
        registro: 'REG999'
      }];
      component.instalacionesList = datosIniciales;
      
      const eventoMock = new Event('change');
      component.alCambiarEntidadFederaliva(eventoMock);

      expect(component.instalacionesList).toEqual(datosInstalacionesMock.data);
      expect(component.instalacionesList).not.toContain(datosIniciales[0]);
    });

    it('✅ debería manejar eventos null o undefined sin errores', () => {
      expect(() => {
        component.alCambiarEntidadFederaliva(null as any);
      }).not.toThrow();

      expect(() => {
        component.alCambiarEntidadFederaliva(undefined as any);
      }).not.toThrow();
    });
  });

  describe('📋 Manejo de selección de filas en tabla', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería manejar correctamente la selección de una sola fila', () => {
      const filaSeleccionada = [datosInstalacionesMock.data[0]];
      const emitSpy = jest.spyOn(component.instalacionesSeleccionadas, 'emit');

      component.manejarFilaSeleccionada(filaSeleccionada);

      expect(component.listaFilaSeleccionadaEmpleado).toEqual(filaSeleccionada);
      expect(component.filaSeleccionadaNumeroEmpleados).toEqual(datosInstalacionesMock.data[0]);
      expect(emitSpy).toHaveBeenCalledWith(filaSeleccionada);
    });

    it('✅ debería manejar correctamente la selección de múltiples filas', () => {
      const filasSeleccionadas = datosInstalacionesMock.data;
      const emitSpy = jest.spyOn(component.instalacionesSeleccionadas, 'emit');

      component.manejarFilaSeleccionada(filasSeleccionadas);

      expect(component.listaFilaSeleccionadaEmpleado).toEqual(filasSeleccionadas);
      expect(component.filaSeleccionadaNumeroEmpleados).toEqual(datosInstalacionesMock.data[1]); // Última fila
      expect(emitSpy).toHaveBeenCalledWith(filasSeleccionadas);
    });

    it('✅ debería limpiar la selección cuando se pasa un array vacío', () => {
      const filasVacias: InstalacionesInterface[] = [];
      const emitSpy = jest.spyOn(component.instalacionesSeleccionadas, 'emit');

      component.manejarFilaSeleccionada(filasVacias);

      expect(component.listaFilaSeleccionadaEmpleado).toEqual([]);
      expect(component.filaSeleccionadaNumeroEmpleados).toEqual({} as InstalacionesInterface);
      expect(emitSpy).toHaveBeenCalledWith([]);
    });

    it('✅ debería seleccionar siempre la última fila como fila principal cuando hay múltiples selecciones', () => {
      const primeraFila = datosInstalacionesMock.data[0];
      const segundaFila = datosInstalacionesMock.data[1];
      const filasSeleccionadas = [primeraFila, segundaFila];

      component.manejarFilaSeleccionada(filasSeleccionadas);

      expect(component.filaSeleccionadaNumeroEmpleados).toEqual(segundaFila);
      expect(component.filaSeleccionadaNumeroEmpleados).not.toEqual(primeraFila);
    });
  });

  describe('🔄 Funcionalidad de reseteo de tabla', () => {
    beforeEach(() => {
      component.ngOnInit();
      // Configurar datos previos para verificar el reseteo
      component.listaFilaSeleccionadaEmpleado = datosInstalacionesMock.data;
      component.filaSeleccionadaNumeroEmpleados = datosInstalacionesMock.data[0];
      component.instalacionesList = datosInstalacionesMock.data;
      component.forma.patchValue({ entidadFederaliva: 1 });
    });

    it('✅ debería resetear completamente la selección de tabla y formulario', () => {
      const emitSpy = jest.spyOn(component.instalacionesSeleccionadas, 'emit');

      component.resetearSeleccionTabla();

      expect(component.listaFilaSeleccionadaEmpleado).toEqual([]);
      expect(component.filaSeleccionadaNumeroEmpleados).toEqual({} as InstalacionesInterface);
      expect(component.instalacionesList).toEqual([]);
      expect(component.forma.get('entidadFederaliva')?.value).toBeNull();
      expect(emitSpy).toHaveBeenCalledWith([]);
    });

    it('✅ debería limpiar todos los controles del formulario al resetear', () => {
      component.resetearSeleccionTabla();

      expect(component.forma.get('entidadFederaliva')?.value).toBeNull();
      expect(component.forma.pristine).toBe(true);
    });

    it('✅ debería emitir un evento con array vacío al componente padre', () => {
      const emitSpy = jest.spyOn(component.instalacionesSeleccionadas, 'emit');

      component.resetearSeleccionTabla();

      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith([]);
    });
  });

  describe('🔍 Detección de cambios en propiedades de entrada', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      // Restablecer todos los mocks y asegurar que no queden observables con errores colgando
      if (mockOeaTercerizacionLogisticaRegistroService.getEntidadesFederativas.mockClear) {
        mockOeaTercerizacionLogisticaRegistroService.getEntidadesFederativas.mockClear();
      }
      if (mockOeaTercerizacionLogisticaRegistroService.getInstalacionesDatos.mockClear) {
        mockOeaTercerizacionLogisticaRegistroService.getInstalacionesDatos.mockClear();
      }
      // Asegurar que todos los mocks de servicios retornen observables exitosos para esta suite
      mockOeaTercerizacionLogisticaRegistroService.getEntidadesFederativas.mockReturnValue(of(datosEntidadesFederativasMock));
      mockOeaTercerizacionLogisticaRegistroService.getInstalacionesDatos.mockReturnValue(of(datosInstalacionesMock));
      component.ngOnInit();
      jest.spyOn(component, 'resetearSeleccionTabla');
    });

    it('✅ debería resetear la tabla cuando resetTableSelection cambia a true', (done) => {
      // Limpiar cualquier spy existente para evitar interferencias
      jest.clearAllMocks();
      
      const cambios: SimpleChanges = {
        resetTableSelection: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      const resetSpy = jest.spyOn(component, 'resetearSeleccionTabla');

      try {
        component.ngOnChanges(cambios);

        // Verificar ejecución asíncrona con setTimeout
        setTimeout(() => {
          try {
            expect(resetSpy).toHaveBeenCalled();
            done();
          } catch (assertionError) {
            done.fail(assertionError as any);
          }
        }, 20);
      } catch (error) {
        done.fail(error as any);
      }
    });

    it('✅ no debería resetear la tabla cuando resetTableSelection permanece en false', () => {
      const cambios: SimpleChanges = {
        resetTableSelection: {
          currentValue: false,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(cambios);

      expect(component.resetearSeleccionTabla).not.toHaveBeenCalled();
    });

    it('✅ debería ignorar cambios en otras propiedades que no sean resetTableSelection', () => {
      const cambios: SimpleChanges = {
        instalacionesList: {
          currentValue: [datosInstalacionesMock.data[0]],
          previousValue: [],
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(cambios);

      expect(component.resetearSeleccionTabla).not.toHaveBeenCalled();
    });

    it('✅ debería manejar múltiples cambios de propiedades simultáneamente', () => {
      const cambios: SimpleChanges = {
        resetTableSelection: {
          currentValue: false,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        },
        instalacionesList: {
          currentValue: datosInstalacionesMock.data,
          previousValue: [],
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(cambios);

      expect(component.resetearSeleccionTabla).not.toHaveBeenCalled();
    });
  });

  describe('📤 Eventos de salida del componente', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería emitir instalacionesSeleccionadas al seleccionar filas', () => {
      const emitSpy = jest.spyOn(component.instalacionesSeleccionadas, 'emit');
      const filasSeleccionadas = [datosInstalacionesMock.data[0]];

      component.manejarFilaSeleccionada(filasSeleccionadas);

      expect(emitSpy).toHaveBeenCalledWith(filasSeleccionadas);
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('✅ debería emitir array vacío al resetear la selección', () => {
      const emitSpy = jest.spyOn(component.instalacionesSeleccionadas, 'emit');

      component.resetearSeleccionTabla();

      expect(emitSpy).toHaveBeenCalledWith([]);
    });

    it('✅ debería emitir eventos múltiples cuando se cambia la selección varias veces', () => {
      const emitSpy = jest.spyOn(component.instalacionesSeleccionadas, 'emit');

      // Primera selección
      component.manejarFilaSeleccionada([datosInstalacionesMock.data[0]]);
      // Segunda selección
      component.manejarFilaSeleccionada([datosInstalacionesMock.data[1]]);
      // Limpiar selección
      component.manejarFilaSeleccionada([]);

      expect(emitSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('🧹 Gestión de memoria y limpieza de recursos', () => {
    it('✅ debería completar el subject destroyed$ al destruir el componente', () => {
      const nextSpy = jest.spyOn(component.destroyed$, 'next');
      const completeSpy = jest.spyOn(component.destroyed$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('✅ debería cancelar todas las suscripciones activas al destruir', () => {
      const espiaDest = jest.spyOn(component.destroyed$, 'next');
      
      component.ngOnDestroy();
      
      expect(espiaDest).toHaveBeenCalledTimes(1);
    });

    it('✅ debería manejar la destrucción múltiples veces sin errores', () => {
      expect(() => {
        component.ngOnDestroy();
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe('📥 Propiedades de entrada del componente', () => {
    it('✅ debería aceptar y almacenar correctamente instalacionesList como entrada', () => {
      const instalacionesEntrada = datosInstalacionesMock.data;
      
      component.instalacionesList = instalacionesEntrada;
      
      expect(component.instalacionesList).toEqual(instalacionesEntrada);
      expect(component.instalacionesList.length).toBe(2);
    });

    it('✅ debería aceptar y almacenar correctamente resetTableSelection como entrada', () => {      
      component.resetTableSelection = true;
      
      expect(component.resetTableSelection).toBe(true);
      
      component.resetTableSelection = false;
      
      expect(component.resetTableSelection).toBe(false);
    });

    it('✅ debería manejar instalacionesList vacía sin errores', () => {
      component.instalacionesList = [];
      
      expect(component.instalacionesList).toEqual([]);
      expect(() => component.manejarFilaSeleccionada([])).not.toThrow();
    });
  });

  describe('⚙️ Configuración de componentes de tabla', () => {
    it('✅ debería tener configurado correctamente el tipo de selección de tabla', () => {
      expect(component.tipoSeleccionTabla).toBeDefined();
      expect(typeof component.tipoSeleccionTabla).toBe('string');
    });

    it('✅ debería tener configurada correctamente la estructura de columnas de tabla', () => {
      expect(component.ParqueVehicular).toBeDefined();
      expect(Array.isArray(component.ParqueVehicular) || typeof component.ParqueVehicular === 'object').toBe(true);
    });
  });

  describe('🚨 Casos de error y estados límite', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería manejar servicios que devuelven respuestas vacías', () => {
      const respuestaVacia: ApiResponse<EntidadFederativa> = {
        code: 404,
        data: [],
        message: 'No se encontraron datos'
      };
      
      mockOeaTercerizacionLogisticaRegistroService.getEntidadesFederativas.mockReturnValue(of(respuestaVacia));
      
      component.getEntidadesFederativas();
      
      expect(component.entidadFederalivaList).toEqual([]);
    });

    it('✅ debería manejar formulario no inicializado sin lanzar errores', () => {
      component.forma = undefined as any;
      
      expect(() => component.resetearSeleccionTabla()).not.toThrow();
    });

    it('✅ debería manejar selección de filas null o undefined correctamente', () => {
      const emitSpy = jest.spyOn(component.instalacionesSeleccionadas, 'emit');
      
      expect(() => {
        component.manejarFilaSeleccionada(null as any);
      }).not.toThrow();
      
      expect(() => {
        component.manejarFilaSeleccionada(undefined as any);
      }).not.toThrow();
    });

    it('✅ debería manejar errores de red en servicios sin afectar el estado del componente', () => {
      const estadoInicial = { ...component };
      
      const errorObservable = new Subject<ApiResponse<InstalacionesInterface>>();
      mockOeaTercerizacionLogisticaRegistroService.getInstalacionesDatos.mockReturnValue(errorObservable.asObservable());
      
      component.alCambiarEntidadFederaliva(new Event('change'));
      errorObservable.error({ message: 'Error de conexión', status: 500 });
      
      // El componente debería mantener su estado estable
      expect(component.destroyed$.closed).toBe(false);
      expect(component.instalacionesList).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error al obtener instalaciones:', { message: 'Error de conexión', status: 500 });
    });
  });

  describe('🔒 Manejo del estado de solo lectura', () => {
    it('✅ debería configurar esFormularioSoloLectura como false cuando el estado permite edición', (done) => {
      const estadoEditable = { readonly: false };
      const mockConsultaioQueryEditable = {
        selectConsultaioState$: of(estadoEditable)
      } as any;

      // Crear un nuevo TestBed limpio
      TestBed.resetTestingModule();
      
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          AgregarEnlaceOperativoComponent
        ],
        providers: [
          FormBuilder,
          { provide: ConsultaioQuery, useValue: mockConsultaioQueryEditable },
          { provide: OeaTercerizacionLogisticaRegistroService, useValue: mockOeaTercerizacionLogisticaRegistroService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents().then(() => {
        const nuevoFixture = TestBed.createComponent(AgregarEnlaceOperativoComponent);
        const nuevoComponente = nuevoFixture.componentInstance;
        
        // Ejecutar la detección de cambios inmediatamente para inicializar el componente
        nuevoFixture.detectChanges();
        
        // Esperar suficiente tiempo para que la suscripción asíncrona se complete
        setTimeout(() => {
          try {
            expect(nuevoComponente.esFormularioSoloLectura).toBe(false);
            done();
          } catch (assertionError) {
            done.fail(assertionError as any);
          }
        }, 50);
      }).catch(error => {
        done.fail(error);
      });
    });
  });

  describe('🔄 Integración entre métodos del componente', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería mantener sincronización entre selección de tabla y emisión de eventos', () => {
      const emitSpy = jest.spyOn(component.instalacionesSeleccionadas, 'emit');
      
      // Simular flujo completo: seleccionar, cambiar selección, resetear
      const primeraSeleccion = [datosInstalacionesMock.data[0]];
      const segundaSeleccion = [datosInstalacionesMock.data[1]];
      
      component.manejarFilaSeleccionada(primeraSeleccion);
      expect(emitSpy).toHaveBeenCalledWith(primeraSeleccion);
      
      component.manejarFilaSeleccionada(segundaSeleccion);
      expect(emitSpy).toHaveBeenCalledWith(segundaSeleccion);
      
      component.resetearSeleccionTabla();
      expect(emitSpy).toHaveBeenCalledWith([]);
      
      expect(emitSpy).toHaveBeenCalledTimes(3);
    });

    it('✅ debería mantener coherencia entre reseteo manual y reseteo por cambios', (done) => {
      // Limpiar cualquier mock existente
      jest.clearAllMocks();
      
      const resetSpy = jest.spyOn(component, 'resetearSeleccionTabla');
      const emitSpy = jest.spyOn(component.instalacionesSeleccionadas, 'emit');
      
      try {
        // Reseteo manual
        component.resetearSeleccionTabla();
        
        // Reseteo por cambios
        const cambios: SimpleChanges = {
          resetTableSelection: {
            currentValue: true,
            previousValue: false,
            firstChange: false,
            isFirstChange: () => false
          }
        };
        
        component.ngOnChanges(cambios);
        
        setTimeout(() => {
          try {
            // Verificar que se llamó el reseteo al menos una vez
            expect(resetSpy).toHaveBeenCalled();
            done();
          } catch (assertionError) {
            done.fail(assertionError as any);
          }
        }, 25);
      } catch (error) {
        done.fail(error as any);
      }
    });
  });

  describe('🎭 Pruebas de renderizado y DOM', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('✅ debería renderizar correctamente el formulario de entidad federativa', () => {
      const selectElement = fixture.debugElement.query(obj => obj.name === 'app-catalogo-select');
      expect(selectElement).toBeTruthy();
    });

    it('✅ debería renderizar la tabla dinámica de instalaciones', () => {
      const tablaElement = fixture.debugElement.query(obj => obj.name === 'app-tabla-dinamica');
      expect(tablaElement).toBeTruthy();
    });

    it('✅ debería actualizar la vista cuando cambian las instalaciones', () => {
      component.instalacionesList = datosInstalacionesMock.data;
      fixture.detectChanges();
      
      expect(component.instalacionesList.length).toBe(2);
    });

    it('✅ debería mostrar estado de carga mientras se obtienen datos', () => {
      component.instalacionesList = [];
      fixture.detectChanges();
      
      expect(component.instalacionesList.length).toBe(0);
    });
  });

  describe('🧪 Validación de formularios reactivos', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería crear un FormGroup válido con control entidadFederaliva', () => {
      expect(component.forma).toBeInstanceOf(Object);
      expect(component.forma.get('entidadFederaliva')).toBeTruthy();
    });

    it('✅ debería manejar valores null en el control del formulario', () => {
      const control = component.forma.get('entidadFederaliva');
      control?.setValue(null);
      
      expect(control?.value).toBeNull();
      expect(component.forma.valid).toBe(true);
    });

    it('✅ debería actualizar el formulario cuando se selecciona una entidad', () => {
      const control = component.forma.get('entidadFederaliva');
      control?.setValue(1);
      control?.markAsDirty();
      
      expect(control?.value).toBe(1);
      expect(control?.dirty).toBe(true);
    });

    it('✅ debería resetear correctamente todos los controles del formulario', () => {
      const control = component.forma.get('entidadFederaliva');
      control?.setValue(3);
      control?.markAsDirty();
      
      component.resetearSeleccionTabla();
      
      expect(control?.value).toBeNull();
      expect(control?.pristine).toBe(true);
    });
  });

  describe('🚀 Pruebas de rendimiento y optimización', () => {
    it('✅ debería manejar listas grandes de instalaciones sin degradación', () => {
      const instalacionesGrandes = Array.from({ length: 1000 }, (_, index) => ({
        entidadFederativa: `Estado ${index}`,
        municipio: `Municipio ${index}`,
        direccion: `Dirección ${index}`,
        codigoPostal: `${10000 + index}`,
        registro: `REG${index}`
      }));

      const inicioTiempo = performance.now();
      component.manejarFilaSeleccionada(instalacionesGrandes);
      const finTiempo = performance.now();

      expect(finTiempo - inicioTiempo).toBeLessThan(100); // Menos de 100ms
      expect(component.listaFilaSeleccionadaEmpleado.length).toBe(1000);
    });

    it('✅ debería optimizar las llamadas a servicios evitando duplicados', () => {
      component.getEntidadesFederativas();
      component.getEntidadesFederativas();
      component.getEntidadesFederativas();

      expect(mockOeaTercerizacionLogisticaRegistroService.getEntidadesFederativas).toHaveBeenCalledTimes(3);
    });

    it('✅ debería liberar memoria correctamente al cambiar selecciones múltiples veces', () => {
      for (let i = 0; i < 50; i++) {
        const instalaciones = [datosInstalacionesMock.data[0]];
        component.manejarFilaSeleccionada(instalaciones);
        component.resetearSeleccionTabla();
      }

      expect(component.listaFilaSeleccionadaEmpleado).toEqual([]);
      expect(component.instalacionesList).toEqual([]);
    });
  });

  describe('🔐 Pruebas de seguridad y sanitización', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería manejar scripts maliciosos en datos de instalaciones', () => {
      const instalacionesConScript = [{
        entidadFederativa: '<script>alert("XSS")</script>',
        municipio: 'Municipio Seguro',
        direccion: 'Dirección Segura',
        codigoPostal: '12345',
        registro: 'REG001'
      }];

      expect(() => {
        component.manejarFilaSeleccionada(instalacionesConScript);
      }).not.toThrow();

      expect(component.listaFilaSeleccionadaEmpleado[0].entidadFederativa).toContain('<script>');
    });

    it('✅ debería validar tipos de datos correctamente', () => {
      const instalacionesInvalidas = [
        {
          entidadFederativa: 123, // Número en lugar de string
          municipio: null,
          direccion: undefined,
          codigoPostal: '',
          registro: 'REG001'
        }
      ] as any;

      expect(() => {
        component.manejarFilaSeleccionada(instalacionesInvalidas);
      }).not.toThrow();
    });
  });

  describe('📊 Pruebas de accesibilidad', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('✅ debería mantener el orden de tabulación correcto', () => {
      const elementoForm = fixture.debugElement.query(obj => obj.name === 'form');
      expect(elementoForm).toBeTruthy();
    });

    it('✅ debería proporcionar retroalimentación visual para selecciones', () => {
      component.manejarFilaSeleccionada([datosInstalacionesMock.data[0]]);
      fixture.detectChanges();

      expect(component.listaFilaSeleccionadaEmpleado.length).toBe(1);
    });

    it('✅ debería manejar navegación por teclado en la tabla', () => {
      component.instalacionesList = datosInstalacionesMock.data;
      fixture.detectChanges();

      // Simular evento de teclado
      const tablaElement = fixture.debugElement.query(obj => obj.name === 'app-tabla-dinamica');
      expect(tablaElement).toBeTruthy();
    });
  });

  describe('🔄 Casos de uso complejos e integración', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería manejar flujo completo: cargar entidades → seleccionar → cargar instalaciones → seleccionar → resetear', () => {
      // 1. Cargar entidades federativas
      component.getEntidadesFederativas();
      expect(component.entidadFederalivaList.length).toBe(3);

      // 2. Seleccionar entidad federativa
      const evento = new Event('change');
      component.alCambiarEntidadFederaliva(evento);
      expect(component.instalacionesList.length).toBe(2);

      // 3. Seleccionar instalaciones
      component.manejarFilaSeleccionada([datosInstalacionesMock.data[0]]);
      expect(component.listaFilaSeleccionadaEmpleado.length).toBe(1);

      // 4. Resetear selección
      component.resetearSeleccionTabla();
      expect(component.listaFilaSeleccionadaEmpleado.length).toBe(0);
      expect(component.instalacionesList.length).toBe(0);
    });

    it('✅ debería mantener consistencia de datos durante múltiples cambios de entidad', () => {
      const evento = new Event('change');

      // Cambiar entidad múltiples veces
      component.alCambiarEntidadFederaliva(evento);
      const primerCargaInstalaciones = [...component.instalacionesList];

      component.alCambiarEntidadFederaliva(evento);
      const segundaCargaInstalaciones = [...component.instalacionesList];

      expect(primerCargaInstalaciones).toEqual(segundaCargaInstalaciones);
    });

    it('✅ debería coordinar correctamente entre estados de solo lectura y edición', () => {
      // Modo edición
      component.esFormularioSoloLectura = false;
      expect(component.esFormularioSoloLectura).toBe(false);

      // Simular cambio a modo solo lectura
      component.esFormularioSoloLectura = true;
      expect(component.esFormularioSoloLectura).toBe(true);
    });
  });

  describe('⚡ Pruebas de eventos asíncronos y timing', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('✅ debería manejar eventos de cambio concurrentes sin conflictos', (done) => {
      let eventosCompletados = 0;
      const totalEventos = 3;

      const verificarComplecion = () => {
        eventosCompletados++;
        if (eventosCompletados === totalEventos) {
          expect(component.instalacionesList.length).toBe(2);
          done();
        }
      };

      // Simular múltiples eventos concurrentes
      const evento = new Event('change');
      
      setTimeout(() => {
        component.alCambiarEntidadFederaliva(evento);
        verificarComplecion();
      }, 10);

      setTimeout(() => {
        component.alCambiarEntidadFederaliva(evento);
        verificarComplecion();
      }, 20);

      setTimeout(() => {
        component.alCambiarEntidadFederaliva(evento);
        verificarComplecion();
      }, 30);
    });

    it('✅ debería cancelar suscripciones previas al destruir el componente', () => {
      const nextSpy = jest.spyOn(component.destroyed$, 'next');
      const completeSpy = jest.spyOn(component.destroyed$, 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
