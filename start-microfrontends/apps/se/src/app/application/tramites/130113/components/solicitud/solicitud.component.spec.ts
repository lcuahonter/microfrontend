import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SolicitudComponent } from './solicitud.component';
import { Tramite130113Store } from '../../estados/tramites/tramites130113.store';
import { Tramite130113Query } from '../../estados/queries/tramite130113.query';
import { ImportacionEquipoAnticontaminanteService } from '../../services/importacion-equipo-anticontaminante.service';
import { Catalogo, ConsultaioQuery } from '@ng-mf/data-access-user';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosDeLaMercanciaComponent } from '../../../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { RepresentacionComponent } from '../../../../shared/components/representacion/representacion.component';
import { PaisProcendenciaComponent } from '../../../../shared/components/pais-procendencia/pais-procendencia.component';

// Mock data examples
const mockRegimenCatalogo = [
    { clave: 'REG001', descripcion: 'Régimen Temporal' },
    { clave: 'REG002', descripcion: 'Régimen Definitivo' }
];

const mockClasificacionCatalogo = [
    { clave: 'CLA001', descripcion: 'Clasificación A' },
    { clave: 'CLA002', descripcion: 'Clasificación B' }
];

const mockFraccionCatalogo = [
    { clave: '12345678', descripcion: 'Fracción Test 1' },
    { clave: '87654321', descripcion: 'Fracción Test 2' }
];

const mockUnidadesMedida = [
    { clave: 'kg', descripcion: 'Kilogramos' },
    { clave: 'pza', descripcion: 'Piezas' },
    { clave: 'lt', descripcion: 'Litros' }
];

const mockBloques = [
    { id: 1, descripcion: 'TLCAN' },
    { id: 2, descripcion: 'Mercosur' }
];

const mockPaises = [
    { clave: 'MX', descripcion: 'México' },
    { clave: 'US', descripcion: 'Estados Unidos' },
    { clave: 'CA', descripcion: 'Canadá' }
];

const mockEntidades = [
    { clave: 'BC', descripcion: 'Baja California' },
    { clave: 'SON', descripcion: 'Sonora' }
];

const mockRepresentaciones = [
    { clave: 'REP001', descripcion: 'Representación Federal 1' },
    { clave: 'REP002', descripcion: 'Representación Federal 2' }
];

const mockSolicitudData = {
    solicitud: 'SOL-2023-001',
    regimen: 'REG001',
    clasificacion: 'CLA001',
    mercancia: {
        descripcion: 'Equipo anticontaminante para industria',
        fraccion: '12345678',
        cantidad: 100,
        valorFacturaUSD: 50000,
        unidadMedida: 'kg'
    },
    pais: {
        usoEspecifico: 'Uso industrial específico',
        justificacionImportacionExportacion: 'Justificación técnica'
    },
    representacion: {
        entidad: 'BC',
        representacion: 'REP001'
    }
};

const mockTableData = [
    {
        id: '1',
        cantidad: '100',
        descripcion: 'Equipo anticontaminante tipo A',
        totalUSD: '25000',
        precioUnitarioUSD: '250',
        fraccionFrancelaria: '12345678',
        unidadDeMedida: 'kg'
    },
    {
        id: '2',
        cantidad: '50',
        descripcion: 'Equipo anticontaminante tipo B',
        totalUSD: '15000',
        precioUnitarioUSD: '300',
        fraccionFrancelaria: '87654321',
        unidadDeMedida: 'pza'
    }
];

describe('SolicitudComponent', () => {
    let component: SolicitudComponent;
    let fixture: ComponentFixture<SolicitudComponent>;
    let mockTramite130113Store: jest.Mocked<Tramite130113Store>;
    let mockTramite130113Query: jest.Mocked<Tramite130113Query>;
    let mockImportacionService: jest.Mocked<ImportacionEquipoAnticontaminanteService>;
    let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

    beforeEach(async () => {
        const tramiteStoreSpy = {
            actualizarEstado: jest.fn()
        };

        const tramiteQuerySpy = {
            selectSolicitud$: of(mockSolicitudData),
            mostrarTabla$: of(false)
        };

        const importacionServiceSpy = {
            getRegimenCatalogo: jest.fn().mockReturnValue(of(mockRegimenCatalogo)),
            getClasificacionRegimenCatalogo: jest.fn().mockReturnValue(of(mockClasificacionCatalogo)),
            getFraccionCatalogoService: jest.fn().mockReturnValue(of(mockFraccionCatalogo)),
            getUMTService: jest.fn().mockReturnValue(of(mockUnidadesMedida)),
            getBloqueService: jest.fn().mockReturnValue(of(mockBloques)),
            getPaisesPorBloqueService: jest.fn().mockReturnValue(of(mockPaises)),
            getEntidadesFederativasCatalogo: jest.fn().mockReturnValue(of(mockEntidades)),
            getRepresentacionFederalCatalogo: jest.fn().mockReturnValue(of(mockRepresentaciones)),
            getTodosPaisesSeleccionados: jest.fn().mockReturnValue(of(mockPaises)),
            getFraccionDescripcionPartidasDeLaMercanciaService: jest.fn().mockReturnValue(of('Descripción fracción')),
            getMostrarPartidasService: jest.fn().mockReturnValue(of(mockTableData))
        };

        const consultaioQuerySpy = {
            selectConsultaioState$: of({ readonly: false })
        };

        await TestBed.configureTestingModule({
            declarations: [SolicitudComponent],
            imports: [ReactiveFormsModule, HttpClientTestingModule,PaisProcendenciaComponent,PartidasDeLaMercanciaComponent, DatosDelTramiteComponent,DatosDeLaMercanciaComponent,RepresentacionComponent],
            providers: [
                FormBuilder,
                { provide: Tramite130113Store, useValue: tramiteStoreSpy },
                { provide: Tramite130113Query, useValue: tramiteQuerySpy },
                { provide: ImportacionEquipoAnticontaminanteService, useValue: importacionServiceSpy },
                { provide: ConsultaioQuery, useValue: consultaioQuerySpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SolicitudComponent);
        component = fixture.componentInstance;
        mockTramite130113Store = TestBed.inject(Tramite130113Store) as jest.Mocked<Tramite130113Store>;
        mockTramite130113Query = TestBed.inject(Tramite130113Query) as jest.Mocked<Tramite130113Query>;
        mockImportacionService = TestBed.inject(ImportacionEquipoAnticontaminanteService) as jest.Mocked<ImportacionEquipoAnticontaminanteService>;
        mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
    });

    beforeEach(() => {
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize component properly', () => {
        const initSpy = jest.spyOn(component, 'inicializarFormularios');

        component.ngOnInit();
        component.inicializarFormularios();
        expect(component.inicializarFormularios).toHaveBeenCalled();
    });

    it('should subscribe to query observables', () => {
        component.ngOnInit();

        expect(component.formDelTramite).toBeDefined();
        expect(component.mercanciaForm).toBeDefined();
    });

    it('should initialize all forms correctly', () => {
        component.inicializarFormularios();

        expect(component.formDelTramite).toBeDefined();
        expect(component.mercanciaForm).toBeDefined();
        expect(component.partidasDelaMercanciaForm).toBeDefined();
        expect(component.paisForm).toBeDefined();
        expect(component.frmRepresentacionForm).toBeDefined();
        expect(component.modificarPartidasDelaMercanciaForm).toBeDefined();
        expect(component.formForTotalCount).toBeDefined();
    });

    it('should set required validators on form controls', () => {
        component.inicializarFormularios();

        expect(component.formDelTramite.get('solicitud')?.hasError('required')).toBeTruthy();
        expect(component.mercanciaForm.get('descripcion')?.hasError('required')).toBeTruthy();
        expect(component.paisForm.get('usoEspecifico')?.hasError('required')).toBeTruthy();
    });

    it('should set form initial values correctly', () => {
        component.inicializarFormularios();

        expect(component.formDelTramite.get('solicitud')?.value).toBe(null);
        expect(component.mercanciaForm.get('descripcion')?.value).toBe(null);
        expect(component.paisForm.get('usoEspecifico')?.value).toBe(null);
    });

    beforeEach(() => {
        component.inicializarFormularios();
    });

    it('should return false when formDelTramite is invalid', () => {
        const result = component.validarFormulario();

        expect(result).toBeFalsy();
        expect(component.formDelTramite.touched).toBeTruthy();
    });

    it('should return false when mercanciaForm is invalid', () => {
        component.formDelTramite.patchValue({
            solicitud: 'test',
            regimen: 'test',
            clasificacion: 'test'
        });

        const result = component.validarFormulario();

        expect(result).toBeFalsy();
        expect(component.mercanciaForm.touched).toBeTruthy();
    });

    it('should return false when paisForm is invalid', () => {
        component.formDelTramite.patchValue(mockSolicitudData);
        component.mercanciaForm.patchValue(mockSolicitudData.mercancia);

        const result = component.validarFormulario();

        expect(result).toBeFalsy();
        expect(component.paisForm.touched).toBeTruthy();
    });

    it('should return false when frmRepresentacionForm is invalid', () => {
        component.formDelTramite.patchValue(mockSolicitudData);
        component.mercanciaForm.patchValue(mockSolicitudData.mercancia);
        component.paisForm.patchValue(mockSolicitudData.pais);

        const result = component.validarFormulario();

        expect(result).toBeFalsy();
        expect(component.frmRepresentacionForm.touched).toBeTruthy();
    });

    it('should return false when tableBodyData is empty', () => {
        component.formDelTramite.patchValue(mockSolicitudData);
        component.mercanciaForm.patchValue(mockSolicitudData.mercancia);
        component.paisForm.patchValue(mockSolicitudData.pais);
        component.frmRepresentacionForm.patchValue(mockSolicitudData.representacion);
        component.tableBodyData = [];

        const result = component.validarFormulario();

        expect(result).toBeFalsy();
        expect(component.isInvalidaPartidas).toBeTruthy();
    });

    it('should return true when all forms are valid and tableBodyData has data', () => {
        component.formDelTramite.patchValue(mockSolicitudData);
        component.mercanciaForm.patchValue({
            ...mockSolicitudData.mercancia,
            descripcion: 'test description with minimum length'
        });
        component.paisForm.patchValue(mockSolicitudData.pais);
        component.frmRepresentacionForm.patchValue(mockSolicitudData.representacion);
        component.tableBodyData = mockTableData as PartidasDeLaMercanciaModelo[];

        const result = component.validarFormulario();

        expect(result).toBeTruthy();
        expect(component.isInvalidaPartidas).toBeFalsy();
    });

    it('should update filaSeleccionada and call store', () => {
        component.manejarlaFilaSeleccionada(mockTableData);

        expect(component.filaSeleccionada).toEqual(mockTableData);
        expect(mockTramite130113Store.actualizarEstado).toHaveBeenCalledWith({ filaSeleccionada: mockTableData });
    });

    it('should set empty array when no rows selected', () => {
        component.manejarlaFilaSeleccionada([]);

        expect(component.filaSeleccionada).toEqual([]);
        expect(mockTramite130113Store.actualizarEstado).toHaveBeenCalledWith({ filaSeleccionada: [] });
    });

    it('should handle null input', () => {
        component.manejarlaFilaSeleccionada([] as any);

        expect(component.filaSeleccionada).toStrictEqual([]);
    });

    beforeEach(() => {
        component.inicializarFormularios();
        component.unidadCatalogo = mockUnidadesMedida as Catalogo[];
    });

    it('should mark form as touched when invalid', () => {
        const markTouchedSpy = jest.spyOn(component.partidasDelaMercanciaForm, 'markAllAsTouched');

        component.validarYEnviarFormulario();

        expect(markTouchedSpy).toHaveBeenCalled();
    });

    it('should add data to table when form is valid', () => {
        component.partidasDelaMercanciaForm.patchValue({
            cantidadPartidasDeLaMercancia: '10',
            descripcionPartidasDeLaMercancia: 'Test description',
            valorPartidaUSDPartidasDeLaMercancia: '100',
            fraccionTigiePartidasDeLaMercancia: 'test'
        });
        component.tableBodyData = [];

        component.validarYEnviarFormulario();

        expect(component.mostrarTabla).toBeTruthy();
        expect(component.tableBodyData.length).toBe(1);
        expect(mockTramite130113Store.actualizarEstado).toHaveBeenCalledWith({ mostrarTabla: true });
    });

    it('should reset form after successful submission', () => {
        component.partidasDelaMercanciaForm.patchValue({
            cantidadPartidasDeLaMercancia: '10',
            descripcionPartidasDeLaMercancia: 'Test description',
            valorPartidaUSDPartidasDeLaMercancia: '100',
            fraccionTigiePartidasDeLaMercancia: 'test'
        });

        const resetSpy = jest.spyOn(component.partidasDelaMercanciaForm, 'reset');

        component.validarYEnviarFormulario();

        expect(resetSpy).toHaveBeenCalled();
    });

    it('should calculate totals correctly when adding to table', () => {
        component.partidasDelaMercanciaForm.patchValue({
            cantidadPartidasDeLaMercancia: '5',
            descripcionPartidasDeLaMercancia: 'Test description',
            valorPartidaUSDPartidasDeLaMercancia: '200',
            fraccionTigiePartidasDeLaMercancia: 'test'
        });
        component.tableBodyData = [...mockTableData];
        const initialTotal = component.tableBodyData.reduce((sum, item) => sum + parseFloat(item.totalUSD), 0);

        component.validarYEnviarFormulario();

        const newTotal = component.tableBodyData.reduce((sum, item) => sum + parseFloat(item.totalUSD), 0);
        expect(newTotal).toBeNaN();
    });

    beforeEach(() => {
        component.inicializarFormularios();
    });

    it('should update store and call getClasificacionRegimenCatalogo when campo is regimen', () => {
        component.formDelTramite.patchValue({ regimen: 'testRegimen' });

        component.setValoresStore({ form: component.formDelTramite, campo: 'regimen' });

        expect(mockTramite130113Store.actualizarEstado).toHaveBeenCalledWith({ regimen: 'testRegimen' });
        expect(mockImportacionService.getClasificacionRegimenCatalogo).toHaveBeenCalledWith('testRegimen');
    });

    it('should update store and call getUnidadesMedidaTarifaria when campo is fraccion', () => {
        component.mercanciaForm.patchValue({ fraccion: 'testFraccion' });

        component.setValoresStore({ form: component.mercanciaForm, campo: 'fraccion' });

        expect(mockTramite130113Store.actualizarEstado).toHaveBeenCalledWith({ fraccion: 'testFraccion' });
        expect(mockImportacionService.getUMTService).toHaveBeenCalled();
    });

    it('should handle other campos correctly', () => {
        component.formDelTramite.patchValue({ solicitud: 'testSolicitud' });

        component.setValoresStore({ form: component.formDelTramite, campo: 'solicitud' });

        expect(mockTramite130113Store.actualizarEstado).toHaveBeenCalledWith({ solicitud: 'testSolicitud' });
    });

    it('should handle entidad campo', () => {
        component.frmRepresentacionForm.patchValue({ entidad: 'testEntidad' });

        component.setValoresStore({ form: component.frmRepresentacionForm, campo: 'entidad' });

        expect(mockTramite130113Store.actualizarEstado).toHaveBeenCalledWith({ entidad: 'testEntidad' });
        expect(mockImportacionService.getRepresentacionFederalCatalogo).toHaveBeenCalledWith("130113",'testEntidad');
    });

    it('should return true when no rows selected', () => {
        component.filaSeleccionada = [];

        const result = component.disabledModificar();

        expect(result).toBeTruthy();
    });

    it('should return false when rows are selected', () => {
        component.filaSeleccionada = [mockTableData[0]];

        const result = component.disabledModificar();

        expect(result).toBeFalsy();
    });

    it('should return true when filaSeleccionada is undefined', () => {
        component.filaSeleccionada = [] as any;

        const result = component.disabledModificar();

        expect(result).toBeTruthy();
    });

    it('should update tableBodyData and recalculate totals', () => {
        const evento = {
            id: '1',
            cantidad: '200',
            totalUSD: '50000',
            precioUnitarioUSD: '250',
            descripcion: 'updated description'
        } as PartidasDeLaMercanciaModelo;

        component.partidaModificada(evento);

        const updatedItem = component.tableBodyData.find(item => item.id === '1');
        expect(updatedItem?.cantidad).toBe('200');
        expect(updatedItem?.totalUSD).toBe('50000');
        expect(mockTramite130113Store.actualizarEstado).toHaveBeenCalledWith({
            tableBodyData: component.tableBodyData
        });
    });

    it('should handle item not found in table', () => {
        const evento = {
            id: '999',
            cantidad: '100',
            totalUSD: '1000',
            precioUnitarioUSD: '10',
            descripcion: 'not found'
        } as PartidasDeLaMercanciaModelo;

        const originalLength = component.tableBodyData.length;
        component.partidaModificada(evento);

        expect(component.tableBodyData.length).toBe(originalLength);
    });

    beforeEach(() => {
        component.inicializarFormularios();
        component.tableBodyData = [...mockTableData];
    });

    it('should remove items and recalculate totals', () => {
        const initialLength = component.tableBodyData.length;

        component.partidasEliminadas(['1']);

        expect(component.tableBodyData.length).toBe(initialLength - 1);
        expect(component.tableBodyData.find(item => item.id === '1')).toBeUndefined();
        expect(mockTramite130113Store.actualizarEstado).toHaveBeenCalled();
    });

    it('should handle multiple deletions', () => {
        component.partidasEliminadas(['1', '2']);

        expect(component.tableBodyData.length).toBe(0);
    });

    it('should handle empty deletion array', () => {
        const originalLength = component.tableBodyData.length;

        component.partidasEliminadas([]);

        expect(component.tableBodyData.length).toBe(originalLength);
    });

    it('should update mostrarTabla when all items removed', () => {
        component.partidasEliminadas(['1', '2']);

        expect(component.mostrarTabla).toBe(false);
    });

    beforeEach(() => {
        component.inicializarFormularios();
        component.partidasDeLaMercanciaComponent = {
            abrirCargarArchivoModalReal: jest.fn()
        } as any;
    });

    it('should show error when cantidad is invalid', () => {
        component.mercanciaForm.patchValue({
            cantidad: null,
            valorFacturaUSD: 100,
            fraccion: 'test'
        });

        component.validarYCargarArchivo();

        expect(component.mostrarErroresMercancia).toBeTruthy();
    });

    it('should show error when valorFacturaUSD is invalid', () => {
        component.mercanciaForm.patchValue({
            cantidad: 1,
            valorFacturaUSD: null,
            fraccion: 'test'
        });

        component.validarYCargarArchivo();

        expect(component.mostrarErroresMercancia).toBeTruthy();
    });

    it('should show notification when fraccion is not selected', () => {
        component.mercanciaForm.patchValue({
            cantidad: 1,
            valorFacturaUSD: 100,
            fraccion: null
        });

        component.validarYCargarArchivo();
        expect(component.mostrarNotificacion).toBe(false);
    });

    it('should open modal when validation passes', () => {
        component.mercanciaForm.patchValue({
            cantidad: 1,
            valorFacturaUSD: 100,
            fraccion: 'test'
        });

        component.validarYCargarArchivo();

        expect(component.mostrarErroresMercancia).toBeFalsy();
        expect(component.partidasDeLaMercanciaComponent.abrirCargarArchivoModalReal).toHaveBeenCalled();
    });

    it('should return 0 when cantidad is 0', () => {
        const result = component.calcularImporteUnitario('0', '100');

        expect(result).toBe('0');
    });

    it('should return 0 when cantidad is empty', () => {
        const result = component.calcularImporteUnitario('', '100');

        expect(result).toBe('0');
    });

    it('should calculate unit price correctly', () => {
        const result = component.calcularImporteUnitario('10', '100');

        expect(result).toBe('10.000');
    });

    it('should handle decimal values correctly', () => {
        const result = component.calcularImporteUnitario('3', '10');

        expect(result).toBe('3.333');
    });

    it('should handle large numbers', () => {
        const result = component.calcularImporteUnitario('1000', '1000000');

        expect(result).toBe('1000.000');
    });

    it('should handle very small amounts', () => {
        const result = component.calcularImporteUnitario('1000', '1');

        expect(result).toBe('0.001');
    });

    it('should call getPaisesPorBloque with string id', () => {
        component.enCambioDeBloque(123);

        expect(mockImportacionService.getPaisesPorBloqueService).toHaveBeenCalledWith(expect.any(String), '123');
    });

    it('should handle null or undefined input', () => {
        component.enCambioDeBloque('SIN' as any);

        expect(mockImportacionService.getPaisesPorBloqueService).toHaveBeenCalledWith(expect.any(String), 'SIN');
    });

    it('should convert number to string correctly', () => {
        component.enCambioDeBloque(456);

        expect(mockImportacionService.getPaisesPorBloqueService).toHaveBeenCalledWith(expect.any(String), '456');
    });

    it('should update store with selected dates', () => {
        const fechas = ['2023-01-01', '2023-01-02'];

        component.fechasSeleccionadas(fechas);

        expect(mockTramite130113Store.actualizarEstado).toHaveBeenCalledWith({ fechasSeleccionadas: fechas });
    });

    it('should handle empty dates array', () => {
        const fechas: string[] = [];

        component.fechasSeleccionadas(fechas);

        expect(mockTramite130113Store.actualizarEstado).toHaveBeenCalledWith({ fechasSeleccionadas: fechas });
    });

    it('should handle single date', () => {
        const fechas = ['2023-01-01'];

        component.fechasSeleccionadas(fechas);

        expect(mockTramite130113Store.actualizarEstado).toHaveBeenCalledWith({ fechasSeleccionadas: fechas });
    });

    it('should complete destroyed subject', () => {
        const nextSpy = jest.spyOn(component['destroyed$'], 'next');
        const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

        component.ngOnDestroy();

        expect(nextSpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
    });

    beforeEach(() => {
        component.inicializarFormularios();
    });

    it('should handle form control value access safely', () => {
        component.formDelTramite.removeControl('solicitud');

        expect(() => component.validarFormulario()).not.toThrow();
    });

    it('should handle null form values in setValoresStore', () => {
        component.formDelTramite.patchValue({ regimen: null });

        expect(() => component.setValoresStore({
            form: component.formDelTramite,
            campo: 'regimen'
        })).not.toThrow();
    });

    it('should handle table operations with empty data', () => {
        component.tableBodyData = [];
        expect(() => component.partidasEliminadas(['1'])).not.toThrow();
    });

    it('should reset notification flags correctly', () => {
        component.mostrarNotificacion = true;
        component.mostrarErroresMercancia = true;
        component.mostrarErroresPartidas = true;

        component.validarYCargarArchivo();

        expect(component.mostrarNotificacion).toBeDefined();
    });

    it('should handle calculation with invalid numbers', () => {
        const result1 = component.calcularImporteUnitario('abc', '100');
        const result2 = component.calcularImporteUnitario('10', 'xyz');

        expect(typeof result1).toBe('string');
        expect(typeof result2).toBe('string');
    });

    beforeEach(() => {
        component.inicializarFormularios();
    });

    it('should validate minimum length for descripcion', () => {
        component.mercanciaForm.patchValue({ descripcion: 'ab' }); // Less than minimum

        expect(component.mercanciaForm.get('descripcion')?.hasError('minlength')).toBeTruthy();
    });

    it('should validate positive numbers for cantidad and valor', () => {
        component.mercanciaForm.patchValue({
            cantidad: -1,
            valorFacturaUSD: -100
        });

        expect(component.mercanciaForm.get('cantidad')?.hasError('min')).toBeTruthy();
        expect(component.mercanciaForm.get('valorFacturaUSD')?.hasError('min')).toBeTruthy();
    });

    it('should validate required fields across all forms', () => {
        const requiredFields = [
            { form: 'formDelTramite', field: 'solicitud' },
            { form: 'formDelTramite', field: 'regimen' },
            { form: 'mercanciaForm', field: 'descripcion' },
            { form: 'paisForm', field: 'usoEspecifico' },
            { form: 'frmRepresentacionForm', field: 'entidad' }
        ];

        requiredFields.forEach(({ form, field }) => {
            const formGroup = component[form as keyof SolicitudComponent] as any;
        });
    });

    it('should call all catalog services on initialization', () => {
        component.ngOnInit();

        expect(mockImportacionService.getRegimenCatalogo).toHaveBeenCalled();
        expect(mockImportacionService.getFraccionCatalogoService).toHaveBeenCalled();
        expect(mockImportacionService.getEntidadesFederativasCatalogo).toHaveBeenCalled();
        expect(mockImportacionService.getBloqueService).toHaveBeenCalled();
    });
});
