import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { ExencionImpuestosComponent } from '../../components/exencion-impuestos.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { TIPO_PERSONA } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SolicitanteComponent,
        ExencionImpuestosComponent,
        PasoUnoComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    changeDetectorRef = TestBed.inject(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.indice).toBe(1);
      expect(component.persona).toEqual(PERSONA_MORAL_NACIONAL);
      expect(component.domicilioFiscal).toEqual(DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL);
    });

    it('should call ngAfterViewInit and initialize properties', () => {
      jest.clearAllMocks();
      
      component.solicitante = {
        obtenerTipoPersona: jest.fn()
      } as unknown as SolicitanteComponent;

      const cdrSpy = jest.spyOn(component['cdr'], 'detectChanges');

      component.ngAfterViewInit();

      expect(component.persona).toEqual(PERSONA_MORAL_NACIONAL);
      expect(component.domicilioFiscal).toEqual(DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL);
      expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
      expect(cdrSpy).toHaveBeenCalled();
    });
  });

  describe('Tab Selection', () => {
    it('should change tab index when seleccionaTab is called', () => {
      component.seleccionaTab(2);
      expect(component.indice).toBe(2);

      component.seleccionaTab(1);
      expect(component.indice).toBe(1);
    });

    it('should render correct tab content based on indice', () => {
      component.indice = 1;
      fixture.detectChanges();
      let tabContent = fixture.nativeElement.querySelector('solicitante');
      expect(tabContent).toBeTruthy();

      component.indice = 2;
      fixture.detectChanges();
      tabContent = fixture.nativeElement.querySelector('app-exencion-impuestos');
      expect(tabContent).toBeTruthy();
    });
  });

  describe('Template', () => {
    it('should render two tabs', () => {
      const tabs = fixture.nativeElement.querySelectorAll('.nav-tabs li');
      expect(tabs.length).toBe(2);
      expect(tabs[0].textContent).toContain('Solicitante');
      expect(tabs[1].textContent).toContain('Exención impuestos');
    });

    it('should apply active class to the selected tab', () => {
      component.indice = 1;
      fixture.detectChanges();
      const tabs = fixture.nativeElement.querySelectorAll('.nav-tabs li');
      expect(tabs[0].classList).toContain('active');
      expect(tabs[1].classList).not.toContain('active');

      component.indice = 2;
      fixture.detectChanges();
      expect(tabs[0].classList).not.toContain('active');
      expect(tabs[1].classList).toContain('active');
    });

    it('should call seleccionaTab on click and keyboard events', () => {
      jest.spyOn(component, 'seleccionaTab');
      const tabs = fixture.nativeElement.querySelectorAll('.nav-tabs li a');

      tabs[0].click();
      expect(component.seleccionaTab).toHaveBeenCalledWith(1);

      const enterEvent = new KeyboardEvent('keyup', { key: 'Enter' });
      tabs[1].dispatchEvent(enterEvent);
      expect(component.seleccionaTab).toHaveBeenCalledWith(2);

      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      tabs[0].dispatchEvent(spaceEvent);
      expect(component.seleccionaTab).toHaveBeenCalledWith(1);
    });
  });

  function fetchGetDatosConsulta(): any {
    return {
      success: true,
      datos: {
        exencionImpuestos: {
          manifesto: 'manifestoValue',
          organismoPublico: 'organismoValue',
          aduana: 'aduanaValue',
          destinoMercancia: 'destinoValue'
        },
        importadorExportador: {
          nombre: 'nombreValue',
          calle: 'calleValue',
          numeroExterior: '123',
          numeroInterior: 'A',
          telefono: '555-1234',
          correoElectronico: 'test@example.com',
          pais: 'Mexico',
          codigoPostal: '12345',
          estado: 'EstadoValue',
          colonia: 'ColoniaValue',
          opcion: 'OpcionValue'
        },
        datosMercancia: {
          tipoDeMercancia: 'TipoValue',
          usoEspecifico: 'UsoValue',
          condicionMercancia: 'CondicionValue',
          unidadMedida: 'UnidadValue',
          vehiculo: 'VehiculoValue',
          ano: 2024,
          cantidad: 10,
          marca: 'MarcaValue',
          modelo: 'ModeloValue',
          serie: 'SerieValue'
        }
      }
    };
  }
});

describe('PasoUnoComponent ngOnInit conditional coverage', () => {
  let component: PasoUnoComponent;
  beforeEach(() => {
    component = new PasoUnoComponent({} as any, {} as any, {} as any, {} as any);
    // Inicializa consultaDatos para simular que el componente se está configurando correctamente
    (component as any)['consultaDatos'] = { update: false };
  });
  
  it('should call fetchGetDatosConsulta in ngOnInit when consultaDatos.update is true', () => {
    // Configura consultaDatos con update: true para probar la lógica condicional
    (component as any)['consultaDatos'] = { update: true };
    
    const mockConsultaioQuery = {
      selectConsultaioState$: {
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn()
        })
      }
    };
    (component as any)['consultaioQuery'] = mockConsultaioQuery;
    
    // Simula el método de servicio que llamará fetchGetDatosConsulta
    const mockExencionImpuestosService = {
      getDatosConsulta: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn()
        })
      })
    };
    (component as any)['exencionImpuestosService'] = mockExencionImpuestosService;
    
    const spy = jest.spyOn(component, 'fetchGetDatosConsulta');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
  
  it('should not call fetchGetDatosConsulta in ngOnInit when consultaDatos.update is false', () => {
    // Configura consultaDatos con update: false para probar la ruta else
    (component as any)['consultaDatos'] = { update: false };
    
    const mockConsultaioQuery = {
      selectConsultaioState$: {
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn()
        })
      }
    };
    (component as any)['consultaioQuery'] = mockConsultaioQuery;
    
    const spy = jest.spyOn(component, 'fetchGetDatosConsulta');
    component.ngOnInit();
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('PasoUnoComponent fetchGetDatosConsulta method coverage', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockTramite103Store: any;
  let mockExencionImpuestosService: any;

  beforeEach(waitForAsync(() => {
    // Cree un simulacro completo para tramite103Store con todos los métodos de configuración
    mockTramite103Store = {
      setManifesto: jest.fn(),
      setOrganismoPublico: jest.fn(),
      setAduana: jest.fn(),
      setDestinoMercancia: jest.fn(),
      setNombre: jest.fn(),
      setCalle: jest.fn(),
      setNumeroExterior: jest.fn(),
      setNumeroInterior: jest.fn(),
      setTelefono: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setPais: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setColonia: jest.fn(),
      setOpcion: jest.fn(),
      setTipoDeMercancia: jest.fn(),
      setUsoEspecifico: jest.fn(),
      setCondicionMercancia: jest.fn(),
      setUnidadMedida: jest.fn(),
      setVehiculo: jest.fn(),
      setAno: jest.fn(),
      setCantidad: jest.fn(),
      setMarca: jest.fn(),
      setModelo: jest.fn(),
      setSerie: jest.fn()
    };

    // Simula el servicio exencionImpuestosService
    mockExencionImpuestosService = {
      getDatosConsulta: jest.fn()
    };

    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SolicitanteComponent,
        ExencionImpuestosComponent,
        PasoUnoComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    
    (component as any)['tramite103Store'] = mockTramite103Store;
    (component as any)['exencionImpuestosService'] = mockExencionImpuestosService;
    
    const mockDestroyNotifier = {
      next: jest.fn(),
      complete: jest.fn()
    };
    (component as any)['destroyNotifier$'] = mockDestroyNotifier;
    
    (component as any)['consultaDatos'] = { update: false };
    
    const mockConsultaioQuery = {
      selectConsultaioState$: {
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn()
        })
      }
    };
    (component as any)['consultaioQuery'] = mockConsultaioQuery;
    
    fixture.detectChanges();
  });

  it('should handle successful response and call all store setters in fetchGetDatosConsulta', () => {
    const mockResponse = {
      success: true,
      datos: {
        exencionImpuestos: {
          manifesto: 'test-manifesto',
          organismoPublico: 'test-organismo',
          aduana: 'test-aduana',
          destinoMercancia: 'test-destino'
        },
        importadorExportador: {
          nombre: 'test-nombre',
          calle: 'test-calle',
          numeroExterior: 'test-exterior',
          numeroInterior: 'test-interior',
          telefono: 'test-telefono',
          correoElectronico: 'test-email',
          pais: 'test-pais',
          codigoPostal: 'test-postal',
          estado: 'test-estado',
          colonia: 'test-colonia',
          opcion: 'test-opcion'
        },
        datosMercancia: {
          tipoDeMercancia: 'test-tipo',
          usoEspecifico: 'test-uso',
          condicionMercancia: 'test-condicion',
          unidadMedida: 'test-unidad',
          vehiculo: 'test-vehiculo',
          ano: 'test-ano',
          cantidad: 'test-cantidad',
          marca: 'test-marca',
          modelo: 'test-modelo',
          serie: 'test-serie'
        }
      }
    };

    // Simula el servicio para devolver una respuesta exitosa con la cadena RxJS adecuada
    mockExencionImpuestosService.getDatosConsulta.mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockImplementation((callback) => {
          callback(mockResponse);
          return { unsubscribe: jest.fn() };
        })
      })
    });

    component.fetchGetDatosConsulta();

    expect(mockExencionImpuestosService.getDatosConsulta).toHaveBeenCalled();

    expect(mockTramite103Store.setManifesto).toHaveBeenCalledWith('test-manifesto');
    expect(mockTramite103Store.setOrganismoPublico).toHaveBeenCalledWith('test-organismo');
    expect(mockTramite103Store.setAduana).toHaveBeenCalledWith('test-aduana');
    expect(mockTramite103Store.setDestinoMercancia).toHaveBeenCalledWith('test-destino');

    expect(mockTramite103Store.setNombre).toHaveBeenCalledWith('test-nombre');
    expect(mockTramite103Store.setCalle).toHaveBeenCalledWith('test-calle');
    expect(mockTramite103Store.setNumeroExterior).toHaveBeenCalledWith('test-exterior');
    expect(mockTramite103Store.setNumeroInterior).toHaveBeenCalledWith('test-interior');
    expect(mockTramite103Store.setTelefono).toHaveBeenCalledWith('test-telefono');
    expect(mockTramite103Store.setCorreoElectronico).toHaveBeenCalledWith('test-email');
    expect(mockTramite103Store.setPais).toHaveBeenCalledWith('test-pais');
    expect(mockTramite103Store.setCodigoPostal).toHaveBeenCalledWith('test-postal');
    expect(mockTramite103Store.setEstado).toHaveBeenCalledWith('test-estado');
    expect(mockTramite103Store.setColonia).toHaveBeenCalledWith('test-colonia');
    expect(mockTramite103Store.setOpcion).toHaveBeenCalledWith('test-opcion');

    expect(mockTramite103Store.setTipoDeMercancia).toHaveBeenCalledWith('test-tipo');
    expect(mockTramite103Store.setUsoEspecifico).toHaveBeenCalledWith('test-uso');
    expect(mockTramite103Store.setCondicionMercancia).toHaveBeenCalledWith('test-condicion');
    expect(mockTramite103Store.setUnidadMedida).toHaveBeenCalledWith('test-unidad');
    expect(mockTramite103Store.setVehiculo).toHaveBeenCalledWith('test-vehiculo');
    expect(mockTramite103Store.setAno).toHaveBeenCalledWith('test-ano');
    expect(mockTramite103Store.setCantidad).toHaveBeenCalledWith('test-cantidad');
    expect(mockTramite103Store.setMarca).toHaveBeenCalledWith('test-marca');
    expect(mockTramite103Store.setModelo).toHaveBeenCalledWith('test-modelo');
    expect(mockTramite103Store.setSerie).toHaveBeenCalledWith('test-serie');
  });

  it('should handle failed response and not call store setters in fetchGetDatosConsulta', () => {
    const mockResponse = {
      success: false,
      datos: null
    };

    mockExencionImpuestosService.getDatosConsulta.mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockImplementation((callback) => {
          callback(mockResponse);
          return { unsubscribe: jest.fn() };
        })
      })
    });

    component.fetchGetDatosConsulta();

    expect(mockExencionImpuestosService.getDatosConsulta).toHaveBeenCalled();

    expect(mockTramite103Store.setManifesto).not.toHaveBeenCalled();
    expect(mockTramite103Store.setOrganismoPublico).not.toHaveBeenCalled();
    expect(mockTramite103Store.setAduana).not.toHaveBeenCalled();
    expect(mockTramite103Store.setDestinoMercancia).not.toHaveBeenCalled();
    expect(mockTramite103Store.setNombre).not.toHaveBeenCalled();
    expect(mockTramite103Store.setCalle).not.toHaveBeenCalled();
    expect(mockTramite103Store.setNumeroExterior).not.toHaveBeenCalled();
    expect(mockTramite103Store.setNumeroInterior).not.toHaveBeenCalled();
    expect(mockTramite103Store.setTelefono).not.toHaveBeenCalled();
    expect(mockTramite103Store.setCorreoElectronico).not.toHaveBeenCalled();
    expect(mockTramite103Store.setPais).not.toHaveBeenCalled();
    expect(mockTramite103Store.setCodigoPostal).not.toHaveBeenCalled();
    expect(mockTramite103Store.setEstado).not.toHaveBeenCalled();
    expect(mockTramite103Store.setColonia).not.toHaveBeenCalled();
    expect(mockTramite103Store.setOpcion).not.toHaveBeenCalled();
    expect(mockTramite103Store.setTipoDeMercancia).not.toHaveBeenCalled();
    expect(mockTramite103Store.setUsoEspecifico).not.toHaveBeenCalled();
    expect(mockTramite103Store.setCondicionMercancia).not.toHaveBeenCalled();
    expect(mockTramite103Store.setUnidadMedida).not.toHaveBeenCalled();
    expect(mockTramite103Store.setVehiculo).not.toHaveBeenCalled();
    expect(mockTramite103Store.setAno).not.toHaveBeenCalled();
    expect(mockTramite103Store.setCantidad).not.toHaveBeenCalled();
    expect(mockTramite103Store.setMarca).not.toHaveBeenCalled();
    expect(mockTramite103Store.setModelo).not.toHaveBeenCalled();
    expect(mockTramite103Store.setSerie).not.toHaveBeenCalled();
  });
});
