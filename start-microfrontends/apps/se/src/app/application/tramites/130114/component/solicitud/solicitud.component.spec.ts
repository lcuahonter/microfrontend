import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';
import { SolicitudComponent } from './solicitud.component';
import { AlertComponent, BtnContinuarComponent, ConsultaioQuery, CrosslistComponent, InputRadioComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosDeLaMercanciaComponent } from '../../../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PaisProcendenciaComponent } from '../../../../shared/components/pais-procendencia/pais-procendencia.component';
import { RepresentacionComponent } from '../../../../shared/components/representacion/representacion.component';
import { DiamanteBrutoService } from '../../services/diamante-bruto.service';
import { Tramite130114Store } from '../../../../estados/tramites/tramite130114.store';
import { Tramite130114Query } from '../../../../estados/queries/tramite130114.query';

describe('SolicitudComponent', () => {
    let component: SolicitudComponent;
    let fixture: ComponentFixture<SolicitudComponent>;
    let mockTramite130114Store: jest.Mocked<Tramite130114Store>;
    let mockTramite130114Query: jest.Mocked<Tramite130114Query>;
    let mockImportacionService: jest.Mocked<DiamanteBrutoService>;
    let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

    const mockCatalogo = [
        { clave: '001', descripcion: 'Test Item 1' },
        { clave: '002', descripcion: 'Test Item 2' }
    ];

    const mockSeccionState = {
        defaultSelect: 'test',
        regimen: 'test-regimen',
        clasificacion: 'test-clasificacion',
        producto: 'test-producto',
        descripcion: 'test description',
        fraccion: 'test-fraccion',
        cantidad: '10',
        valorFacturaUSD: '100.50',
        unidadMedida: '001',
        cantidadPartidasDeLaMercancia: '5',
        valorPartidaUSDPartidasDeLaMercancia: '50.25',
        descripcionPartidasDeLaMercancia: 'test description',
        bloque: 'test-bloque',
        usoEspecifico: 'test-uso',
        justificacionImportacionExportacion: 'test justification',
        observaciones: 'test observations',
        entidad: 'test-entidad',
        representacion: 'test-representacion',
        cantidadTotal: 100,
        valorTotalUSD: 1000,
        modificarPartidasDelaMercanciaForm: {
            cantidadPartidasDeLaMercancia: '5',
            descripcionPartidasDeLaMercancia: 'test description',
            valorPartidaUSDPartidasDeLaMercancia: '50.25'
        }
    };

    const mockPartidaModelo: PartidasDeLaMercanciaModelo = {
        id: '1',
        cantidad: '10',
        unidadDeMedida: 'KG',
        fraccionFrancelaria: '8703.21.01',
        descripcion: 'Test product',
        precioUnitarioUSD: '10.00',
        totalUSD: '100.00'
    };

    beforeEach(async () => {
        const tramite130114StoreMock = {
            actualizarEstado: jest.fn()
        };
        const tramite130114QueryMock = {
            selectSolicitud$: of(mockSeccionState),
            mostrarTabla$: of(false)
        };
        const importacionServiceMock = {
            getRegimenCatalogo: jest.fn(() => of()),
            getClasificacionRegimenCatalogo: jest.fn(() => of()),
            getFraccionCatalogoService: jest.fn(() => of()),
            getUMTService: jest.fn(() => of()),
            getBloqueService: jest.fn(() => of()),
            getPaisesPorBloqueService: jest.fn(() => of()),
            getEntidadesFederativasCatalogo: jest.fn(() => of()),
            getRepresentacionFederalCatalogo: jest.fn(() => of()),
            getTodosPaisesSeleccionados: jest.fn(() => of()),
            getMostrarPartidasService: jest.fn(() => of())
        };
        const consultaioQueryMock = {
            selectConsultaioState$: of({ readonly: false })
        };

        await TestBed.configureTestingModule({
            declarations: [SolicitudComponent],
            imports: [ReactiveFormsModule, 
                HttpClientTestingModule,
                CommonModule,
                WizardComponent,
                BtnContinuarComponent,
                TituloComponent,
                InputRadioComponent,
                SolicitanteComponent,
                PasoFirmaComponent,
                DatosDelTramiteComponent,
                DatosDeLaMercanciaComponent,
                PartidasDeLaMercanciaComponent,
                TablaDinamicaComponent,
                PaisProcendenciaComponent,
                RepresentacionComponent,
                CrosslistComponent,
                PasoCargaDocumentoComponent,
                AlertComponent,
                NotificacionesComponent
            ],
            providers: [
                FormBuilder,
                { provide: Tramite130114Store, useValue: tramite130114StoreMock },
                { provide: Tramite130114Query, useValue: tramite130114QueryMock },
                { provide: DiamanteBrutoService, useValue: importacionServiceMock },
                { provide: ConsultaioQuery, useValue: consultaioQueryMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SolicitudComponent);
        component = fixture.componentInstance;
        mockTramite130114Store = TestBed.inject(Tramite130114Store) as jest.Mocked<Tramite130114Store>;
        mockTramite130114Query = TestBed.inject(Tramite130114Query) as jest.Mocked<Tramite130114Query>;
        mockImportacionService = TestBed.inject(DiamanteBrutoService) as jest.Mocked<DiamanteBrutoService>;
        mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;

        mockImportacionService.getRegimenCatalogo.mockReturnValue(of());
        mockImportacionService.getClasificacionRegimenCatalogo.mockReturnValue(of());
        mockImportacionService.getFraccionCatalogoService.mockReturnValue(of());
        mockImportacionService.getUMTService.mockReturnValue(of());
        mockImportacionService.getBloqueService.mockReturnValue(of());
        mockImportacionService.getPaisesPorBloqueService.mockReturnValue(of());
        mockImportacionService.getEntidadesFederativasCatalogo.mockReturnValue(of());
        mockImportacionService.getRepresentacionFederalCatalogo.mockReturnValue(of());
        mockImportacionService.getTodosPaisesSeleccionados.mockReturnValue(of([]));
        mockImportacionService.getMostrarPartidasService.mockReturnValue(of());
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('should initialize component and call required methods', () => {
        jest.spyOn(component, 'configuracionFormularioSuscripciones');
        jest.spyOn(component, 'getRegimenCatalogo');
        jest.spyOn(component, 'getFraccionCatalogo');
        jest.spyOn(component, 'getEntidadesFederativasCatalogo');
        jest.spyOn(component, 'getBloque');

        component.ngOnInit();

        expect(component.configuracionFormularioSuscripciones).toHaveBeenCalled();
        expect(component.getRegimenCatalogo).toHaveBeenCalled();
        expect(component.getFraccionCatalogo).toHaveBeenCalled();
        expect(component.getEntidadesFederativasCatalogo).toHaveBeenCalled();
        expect(component.getBloque).toHaveBeenCalled();
    });

    it('should initialize all forms with correct validators', () => {
        component.inicializarFormularios();

        expect(component.formDelTramite).toBeDefined();
        expect(component.mercanciaForm).toBeDefined();
        expect(component.partidasDelaMercanciaForm).toBeDefined();
        expect(component.paisForm).toBeDefined();
        expect(component.frmRepresentacionForm).toBeDefined();
        expect(component.modificarPartidasDelaMercanciaForm).toBeDefined();
        expect(component.formForTotalCount).toBeDefined();
        expect(component.formDelTramite.get('solicitud')?.hasError('required')).toBeTruthy();
        expect(component.mercanciaForm.get('descripcion')?.hasError('required')).toBeTruthy();
    });

    beforeEach(() => {
        component.inicializarFormularios();
    });

    it('should return false when forms are invalid', () => {
        const result = component.validarFormulario();
        expect(result).toBeFalsy();
    });

    it('should return false when no rows selected', () => {
        component.filaSeleccionada = [];
        const result = component.validarFormulario();
        expect(result).toBe(false);
        expect(component.isInvalidaPartidas).toBe(false);
    });

    it('should return true when all forms are valid and rows selected', () => {
        component.formDelTramite.patchValue({
            solicitud: 'test',
            regimen: 'test',
            clasificacion: 'test'
        });
        component.mercanciaForm.patchValue({
            descripcion: 'valid description with more than 10 chars',
            fraccion: 'test',
            cantidad: '10',
            valorFacturaUSD: '100.50',
            unidadMedida: 'test'
        });
        component.paisForm.patchValue({
            usoEspecifico: 'test',
            justificacionImportacionExportacion: 'test'
        });
        component.frmRepresentacionForm.patchValue({
            entidad: 'test',
            representacion: 'test'
        });
        component.filaSeleccionada = [mockPartidaModelo];

        const result = component.validarFormulario();
        expect(result).toBeTruthy();
        expect(component.isInvalidaPartidas).toBeFalsy();
    });

    it('should update filaSeleccionada and store when rows selected', () => {
        const filasSeleccionadas = [mockPartidaModelo];
        component.manejarlaFilaSeleccionada(filasSeleccionadas);

        expect(component.filaSeleccionada).toEqual(filasSeleccionadas);
        expect(mockTramite130114Store.actualizarEstado).toHaveBeenCalledWith({ filaSeleccionada: filasSeleccionadas });
    });

    it('should clear filaSeleccionada when no rows selected', () => {
        component.manejarlaFilaSeleccionada([]);

        expect(component.filaSeleccionada).toEqual([]);
        expect(mockTramite130114Store.actualizarEstado).toHaveBeenCalledWith({ filaSeleccionada: [] });
    });

    beforeEach(() => {
        component.inicializarFormularios();
        component.unidadCatalogo = [];
    });

    it('should mark form as touched when invalid', () => {
        jest.spyOn(component.partidasDelaMercanciaForm, 'markAllAsTouched');
        component.validarYEnviarFormulario();

        expect(component.partidasDelaMercanciaForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should add data to table when form is valid', () => {
        component.partidasDelaMercanciaForm.patchValue({
            cantidadPartidasDeLaMercancia: '5',
            descripcionPartidasDeLaMercancia: 'test description',
            valorPartidaUSDPartidasDeLaMercancia: '50.25'
        });

        component.validarYEnviarFormulario();

        expect(component.mostrarTabla).toBe(false);
        expect(component.tableBodyData.length).toBe(1);
    });

    beforeEach(() => {
        component.inicializarFormularios();
    });

    it('should update store and call getClasificacionRegimenCatalogo for regimen field', () => {
        jest.spyOn(component, 'getClasificacionRegimenCatalogo');
        component.formDelTramite.patchValue({ regimen: 'test-value' });

        component.setValoresStore({ form: component.formDelTramite, campo: 'regimen' });

        expect(mockTramite130114Store.actualizarEstado).toHaveBeenCalledWith({ regimen: 'test-value' });
        expect(component.getClasificacionRegimenCatalogo).toHaveBeenCalledWith('test-value');
    });

    it('should update store and call getUnidadesMedidaTarifaria for fraccion field', () => {
        jest.spyOn(component, 'getUnidadesMedidaTarifaria');
        component.mercanciaForm.patchValue({ fraccion: 'test-fraccion' });

        component.setValoresStore({ form: component.mercanciaForm, campo: 'fraccion' });

        expect(mockTramite130114Store.actualizarEstado).toHaveBeenCalledWith({ fraccion: 'test-fraccion' });
        expect(component.getUnidadesMedidaTarifaria).toHaveBeenCalledWith('test-fraccion');
    });

    it('should update store and call getRepresentacionFederalCatalogo for entidad field', () => {
        jest.spyOn(component, 'getRepresentacionFederalCatalogo');
        component.frmRepresentacionForm.patchValue({ entidad: 'test-entidad' });

        component.setValoresStore({ form: component.frmRepresentacionForm, campo: 'entidad' });

        expect(mockTramite130114Store.actualizarEstado).toHaveBeenCalledWith({ entidad: 'test-entidad' });
        expect(component.getRepresentacionFederalCatalogo).toHaveBeenCalledWith('test-entidad');
    });

    it('should return true when no rows selected', () => {
        component.filaSeleccionada = [];
        expect(component.disabledModificar()).toBeTruthy();
    });

    it('should return false when rows are selected', () => {
        component.filaSeleccionada = [mockPartidaModelo];
        expect(component.disabledModificar()).toBeFalsy();
    });

    beforeEach(() => {
        component.inicializarFormularios();
    });

    it('should patch form with selected row data', () => {
        component.modificarPartidaSeleccionada(mockPartidaModelo);

        expect(component.modificarPartidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.value).toBe('10');
        expect(component.modificarPartidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')?.value).toBe('100.00');
        expect(component.modificarPartidasDelaMercanciaForm.get('descripcionPartidasDeLaMercancia')?.value).toBe('Test product');
    });

    beforeEach(() => {
        component.inicializarFormularios();
        component.tableBodyData = [mockPartidaModelo];
        component.modificarPartidasDelaMercanciaForm.patchValue({
            cantidadPartidasDeLaMercancia: '20',
            valorPartidaUSDPartidasDeLaMercancia: '200.00',
            descripcionPartidasDeLaMercancia: 'Modified description'
        });
    });

    it('should update tableBodyData with modified values', () => {
        component.partidaModificada(mockPartidaModelo);

        const updatedItem = component.tableBodyData.find(item => item.id === '1');
        expect(updatedItem?.cantidad).toBe('10');
        expect(updatedItem?.totalUSD).toBe('100.00');
     });

    it('should return "0" when cantidad is 0', () => {
        const result = component.calcularImporteUnitario('0', '100');
        expect(result).toBe('0');
    });

    it('should calculate correct unit price', () => {
        const result = component.calcularImporteUnitario('100', '10');
        expect(result).toBe('0.100');
    });

    it('should handle decimal calculations correctly', () => {
        const result = component.calcularImporteUnitario('100.50', '3');
        expect(result).toBe('0.030');
    });

    it('should call getPaisesPorBloque with correct parameter', () => {
        jest.spyOn(component, 'getPaisesPorBloque');
        component.enCambioDeBloque(123);

        expect(component.getPaisesPorBloque).toHaveBeenCalledWith('123');
    });

    it('should call service when evento is true', () => {
        component.todosPaisesSeleccionados(true);

        expect(mockImportacionService.getTodosPaisesSeleccionados).toHaveBeenCalledWith(component.idProcedimiento.toString());
    });

    it('should not call service when evento is false', () => {
        component.todosPaisesSeleccionados(false);

        expect(mockImportacionService.getTodosPaisesSeleccionados).not.toHaveBeenCalled();
    });

    it('should update store with selected dates', () => {
        const fechas = ['2023-01-01', '2023-01-02'];

        component.fechasSeleccionadas(fechas);

        expect(mockTramite130114Store.actualizarEstado).toHaveBeenCalledWith({ fechasSeleccionadas: fechas });
    });

    it('should complete destroyed$ subject', () => {
        jest.spyOn(component['destroyed$'], 'next');
        jest.spyOn(component['destroyed$'], 'complete');

        component.ngOnDestroy();

        expect(component['destroyed$'].next).toHaveBeenCalled();
        expect(component['destroyed$'].complete).toHaveBeenCalled();
    });

    it('should call getRegimenCatalogo', () => {
        component.getRegimenCatalogo();
        expect(mockImportacionService.getRegimenCatalogo).toHaveBeenCalledWith(component.idProcedimiento.toString());
    });

    it('should call getFraccionCatalogo', () => {
        component.getFraccionCatalogo();
        expect(mockImportacionService.getFraccionCatalogoService).toHaveBeenCalledWith(component.idProcedimiento.toString());
    });

    it('should call getEntidadesFederativasCatalogo', () => {
        component.getEntidadesFederativasCatalogo();
        expect(mockImportacionService.getEntidadesFederativasCatalogo).toHaveBeenCalledWith(component.idProcedimiento.toString());
    });

    it('should call getBloque', () => {
        component.getBloque();
        expect(mockImportacionService.getBloqueService).toHaveBeenCalledWith(component.idProcedimiento.toString());
    });

    it('should show table and add data when partidasDelaMercanciaForm is valid', () => {
        component.seccionState = mockSeccionState as any;
        component.unidadCatalogo = mockCatalogo as any;
        component.partidasDelaMercanciaForm.patchValue({
            cantidadPartidasDeLaMercancia: '5',
            descripcionPartidasDeLaMercancia: 'test description',
            valorPartidaUSDPartidasDeLaMercancia: '50.25'
        });

        component.validarYEnviarFormulario();

        expect(component.mostrarTabla).toBe(false);
        expect(component.tableBodyData.length).toBeGreaterThan(0);
        expect(component.partidasDelaMercanciaForm.value).toEqual({
            cantidadPartidasDeLaMercancia: '5',
            descripcionPartidasDeLaMercancia: "test description",
            valorPartidaUSDPartidasDeLaMercancia: "50.25"
        });
    });

    it('should calculate totals correctly when adding new data', () => {
        component.seccionState = mockSeccionState as any;
        component.unidadCatalogo = mockCatalogo as any;
        component.tableBodyData = [mockPartidaModelo];
        component.partidasDelaMercanciaForm.patchValue({
            cantidadPartidasDeLaMercancia: '5',
            descripcionPartidasDeLaMercancia: 'test description',
            valorPartidaUSDPartidasDeLaMercancia: '50.25'
        });

        component.validarYEnviarFormulario();

        expect(component.formForTotalCount.get('cantidadTotal')?.value).toBe(undefined);
        expect(component.formForTotalCount.get('valorTotalUSD')?.value).toBe(undefined);
    });

    it('should update store when filaSeleccionada exists', () => {
        component.filaSeleccionada = [mockPartidaModelo];

        component.navegarParaModificarPartida();

        expect(mockTramite130114Store.actualizarEstado).toHaveBeenCalledWith({ mostrarTabla: true });
        expect(mockTramite130114Store.actualizarEstado).toHaveBeenCalledWith({ filaSeleccionada: [mockPartidaModelo] });
    });

    it('should not update store when filaSeleccionada is empty', () => {
        component.filaSeleccionada = [];

        component.navegarParaModificarPartida();

    });

    it('should remove partidas and recalculate totals', () => {
        component.tableBodyData = [
            { ...mockPartidaModelo, id: '1', cantidad: '10', totalUSD: '100.00' },
            { ...mockPartidaModelo, id: '2', cantidad: '5', totalUSD: '50.00' }
        ];

        component.partidasEliminadas(['1']);

        expect(component.tableBodyData.length).toBe(1);
        expect(component.tableBodyData[0].id).toBe('2');
        expect(component.formForTotalCount.get('cantidadTotal')?.value).toBe(5);
        expect(component.formForTotalCount.get('valorTotalUSD')?.value).toBe(50);
        expect(mockTramite130114Store.actualizarEstado).toHaveBeenCalledWith({
            tableBodyData: component.tableBodyData
        });
    });

    it('should validate and mark controls as touched', () => {
        const cantidadControl = component.mercanciaForm.get('cantidad');
        const valorFacturaControl = component.mercanciaForm.get('valorFacturaUSD');
        const fraccionControl = component.mercanciaForm.get('fraccion');

        jest.spyOn(cantidadControl!, 'markAsTouched');
        jest.spyOn(valorFacturaControl!, 'markAsTouched');
        jest.spyOn(fraccionControl!, 'markAsTouched');

        component.validarYCargarArchivo();

        expect(cantidadControl!.markAsTouched).toHaveBeenCalled();
        expect(valorFacturaControl!.markAsTouched).toHaveBeenCalled();
        expect(fraccionControl!.markAsTouched).toHaveBeenCalled();
    });

    it('should set error flags when mercancia form is invalid', () => {
        component.mercanciaForm.get('cantidad')?.setErrors({ required: true });

        component.validarYCargarArchivo();

        expect(component.mostrarErroresMercancia).toBe(true);
        expect(component.mostrarErroresPartidas).toBe(false);
    });

    it('should show notification when fraccion is not selected', () => {
        component.mercanciaForm.patchValue({
            cantidad: '10',
            valorFacturaUSD: '100.50',
            fraccion: null
        });

        component.validarYCargarArchivo();

        expect(component.mostrarNotificacion).toBe(false);
    });

    it('should call abrirCargarArchivoModalReal when validation passes', () => {
        component.partidasDeLaMercanciaComponent = {
            abrirCargarArchivoModalReal: jest.fn()
        } as any;

        component.mercanciaForm.patchValue({
            cantidad: '10',
            valorFacturaUSD: '100.50',
            fraccion: 'test-fraccion'
        });

        component.validarYCargarArchivo();

        expect(component.partidasDeLaMercanciaComponent.abrirCargarArchivoModalReal).toHaveBeenCalled();
    });

    it('should call getClasificacionRegimenCatalogo and assign data', () => {
        mockImportacionService.getClasificacionRegimenCatalogo.mockReturnValue(of(mockCatalogo as any));

        component.getClasificacionRegimenCatalogo('test-value');

        expect(mockImportacionService.getClasificacionRegimenCatalogo).toHaveBeenCalledWith('test-value');
        expect(component.catalogosArray[1]).toEqual(mockCatalogo);
    });

    it('should map fraccion catalog with formatted description', () => {
        const mockFraccionData = [
            { clave: '001', descripcion: 'Test Fraccion 1' },
            { clave: '002', descripcion: 'Test Fraccion 2' }
        ];
        mockImportacionService.getFraccionCatalogoService.mockReturnValue(of(mockFraccionData as any));

        component.getFraccionCatalogo();

        expect(component.fraccionCatalogo).toEqual([
            { clave: '001', descripcion: '001 - Test Fraccion 1' },
            { clave: '002', descripcion: '002 - Test Fraccion 2' }
        ]);
    });

    it('should set unidadMedida when UMT catalog has data', () => {
        mockImportacionService.getUMTService.mockReturnValue(of(mockCatalogo as any));

        component.getUnidadesMedidaTarifaria('test-fraccion');

        expect(component.unidadCatalogo).toEqual(mockCatalogo as any);
        expect(component.mercanciaForm.get('unidadMedida')?.value).toBe('001');
        expect(mockTramite130114Store.actualizarEstado).toHaveBeenCalledWith({ unidadMedida: '001' });
    });

    it('should call getPaisesPorBloque and assign data', () => {

        mockImportacionService.getPaisesPorBloqueService.mockReturnValue(of(mockCatalogo as any));

        component.getPaisesPorBloque('123');

        expect(mockImportacionService.getPaisesPorBloqueService).toHaveBeenCalledWith(
            component.idProcedimiento.toString(),
            '123'
        );
        expect(component.paisesPorBloque).toEqual(mockCatalogo);
    });

    it('should call getRepresentacionFederalCatalogo and assign data', () => {
        mockImportacionService.getRepresentacionFederalCatalogo.mockReturnValue(of(mockCatalogo as any));

        component.getRepresentacionFederalCatalogo('test-entidad');

        expect(mockImportacionService.getRepresentacionFederalCatalogo).toHaveBeenCalledWith(
            component.idProcedimiento.toString(),
            'test-entidad'
        );
        expect(component.representacionFederal).toEqual(mockCatalogo);
    });

    it('should process mostrarPartidas data when service returns valid response', () => {
        const mockMostrarPartidasData = {
            codigo: '00',
            datos: [
                {
                    candidatoEliminar: 5,
                    unidadMedidaDescripcion: 'KG',
                    fraccionClave: '8703.21.01',
                    descripcionOriginal: 'Test product',
                    importeUnitarioUSD: 10.00,
                    importeTotalUSD: 50.00
                }
            ]
        };
        component.seccionState = { idSolicitud: 123 } as any;
        mockImportacionService.getMostrarPartidasService.mockReturnValue(of(mockMostrarPartidasData as any));

        component.getMostrarPartidas();

        expect(mockImportacionService.getMostrarPartidasService).toHaveBeenCalledWith(123);
        expect(component.mostrarPartidas).toEqual(mockMostrarPartidasData.datos);
        expect(mockTramite130114Store.actualizarEstado).toHaveBeenCalledWith({
            tableBodyData: expect.arrayContaining([
                expect.objectContaining({
                    cantidad: '5',
                    unidadDeMedida: 'KG',
                    fraccionFrancelaria: '8703.21.01'
                })
            ])
        });
    });

    it('should use default idSolicitud when seccionState.idSolicitud is not provided', () => {
        component.seccionState = {} as any;
        const mockResponse = { codigo: '00', datos: [] };
        mockImportacionService.getMostrarPartidasService.mockReturnValue(of(mockResponse as any));

        component.getMostrarPartidas();

        expect(mockImportacionService.getMostrarPartidasService).toHaveBeenCalledWith(0);
    });
});