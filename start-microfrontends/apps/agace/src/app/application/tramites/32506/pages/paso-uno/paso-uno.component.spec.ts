import { TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite32506Store } from '../../estados/tramite32506.store';
import { Tramite32506Query } from '../../estados/tramite32506.query';
import { AvisoDestruccionService } from '../../services/aviso-destruccion.service';
import { ConsultaioQuery, SolicitanteComponent } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AvisoComponent } from '../../components/aviso/aviso.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: any;
  let mockStore: any;
  let mockTramiteQuery: any;
  let mockAvisoDestruccionService: any;
  let mockConsultaQuery: any;

  beforeEach(async () => {
    mockStore = {
      setPestanaActiva: jest.fn(),
      setDestruccionMercanciasTabla: jest.fn(),
      setAvisoFormularioAdace: jest.fn(),
      setAvisoFormularioCalle: jest.fn(),
      setAvisoFormularioCodigoPostal: jest.fn(),
      setAvisoFormularioColonia: jest.fn(),
      setAvisoFormularioDelegacionMunicipio: jest.fn(),
      setAvisoFormularioEntidadFederativa: jest.fn(),
      setAvisoFormularioFechaTranslado: jest.fn(),
      setAvisoFormularioJustificacion: jest.fn(),
      setAvisoFormularioNombreComercial: jest.fn(),
      setAvisoFormularioNumeroExterior: jest.fn(),
      setAvisoFormularioNumeroInterior: jest.fn(),
      setAvisoFormularioTipoAviso: jest.fn(),
      setAvisoFormularioTipoCarga: jest.fn(),
      setAvisoFormularioValorAnioProgramaImmex: jest.fn(),
      setAvisoFormularioValorProgramaImmex: jest.fn(),
      setPeriodicidadMensualDestruccion: jest.fn(),
      setCantidadDesp: jest.fn(),
      setCircunstanciaHechos: jest.fn(),
      setClaveUnidadMedidaDesp: jest.fn(),
      setDescripcionDesperdicio: jest.fn(),
      setDescripcionMercancia: jest.fn(),
      setCantidadPedimento: jest.fn(),
      setClaveAduanaPedimento: jest.fn(),
      setClaveFraccionArancelariaPedimento: jest.fn(),
      setClaveUnidadMedidaPedimento: jest.fn(),
      setDescripcionProcesoDestruccion: jest.fn(),
      setDomicilioFormularioCalle: jest.fn(),
      setDomicilioFormularioCodigoPostal: jest.fn(),
      setDomicilioFormularioColonia: jest.fn(),
      setDomicilioFormularioDelegacionMunicipio: jest.fn(),
      setDomicilioFormularioEntidadFederativa: jest.fn(),
      setDomicilioFormularioNombreComercial: jest.fn(),
      setDomicilioFormularioNumeroExterior: jest.fn(),
      setDomicilioFormularioNumeroInterior: jest.fn(),
      setDomicilioFormularioRfc: jest.fn(),
    };

    mockTramiteQuery = {
      selectSolicitud$: of({ pestanaActiva: 2 })
    };

    mockAvisoDestruccionService = {
      guardarDatosFormulario: jest.fn(() => of()),
      obtenerFederativa: jest.fn(() => of()),
      obtenerMunicipio: jest.fn(() => of()),
      obtenerColonias: jest.fn(() => of()),
      obtenerUnidadMedida: jest.fn(() => of()),
      obtenerFraccionArancelaria: jest.fn(() => of()),
      obtenerAvisoTabla: jest.fn(() => of()),
      obtenerDesperdicioTabla: jest.fn(() => of()),
      obtenerProcesoTabla: jest.fn(() => of()),
      obtenerPedimentoTabla: jest.fn(() => of()),
      obtenerDatosSolicitante: jest.fn(() => of()),
      actualizarEstadoFormulario: jest.fn(() => of())
    };

    mockConsultaQuery = {
      selectConsultaioState$: of({ update: false })
    };

    await TestBed.configureTestingModule({
      imports: [PasoUnoComponent, CommonModule, SolicitanteComponent, AvisoComponent, HttpClientTestingModule],
      providers: [
        { provide: Tramite32506Store, useValue: mockStore },
        { provide: Tramite32506Query, useValue: mockTramiteQuery },
        { provide: AvisoDestruccionService, useValue: mockAvisoDestruccionService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tramiteState and indice on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tramiteState).toEqual({ pestanaActiva: 2 });
    expect(component.indice).toBe(2);
  });

  it('should set indice and call store.setPestanaActiva on seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
    expect(mockStore.setPestanaActiva).toHaveBeenCalledWith(3);
  });

  it('should emit and complete destroyNotifier$ on ngOnDestroy', () => {
    const spyNext = jest.spyOn(component.destroyNotifier$, 'next');
    const spyComplete = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false in constructor', () => {
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormulario if consultaState.update is true in constructor', () => {
    mockConsultaQuery.selectConsultaioState$ = of({ update: true });
    const guardarDatosFormularioSpy = jest.spyOn(PasoUnoComponent.prototype, 'guardarDatosFormulario');
    const comp = new PasoUnoComponent(
      mockStore,
      mockTramiteQuery,
      mockAvisoDestruccionService,
      mockConsultaQuery
    );
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should update store and esDatosRespuesta on guardarDatosFormulario success', () => {
    const resp = {
      success: true,
      datos: {
        avisoFormulario: { adace: 'adace', calle: 'calle', codigoPostal: 'cp', claveColonia: 'col', claveDelegacionMunicipio: 'del', claveEntidadFederativa: 'ent', fechaTranslado: 'fecha', justificacion: 'just', nombreComercial: 'nom', numeroExterior: 'ext', numeroInterior: 'int', tipoAviso: 'tipo', tipoCarga: 'carga', valorAnioProgramaImmex: 'anio', valorProgramaImmex: 'valor', periodicidadMensualDestruccion: 'period' },
        desperdicioFormulario: { cantidadDesp: 1, circunstanciaHechos: 'circ', claveUnidadMedidaDesp: 'clave', descripcionDesperdicio: 'desc', descripcionMercancia: 'merc' },
        pedimentoFormulario: { cantidadPedimento: 2, claveAduanaPedimento: 'aduana', claveFraccionArancelariaPedimento: 'frac', claveUnidadMedidaPedimento: 'unidad' },
        procesoFormulario: { descripcionProcesoDestruccion: 'proc' },
        domicilioFormulario: { calle: 'calle', codigoPostal: 'cp', claveColonia: 'col', claveDelegacionMunicipio: 'del', claveEntidadFederativa: 'ent', nombreComercial: 'nom', numeroExterior: 'ext', numeroInterior: 'int', rfc: 'rfc' },
        destruccionMercanciasTabla: []
      }
    };
    mockAvisoDestruccionService.guardarDatosFormulario.mockReturnValue(of(resp));
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockStore.setDestruccionMercanciasTabla).toHaveBeenCalledWith([]);
    expect(mockStore.setAvisoFormularioAdace).toHaveBeenCalledWith('adace');
    expect(mockStore.setCantidadDesp).toHaveBeenCalledWith(1);
    expect(mockStore.setCantidadPedimento).toHaveBeenCalledWith(2);
    expect(mockStore.setDescripcionProcesoDestruccion).toHaveBeenCalledWith('proc');
    expect(mockStore.setDomicilioFormularioRfc).toHaveBeenCalledWith('rfc');
  });
});