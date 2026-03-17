import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContenedorDeDatosSolicitudComponent } from './contenedor-de-datos-solicitud.component';
import { Tramite260213Query } from '../../estados/tramite260213Query.query';
import { Tramite260213Store } from '../../estados/tramite260213Store.store';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import {
  DatosDeTablaSeleccionados,
  DatosSolicitudFormState,
  TablaMercanciasDatos,
  TablaOpcionConfig,
  TablaScianConfig,
  TablaSeleccion,
} from '../../../../shared/models/datos-solicitud.model';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('ContenedorDeDatosSolicitudComponent', () => {
  let component: ContenedorDeDatosSolicitudComponent;
  let fixture: ComponentFixture<ContenedorDeDatosSolicitudComponent>;
  let mockTramite260213Query: jest.Mocked<Tramite260213Query>;
  let mockTramite260213Store: jest.Mocked<Tramite260213Store>;

  beforeEach(() => {
    mockTramite260213Query = {
      selectTramiteState$: of({
        opcionConfigDatos: [],
        scianConfigDatos: [],
        tablaMercanciasConfigDatos: [],
      }) as any, // Ensure compatibility with the expected type
    } as unknown as jest.Mocked<Tramite260213Query>; // Cast to jest.Mocked type

    mockTramite260213Store = {
      updateOpcionConfigDatos: jest.fn() as any, // Ensure compatibility with the expected type
      updateScianConfigDatos: jest.fn() as any,
      updateTablaMercanciasConfigDatos: jest.fn() as any,
      updateDatosSolicitudFormState: jest.fn() as any,
      update: jest.fn() as any,
    } as unknown as jest.Mocked<Tramite260213Store>; // Cast to jest.Mocked type

    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CommonModule,
        DatosDeLaSolicitudComponent,
        ContenedorDeDatosSolicitudComponent,
        HttpClientModule,
      ],
      providers: [
        { provide: Tramite260213Query, useValue: mockTramite260213Query },
        { provide: Tramite260213Store, useValue: mockTramite260213Store },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContenedorDeDatosSolicitudComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tramiteState and config data on ngOnInit', () => {
    expect(component.opcionConfig.datos).toEqual([]);
    expect(component.scianConfig.datos).toEqual([]);
    expect(component.tablaMercanciasConfig.datos).toEqual([]);
  });

  it('opcionSeleccionado should call updateOpcionConfigDatos on the store', () => {
    const mockEvent: TablaOpcionConfig[] = [
      {
        fechaCreacion: 'test',
        mercancia: 'test',
        cantidad: 'test',
        proveedor: 'test',
      },
    ];
    component.opcionSeleccionado(mockEvent);
    expect(mockTramite260213Store.updateOpcionConfigDatos).toHaveBeenCalledWith(
      mockEvent
    );
  });

  it('scianSeleccionado should call updateScianConfigDatos on the store', () => {
    const mockEvent: TablaScianConfig[] = [
      { descripcion: 'test', clave: 'testClave' },
    ];
    component.scianSeleccionado(mockEvent);
    expect(mockTramite260213Store.updateScianConfigDatos).toHaveBeenCalledWith(
      mockEvent
    );
  });

  it('datasolicituActualizar should call updateDatosSolicitudFormState on the store', () => {
    const mockEvent: DatosSolicitudFormState = {
      rfcSanitario: 'RFC123',
      denominacionRazon: 'Empresa S.A.',
      correoElectronico: 'test@correo.com',
      codigoPostal: '12345',
      estado: 'Estado',
      municipioAlcaldia: 'Municipio',
      localidad: 'Localidad',
      colonia: 'Colonia',
      calle: 'Calle 123',
      lada: '55',
      telefono: '1234567890',
      aviso: 'Aviso',
      licenciaSanitaria: 'Lic123',
      regimen: 'Regimen',
      adunasDeEntradas: 'Aduana',
      aeropuerto: true,
      publico: 'Público',
      representanteRfc: 'RFCREP',
      representanteNombre: 'Juan',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'Gómez',
    };
    component.datasolicituActualizar(mockEvent);
    expect(mockTramite260213Store.updateDatosSolicitudFormState).toHaveBeenCalledWith(mockEvent);
  });

  it('datosDeTablaSeleccionados should update store with correct data', () => {
    const mockEvent: DatosDeTablaSeleccionados = {
      opcionSeleccionados: [{ fechaCreacion: '2024-01-01', mercancia: 'Mercancia', cantidad: '10', proveedor: 'Proveedor' }],
      scianSeleccionados: [{ descripcion: 'Desc', clave: 'Clave' }],
      mercanciasSeleccionados: [{
        clasificacionProducto: 'Clasificacion',
        especificarClasificacionProducto: 'Especificar',
        denominacionEspecificaProducto: 'Denominacion',
        denominacionDistintiva: 'Distintiva',
        denominacionComun: 'Comun',
        formaFarmaceutica: 'Forma',
        estadoFisico: 'Fisico',
        fraccionArancelaria: 'Fraccion',
        descripcionFraccion: 'Descripcion',
        unidadMedidaComercializacion: 'UMC',
        cantidadUMC: '5',
        unidadMedidaTarifa: 'UMT',
        cantidadUMT: '3',
        presentacion: 'Presentacion',
        numeroRegistroSanitario: 'Reg123',
        paisOrigen: 'Origen',
        paisProcedencia: 'Procedencia',
        tipoProducto: 'Tipo',
        usoEspecifico: 'Uso',
      }],
      opcionesColapsableState: false
    };
    component.datosDeTablaSeleccionados(mockEvent);
    expect(mockTramite260213Store.update).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should set formularioDeshabilitado input value', () => {
    component.formularioDeshabilitado = true;
    expect(component.formularioDeshabilitado).toBe(true);
    component.formularioDeshabilitado = false;
    expect(component.formularioDeshabilitado).toBe(false);
  });

  it('should have idProcedimiento defined', () => {
    expect(component.idProcedimiento).toBeDefined();
  });

  it('mercanciasSeleccionado should call updateTablaMercanciasConfigDatos on the store', () => {
    const mockEvent: TablaMercanciasDatos[] = [
      {
        clasificacionProducto: 'test',
        especificarClasificacionProducto: '',
        denominacionEspecificaProducto: '',
        denominacionDistintiva: '',
        denominacionComun: '',
        formaFarmaceutica: '',
        estadoFisico: '',
        fraccionArancelaria: '',
        descripcionFraccion: '',
        unidadMedidaComercializacion: '',
        cantidadUMC: '',
        unidadMedidaTarifa: '',
        cantidadUMT: '',
        presentacion: '',
        numeroRegistroSanitario: '',
        paisOrigen: '',
        paisProcedencia: '',
        tipoProducto: '',
        usoEspecifico: '',
      },
    ];
    component.mercanciasSeleccionado(mockEvent);
    expect(
      mockTramite260213Store.updateTablaMercanciasConfigDatos
    ).toHaveBeenCalledWith(mockEvent);
  });

  it('datasolicituActualizar should call updateDatosSolicitudFormState on the store', () => {
    const mockEvent: DatosSolicitudFormState = {
      rfcSanitario: 'test',
      denominacionRazon: '',
      correoElectronico: '',
      codigoPostal: '',
      estado: '',
      municipioAlcaldia: '',
      localidad: '',
      colonia: '',
      calle: '',
      lada: '',
      telefono: '',
      aviso: '',
      licenciaSanitaria: '',
      regimen: '',
      adunasDeEntradas: '',
      aeropuerto: false,
      publico: '',
      representanteRfc: '',
      representanteNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
    };
   
  });

  

  it('ngOnDestroy should emit and complete destroyNotifier$', () => {
    const destroyNotifierSpy = jest.spyOn(
      component['destroyNotifier$'],
      'next'
    );
    const completeNotifierSpy = jest.spyOn(
      component['destroyNotifier$'],
      'complete'
    );
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalledTimes(1);
    expect(completeNotifierSpy).toHaveBeenCalledTimes(1);
  });
});
