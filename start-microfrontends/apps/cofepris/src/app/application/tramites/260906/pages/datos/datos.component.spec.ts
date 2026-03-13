import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { SanitarioService } from '../../services/sanitario.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite260906Store } from '../../../../estados/tramites/tramite260906.store';
import { Sanitario260906Store } from '../../../../estados/tramites/sanitario260906.store';
import { of } from 'rxjs';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let sanitarioServiceMock: any;
  let consultaioQueryMock: any;
  let tramiteStoreMock: any;
  let sanitarioStoreMock: any;

  beforeEach(async () => {
    sanitarioServiceMock = {
      getDatosConsulta: jest.fn(),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ update: true }),
    };

    tramiteStoreMock = {
      setRfcResponsableSanitario: jest.fn(),
      setDenominacion: jest.fn(),
      setCorreo: jest.fn(),
      setTipoOperacionJustificacion: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setMuncipio: jest.fn(),
      setLocalidad: jest.fn(),
      setColonia: jest.fn(),
      setCalle: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setClaveScianModal: jest.fn(),
      setClaveDescripcionModal: jest.fn(),
      setAvisoCheckbox: jest.fn(),
      setLicenciaSanitaria: jest.fn(),
      setRegimen: jest.fn(),
      setAduanasEntradas: jest.fn(),
      setNumeroPermiso: jest.fn(),
      setTiempoPrograma: jest.fn(),
      setClasificacion: jest.fn(),
      setEspecificarClasificacionProducto: jest.fn(),
      setDenominacionEspecifica: jest.fn(),
      setDenominacionDistintiva: jest.fn(),
      setDenominacionComun: jest.fn(),
      setTipoDeProducto: jest.fn(),
      setFormaFarmaceutica: jest.fn(),
      setEstadoFisico: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setDescripcionFraccion: jest.fn(),
      setCantidadUMT: jest.fn(),
      setUMT: jest.fn(),
      setCantidadUMC: jest.fn(),
      setUMC: jest.fn(),
      setPresentacion: jest.fn(),
      setNumeroRegistro: jest.fn(),
      setFechaCaducidad: jest.fn(),
      setCumplimiento: jest.fn(),
      setRfc: jest.fn(),
      setNombre: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
      setTipoOperacion: jest.fn(),
      setInformacionConfidencial: jest.fn(),
      setManifesto: jest.fn(),
    };

    sanitarioStoreMock = {
      setreferencia: jest.fn(),
      setcadenaDependencia: jest.fn(),
      setbanco: jest.fn(),
      setLlave: jest.fn(),
      settipoFetch: jest.fn(),
      setimporte: jest.fn(),
      setSelectedEstado: jest.fn(),
      setClave: jest.fn(),
      setDescripcion: jest.fn(),
      setDespecificarClasificacion: jest.fn(),
      setFabricante: jest.fn(),
      setDestinatario: jest.fn(),
      setProveedor: jest.fn(),
      setFacturador: jest.fn(),
      setTercerosNacionalidad: jest.fn(),
      setTipoPersona: jest.fn(),
      setRfc: jest.fn(),
      setCurp: jest.fn(),
      setNombre: jest.fn(),
      setPrimerApellido: jest.fn(),
      setSegundoApellido: jest.fn(),
      setDenominacionRazonSocial: jest.fn(),
      setPais: jest.fn(),
      setEstadoLocalidad: jest.fn(),
      setMunicipioAlcaldia: jest.fn(),
      setLocalidad: jest.fn(),
      setEntidadFederativa: jest.fn(),
      setCodigoPostaloEquivalente: jest.fn(),
      setColonia: jest.fn(),
      setColoniaoEquivalente: jest.fn(),
      setCalle: jest.fn(),
      setNumeroExterior: jest.fn(),
      setNumeroInterior: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setExtranjeroCodigo: jest.fn(),
      setExtranjeroEstado: jest.fn(),
      setExtranjeroColonia: jest.fn(),
      setEstado: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      providers: [
        { provide: SanitarioService, useValue: sanitarioServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: Tramite260906Store, useValue: tramiteStoreMock },
        { provide: Sanitario260906Store, useValue: sanitarioStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with indice set to 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should change indice when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should set esDatosRespuesta to true if consultaDatos.update is false', () => {
    consultaioQueryMock.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call sanitarioService.getDatosConsulta in fetchGetDatosConsulta', () => {
    const mockResponse = { success: true, datos: {} };
    sanitarioServiceMock.getDatosConsulta.mockReturnValue(of(mockResponse));

    component.fetchGetDatosConsulta();

    expect(sanitarioServiceMock.getDatosConsulta).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should unsubscribe from observables on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component.destroyNotifier$, 'complete');

    component.ngOnDestroy();

    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
});
