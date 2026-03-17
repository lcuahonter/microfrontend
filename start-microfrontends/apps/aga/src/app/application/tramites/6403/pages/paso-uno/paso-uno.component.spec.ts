import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { SolicitanteComponent } from '../../components/solicitante/solicitante.component';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { Tramite6403Store, createInitialState } from '../../estados/tramite6403.store';
import { Tramite6403Query } from '../../estados/tramite6403.query';
import { RetornoDePartesService } from '../../services/retorno-de-partes.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let storeMock: any;
  let tramiteQueryMock: any;
  let consultaQueryMock: any;
  let retornoDePartesServiceMock: any;

  beforeEach(async () => {
    storeMock = {
      setPestanaActiva: jest.fn(()=> of()),
      setCveAduana: jest.fn(()=> of()),
      setCveSeccionAduanal: jest.fn(()=> of()),
      setCveRecintoFiscalizado: jest.fn(()=> of()),
      setCveTipoDocumento: jest.fn(()=> of()),
      setEstadoTipoDocumento: jest.fn(()=> of()),
      setAduana: jest.fn(()=> of()),
      setPatente: jest.fn(()=> of()),
      setPedimento: jest.fn(()=> of()),
      setFolioImportacionTemporal: jest.fn(()=> of()),
      setFolioFormatoOficial: jest.fn(()=> of()),
      setCheckProrroga: jest.fn(()=> of()),
      setFolioOficialProrroga: jest.fn(()=> of()),
      setFechaImportacionTemporal: jest.fn(()=> of()),
      setFechaVencimiento: jest.fn(()=> of()),
      setDescMercancia: jest.fn(()=> of()),
      setMarca: jest.fn(()=> of()),
      setModelo: jest.fn(()=> of()),
      setNumeroSerie: jest.fn(()=> of()),
      setTipo: jest.fn(()=> of()),
      setCveMedioTrasporte: jest.fn(()=> of()),
      setGuiaMaster: jest.fn(()=> of()),
      setGuiaBl: jest.fn(()=> of()),
      setNumeroBl: jest.fn(()=> of()),
      setRfcEmpresaTransportista: jest.fn(()=> of()),
      setEstadoMedioTransporte: jest.fn(()=> of()),
      setCartaPorte: jest.fn(()=> of()),
      setCvePaisProcedencia: jest.fn(()=> of()),
      setGuiaHouse: jest.fn(()=> of()),
      setNumeroBuque: jest.fn(()=> of()),
      setNumeroEquipo: jest.fn(()=> of()),
      setFechaCartaPorte: jest.fn(()=> of()),
      setTipContenedor: jest.fn(()=> of()),
      setTranporteMarca: jest.fn(()=> of()),
      setTranporteModelo: jest.fn(()=> of()),
      setTranportePlaca: jest.fn(()=> of()),
      setObservaciones: jest.fn(()=> of()),
      setConDestino: jest.fn(()=> of()),
      setCveTipoDestino: jest.fn(()=> of()),
      setCveTipoDocumentoReemplazada: jest.fn(()=> of()),
      setNumeroActaDescruccion: jest.fn(()=> of()),
      setCveAduanaDestino: jest.fn(()=> of()),
      setCvePatenteDestino: jest.fn(()=> of()),
      setCvePedimentoDestino: jest.fn(()=> of()),
      setFolioVucemRetorno: jest.fn(()=> of()),
      setFolioFormatoOficialDestino: jest.fn(()=> of()),
      setFechaDescruccionDestino: jest.fn(()=> of()),
      setEstadoTipoDocumentoDestino: jest.fn(()=> of()),
      setAutoridadPresentoAvisoDestruccion: jest.fn(()=> of()),
      setModalDescMercancia: jest.fn(()=> of()),
      setEspeMercancia: jest.fn(()=> of()),
      setMarcaMercancia: jest.fn(()=> of()),
      setModeloMercancia: jest.fn(()=> of()),
      setNumSerieMercancia: jest.fn(()=> of()),
      setNumParteMercancia: jest.fn(()=> of()),
      setTipoMercancia: jest.fn(()=> of()),
      setMercanciaFormulario:jest.fn(()=> of()),


    };

    tramiteQueryMock = {
      selectSolicitud$: of({
        ...createInitialState(),
        pestanaActiva: 1,
      }),
    };

    consultaQueryMock = {
      selectConsultaioState$: of({ update: false }),
    };

    retornoDePartesServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({
        success: true,
        datos: {
          solicitudFormulario: { ...createInitialState().solicitudFormulario, cveAduana: '1' },
          mercanciaFormulario: { ...createInitialState().mercanciaFormulario, tipoMercancia: 'tipo' }
        }
      })),
      obtenerDatosSolicitante: jest.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [PasoUnoComponent, SolicitanteComponent, SolicitudComponent, HttpClientTestingModule],
      providers: [
        { provide: Tramite6403Store, useValue: storeMock },
        { provide: Tramite6403Query, useValue: tramiteQueryMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: RetornoDePartesService, useValue: retornoDePartesServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    component.tramiteState = createInitialState();
    component.consultaState = { update: false } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tramiteState and consultaState in ngOnInit', () => {
    component.tramiteState = undefined as any;
    component.consultaState = undefined as any;
    component.ngOnInit();
    expect(component.tramiteState).toBeDefined();
    expect(component.consultaState).toBeDefined();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false in ngOnInit', () => {
    component.consultaState = { update: false } as any;
    component.esDatosRespuesta = false;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });
   it('should set esDatosRespuesta to true if consultaState.update is true in ngOnInit', () => {
    component.consultaState = { update: true } as any;
    component.esDatosRespuesta = true;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call store setters and set esDatosRespuesta in guardarDatosFormularios', () => {
    component.esDatosRespuesta = false;
    component.guardarDatosFormularios();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should update indice and call setPestanaActiva in seleccionaTab', () => {
    component.indice = 1;
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
    expect(storeMock.setPestanaActiva).toHaveBeenCalledWith(2);
  });

  it('should complete destroyed$ in ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should not set esDatosRespuesta or call store setters if respuesta.success is false in guardarDatosFormularios', () => {
    const spySetters = [
      'setMercanciaFormulario', 'setCveAduana', 'setCveSeccionAduanal', 'setCveRecintoFiscalizado', 'setCveTipoDocumento',
      'setEstadoTipoDocumento', 'setAduana', 'setPatente', 'setPedimento', 'setFolioImportacionTemporal', 'setFolioFormatoOficial',
      'setCheckProrroga', 'setFolioOficialProrroga', 'setFechaImportacionTemporal', 'setFechaVencimiento', 'setDescMercancia',
      'setMarca', 'setModelo', 'setNumeroSerie', 'setTipo', 'setCveMedioTrasporte', 'setGuiaMaster', 'setGuiaBl', 'setNumeroBl',
      'setRfcEmpresaTransportista', 'setEstadoMedioTransporte', 'setCartaPorte', 'setCvePaisProcedencia', 'setGuiaHouse',
      'setNumeroBuque', 'setNumeroEquipo', 'setFechaCartaPorte', 'setTipContenedor', 'setTranporteMarca', 'setTranporteModelo',
      'setTranportePlaca', 'setObservaciones', 'setConDestino', 'setCveTipoDestino', 'setCveTipoDocumentoReemplazada',
      'setNumeroActaDescruccion', 'setCveAduanaDestino', 'setCvePatenteDestino', 'setCvePedimentoDestino', 'setFolioVucemRetorno',
      'setFolioFormatoOficialDestino', 'setFechaDescruccionDestino', 'setEstadoTipoDocumentoDestino', 'setAutoridadPresentoAvisoDestruccion',
      'setModalDescMercancia', 'setEspeMercancia', 'setMarcaMercancia', 'setModeloMercancia', 'setNumSerieMercancia',
      'setNumParteMercancia', 'setTipoMercancia'
    ];
    spySetters.forEach(method => storeMock[method].mockClear());
    retornoDePartesServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValueOnce(of({ success: false, datos: {} }));
    component.esDatosRespuesta = false;
    component.guardarDatosFormularios();
    expect(component.esDatosRespuesta).toBe(false);
    spySetters.forEach(method => {
      expect(storeMock[method]).not.toHaveBeenCalled();
    });
  });

  it('should call all store setters with correct values in guardarDatosFormularios', () => {
    const solicitudFormulario = {
      cveAduana: 'aduana1',
      cveSeccionAduanal: 'sec1',
      cveRecintoFiscalizado: 'rec1',
      cveTipoDocumento: 'doc1',
      estadoTipoDocumento: 'estado1',
      aduana: 'aduana2',
      patente: 'patente1',
      pedimento: 'ped1',
      folioImportacionTemporal: 'folio1',
      folioFormatoOficial: 'folio2',
      checkProrroga: true,
      folioOficialProrroga: 'folio3',
      fechaImportacionTemporal: '2024-01-01',
      fechaVencimiento: '2024-01-02',
      descMercancia: 'desc',
      marca: 'marca',
      modelo: 'modelo',
      numeroSerie: 'serie',
      tipo: 'tipo',
      cveMedioTrasporte: 'medio',
      guiaMaster: 'master',
      guiaBl: 'bl',
      numeroBl: 'nbl',
      rfcEmpresaTransportista: 'rfc',
      estadoMedioTransporte: 'estado2',
      cartaPorte: 'carta',
      cvePaisProcedencia: 'pais',
      guiaHouse: 'house',
      numeroBuque: 'buque',
      numeroEquipo: 'equipo',
      fechaCartaPorte: '2024-01-03',
      tipContenedor: 'cont',
      tranporteMarca: 'tmarca',
      tranporteModelo: 'tmodelo',
      tranportePlaca: 'tpl',
      observaciones: 'obs',
      conDestino: true,
      cveTipoDestino: 'destino',
      cveTipoDocumentoReemplazada: 'docrep',
      numeroActaDescruccion: 'acta',
      cveAduanaDestino: 'aduanadest',
      cvePatenteDestino: 'patdest',
      cvePedimentoDestino: 'peddest',
      folioVucemRetorno: 'foliovucem',
      folioFormatoOficialDestino: 'folioofdest',
      fechaDescruccionDestino: '2024-01-04',
      estadoTipoDocumentoDestino: 'estadodest',
      autoridadPresentoAvisoDestruccion: 'autoridad'
    };
    const mercanciaFormulario = {
      modalDescMercancia: 'modal',
      espeMercancia: 'espe',
      marcaMercancia: 'mmarca',
      modeloMercancia: 'mmodelo',
      numSerieMercancia: 'mserie',
      numParteMercancia: 'mpart',
      tipoMercancia: 'mtipo'
    };
    retornoDePartesServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValueOnce(of({
      success: true,
      datos: { solicitudFormulario, mercanciaFormulario }
    }));

    component.guardarDatosFormularios();
    expect(storeMock.setMercanciaFormulario).toHaveBeenCalledWith(mercanciaFormulario);
    expect(storeMock.setCveAduana).toHaveBeenCalledWith('aduana1');
    expect(storeMock.setCveSeccionAduanal).toHaveBeenCalledWith('sec1');
    expect(storeMock.setCveRecintoFiscalizado).toHaveBeenCalledWith('rec1');
    expect(storeMock.setCveTipoDocumento).toHaveBeenCalledWith('doc1');
    expect(storeMock.setEstadoTipoDocumento).toHaveBeenCalledWith('estado1');
    expect(storeMock.setAduana).toHaveBeenCalledWith('aduana2');
    expect(storeMock.setPatente).toHaveBeenCalledWith('patente1');
    expect(storeMock.setPedimento).toHaveBeenCalledWith('ped1');
    expect(storeMock.setFolioImportacionTemporal).toHaveBeenCalledWith('folio1');
    expect(storeMock.setFolioFormatoOficial).toHaveBeenCalledWith('folio2');
    expect(storeMock.setCheckProrroga).toHaveBeenCalledWith(true);
    expect(storeMock.setFolioOficialProrroga).toHaveBeenCalledWith('folio3');
    expect(storeMock.setFechaImportacionTemporal).toHaveBeenCalledWith('2024-01-01');
    expect(storeMock.setFechaVencimiento).toHaveBeenCalledWith('2024-01-02');
    expect(storeMock.setDescMercancia).toHaveBeenCalledWith('desc');
    expect(storeMock.setMarca).toHaveBeenCalledWith('marca');
    expect(storeMock.setModelo).toHaveBeenCalledWith('modelo');
    expect(storeMock.setNumeroSerie).toHaveBeenCalledWith('serie');
    expect(storeMock.setTipo).toHaveBeenCalledWith('tipo');
    expect(storeMock.setCveMedioTrasporte).toHaveBeenCalledWith('medio');
    expect(storeMock.setGuiaMaster).toHaveBeenCalledWith('master');
    expect(storeMock.setGuiaBl).toHaveBeenCalledWith('bl');
    expect(storeMock.setNumeroBl).toHaveBeenCalledWith('nbl');
    expect(storeMock.setRfcEmpresaTransportista).toHaveBeenCalledWith('rfc');
    expect(storeMock.setEstadoMedioTransporte).toHaveBeenCalledWith('estado2');
    expect(storeMock.setCartaPorte).toHaveBeenCalledWith('carta');
    expect(storeMock.setCvePaisProcedencia).toHaveBeenCalledWith('pais');
    expect(storeMock.setGuiaHouse).toHaveBeenCalledWith('house');
    expect(storeMock.setNumeroBuque).toHaveBeenCalledWith('buque');
    expect(storeMock.setNumeroEquipo).toHaveBeenCalledWith('equipo');
    expect(storeMock.setFechaCartaPorte).toHaveBeenCalledWith('2024-01-03');
    expect(storeMock.setTipContenedor).toHaveBeenCalledWith('cont');
    expect(storeMock.setTranporteMarca).toHaveBeenCalledWith('tmarca');
    expect(storeMock.setTranporteModelo).toHaveBeenCalledWith('tmodelo');
    expect(storeMock.setTranportePlaca).toHaveBeenCalledWith('tpl');
    expect(storeMock.setObservaciones).toHaveBeenCalledWith('obs');
    expect(storeMock.setConDestino).toHaveBeenCalledWith(true);
    expect(storeMock.setCveTipoDestino).toHaveBeenCalledWith('destino');
    expect(storeMock.setCveTipoDocumentoReemplazada).toHaveBeenCalledWith('docrep');
    expect(storeMock.setNumeroActaDescruccion).toHaveBeenCalledWith('acta');
    expect(storeMock.setCveAduanaDestino).toHaveBeenCalledWith('aduanadest');
    expect(storeMock.setCvePatenteDestino).toHaveBeenCalledWith('patdest');
    expect(storeMock.setCvePedimentoDestino).toHaveBeenCalledWith('peddest');
    expect(storeMock.setFolioVucemRetorno).toHaveBeenCalledWith('foliovucem');
    expect(storeMock.setFolioFormatoOficialDestino).toHaveBeenCalledWith('folioofdest');
    expect(storeMock.setFechaDescruccionDestino).toHaveBeenCalledWith('2024-01-04');
    expect(storeMock.setEstadoTipoDocumentoDestino).toHaveBeenCalledWith('estadodest');
    expect(storeMock.setAutoridadPresentoAvisoDestruccion).toHaveBeenCalledWith('autoridad');
    expect(storeMock.setModalDescMercancia).toHaveBeenCalledWith('modal');
    expect(storeMock.setEspeMercancia).toHaveBeenCalledWith('espe');
    expect(storeMock.setMarcaMercancia).toHaveBeenCalledWith('mmarca');
    expect(storeMock.setModeloMercancia).toHaveBeenCalledWith('mmodelo');
    expect(storeMock.setNumSerieMercancia).toHaveBeenCalledWith('mserie');
    expect(storeMock.setNumParteMercancia).toHaveBeenCalledWith('mpart');
    expect(storeMock.setTipoMercancia).toHaveBeenCalledWith('mtipo');
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should handle undefined datos in respuesta in guardarDatosFormularios', () => {
    retornoDePartesServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValueOnce(of({
      success: true,
      datos: undefined
    }));
    expect(() => component.guardarDatosFormularios()).not.toThrow();
    expect(component.esDatosRespuesta).toBe(true);
  });
});