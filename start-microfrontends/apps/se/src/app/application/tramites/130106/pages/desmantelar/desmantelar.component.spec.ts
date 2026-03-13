import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesmantelarComponent } from './desmantelar.component';
import { BtnContinuarComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { DatosComponent } from '../datos/datos.component';
import { Solocitud130106Service } from '../../service/service130106.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { Solicitud130106State } from '../../../../estados/tramites/tramite130106.store';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';

const mockSolicitudState: Solicitud130106State = {
  idSolicitud: 1,
  regimen: '',
  clasificacion: '',
  solicitudDescripcion: '',
  producto: '',
  fraccion: '',
  cantidad: '',
  valorFacturaUSD: '',
  unidadMedida: '',
  cantidadPartidasDeLaMercancia: '',
  descripcionPartidasDeLaMercancia: '',
  valorPartidaUSDPartidasDeLaMercancia: '',
  cantidadTotal: '',
  valorTotalUSD: '',
  bloque: '',
  usoEspecifico: '',
  justificacionImportacionExportacion: '',
  observaciones: '',
  entidad: '',
  representacion: '',
  filaSeleccionada: [],
  tableBodyData: [],
  mostrarTabla: false,
  defaultSelect: '',
  defaultProducto: '',
  fechasSeleccionadas: [],
  solicitud: '',
  factura: '',
  umt: '',
  mercanciaCantidad: '',
  mercanciaFactura: '',
  descripcion: '',
  especifico: '',
  justificacion: '',
  disponible: '',
  seleccionado: '',
  selectRangoDias: [],
  valorPartidaUSD: 0,
};

describe('DesmantelarComponent', () => {
  let component: DesmantelarComponent;
  let fixture: ComponentFixture<DesmantelarComponent>;
  let solocitud130106Service: any;
  let toastrService: any;

  beforeEach(async () => {
    solocitud130106Service = {
      getAllState: jest.fn().mockReturnValue(of(mockSolicitudState)),
      getPayloadDatos: jest.fn().mockReturnValue([]),
      guardarDatosPost: jest.fn().mockReturnValue(of({ codigo: '00', mensaje: 'ok', datos: { id_solicitud: 123, idSolicitud: 123 } })),
    };
    toastrService = { success: jest.fn(), error: jest.fn() };
    await TestBed.configureTestingModule({
      imports:[require('@angular/common/http/testing').HttpClientTestingModule, SolicitanteComponent, WizardComponent,BtnContinuarComponent],
      declarations: [DesmantelarComponent, DatosComponent],
      providers: [
        { provide: Solocitud130106Service, useValue: solocitud130106Service },
        { provide: ToastrService, useValue: toastrService },
      ],
      schemas: [require('@angular/core').CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(DesmantelarComponent);
    component = fixture.componentInstance;
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getValorIndice should call obtenerDatosDelStore for indice 1 and accion cont', () => {
    const spy = jest.spyOn(component, 'obtenerDatosDelStore');
    component.indice = 1;
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(spy).toHaveBeenCalled();
  });

  it('getValorIndice should call pasoNavegarPor for valid valor', () => {
    const spy = jest.spyOn(component, 'pasoNavegarPor');
    component.indice = 2; // Ensure else branch is triggered
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(spy).toHaveBeenCalledWith({ valor: 2, accion: 'cont' });
  });

  it('pasoNavegarPor should navigate forward and set alertaNotificacion', () => {
    component.wizardComponent.siguiente = jest.fn();
    component.folioTemporal = 123;
    component.pasoNavegarPor({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.alertaNotificacion).toBeDefined();
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('pasoNavegarPor should navigate backward', () => {
    component.wizardComponent.atras = jest.fn();
    component.pasoNavegarPor({ valor: 2, accion: 'back' });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('obtenerDatosDelStore should call guardar with state', () => {
    const spy = jest.spyOn(component, 'guardar');
    component.obtenerDatosDelStore({ valor: 1, accion: 'cont' });
    expect(spy).toHaveBeenCalledWith(mockSolicitudState, { valor: 1, accion: 'cont' });
  });

  it('guardar should resolve and set folioTemporal', async () => {
    component.solicitudState = mockSolicitudState;
    const result = await component.guardar(mockSolicitudState, { valor: 2, accion: 'cont' });
    expect(result.codigo).toBe('00');
    expect(component.folioTemporal).toBe(123);
    expect(toastrService.success).toHaveBeenCalled();
  });

  it('guardar should reject if solicitudState is undefined', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    component.solicitudState = undefined as any;
    await expect(component.guardar(mockSolicitudState, { valor: 2, accion: 'cont' })).rejects.toBe('solicitudState is undefined');
  });
});
