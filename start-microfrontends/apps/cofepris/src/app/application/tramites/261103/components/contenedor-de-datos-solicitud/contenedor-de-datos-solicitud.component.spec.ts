import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContenedorDeDatosSolicitudComponent } from './contenedor-de-datos-solicitud.component';
import { Tramite260202Query } from '../../estados/tramite260202Query.query';
import { Tramite260202Store } from '../../estados/tramite260202Store.store';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosDeTablaSeleccionados, DatosSolicitudFormState, TablaMercanciasDatos, TablaOpcionConfig, TablaScianConfig, TablaSeleccion } from '../../../../shared/models/datos-solicitud.model';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('ContenedorDeDatosSolicitudComponent', () => {
  let component: ContenedorDeDatosSolicitudComponent;
  let fixture: ComponentFixture<ContenedorDeDatosSolicitudComponent>;
  let mockTramite260202Query: jest.Mocked<Tramite260202Query>;
  let mockTramite260202Store: jest.Mocked<Tramite260202Store>;

  beforeEach(() => {
    mockTramite260202Query = {
      selectTramiteState$: of({
        opcionConfigDatos: [],
        scianConfigDatos: [],
        tablaMercanciasConfigDatos: [],
      }) as any, 
    } as unknown as jest.Mocked<Tramite260202Query>; 
    mockTramite260202Store = {
      updateOpcionConfigDatos: jest.fn() as any, 
      updateScianConfigDatos: jest.fn() as any,
      updateTablaMercanciasConfigDatos: jest.fn() as any,
      updateDatosSolicitudFormState: jest.fn() as any,
      update: jest.fn() as any,
    } as unknown as jest.Mocked<Tramite260202Store>; // Cast to jest.Mocked type

    TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonModule, DatosDeLaSolicitudComponent, ContenedorDeDatosSolicitudComponent,HttpClientModule],
      providers: [
        { provide: Tramite260202Query, useValue: mockTramite260202Query },
        { provide: Tramite260202Store, useValue: mockTramite260202Store },
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
    expect(mockTramite260202Store.updateOpcionConfigDatos).toHaveBeenCalledWith(mockEvent);
  });

  it('scianSeleccionado should call updateScianConfigDatos on the store', () => {
    const mockEvent: TablaScianConfig[] = [{ descripcion: 'test', clave: 'testClave'}];
    component.scianSeleccionado(mockEvent);
    expect(mockTramite260202Store.updateScianConfigDatos).toHaveBeenCalledWith(mockEvent);
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
    expect(mockTramite260202Store.updateTablaMercanciasConfigDatos).toHaveBeenCalledWith(mockEvent);
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
    expect(mockTramite260202Store.updateDatosSolicitudFormState).toHaveBeenCalledWith(mockEvent);
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
    expect(mockTramite260202Store.update).toHaveBeenCalled();
  });

  it('ngOnDestroy should emit and complete destroyNotifier$', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalledTimes(1);
    expect(completeNotifierSpy).toHaveBeenCalledTimes(1);
  });
});