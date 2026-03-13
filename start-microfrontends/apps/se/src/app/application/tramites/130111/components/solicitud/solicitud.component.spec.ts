import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tramite130111Store } from '../../../../estados/tramites/tramites130111.store';
import { Tramite130111Query } from '../../../../estados/queries/tramite130111.query';
import { of, Subject } from 'rxjs';
import { Catalogo } from '@ng-mf/data-access-user';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { Component, Input } from '@angular/core';
import { ImportacionDeVehiculosService } from '../../services/importacion-de-vehiculos.service';
import { HttpClientModule } from '@angular/common/http';


@Component({ selector: 'app-partidas-de-la-mercancia', template: '' })
class PartidasDeLaMercanciaStubComponent {}

@Component({ selector: 'app-datos-del-tramite', template: '' })
class DatosDelTramiteStubComponent {}

@Component({ selector: 'app-datos-de-la-mercancia', template: '' })
class DatosDeLaMercanciaStubComponent {}

@Component({ selector: 'app-pais-procendencia', template: '' })
class PaisProcendenciaStubComponent {
  @Input() fechas: any[] = [];
  @Input() fechasSeleccionadas: any[] = [];
}

@Component({ selector: 'app-representacion', template: '' })
class RepresentacionStubComponent {}

const MOCK_PARTIDAS_TABLA = {
  cantidad :"10",
  unidadDeMedida :"kg",
  fraccionFrancelaria :"1234",
  descripcion:"Item",
  precioUnitarioUSD :"50",
  totalUSD:"100",
};

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let mockStore: jest.Mocked<Tramite130111Store>;
  let mockQuery: jest.Mocked<Tramite130111Query>;
  let mockService: jest.Mocked<any>;
  let mockImportacionDeVehiculosService: Partial<ImportacionDeVehiculosService>;

  const MOCK_PRODUCTO_OPTIONS: ProductoOpción[] = [
    { label: 'Nuevo', value: 'Nuevo' },
    { label: 'Usado', value: 'Usado' },
  ];
  const MOCK_CATALOGO: Catalogo[] = [
    { id: 1, descripcion: 'Option 1' },
    { id: 2, descripcion: 'Option 2' },
  ];

  beforeEach(async () => {
    mockStore = {
      actualizarEstado: jest.fn(),
      setMostrarTabla: jest.fn(),
      storeTableValues: jest.fn(),
      updateSolicitud: jest.fn(),
      setDescripcionPartidasDeLaMercancia: jest.fn(),
      setCantidadPartidasDeLaMercancia: jest.fn(),
      setValorPartidaUSDPartidasDeLaMercancia: jest.fn(),
      setregimen: jest.fn(),
      setclasificacion: jest.fn(),
      setProducto: jest.fn(),
      setDescripcion: jest.fn(),
      setCantidad: jest.fn(),
      setValorPartidaUSD: jest.fn(),
      setUnidadMedida: jest.fn(),
      setBloque: jest.fn(),
      setUsoEspecifico: jest.fn(),
      setJustificacionImportacionExportacion: jest.fn(),
      setObservaciones: jest.fn(),
      setEntidad: jest.fn(),
      setRepresentacion: jest.fn(),
    } as any;

    mockQuery = {
      mostrarTabla$: new Subject<boolean>(),
      solicitud$: of(''),
      regimen$: of(''),
      clasificacion$: of(''),
      mercanciaState$: of({
        producto: 'Nuevo',
        descripcion: '',
        fraccion: '',
        cantidad: '',
        valorPartidaUSD: 0,
        unidadMedida: '',
      }),
      selectSolicitud$: of({
        cantidadPartidasDeLaMercancia: '',
        valorPartidaUSDPartidasDeLaMercancia: '',
        descripcionPartidasDeLaMercancia: '',
        bloque: '',
        usoEspecifico: '',
        justificacionImportacionExportacion: '',
        observaciones: '',
        entidad: '',
        representacion: '',
      }),
      select: jest.fn().mockReturnValue(of({})),
      getValue: jest.fn().mockReturnValue({})
    } as any;

    mockService = {
      getEntidadesFederativasCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getEntidadFederativa: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getRepresentacionFederal: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getListaDePaisesDisponibles: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getPaisesPorBloque: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    };
    jest.spyOn(mockService, 'getEntidadFederativa'); 

    await TestBed.configureTestingModule({
      declarations: [
        SolicitudComponent,
        PartidasDeLaMercanciaStubComponent,
        DatosDelTramiteStubComponent,
        DatosDeLaMercanciaStubComponent,
        PaisProcendenciaStubComponent,
        RepresentacionStubComponent,
      ],
      imports: [ReactiveFormsModule,HttpClientModule],
      providers: [
        FormBuilder,
        { provide: Tramite130111Store, useValue: mockStore },
        { provide: Tramite130111Query, useValue: mockQuery },
        { provide: ImportacionDeVehiculosService, useValue: mockImportacionDeVehiculosService },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    mockImportacionDeVehiculosService = {
    getEntidadesFederativasCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    getBloqueService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    getRegimenCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    getClasificacionRegimenCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    getRepresentacionFederalCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    getUMTService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    getFraccionCatalogoService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    getPaisesPorBloqueService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getEntidadFederativa: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getRepresentacionFederal: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getListaDePaisesDisponibles: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getPaisesPorBloque: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getSolicitudeOptions: jest.fn().mockReturnValue(
        of({
          options: MOCK_PRODUCTO_OPTIONS,
          defaultSelect: 'Inicial',
        })
      ),
      getProductoOptions: jest.fn().mockReturnValue(
        of({
          options: MOCK_PRODUCTO_OPTIONS,
        })
      ),
      getTablaDatos: jest.fn().mockReturnValue(of([{ cantidad: 10, totalUSD: 1000 }])),
    };
  
    await TestBed.configureTestingModule({
      declarations: [SolicitudComponent],
      providers: [
        { provide: ImportacionDeVehiculosService, useValue: mockImportacionDeVehiculosService },
      ],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('Debe inicializar formularios y configurar suscripciones', () => {
      jest.spyOn(component, 'inicializarFormularios');
      jest.spyOn(component, 'opcionesDeBusqueda');
      jest.spyOn(component, 'formularioTotalCount');
      jest.spyOn(component, 'fetchEntidadFederativa');
      jest.spyOn(component, 'getRepresentacionFederalCatalogo');
      jest.spyOn(component, 'listaDePaisesDisponibles');

      component.ngOnInit();

      expect(component.opcionesDeBusqueda).toHaveBeenCalled();
      expect(component.formularioTotalCount).toHaveBeenCalled();
      expect(component.fetchEntidadFederativa).toHaveBeenCalled();
      expect(component.listaDePaisesDisponibles).toHaveBeenCalled();
    });

    it('Debería actualizar mostrarTabla según la consulta', () => {
      const MONSTER_TABLA_SUBJECT = new Subject<boolean>();
      mockQuery.mostrarTabla$ = MONSTER_TABLA_SUBJECT.asObservable();

      component.ngOnInit();
      MONSTER_TABLA_SUBJECT.next(true);

      expect(component.mostrarTabla).toBe(true);
    });

  });

  describe('inicializarFormularios', () => {
    it('debe inicializar todas las formas reactivas', () => {
      component.inicializarFormularios();

      expect(component.formDelTramite).toBeDefined();
      expect(component.mercanciaForm).toBeDefined();
      expect(component.partidasDelaMercanciaForm).toBeDefined();
      expect(component.paisForm).toBeDefined();
      expect(component.frmRepresentacionForm).toBeDefined();

      expect(component.formDelTramite.get('solicitud')).toBeDefined();
      expect(component.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')).toBeDefined();
      expect(component.paisForm.get('bloque')).toBeDefined();
      expect(component.frmRepresentacionForm.get('entidad')).toBeDefined();
    });
  });

  describe('opcionesDeBusqueda', () => {
    it('Debería obtener las opciones de solicitud y producto', () => {
      component.opcionesDeBusqueda();

      expect(mockImportacionDeVehiculosService.getSolicitudeOptions).toHaveBeenCalled();
     
      expect(mockImportacionDeVehiculosService.getProductoOptions).toHaveBeenCalled();
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
        producto: 'Nuevo',
        defaultProducto: 'Nuevo',
      });
    });
  });


describe('validarYEnviarFormulario', () => {
  it('Debe establecer mostrarTabla como verdadero si el formulario es válido', () => {
    component.unidadCatalogo = [{ id: 1, descripcion: 'Pieza' }];
    component.fraccionCatalogo = [{ id: 1234, descripcion: 'Fracción Test' }];

    component.mercanciaForm = TestBed.inject(FormBuilder).group({
      cantidad: ['10', [Validators.required, Validators.pattern('^[0-9]+$')]],
      valorFacturaUSD: ['100', Validators.required],
      fraccion: ['1234', Validators.required],
      unidadMedida: ['1', Validators.required], 
      descripcion: ['desc', Validators.required],
    });

    component.partidasDelaMercanciaForm = TestBed.inject(FormBuilder).group({
      cantidadPartidasDeLaMercancia: ['10', [Validators.required, Validators.pattern('^[0-9]+$')]],
      descripcionPartidasDeLaMercancia: ['Test', Validators.required],
      valorPartidaUSDPartidasDeLaMercancia: ['100', Validators.required],
    });

    component.mercanciaForm.get('fraccion')?.setValue('1234');

    component.validarYEnviarFormulario();

    expect(component.mostrarTabla).toBe(true);
  });
});


  describe('navegarParaModificarPartida', () => {
    it('Debería actualizar el estado y mostrarTabla si hay fila seleccionada', () => {
      component.filaSeleccionada = [{ id:'1', cantidad: '10', descripcion: 'Item', precioUnitarioUSD: '50', unidadDeMedida: 'kg', fraccionFrancelaria: '1234', totalUSD: '100' }];

      component.navegarParaModificarPartida();

    });
  });

  describe('fetchEntidadFederativa', () => {
    it('Debería obtener la lista de entidades federativas', () => {
      component.fetchEntidadFederativa();
    
      expect(mockImportacionDeVehiculosService.getEntidadesFederativasCatalogo).toHaveBeenCalled(); 
      expect(component.entidadFederativa).toEqual(MOCK_CATALOGO);
    });
  });

  describe('getRepresentacionFederalCatalogo', () => {
    it('Debería obtener la lista de representaciones federales', () => {
      component.getRepresentacionFederalCatalogo('01');

      expect(mockImportacionDeVehiculosService.getRepresentacionFederalCatalogo).toHaveBeenCalled();
      expect(component.representacionFederal).toEqual(MOCK_CATALOGO);
    });
  });

  describe('listaDePaisesDisponibles', () => {
    it('Debería obtener la lista de países disponibles', () => {
      component.listaDePaisesDisponibles();

      expect(component.elementosDeBloque).toEqual(MOCK_CATALOGO);
    });
  });

  describe('fetchPaisesPorBloque', () => {
    it('Debería obtener países por bloque y actualizar selectRangoDias', () => {
      component.fetchPaisesPorBloque(1);

      expect(component.paisesPorBloque).toEqual(MOCK_CATALOGO);
      expect(component.selectRangoDias).toEqual(['Option 1', 'Option 2']);
    });
  });

  describe('enCambioDeBloque', () => {
    it('Debería llamar a fetchPaisesPorBloque con el bloqueId', () => {
      jest.spyOn(component, 'fetchPaisesPorBloque');

      component.enCambioDeBloque(2);

      expect(component.fetchPaisesPorBloque).toHaveBeenCalledWith(2);
    });
  });

  describe('setValoresStore', () => {
    it('Debería actualizar el store según el método especificado', () => {
      component.mercanciaForm = TestBed.inject(FormBuilder).group({
        producto: ['Nuevo'], 
      });
  
      component.setValoresStore({
        form: component.mercanciaForm,
        campo: 'producto',
        
      });
  
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({ producto: 'Nuevo' });
    });
  });

  describe('ngOnDestroy', () => {
    it('Debería completar el tema destruido$', () => {
      const DESTROY_SPY = jest.spyOn(component['destroyed$'], 'next');
      const COMPLETE_SPY = jest.spyOn(component['destroyed$'], 'complete');

      component.ngOnDestroy();

      expect(DESTROY_SPY).toHaveBeenCalled();
      expect(COMPLETE_SPY).toHaveBeenCalled();
    });

    describe('guardarDatosFormulario', () => {
      it('debería llamar a inicializarFormularios', () => {
        const spy = jest.spyOn(component, 'inicializarFormularios');
        component.guardarDatosFormulario();
        expect(spy).toHaveBeenCalled();
      });

      describe('inicializarEstadoFormulario', () => {
        it('debería llamar a guardarDatosFormulario si esFormularioSoloLectura es true', () => {
          component.esFormularioSoloLectura = true;
          const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
          component.inicializarEstadoFormulario();
          expect(guardarDatosFormularioSpy).toHaveBeenCalled();
        });

        it('debería llamar a inicializarFormularios si esFormularioSoloLectura es false', () => {
          component.esFormularioSoloLectura = false;
          const inicializarFormulariosSpy = jest.spyOn(component, 'inicializarFormularios');
          component.inicializarEstadoFormulario();
          expect(inicializarFormulariosSpy).toHaveBeenCalled();
        });

        describe('validarFormulario', () => {
          beforeEach(() => {
            component.formDelTramite = TestBed.inject(FormBuilder).group({
              solicitud: ['valor', Validators.required]
            });
            component.mercanciaForm = TestBed.inject(FormBuilder).group({
              cantidad: ['10', Validators.required]
            });
            component.paisForm = TestBed.inject(FormBuilder).group({
              bloque: ['valor', Validators.required],
              usoEspecifico: ['valor', Validators.required],
              justificacionImportacionExportacion: ['valor', Validators.required],
              observaciones: ['valor']
            });
            component.frmRepresentacionForm = TestBed.inject(FormBuilder).group({
              entidad: ['valor', Validators.required],
              representacion: ['valor', Validators.required]
            });
            component.tableBodyData = [{
              id: '1', cantidad: '10', descripcion: 'desc', totalUSD: '100',
              unidadDeMedida: '',
              fraccionFrancelaria: '',
              precioUnitarioUSD: ''
            }];
            component.isInvalidaPartidas = false;
          });

          it('debe retornar true si todos los formularios son válidos y hay partidas', () => {
            expect(component.validarFormulario()).toBe(true);
            expect(component.isInvalidaPartidas).toBe(false);
          });

          it('debe retornar false si formDelTramite es inválido', () => {
            component.formDelTramite.get('solicitud')?.setValue('');
            expect(component.validarFormulario()).toBe(false);
          });

          it('debe retornar false si mercanciaForm es inválido', () => {
            component.mercanciaForm.get('cantidad')?.setValue('');
            expect(component.validarFormulario()).toBe(false);
          });

          it('debe retornar false si no hay partidas en tableBodyData', () => {
            component.tableBodyData = [];
            expect(component.validarFormulario()).toBe(false);
            expect(component.isInvalidaPartidas).toBe(true);
          });

          it('debe retornar false si paisForm es inválido', () => {
            component.paisForm.get('bloque')?.setValue('');
            expect(component.validarFormulario()).toBe(false);
          });

          it('debe retornar false si frmRepresentacionForm es inválido', () => {
            component.frmRepresentacionForm.get('entidad')?.setValue('');
            expect(component.validarFormulario()).toBe(false);
          });

          it('debe marcar todos los controles como touched si son inválidos', () => {
            component.formDelTramite.get('solicitud')?.setValue('');
            component.mercanciaForm.get('cantidad')?.setValue('');
            component.paisForm.get('bloque')?.setValue('');
            component.frmRepresentacionForm.get('entidad')?.setValue('');
            component.tableBodyData = [];
            jest.spyOn(component.formDelTramite, 'markAllAsTouched');
            jest.spyOn(component.mercanciaForm, 'markAllAsTouched');
            jest.spyOn(component.paisForm, 'markAllAsTouched');
            jest.spyOn(component.frmRepresentacionForm, 'markAllAsTouched');
            component.validarFormulario();
            expect(component.formDelTramite.markAllAsTouched).toHaveBeenCalled();
            expect(component.mercanciaForm.markAllAsTouched).toHaveBeenCalled();
            expect(component.paisForm.markAllAsTouched).toHaveBeenCalled();
            expect(component.frmRepresentacionForm.markAllAsTouched).toHaveBeenCalled();
          });

          describe('onPartidasEliminadas', () => {
            beforeEach(() => {
              component.tableBodyData = [
                { id: '1', cantidad: '10', descripcion: 'desc1', totalUSD: '100', unidadDeMedida: '', fraccionFrancelaria: '', precioUnitarioUSD: '' },
                { id: '2', cantidad: '20', descripcion: 'desc2', totalUSD: '200', unidadDeMedida: '', fraccionFrancelaria: '', precioUnitarioUSD: '' }
              ];
              component.mostrarTabla = true;
              jest.spyOn(component, 'formularioTotalCount');
            });

            it('debe eliminar las partidas con los ids proporcionados y actualizar los totales', () => {
              component.onPartidasEliminadas(['1']);

              expect(component.tableBodyData).toEqual([
                { id: '2', cantidad: '20', descripcion: 'desc2', totalUSD: '200', unidadDeMedida: '', fraccionFrancelaria: '', precioUnitarioUSD: '' }
              ]);
              expect(component.mostrarTabla).toBe(true);
              expect(component.tramite130111Store.actualizarEstado).toHaveBeenCalledWith({
                cantidadTotal: '20',
                valorTotalUSD: '200'
              });
              expect(component.formularioTotalCount).toHaveBeenCalledWith('20', '200');
              expect(component.tramite130111Store.actualizarEstado).toHaveBeenCalledWith({
                tableBodyData: component.tableBodyData,
                mostrarTabla: true
              });
            });

            it('debe establecer mostrarTabla en false si no quedan partidas', () => {
              component.onPartidasEliminadas(['1', '2']);

              expect(component.tableBodyData).toEqual([]);
              expect(component.mostrarTabla).toBe(false);
              expect(component.tramite130111Store.actualizarEstado).toHaveBeenCalledWith({
                cantidadTotal: '0',
                valorTotalUSD: '0'
              });
              expect(component.formularioTotalCount).toHaveBeenCalledWith('0', '0');
              expect(component.tramite130111Store.actualizarEstado).toHaveBeenCalledWith({
                tableBodyData: [],
                mostrarTabla: false
              });
            });

            it('no debe eliminar ninguna partida si los ids no coinciden', () => {
              const originalTable = [...component.tableBodyData];
              component.onPartidasEliminadas(['3']);

              expect(component.tableBodyData).toEqual(originalTable);
              expect(component.mostrarTabla).toBe(true);
              expect(component.tramite130111Store.actualizarEstado).toHaveBeenCalledWith({
                cantidadTotal: '30',
                valorTotalUSD: '300'
              });
              expect(component.formularioTotalCount).toHaveBeenCalledWith('30', '300');
              expect(component.tramite130111Store.actualizarEstado).toHaveBeenCalledWith({
                tableBodyData: originalTable,
                mostrarTabla: true
              });
            });

            describe('validarYCargarArchivo', () => {
              let abrirCargarArchivoModalRealSpy: jest.SpyInstance;

              beforeEach(() => {
                component.partidasDeLaMercanciaComponent = {
                  abrirCargarArchivoModalReal: jest.fn()
                } as any;

                abrirCargarArchivoModalRealSpy = jest.spyOn(component.partidasDeLaMercanciaComponent, 'abrirCargarArchivoModalReal');

                component.mercanciaForm = TestBed.inject(FormBuilder).group({
                  cantidad: ['10', Validators.required],
                  valorFacturaUSD: ['100', Validators.required],
                  fraccion: ['1234', Validators.required]
                });
                component.partidasDelaMercanciaForm = TestBed.inject(FormBuilder).group({
                  cantidadPartidasDeLaMercancia: ['10', Validators.required],
                  valorPartidaUSDPartidasDeLaMercancia: ['100', Validators.required],
                  descripcionPartidasDeLaMercancia: ['desc', Validators.required]
                });
                component.mostrarErroresMercancia = false;
                component.mostrarErroresPartidas = false;
                component.mostrarNotificacion = false;
                component.nuevaNotificacion = { mensaje: '', tipo: '' } as any;
              });

              it('debe llamar abrirCargarArchivoModalReal si todos los formularios son válidos y fraccion existe', () => {
                component.validarYCargarArchivo();
                expect(abrirCargarArchivoModalRealSpy).toHaveBeenCalled();
                expect(component.mostrarErroresMercancia).toBe(false);
                expect(component.mostrarErroresPartidas).toBe(false);
                expect(component.mostrarNotificacion).toBe(false);
              });

              it('debe establecer mostrarErroresMercancia en true si mercanciaForm es inválido', () => {
                component.mercanciaForm.get('cantidad')?.setValue('');
                component.validarYCargarArchivo();
                expect(component.mostrarErroresMercancia).toBe(true);
                expect(component.mostrarErroresPartidas).toBe(false);
                expect(abrirCargarArchivoModalRealSpy).not.toHaveBeenCalled();
              });

              it('debe establecer mostrarErroresPartidas en true si partidasDelaMercanciaForm es inválido', () => {
                component.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.setValue('');
                component.validarYCargarArchivo();
                expect(component.mostrarErroresPartidas).toBe(true);
                expect(abrirCargarArchivoModalRealSpy).not.toHaveBeenCalled();
              });

              it('debe mostrar notificación si fraccion no está presente', () => {
                component.mercanciaForm.get('fraccion')?.setValue('');
                component.validarYCargarArchivo();
                expect(component.mostrarNotificacion).toBe(true);
                expect(component.nuevaNotificacion?.mensaje).toBe('Debes seleccionar una Fracción arancelaria');
                expect(abrirCargarArchivoModalRealSpy).not.toHaveBeenCalled();
              });

              it('debe marcar controles como touched y actualizar su validez', () => {
                const cantidadControl = component.mercanciaForm.get('cantidad');
                const valorFacturaUSDControl = component.mercanciaForm.get('valorFacturaUSD');
                const cantidadPartidasControl = component.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia');
                const valorPartidaUSDControl = component.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia');
                const descripcionControl = component.partidasDelaMercanciaForm.get('descripcionPartidasDeLaMercancia');

                jest.spyOn(cantidadControl!, 'markAsTouched');
                jest.spyOn(valorFacturaUSDControl!, 'markAsTouched');
                jest.spyOn(cantidadPartidasControl!, 'markAsTouched');
                jest.spyOn(valorPartidaUSDControl!, 'markAsTouched');
                jest.spyOn(descripcionControl!, 'markAsTouched');

                jest.spyOn(cantidadControl!, 'updateValueAndValidity');
                jest.spyOn(valorFacturaUSDControl!, 'updateValueAndValidity');
                jest.spyOn(cantidadPartidasControl!, 'updateValueAndValidity');
                jest.spyOn(valorPartidaUSDControl!, 'updateValueAndValidity');
                jest.spyOn(descripcionControl!, 'updateValueAndValidity');

                component.validarYCargarArchivo();

                expect(cantidadControl!.markAsTouched).toHaveBeenCalled();
                expect(valorFacturaUSDControl!.markAsTouched).toHaveBeenCalled();
                expect(cantidadPartidasControl!.markAsTouched).toHaveBeenCalled();
                expect(valorPartidaUSDControl!.markAsTouched).toHaveBeenCalled();
                expect(descripcionControl!.markAsTouched).toHaveBeenCalled();

                expect(cantidadControl!.updateValueAndValidity).toHaveBeenCalled();
                expect(valorFacturaUSDControl!.updateValueAndValidity).toHaveBeenCalled();
                expect(cantidadPartidasControl!.updateValueAndValidity).toHaveBeenCalled();
                expect(valorPartidaUSDControl!.updateValueAndValidity).toHaveBeenCalled();
                expect(descripcionControl!.updateValueAndValidity).toHaveBeenCalled();
              });

              describe('onPartidaModificada', () => {
                beforeEach(() => {
                  component.tableBodyData = [
                    { id: '1', cantidad: '10', descripcion: 'desc1', totalUSD: '100', unidadDeMedida: '', fraccionFrancelaria: '', precioUnitarioUSD: '' },
                    { id: '2', cantidad: '20', descripcion: 'desc2', totalUSD: '200', unidadDeMedida: '', fraccionFrancelaria: '', precioUnitarioUSD: '' }
                  ];
                  jest.spyOn(component, 'formularioTotalCount');
                });

                it('debe modificar la partida correspondiente y actualizar totales', () => {
                  const partidaModificada = { id: '1', cantidad: '15', descripcion: 'desc1-mod', totalUSD: '150', unidadDeMedida: '', fraccionFrancelaria: '', precioUnitarioUSD: '' };
                  component.onPartidaModificada(partidaModificada);

                  expect(component.tableBodyData).toEqual([
                    { id: '1', cantidad: '15', descripcion: 'desc1-mod', totalUSD: '150', unidadDeMedida: '', fraccionFrancelaria: '', precioUnitarioUSD: '' },
                    { id: '2', cantidad: '20', descripcion: 'desc2', totalUSD: '200', unidadDeMedida: '', fraccionFrancelaria: '', precioUnitarioUSD: '' }
                  ]);
                  expect(component.tramite130111Store.actualizarEstado).toHaveBeenCalledWith({ tableBodyData: component.tableBodyData });
                  expect(component.tramite130111Store.actualizarEstado).toHaveBeenCalledWith({
                    cantidadTotal: '35',
                    valorTotalUSD: '350'
                  });
                  expect(component.formularioTotalCount).toHaveBeenCalledWith('35', '350');
                });

                it('no debe modificar ninguna partida si el id no coincide', () => {
                  const partidaModificada = { id: '3', cantidad: '99', descripcion: 'desc3', totalUSD: '999', unidadDeMedida: '', fraccionFrancelaria: '', precioUnitarioUSD: '' };
                  const originalTable = [...component.tableBodyData];
                  component.onPartidaModificada(partidaModificada);

                  expect(component.tableBodyData).toEqual(originalTable);
                  expect(component.tramite130111Store.actualizarEstado).toHaveBeenCalledWith({ tableBodyData: originalTable });
                  expect(component.tramite130111Store.actualizarEstado).toHaveBeenCalledWith({
                    cantidadTotal: '30',
                    valorTotalUSD: '300'
                  });
                  expect(component.formularioTotalCount).toHaveBeenCalledWith('30', '300');
                });

                it('debe manejar correctamente si la tabla está vacía', () => {
                  component.tableBodyData = [];
                  const partidaModificada = { id: '1', cantidad: '10', descripcion: 'desc1', totalUSD: '100', unidadDeMedida: '', fraccionFrancelaria: '', precioUnitarioUSD: '' };
                  component.onPartidaModificada(partidaModificada);

                  expect(component.tableBodyData).toEqual([]);
                  expect(component.tramite130111Store.actualizarEstado).toHaveBeenCalledWith({ tableBodyData: [] });
                  expect(component.tramite130111Store.actualizarEstado).toHaveBeenCalledWith({
                    cantidadTotal: '0',
                    valorTotalUSD: '0'
                  });
                  expect(component.formularioTotalCount).toHaveBeenCalledWith('0', '0');
                });

                describe('manejarlaFilaSeleccionada', () => {
                  it('debe actualizar filaSeleccionada y llamar a actualizarEstado si filasSeleccionadas tiene elementos', () => {
                    const filas = [
                      { id: '1', cantidad: '10', descripcion: 'desc', totalUSD: '100', unidadDeMedida: '', fraccionFrancelaria: '', precioUnitarioUSD: '' }
                    ];
                    component.manejarlaFilaSeleccionada(filas);
                    expect(component.filaSeleccionada).toEqual(filas);
                    expect(mockStore.actualizarEstado).toHaveBeenCalledWith({ filaSeleccionada: filas });
                  });

                  it('debe establecer filaSeleccionada como [] y llamar a actualizarEstado si filasSeleccionadas está vacío', () => {
                    component.manejarlaFilaSeleccionada([]);
                    expect(component.filaSeleccionada).toEqual([]);
                    expect(mockStore.actualizarEstado).toHaveBeenCalledWith({ filaSeleccionada: [] });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});