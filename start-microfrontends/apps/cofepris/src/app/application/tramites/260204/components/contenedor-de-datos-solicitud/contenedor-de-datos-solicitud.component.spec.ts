import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContenedorDeDatosSolicitudComponent } from './contenedor-de-datos-solicitud.component';
import { Tramite260204Query } from '../../estados/queries/tramite260204Query.query';
import { Tramite260204Store } from '../../estados/stores/tramite260204Store.store';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosDeTablaSeleccionados, DatosSolicitudFormState, TablaMercanciasDatos, TablaOpcionConfig, TablaScianConfig, TablaSeleccion } from '../../../../shared/models/datos-solicitud.model';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContenedorDeDatosSolicitudComponent', () => {
  let component: ContenedorDeDatosSolicitudComponent;
  let fixture: ComponentFixture<ContenedorDeDatosSolicitudComponent>;
  let mockTramite260204Query: jest.Mocked<Tramite260204Query>;
  let mockTramite260204Store: jest.Mocked<Tramite260204Store>;

  beforeEach(() => {
    mockTramite260204Query = {
      selectTramiteState$: of({
        opcionConfigDatos: [],
        scianConfigDatos: [],
        tablaMercanciasConfigDatos: [],
      }) as any, // Ensure compatibility with the expected type
    } as unknown as jest.Mocked<Tramite260204Query>; // Cast to jest.Mocked type

    mockTramite260204Store = {
      updateOpcionConfigDatos: jest.fn() as any, // Ensure compatibility with the expected type
      updateScianConfigDatos: jest.fn() as any,
      updateTablaMercanciasConfigDatos: jest.fn() as any,
      updateDatosSolicitudFormState: jest.fn() as any,
      update: jest.fn() as any,
    } as unknown as jest.Mocked<Tramite260204Store>; // Cast to jest.Mocked type

    TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonModule, DatosDeLaSolicitudComponent, ContenedorDeDatosSolicitudComponent, HttpClientTestingModule],
      providers: [
        { provide: Tramite260204Query, useValue: mockTramite260204Query },
        { provide: Tramite260204Store, useValue: mockTramite260204Store },
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
    const mockEvent: TablaOpcionConfig[] = [{ fechaCreacion: 'test', mercancia: 'test', cantidad: 'test', proveedor: 'test' }];
    component.opcionSeleccionado(mockEvent);
    expect(mockTramite260204Store.updateOpcionConfigDatos).toHaveBeenCalledWith(mockEvent);
  });

  it('scianSeleccionado should call updateScianConfigDatos on the store', () => {
    const mockEvent: TablaScianConfig[] = [{ descripcion: 'test', clave: 'testClave'}];
    component.scianSeleccionado(mockEvent);
    expect(mockTramite260204Store.updateScianConfigDatos).toHaveBeenCalledWith(mockEvent);
  });

  it('mercanciasSeleccionado should call updateTablaMercanciasConfigDatos on the store', () => {
    const mockEvent: TablaMercanciasDatos[] = [{
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
      usoEspecifico: ''
    }];
    component.mercanciasSeleccionado(mockEvent);
    expect(mockTramite260204Store.updateTablaMercanciasConfigDatos).toHaveBeenCalledWith(mockEvent);
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
      apellidoMaterno: ''
    };
    component.datasolicituActualizar(mockEvent);
    expect(mockTramite260204Store.updateDatosSolicitudFormState).toHaveBeenCalledWith(mockEvent);
  });

  it('datosDeTablaSeleccionados should call update on the store with correct data', () => {
    const mockEvent: DatosDeTablaSeleccionados = {
      opcionSeleccionados: [{ fechaCreacion: 'test', mercancia: 'test', cantidad: 'test', proveedor: 'test' }],
      scianSeleccionados: [{ descripcion: 'test', clave: 'num test' }],
      mercanciasSeleccionados: [{
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
        usoEspecifico: ''
      }],
      opcionesColapsableState: false
    };
    component.datosDeTablaSeleccionados(mockEvent);
    expect(mockTramite260204Store.update).toHaveBeenCalled();
  });

  it('ngOnDestroy should emit and complete destroyNotifier$', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalledTimes(1);
    expect(completeNotifierSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle empty state gracefully on ngOnInit', () => {
    jest.spyOn(mockTramite260204Query.selectTramiteState$, 'pipe').mockReturnValue(of(null));
    component.ngOnInit();
    expect(component.tramiteState).toBeUndefined();
    expect(component.opcionConfig.datos).toEqual([]);
    expect(component.scianConfig.datos).toEqual([]);
    expect(component.tablaMercanciasConfig.datos).toEqual([]);
  });

});