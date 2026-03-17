import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';

import { SolicitudComponent } from './solicitud.component';
import { Tramite130115Store, Tramite130115State } from '../../../../estados/tramites/tramite130115.store';
import { Tramite130115Query } from '../../../../estados/queries/tramite130115.query';
import { ImportacionVehiculosNuevosService } from '../../services/importacion-vehiculos-nuevos.service';
import { ConsultaioQuery, Catalogo } from '@ng-mf/data-access-user';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';

// Mock Services
class MockHttpClient {
  post = jest.fn().mockReturnValue(of({}));
  get = jest.fn().mockReturnValue(of({}));
}

class MockTramite130115Store {
  actualizarEstado = jest.fn();
}

class MockTramite130115Query {
  selectSolicitud$ = of({
    solicitud: 'TISOL.I',
    regimen: '01',
    clasificacion: 'A1',
    producto: 'CONDMER.N',
    descripcion: 'Test description',
    fraccion: '8703210101',
    cantidad: '10',
    valorFacturaUSD: '1000',
    unidadMedida: '1',
    cantidadPartidasDeLaMercancia: '5',
    descripcionPartidasDeLaMercancia: 'Test partida',
    valorPartidaUSDPartidasDeLaMercancia: '500',
    cantidadTotal: '10',
    valorTotalUSD: '1000',
    bloque: 105,
    usoEspecifico: 'Test uso',
    justificacionImportacionExportacion: 'Test justification',
    observaciones: 'Test observations',
    entidad: '01',
    representacion: '001'
  });
  
  select = jest.fn().mockReturnValue(of([]));
  getValue = jest.fn().mockReturnValue({ tableBodyData: [] });
}

class MockImportacionVehiculosNuevosService {
  getSolicitudeOptions = jest.fn().mockReturnValue(of({ 
    options: [{ value: 'TISOL.I', label: 'Solicitud' }], 
    defaultSelect: 'TISOL.I' 
  }));
  
  getProductoOptions = jest.fn().mockReturnValue(of({ 
    options: [{ value: 'CONDMER.N', label: 'Producto' }] 
  }));
  
  getRegimenes = jest.fn().mockReturnValue(of([
    { id: 1, descripcion: 'Régimen 1' }
  ]));
  
  getRegimenClasificacion = jest.fn().mockReturnValue(of([
    { id: 1, descripcion: 'Clasificación A1' }
  ]));
  
  getFraccionCatalogoService = jest.fn().mockReturnValue(of([
    { id: 8703210101, clave: '8703.21.01.01', descripcion: 'Fracción test' }
  ]));
  
  getEntidadesFederativasCatalogo = jest.fn().mockReturnValue(of([
    { id: 1, descripcion: 'Entidad 1' }
  ]));
  
  getBloqueService = jest.fn().mockReturnValue(of([
    { id: 105, descripcion: 'Bloque 1' }
  ]));
  
  getPaisesPorBloqueService = jest.fn().mockReturnValue(of([
    { id: 1, descripcion: 'País 1' }
  ]));
  
  getUMTService = jest.fn().mockReturnValue(of([
    { id: 1, descripcion: 'Unidad 1' }
  ]));
  
  getRepresentacionFederalCatalogo = jest.fn().mockReturnValue(of([
    { id: 1, descripcion: 'Representación 1' }
  ]));
}

class MockConsultaioQuery {
  selectConsultaioState$ = of({ readonly: false });
}

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let mockTramite130115Store: MockTramite130115Store;
  let mockTramite130115Query: MockTramite130115Query;
  let mockImportacionVehiculosNuevosService: MockImportacionVehiculosNuevosService;
  let mockConsultaioQuery: MockConsultaioQuery;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudComponent],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: Tramite130115Store, useClass: MockTramite130115Store },
        { provide: Tramite130115Query, useClass: MockTramite130115Query },
        { provide: ImportacionVehiculosNuevosService, useClass: MockImportacionVehiculosNuevosService },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    
    mockTramite130115Store = TestBed.inject(Tramite130115Store) as any;
    mockTramite130115Query = TestBed.inject(Tramite130115Query) as any;
    mockImportacionVehiculosNuevosService = TestBed.inject(ImportacionVehiculosNuevosService) as any;
    mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as any;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize component properties', () => {
      expect(component.idPedimento).toBe('130115');
      expect(component.mostrarTabla).toBe(true);
      expect(component.tableBodyData).toEqual([]);
      expect(component.filaSeleccionada).toEqual([]);
      expect(component.esFormularioSoloLectura).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      jest.spyOn(component, 'inicializarEstadoFormulario').mockImplementation(() => {});
      jest.spyOn(component, 'opcionesDeBusqueda').mockImplementation(() => {});
      jest.spyOn(component, 'fetchEntidadFederativa').mockImplementation(() => {});
      jest.spyOn(component, 'listaDePaisesDisponibles').mockImplementation(() => {});
      jest.spyOn(component, 'getRegimenes').mockImplementation(() => {});
      jest.spyOn(component, 'getFraccionCatalogo').mockImplementation(() => {});
      jest.spyOn(component, 'enCambioDeBloque').mockImplementation(() => {});
    });

    it('should call all initialization methods', () => {
      component.ngOnInit();

      expect(mockTramite130115Store.actualizarEstado).toHaveBeenCalledWith({
        solicitud: 'TISOL.I',
        producto: 'CONDMER.N',
        defaultSelect: 'TISOL.I',
        defaultProducto: 'CONDMER.N'
      });
      expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
      expect(component.opcionesDeBusqueda).toHaveBeenCalled();
      expect(component.fetchEntidadFederativa).toHaveBeenCalled();
      expect(component.listaDePaisesDisponibles).toHaveBeenCalled();
      expect(component.getRegimenes).toHaveBeenCalled();
      expect(component.getFraccionCatalogo).toHaveBeenCalled();
      expect(component.enCambioDeBloque).toHaveBeenCalledWith(105);
    });
  });

  describe('Form Initialization', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should initialize formDelTramite with correct validators', () => {
      expect(component.formDelTramite).toBeDefined();
      expect(component.formDelTramite.get('solicitud')?.hasError('required')).toBe(false);
      expect(component.formDelTramite.get('regimen')?.hasError('required')).toBe(false);
      expect(component.formDelTramite.get('clasificacion')?.hasError('required')).toBe(false);
    });

    it('should initialize mercanciaForm with correct validators', () => {
      expect(component.mercanciaForm).toBeDefined();
      expect(component.mercanciaForm.get('descripcion')?.hasError('required')).toBe(false);
      expect(component.mercanciaForm.get('fraccion')?.hasError('required')).toBe(false);
      expect(component.mercanciaForm.get('cantidad')?.hasError('required')).toBe(false);
      expect(component.mercanciaForm.get('valorFacturaUSD')?.hasError('required')).toBe(false);
      expect(component.mercanciaForm.get('unidadMedida')?.hasError('required')).toBe(false);
    });

    it('should initialize partidasDelaMercanciaForm with correct validators', () => {
      expect(component.partidasDelaMercanciaForm).toBeDefined();
      expect(component.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.hasError('required')).toBe(false);
      expect(component.partidasDelaMercanciaForm.get('descripcionPartidasDeLaMercancia')?.hasError('required')).toBe(false);
      expect(component.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')?.hasError('required')).toBe(false);
    });
  });

  describe('Service Methods', () => {
    it('should get regimenes and call getClasificacionRegimen', () => {
      jest.spyOn(component, 'getClasificacionRegimen').mockImplementation(() => {});
      
      component.getRegimenes();
      
      expect(mockImportacionVehiculosNuevosService.getRegimenes).toHaveBeenCalledWith('130115');
      expect(component.getClasificacionRegimen).toHaveBeenCalled();
    });

    it('should get clasificacion regimen', () => {
      component.getClasificacionRegimen();
      
      expect(mockImportacionVehiculosNuevosService.getRegimenClasificacion).toHaveBeenCalledWith('130115', '01');
    });

    it('should get fraccion catalogo', () => {
      component.getFraccionCatalogo();
      
      expect(mockImportacionVehiculosNuevosService.getFraccionCatalogoService).toHaveBeenCalledWith('130115');
    });

    it('should fetch entidad federativa', () => {
      component.fetchEntidadFederativa();
      
      expect(mockImportacionVehiculosNuevosService.getEntidadesFederativasCatalogo).toHaveBeenCalledWith('130115');
    });

    it('should get lista de paises disponibles', () => {
      component.listaDePaisesDisponibles();
      
      expect(mockImportacionVehiculosNuevosService.getBloqueService).toHaveBeenCalledWith('130115');
    });

    it('should fetch paises por bloque', () => {
      component.fetchPaisesPorBloque(105);
      
      expect(mockImportacionVehiculosNuevosService.getPaisesPorBloqueService).toHaveBeenCalledWith('130115', '105');
    });
  });

  describe('Form Validation Methods', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should validate numero tres decimales - valid number', () => {
      const control = { value: '10.123' } as AbstractControl;
      const result = SolicitudComponent.validarNumeroTresDecimales(control);
      expect(result).toBeNull();
    });

    it('should validate numero tres decimales - invalid with more than 3 decimals', () => {
      const control = { value: '10.1234' } as AbstractControl;
      const result = SolicitudComponent.validarNumeroTresDecimales(control);
      expect(result).toEqual({ maximoTresDecimales: true });
    });

    it('should validate numero tres decimales - invalid non-numeric', () => {
      const control = { value: 'abc' } as AbstractControl;
      const result = SolicitudComponent.validarNumeroTresDecimales(control);
      expect(result).toEqual({ noEsNumero: true });
    });

    it('should validate sin caracter angulo derecho - valid string', () => {
      const control = { value: 'valid text' } as AbstractControl;
      const result = SolicitudComponent.validarSinCaracterAnguloDerecho(control);
      expect(result).toBeNull();
    });

    it('should validate sin caracter angulo derecho - invalid with forbidden characters', () => {
      const control = { value: 'text with › character' } as AbstractControl;
      const result = SolicitudComponent.validarSinCaracterAnguloDerecho(control);
      expect(result).toEqual({ validarSinCaracterAnguloDerecho: true });
    });

    it('should validate catorce enteros tres decimales - valid number', () => {
      const control = { value: '12345678901234.123' } as AbstractControl;
      const result = SolicitudComponent.validarCatorceEnterosTresDecimales(control);
      expect(result).toBeNull();
    });

    it('should validate catorce enteros tres decimales - invalid format', () => {
      const control = { value: '123456789012345.1234' } as AbstractControl;
      const result = SolicitudComponent.validarCatorceEnterosTresDecimales(control);
      expect(result).toEqual({ validarCatorceEnterosTresDecimales: true });
    });
  });

  describe('Form Interaction Methods', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should handle fila seleccionada', () => {
      const filas: PartidasDeLaMercanciaModelo[] = [
        {
          id: '1',
          cantidad: '10',
          descripcion: 'Test',
          totalUSD: '100',
          unidadDeMedida: 'pza',
          fraccionFrancelaria: '8703210101',
          precioUnitarioUSD: '10'
        }
      ];

      component.manejarlaFilaSeleccionada(filas);

      expect(component.filaSeleccionada).toEqual(filas);
      expect(mockTramite130115Store.actualizarEstado).toHaveBeenCalledWith({
        filaSeleccionada: filas
      });
    });

    it('should handle modificar partida seleccionada', () => {
      const partida: PartidasDeLaMercanciaModelo = {
        id: '1',
        cantidad: '10',
        descripcion: 'Test description',
        totalUSD: '100',
        unidadDeMedida: 'pza',
        fraccionFrancelaria: '8703210101',
        precioUnitarioUSD: '10'
      };

      component.onModificarPartidaSeleccionada(partida);

      expect(component.modificarPartidasDelaMercanciaForm.value).toEqual({
        cantidadPartidasDeLaMercancia: '10',
        descripcionPartidasDeLaMercancia: 'Test description',
        valorPartidaUSDPartidasDeLaMercancia: '100'
      });
    });

    it('should handle fechas seleccionadas change', () => {
      const fechas = ['2023-01-01', '2023-01-02'];

      component.onFechasSeleccionadasChange(fechas);

      expect(mockTramite130115Store.actualizarEstado).toHaveBeenCalledWith({
        fechasSeleccionadas: fechas
      });
    });
  });

  describe('Form Validation and Submission', () => {
    beforeEach(() => {
      component.ngOnInit();
      
      // Initialize catalogs that are used in validarYEnviarFormulario
      component.unidadCatalogo = [
        { id: 1, descripcion: 'Unidad 1' },
        { id: 2, descripcion: 'Unidad 2' }
      ];
      
      component.fraccionCatalogo = [
        { id: 8703210101, clave: '8703.21.01.01', descripcion: 'Fracción test' },
        { id: 8703210102, clave: '8703.21.01.02', descripcion: 'Fracción test 2' }
      ];
      
      // Set up valid form values
      component.mercanciaForm.patchValue({
        cantidad: '10',
        valorFacturaUSD: '1000',
        fraccion: '8703210101',
        unidadMedida: '1'
      });
      component.partidasDelaMercanciaForm.patchValue({
        cantidadPartidasDeLaMercancia: '5',
        valorPartidaUSDPartidasDeLaMercancia: '500',
        descripcionPartidasDeLaMercancia: 'Test description'
      });
    });

    it('should validate and submit form successfully', () => {
      jest.spyOn(component.partidasDelaMercanciaForm, 'reset').mockImplementation(() => {});
      
      component.validarYEnviarFormulario();

      expect(component.mostrarErroresMercancia).toBe(false);
      expect(component.mostrarErroresPartidas).toBe(false);
      expect(component.partidasDelaMercanciaForm.reset).toHaveBeenCalled();
      expect(mockTramite130115Store.actualizarEstado).toHaveBeenCalled();
    });

    it('should show mercancia errors when form is invalid', () => {
      component.mercanciaForm.patchValue({
        cantidad: '',
        valorFacturaUSD: ''
      });

      component.validarYEnviarFormulario();

      expect(component.mostrarErroresMercancia).toBe(true);
      expect(component.mostrarErroresPartidas).toBe(false);
    });

    it('should show partidas errors when form is invalid', () => {
      component.partidasDelaMercanciaForm.patchValue({
        cantidadPartidasDeLaMercancia: '',
        valorPartidaUSDPartidasDeLaMercancia: ''
      });

      component.validarYEnviarFormulario();

      expect(component.mostrarErroresPartidas).toBe(true);
    });

    it('should show notification when fraccion is not selected', () => {
      component.mercanciaForm.patchValue({ fraccion: '' });

      component.validarYEnviarFormulario();

      expect(component.mostrarNotificacion).toBe(true);
      expect(component.nuevaNotificacion.mensaje).toBe('Debes seleccionar una Fracción arancelaria');
    });
  });

  describe('Store Value Updates', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should update store values for regimen field', () => {
      const event = {
        form: component.formDelTramite,
        campo: 'regimen'
      };
      component.formDelTramite.patchValue({ regimen: '02' });

      component.setValoresStore(event);

      expect(mockTramite130115Store.actualizarEstado).toHaveBeenCalledWith({
        regimen: '02',
        clasificacion: ''
      });
      expect(component.formDelTramite.get('clasificacion')?.value).toBe('');
    });

    it('should update store values for fraccion field', () => {
      const event = {
        form: component.mercanciaForm,
        campo: 'fraccion'
      };
      component.mercanciaForm.patchValue({ fraccion: '8703210101' });
      jest.spyOn(component, 'getUnidadesMedidaTarifaria').mockImplementation(() => {});

      component.setValoresStore(event);

      expect(component.mercanciaForm.get('unidadMedida')?.value).toBe('1');
      expect(component.getUnidadesMedidaTarifaria).toHaveBeenCalledWith('06011008');
    });

    it('should update store values for entidad field', () => {
      const event = {
        form: component.frmRepresentacionForm,
        campo: 'entidad'
      };
      component.frmRepresentacionForm.patchValue({ entidad: '01' });
      jest.spyOn(component, 'getRepresentacionFederalCatalogo').mockImplementation(() => {});

      component.setValoresStore(event);

      expect(component.getRepresentacionFederalCatalogo).toHaveBeenCalledWith('01');
    });
  });

  describe('Utility Methods', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return true when no rows are selected for disabledModificar', () => {
      component.filaSeleccionada = [];

      const result = component.disabledModificar();

      expect(result).toBe(true);
    });

    it('should return false when rows are selected for disabledModificar', () => {
      component.filaSeleccionada = [{
        id: '1',
        cantidad: '10',
        descripcion: 'Test',
        totalUSD: '100',
        unidadDeMedida: 'pza',
        fraccionFrancelaria: '8703210101',
        precioUnitarioUSD: '10'
      }];

      const result = component.disabledModificar();

      expect(result).toBe(false);
    });

    it('should handle en cambio de bloque', () => {
      jest.spyOn(component, 'fetchPaisesPorBloque').mockImplementation(() => {});

      component.enCambioDeBloque(105);

      expect(component.fetchPaisesPorBloque).toHaveBeenCalledWith(105);
    });
  });

  describe('Data Management', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.tableBodyData = [
        {
          id: '1',
          cantidad: '10',
          descripcion: 'Test 1',
          totalUSD: '100',
          unidadDeMedida: 'pza',
          fraccionFrancelaria: '8703210101',
          precioUnitarioUSD: '10'
        },
        {
          id: '2',
          cantidad: '5',
          descripcion: 'Test 2',
          totalUSD: '50',
          unidadDeMedida: 'pza',
          fraccionFrancelaria: '8703210101',
          precioUnitarioUSD: '10'
        }
      ];
    });

    it('should handle partidas eliminadas', () => {
      const idsToDelete = ['1'];

      component.onPartidasEliminadas(idsToDelete);

      expect(component.tableBodyData.length).toBe(1);
      expect(component.tableBodyData[0].id).toBe('2');
      expect(mockTramite130115Store.actualizarEstado).toHaveBeenCalled();
    });

    it('should handle partida modificada', () => {
      const partidaModificada: PartidasDeLaMercanciaModelo = {
        id: '1',
        cantidad: '15',
        descripcion: 'Modified Test 1',
        totalUSD: '150',
        unidadDeMedida: 'pza',
        fraccionFrancelaria: '8703210101',
        precioUnitarioUSD: '10'
      };

      component.onPartidaModificada(partidaModificada);

      expect(component.tableBodyData[0].cantidad).toBe('15');
      expect(component.tableBodyData[0].descripcion).toBe('Modified Test 1');
      expect(component.tableBodyData[0].totalUSD).toBe('150');
      expect(mockTramite130115Store.actualizarEstado).toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should validate all forms and return false when forms are invalid', () => {
      component.formDelTramite.patchValue({ solicitud: '' });
      component.mercanciaForm.patchValue({ descripcion: '' });
      component.tableBodyData = [];

      const result = component.validarFormulario();

      expect(result).toBe(false);
      expect(component.isInvalidaPartidas).toBe(true);
    });

    it('should validate all forms and return true when forms are valid', () => {
      component.formDelTramite.patchValue({
        solicitud: 'TISOL.I',
        regimen: '01',
        clasificacion: 'A1'
      });
      component.mercanciaForm.patchValue({
        producto: 'CONDMER.N',
        descripcion: 'Valid description',
        fraccion: '8703210101',
        cantidad: '10',
        valorFacturaUSD: '1000',
        unidadMedida: '1'
      });
      component.tableBodyData = [{
        id: '1',
        cantidad: '10',
        descripcion: 'Test',
        totalUSD: '100',
        unidadDeMedida: 'pza',
        fraccionFrancelaria: '8703210101',
        precioUnitarioUSD: '10'
      }];
      component.paisForm.patchValue({
        bloque: 105,
        usoEspecifico: 'Test uso',
        justificacionImportacionExportacion: 'Test justification'
      });
      component.frmRepresentacionForm.patchValue({
        entidad: '01',
        representacion: '001'
      });

      const result = component.validarFormulario();

      expect(result).toBe(true);
      expect(component.isInvalidaPartidas).toBe(false);
    });
  });

  describe('Component Lifecycle', () => {
    it('should clean up subscriptions on destroy', () => {
      const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
      const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

      component.ngOnDestroy();

      expect(destroyedSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Options and Catalog Loading', () => {
    it('should load solicitude options', () => {
      component.opcionesDeBusqueda();

      expect(mockImportacionVehiculosNuevosService.getSolicitudeOptions).toHaveBeenCalled();
      expect(mockImportacionVehiculosNuevosService.getProductoOptions).toHaveBeenCalled();
    });

    it('should get unidades medida tarifaria', () => {
      component.getUnidadesMedidaTarifaria('8703210101');

      expect(mockImportacionVehiculosNuevosService.getUMTService).toHaveBeenCalledWith('130115', '8703210101');
    });

    it('should get representacion federal catalogo', () => {
      component.getRepresentacionFederalCatalogo('01');

      expect(mockImportacionVehiculosNuevosService.getRepresentacionFederalCatalogo).toHaveBeenCalledWith('130115', '01');
    });
  });

});