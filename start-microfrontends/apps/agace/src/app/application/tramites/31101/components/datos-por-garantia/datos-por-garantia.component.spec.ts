import { TestBed } from '@angular/core/testing';
import { DatosPorGarantiaComponent } from './datos-por-garantia.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud31101Store } from '../../estados/solicitud31101.store';
import { Solicitud31101Query } from '../../estados/solicitud31101.query';
import { CatalogoSelectComponent, ConsultaioQuery, InputFechaComponent, TituloComponent } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosPorGarantiaComponent', () => {
  let component: DatosPorGarantiaComponent;
  let fixture: any;
  let mockSolicitudService: jest.Mocked<SolicitudService>;
  let mockSolicitud31101Store: jest.Mocked<Solicitud31101Store>;
  let mockSolicitud31101Query: jest.Mocked<Solicitud31101Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  beforeEach(async () => {
    mockSolicitudService = {
      conseguirNombreInstitucionCatalogo: jest.fn(() => of()),
    } as any;

    mockSolicitud31101Store = {
      actualizarRfcInstitucion: jest.fn(() => of()),
      actualizarPolizaDeFianzaActual: jest.fn(() => of()),
      actualizarRfcAfianzadora: jest.fn(() => of()),
      actualizarPolizaFianzaActual: jest.fn(() => of()),
      actualizarFolioFianza: jest.fn(() => of()),
      actualizarFianzaImporteTotal: jest.fn(() => of()),
    } as any;

    mockSolicitud31101Query = {
      selectSolicitud$: of({
        polizaFianzaActual: '1',
        folioFianza: 'F123',
        rfcAfianzadora: 'RFC1',
        fechaExpedicionFianza: '2023-01-01',
        fecInicioVigenciaFianza: '2023-01-02',
        fecFinVigenciaFianza: '2023-01-03',
        fianzaImporteTotal: '1000',
        polizaDeFianzaActual: '2',
        numeroFolio: 'N456',
        rfcInstitucion: 'RFC2',
        fechaExpedicion: '2023-02-01',
        fechaInicioVigenciaNo: '2023-02-02',
        fechaFinVigenciaNo: '2023-02-03',
        fechaInicioVigencia: '2023-02-04',
        fechaFinVigencia: '2023-02-05',
        importeTotal: '2000',
      }),
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DatosPorGarantiaComponent,
        CommonModule,
        TituloComponent,
        CatalogoSelectComponent,
        InputFechaComponent,
        TooltipModule,
        HttpClientTestingModule
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: Solicitud31101Store, useValue: mockSolicitud31101Store },
        { provide: Solicitud31101Query, useValue: mockSolicitud31101Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosPorGarantiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize forms', () => {
    expect(component).toBeTruthy();
    expect(component.polizaFianzaForm).toBeDefined();
    expect(component.polizaCreditoForm).toBeDefined();
  });

  it('should call actualizarRfcInstitucion and actualizarPolizaDeFianzaActual on seleccionaNombreInstitucion', () => {
    const evento: Catalogo = { id: 1, descripcion: 'Test' } as Catalogo;
    component.seleccionaNombreInstitucion(evento);
    expect(
      mockSolicitud31101Store.actualizarRfcInstitucion
    ).toHaveBeenCalledWith('ZURE5401259D8');
    expect(
      mockSolicitud31101Store.actualizarPolizaDeFianzaActual
    ).toHaveBeenCalledWith(1);
  });

  it('should call actualizarRfcAfianzadora and actualizarPolizaFianzaActual on seleccionaInstitucionFianza', () => {
    const evento: Catalogo = { id: 1, descripcion: 'Test2' } as Catalogo;
    component.seleccionaInstitucionFianza(evento);
    expect(
      mockSolicitud31101Store.actualizarRfcAfianzadora
    ).toHaveBeenCalledWith('ZURE5401259D9');
    expect(
      mockSolicitud31101Store.actualizarPolizaFianzaActual
    ).toHaveBeenCalledWith(1);
  });

  it('should call actualizarFolioFianza on seleccionaNumeroFolio', () => {
    const event = { target: { value: 'FOLIO123' } } as unknown as Event;
    component.seleccionaNumeroFolio(event);
    expect(mockSolicitud31101Store.actualizarFolioFianza).toHaveBeenCalledWith(
      'FOLIO123'
    );
  });

  it('should call actualizarFianzaImporteTotal on seleccionaFianzaImporteTotal', () => {
    const event = { target: { value: '9999' } } as unknown as Event;
    component.seleccionaFianzaImporteTotal(event);
    expect(
      mockSolicitud31101Store.actualizarFianzaImporteTotal
    ).toHaveBeenCalledWith('9999');
  });

  it('should disable forms when esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.polizaCreditoForm.disabled).toBe(true);
    expect(component.polizaFianzaForm.disabled).toBe(true);
  });

  it('should enable forms when esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.polizaCreditoForm.enabled).toBe(true);
    expect(component.polizaFianzaForm.enabled).toBe(true);
  });

  it('should call conseguirNombreInstitucionCatalogo on init', () => {
    (
      mockSolicitudService.conseguirNombreInstitucionCatalogo as jest.Mock
    ).mockReturnValue(
      of({
        creditoCatalogo: [{ id: '1', descripcion: 'Inst1' }],
        fianzaCatalogo: [{ id: '2', descripcion: 'Inst2' }],
      })
    );
    component.conseguirNombreInstitucionCatalogo();
    expect(component.nombreInstitucionCatalogo.catalogos).toEqual([]);
    expect(component.institucionFianzaCatalogo.catalogos).toEqual([]);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroy$ = (component as any).destroy$ as Subject<void>;
    const nextSpy = jest.spyOn(destroy$, 'next');
    const completeSpy = jest.spyOn(destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should patch forms when selectSolicitud$ emits new values', () => {
    expect(component.polizaFianzaForm.get('folioFianza')?.value).toBe('F123');
    expect(component.polizaCreditoForm.get('numeroFolio')?.value).toBe('N456');
  });

  it('should call inicializarFormulario when esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario when esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });
});
