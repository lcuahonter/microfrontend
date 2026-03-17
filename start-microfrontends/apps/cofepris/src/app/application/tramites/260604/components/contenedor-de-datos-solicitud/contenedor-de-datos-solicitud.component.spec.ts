import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContenedorDeDatosSolicitudComponent } from './contenedor-de-datos-solicitud.component';
import { Tramite260604Query } from '../../estados/tramite260604Query.query';
import { Tramite260604Store } from '../../estados/tramite260604Store.store';
import { CommonModule } from '@angular/common';

import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DatosDeTablaSeleccionados, DatosSolicitudFormState, TablaMercanciasDatos, TablaOpcionConfig, TablaScianConfig } from '../../../../shared/models/shared2606/datos-solicitud.model';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/shared2606/datos-de-la-solicitud/datos-de-la-solicitud.component';
const mockToastr = {
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
}
describe('ContenedorDeDatosSolicitudComponent', () => {
  let component: ContenedorDeDatosSolicitudComponent;
  let fixture: ComponentFixture<ContenedorDeDatosSolicitudComponent>;
  let mockTramite260604Query: jest.Mocked<Tramite260604Query>;
  let mockTramite260604Store: jest.Mocked<Tramite260604Store>;

  beforeEach(() => {
    mockTramite260604Query = {
      selectTramiteState$: of({
        opcionConfigDatos: [],
        scianConfigDatos: [],
        tablaMercanciasConfigDatos: [],
      }) as any, // Ensure compatibility with the expected type
    } as unknown as jest.Mocked<Tramite260604Query>; // Cast to jest.Mocked type

    mockTramite260604Store = {
      updateOpcionConfigDatos: jest.fn() as any, // Ensure compatibility with the expected type
      updateScianConfigDatos: jest.fn() as any,
      updateTablaMercanciasConfigDatos: jest.fn() as any,
      updateDatosSolicitudFormState: jest.fn() as any,
      update: jest.fn() as any,
    } as unknown as jest.Mocked<Tramite260604Store>; // Cast to jest.Mocked type

    TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonModule, DatosDeLaSolicitudComponent, ContenedorDeDatosSolicitudComponent, HttpClientModule],
      providers: [
        { provide: Tramite260604Query, useValue: mockTramite260604Query },
        { provide: Tramite260604Store, useValue: mockTramite260604Store },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: ToastrService, useValue: mockToastr }

      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContenedorDeDatosSolicitudComponent);
    component = fixture.componentInstance;
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
    const mockEvent: TablaOpcionConfig[] = [{
      fechaCreacion: 'test', mercancia: 'test', cantidad: 'test', proveedor: 'test',
      rfcSanitario: '',
      denominacionRazon: '',
      correoElectronico: '',
      codigoPostal: '',
      estado: '',
      municipioAlcaldia: '',
      localidad: '',
      colonia: '',
      calleYNumero: '',
      calle: '',
      lada: '',
      telefono: '',
      aviso: '',
      licenciaSanitaria: '',
      regimen: '',
      adunasDeEntradas: '',
      aeropuerto: false,
      aeropuertoDos: false,
      publico: '',
      representanteRfc: '',
      representanteNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      regimenLaMercancia: '',
      aduana: '',
      mercancias: [],
      scian: [],
      manifesto: '',
      manifiestosCasillaDeVerificacion: false
    }];
    component.opcionSeleccionado(mockEvent);
    expect(mockTramite260604Store.updateOpcionConfigDatos).toHaveBeenCalledWith(mockEvent);
  });

  it('scianSeleccionado should call updateScianConfigDatos on the store', () => {
    const mockEvent: TablaScianConfig[] = [{ descripcion: 'test', clave: 'testClave' }];
    component.scianSeleccionado(mockEvent);
    expect(mockTramite260604Store.updateScianConfigDatos).toHaveBeenCalledWith(mockEvent);
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
    expect(mockTramite260604Store.updateTablaMercanciasConfigDatos).toHaveBeenCalledWith(mockEvent);
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
    expect(mockTramite260604Store.updateDatosSolicitudFormState).toHaveBeenCalledWith(mockEvent);
  });

  it('datosDeTablaSeleccionados should call update on the store with correct data', () => {
    const mockEvent: DatosDeTablaSeleccionados = {
      opcionSeleccionados: [{
        fechaCreacion: 'test', mercancia: 'test', cantidad: 'test', proveedor: 'test',
        rfcSanitario: '',
        denominacionRazon: '',
        correoElectronico: '',
        codigoPostal: '',
        estado: '',
        municipioAlcaldia: '',
        localidad: '',
        colonia: '',
        calleYNumero: '',
        calle: '',
        lada: '',
        telefono: '',
        aviso: '',
        licenciaSanitaria: '',
        regimen: '',
        adunasDeEntradas: '',
        aeropuerto: false,
        aeropuertoDos: false,
        publico: '',
        representanteRfc: '',
        representanteNombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        regimenLaMercancia: '',
        aduana: '',
        mercancias: [],
        scian: [],
        manifesto: '',
        manifiestosCasillaDeVerificacion: false
      }],
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
    expect(mockTramite260604Store.update).toHaveBeenCalled();
  });

  it('ngOnDestroy should emit and complete destroyNotifier$', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalledTimes(1);
    expect(completeNotifierSpy).toHaveBeenCalledTimes(1);
  });
    it('should run #validarContenedor()', async () => {
    component.datosDeLaSolicitudComponent = component.datosDeLaSolicitudComponent || {};
    component.datosDeLaSolicitudComponent.formularioSolicitudValidacion = jest.fn();
    component.validarContenedor();
  });
});