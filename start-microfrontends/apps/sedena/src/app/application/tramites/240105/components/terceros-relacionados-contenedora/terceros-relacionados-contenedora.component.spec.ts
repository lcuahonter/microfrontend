import { TestBed } from '@angular/core/testing';
import { TercerosRelacionadosContenedoraComponent } from './terceros-relacionados-contenedora.component';
import { Tramite240105Query } from '../../estados/tramite240105Query.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite240105Store } from '../../../240105/estados/tramite240105Store.store';
import { of } from 'rxjs';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { ActivatedRoute } from '@angular/router';

const viewContainerRefMock = {
  element: {},
  injector: {},
  parentInjector: {},
  clear: jest.fn(),
  get: jest.fn(),
  indexOf: jest.fn(),
  insert: jest.fn(),
  move: jest.fn(),
  remove: jest.fn(),
  createComponent: jest.fn(),
  length: 0
} as any;

const modalComponentMock = {
  abrir: jest.fn(),
  cerrar: jest.fn(),
  container: viewContainerRefMock,
  mostrarModal: jest.fn(),
  loadComponent: jest.fn(),
  ngOnDestroy: jest.fn()
};

describe('TercerosRelacionadosContenedoraComponent', () => {
  let component: TercerosRelacionadosContenedoraComponent;
  let fixture: any;

  const tramiteQueryMock = {
    getDestinatarioFinalTablaDatos$: of([{ id: 1 } as DestinoFinal]),
    getProveedorTablaDatos$: of([{ id: 2 } as Proveedor])
  };

  const consultaQueryMock = {
    selectConsultaioState$: of({ readonly: true })
  };

  const tramiteStoreMock = {
    actualizarDatosDestinatario: jest.fn(),
    actualizarDatosProveedor: jest.fn(),
    eliminarDestinatarioFinal: jest.fn(),
    eliminareliminarProveedorFinal: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TercerosRelacionadosContenedoraComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Tramite240105Query, useValue: tramiteQueryMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: Tramite240105Store, useValue: tramiteStoreMock },
        { provide: DatosSolicitudService, useValue: {} },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosContenedoraComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to destinatarioFinalTablaDatos and proveedorTablaDatos on init', () => {
    expect(component.destinatarioFinalTablaDatos).toEqual([{ id: 1 }]);
    expect(component.proveedorTablaDatos).toEqual([{ id: 2 }]);
  });

  it('should set esFormularioSoloLectura from consultaQuery', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should call abrir modal with AgregarDestinatarioFinalContenedoraComponent on agregar-destino-final event', () => {
    component.openModal('agregar-destino-final');
  });

  it('should call abrir modal with AgregarProveedorContenedoraComponent on agregar-proveedor event', () => {
    component.openModal('agregar-proveedor');
  });

  it('should call tramiteStore.actualizarDatosDestinatario and openModal on modificarDestinarioDatos', () => {
    const datos = { id: 10 } as DestinoFinal;
    jest.spyOn(component, 'openModal');

    component.modificarDestinarioDatos(datos);

    expect(tramiteStoreMock.actualizarDatosDestinatario).toHaveBeenCalledWith(datos);
    expect(component.openModal).toHaveBeenCalledWith('agregar-destino-final');
  });

  it('should call tramiteStore.actualizarDatosProveedor and openModal on modificarProveedorDatos', () => {
    const datos = { id: 20 } as Proveedor;
    jest.spyOn(component, 'openModal');

    component.modificarProveedorDatos(datos);

    expect(tramiteStoreMock.actualizarDatosProveedor).toHaveBeenCalledWith(datos);
    expect(component.openModal).toHaveBeenCalledWith('agregar-proveedor');
  });

  it('should call tramiteStore.eliminarDestinatarioFinal on eliminarDestinatarioFinal', () => {
    const datos = { id: 30 } as DestinoFinal;

    component.eliminarDestinatarioFinal(datos);

    expect(tramiteStoreMock.eliminarDestinatarioFinal).toHaveBeenCalledWith(datos);
  });

  it('should call tramiteStore.eliminareliminarProveedorFinal on eliminarProveedor', () => {
    const datos = { id: 40 } as Proveedor;

    component.eliminarProveedor(datos);

    expect(tramiteStoreMock.eliminareliminarProveedorFinal).toHaveBeenCalledWith(datos);
  });

  it('should call modalComponent.cerrar on cerrarModal', () => {
    component.cerrarModal();

  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroy$, 'complete');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
