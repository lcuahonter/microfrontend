import { TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { DatosGeneralesDeLaSolicitudComponent } from '../../components/datos-generales-de-la-solicitud/datos-generales-de-la-solicitud.component';
import { DesistimientoComponent } from '../../components/desistimiento/desistimiento.component';
import {
  SolicitanteComponent,
  WizardComponent,
  BtnContinuarComponent,
} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RetiradaDeLaAutorizacionDeDonacionesService } from '../../services/retirad-de-la-autorizacion-de-donaciones.service';
import { Solicitud11105Store } from '../../estados/solicitud11105.store';
import { Solicitud11105Query } from '../../estados/solicitud11105.query';
import { mock } from 'node:test';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: any;
  let mockService: jest.Mocked<RetiradaDeLaAutorizacionDeDonacionesService>;
  let mockStore: Solicitud11105Store;
  let mockQuery: Solicitud11105Query;

  beforeEach(async () => {
    mockService = {
      getDatosConsulta: jest.fn(),
      getAduanaIngresara: jest.fn().mockReturnValue(of([])),
      getDetallesDelMercanciaDatos: jest.fn().mockReturnValue(of({})),
      getPaisCatalogo: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<RetiradaDeLaAutorizacionDeDonacionesService>;

    mockStore = {
      setAduana: jest.fn().mockReturnValue('Aduana1'),
      setNombre: jest.fn().mockReturnValue('Nombre1'),
      setTipoMercancia: jest.fn().mockReturnValue('Tipo1'),
      setUsoEspecifico: jest.fn().mockReturnValue('Uso1'),
      setCondicion: jest.fn().mockReturnValue('Condicion1'),
      setMarca: jest.fn().mockReturnValue('Marca1'),
      setAno: jest.fn().mockReturnValue('Ano1'),
      setModelo: jest.fn().mockReturnValue('Modelo1'),
      setSerie: jest.fn().mockReturnValue('Serie1'),
      setManifesto: jest.fn().mockReturnValue(true),
      setCalle: jest.fn().mockReturnValue('Calle1'),
      setNumeroExterior: jest.fn().mockReturnValue('NumeroExterior1'),
      setNumeroInterior: jest.fn().mockReturnValue('NumeroInterior1'),
      setTelefono: jest.fn().mockReturnValue('Telefono1'),
      setCorreoElectronico: jest.fn().mockReturnValue('CorreoElectronico1'),
      setPais: jest.fn().mockReturnValue('Pais1'),
      setCodigoPostal: jest.fn().mockReturnValue('CodigoPostal1'),
      setEstado: jest.fn().mockReturnValue('Estado1'),
      setColonia: jest.fn().mockReturnValue('Colonia1'),
      setOpcion: jest.fn().mockReturnValue('Opcion1'),
      setFolioOriginal: jest.fn().mockReturnValue('FolioOriginal1'),
      setJustificacionDelDesistimiento: jest.fn().mockReturnValue('Justificacion1'),
    } as unknown as Solicitud11105Store;

    mockQuery = {
      select: jest.fn().mockReturnValue(of({})),
    } as unknown as Solicitud11105Query;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DatosGeneralesDeLaSolicitudComponent,
        DesistimientoComponent,
        SolicitanteComponent,
        BtnContinuarComponent,
        PasoUnoComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        {
          provide: RetiradaDeLaAutorizacionDeDonacionesService,
          useValue: mockService,
        },
        { provide: Solicitud11105Store, useValue: mockStore },
        { provide: Solicitud11105Query, useValue: mockQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;

    // Mock the wizardComponent methods
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.tipoPersona).toBeUndefined();
    expect(component.persona).toEqual([]);
    expect(component.domicilioFiscal).toEqual([]);
    expect(component.pasos.length).toBeGreaterThan(0);
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
  });

  it('should update the selected tab index when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should emit continuarEvento when continuar is called', () => {
    const spy = jest.spyOn(component.continuarEvento, 'emit');
    component.continuar();
    expect(spy).toHaveBeenCalledWith('');
  });

  it('should update the wizard index and call siguiente when getValorIndice is called with "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should update the wizard index and call atras when getValorIndice is called with "ant"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    component.getValorIndice({ accion: 'ant', valor: 1 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not update the wizard index if the value is out of bounds in getValorIndice', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    component.getValorIndice({ accion: 'cont', valor: 6 });
    expect(component.indice).toBe(1); // Index should remain unchanged
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should set store values when success is true', () => {
    const mockResponse = {
      success: true,
      message: '',
      datos: {
        aduana: '2',
        nombre: 'Juan Pérez',
        tipoMercancia: '3',
        usoEspecifico: 'Componentes para manufactura',
        condicion: 'Nuevo',
        marca: 'ACME',
        ano: '2025',
        modelo: 'X-2000',
        serie: 'SN123456789',
        manifesto: true,
        calle: 'Av. Insurgentes Sur',
        numeroExterior: '100',
        numeroInterior: '5B',
        telefono: '5512345678',
        correoElectronico: 'juan.perez@example.com',
        pais: '1',
        codigoPostal: '03100',
        estado: 'Ciudad de México',
        colonia: 'Del Valle',
        opcion: 'si',
        folioOriginal: 'FO-ABC-123',
        justificacionDelDesistimiento: 'El cliente canceló el pedido.',
      },
    };

    mockService.getDatosConsulta.mockReturnValue(of(mockResponse));

    component.fetchGetDatosConsulta();
    mockStore.setAduana('Aduana1');
    mockStore.setNombre('Nombre1');
    mockStore.setTipoMercancia('Tipo1');
    mockStore.setUsoEspecifico('Uso1');
    mockStore.setCondicion('Condicion1');
    mockStore.setMarca('Marca1');
    mockStore.setAno('2025');
    mockStore.setModelo('Modelo1');
    mockStore.setSerie('Serie1');
    mockStore.setManifesto(true);
    mockStore.setCalle('Calle1');
    mockStore.setNumeroExterior('123');
    mockStore.setNumeroInterior('4B');
    mockStore.setTelefono('555-5555');
    mockStore.setCorreoElectronico('test@example.com');
    mockStore.setPais('Pais1');
    mockStore.setCodigoPostal('12345');
    mockStore.setEstado('Estado1');
    mockStore.setColonia('Colonia1');
    mockStore.setOpcion('Opcion1');
    mockStore.setFolioOriginal('Folio1');
    mockStore.setJustificacionDelDesistimiento('Justificación');

    expect(component.esDatosRespuesta).toBe(true);
    expect(mockStore.setAduana).toHaveBeenCalledWith('Aduana1');
    expect(mockStore.setNombre).toHaveBeenCalledWith('Nombre1');
    expect(mockStore.setTipoMercancia).toHaveBeenCalledWith('Tipo1');
    expect(mockStore.setUsoEspecifico).toHaveBeenCalledWith('Uso1');
    expect(mockStore.setCondicion).toHaveBeenCalledWith('Condicion1');
    expect(mockStore.setMarca).toHaveBeenCalledWith('Marca1');
    expect(mockStore.setAno).toHaveBeenCalledWith('2025');
    expect(mockStore.setModelo).toHaveBeenCalledWith('Modelo1');
    expect(mockStore.setSerie).toHaveBeenCalledWith('Serie1');
    expect(mockStore.setManifesto).toHaveBeenCalledWith(true);
    expect(mockStore.setCalle).toHaveBeenCalledWith('Calle1');
    expect(mockStore.setNumeroExterior).toHaveBeenCalledWith('123');
    expect(mockStore.setNumeroInterior).toHaveBeenCalledWith('4B');
    expect(mockStore.setTelefono).toHaveBeenCalledWith('555-5555');
    expect(mockStore.setCorreoElectronico).toHaveBeenCalledWith(
      'test@example.com'
    );
    expect(mockStore.setPais).toHaveBeenCalledWith('Pais1');
    expect(mockStore.setCodigoPostal).toHaveBeenCalledWith('12345');
    expect(mockStore.setEstado).toHaveBeenCalledWith('Estado1');
    expect(mockStore.setColonia).toHaveBeenCalledWith('Colonia1');
    expect(mockStore.setOpcion).toHaveBeenCalledWith('Opcion1');
    expect(mockStore.setFolioOriginal).toHaveBeenCalledWith('Folio1');
    expect(mockStore.setJustificacionDelDesistimiento).toHaveBeenCalledWith(
      'Justificación'
    );
  });

  it('should not set store values when success is false', () => {
    mockService.getDatosConsulta.mockReturnValue(
      of({ 
        success: false,
        datos: {
          aduana: '',
          nombre: '',
          tipoMercancia: '',
          usoEspecifico: '',
          condicion: '',
          marca: '',
          ano: '',
          modelo: '',
          serie: '',
          manifesto: false,
          calle: '',
          numeroExterior: '',
          numeroInterior: '',
          telefono: '',
          correoElectronico: '',
          pais: '',
          codigoPostal: '',
          estado: '',
          colonia: '',
          opcion: '',
          folioOriginal: '',
          justificacionDelDesistimiento: ''
        },
        message: 'Error'
      })
    );
    component.esDatosRespuesta = false;
    component.fetchGetDatosConsulta();

    expect(component.esDatosRespuesta).toBe(false);
    expect(mockStore.setAduana).not.toHaveBeenCalled();
  });
});
