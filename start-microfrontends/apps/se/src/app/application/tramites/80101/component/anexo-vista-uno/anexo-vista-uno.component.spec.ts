import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnexoVistaUnoComponent } from '../../../../80104/component/anexo-vista-uno/anexo-vista-uno.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Tramite80101Store } from '../../estados/tramite80101.store';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { of, Subject } from 'rxjs';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { ANEXO_I_SERVICIO, ANEXO_IMPORTACION_SERVICIO } from '../../../../shared/constantes/anexo-dos-y-tres.enum';

describe('AnexoVistaUnoComponent', () => {
  let component: AnexoVistaUnoComponent;
  let fixture: ComponentFixture<AnexoVistaUnoComponent>;
  let store: jest.Mocked<Tramite80101Store>;
  let query: jest.Mocked<Tramite80101Query>;
  let router: jest.Mocked<Router>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    store = {
      setImportarDatosTabla: jest.fn(),
      setExportarDatosTabla: jest.fn(),
      setAnnexoUnoSeccionActiva: jest.fn(),
      setDatosParaNavegar: jest.fn(),
      setProyectoImmexTablaLista: jest.fn(),
      setProveedorClienteDatosTablaUno: jest.fn(),
      setProveedorClienteDatosTablaDos: jest.fn(),
    } as any;

    query = {
      selectImportarTablsDatos$: of([]),
      selectExportarTablsDatos$: of([]),
    } as any;

    router = {
      navigate: jest.fn(),
    } as any;

    activatedRoute = {} as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [AnexoVistaUnoComponent],
      providers: [
        { provide: Tramite80101Store, useValue: store },
        { provide: Tramite80101Query, useValue: query },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnexoVistaUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize anexoUnoConfig and anexoImportacionConfig', () => {
    expect(component.anexoUnoConfig.anexoUnoTablaSeleccionRadio).toBe(TablaSeleccion.RADIO);
    expect(component.anexoUnoConfig.anexoUnoEncabezadoDeTabla).toBe(ANEXO_I_SERVICIO);
    expect(component.anexoImportacionConfig.anexoDosTablaSeleccionRadio).toBe(TablaSeleccion.RADIO);
    expect(component.anexoImportacionConfig.anexoDosEncabezadoDeTabla).toBe(ANEXO_IMPORTACION_SERVICIO);
  });

  it('ngOnInit should subscribe and update anexoUnoTablaLista and anexoDosTablaLista', () => {
    const importarTablsDatos = [{ id: 1 }] as any;
    const exportarTablsDatos = [{ id: 2 }] as any;
    const importar$ = new Subject<any[]>();
    const exportar$ = new Subject<any[]>();
    query.selectImportarTablsDatos$ = importar$.asObservable();
    query.selectExportarTablsDatos$ = exportar$.asObservable();

    component.ngOnInit();

    importar$.next(importarTablsDatos);
    expect(component.anexoUnoTablaLista).toEqual(importarTablsDatos);

    exportar$.next(exportarTablsDatos);
    expect(component.anexoDosTablaLista).toEqual(exportarTablsDatos);
  });

  it('obtenerAnexoUnoDevolverLaLlamada should update anexoUnoTablaLista and call store', () => {
    const event = [{ id: 1 }] as any;
    component.obtenerAnexoUnoDevolverLaLlamada(event);
    expect(component.anexoUnoTablaLista).toEqual(event);
    expect(store.setImportarDatosTabla).toHaveBeenCalledWith(event);

    component.obtenerAnexoUnoDevolverLaLlamada(undefined as any);
    expect(component.anexoUnoTablaLista).toEqual([]);
    expect(store.setImportarDatosTabla).toHaveBeenCalledWith([]);
  });

  it('obtenerAnexoDosDevolverLaLlamada should update anexoDosTablaLista and call store', () => {
    const event = [{ id: 2 }] as any;
    component.obtenerAnexoDosDevolverLaLlamada(event);
    expect(component.anexoDosTablaLista).toEqual(event);
    expect(store.setExportarDatosTabla).toHaveBeenCalledWith(event);

    component.obtenerAnexoDosDevolverLaLlamada(undefined as any);
    expect(component.anexoDosTablaLista).toEqual([]);
    expect(store.setExportarDatosTabla).toHaveBeenCalledWith([]);
  });

  it('rutaLaFraccionDeComplemento should navigate and set store values if event is valid', () => {
    const event = { catagoria: 'cat', id: 1, datos: { foo: 'bar' } };
    component.rutaLaFraccionDeComplemento(event as any);
    expect(store.setAnnexoUnoSeccionActiva).toHaveBeenCalledWith(1);
    expect(store.setDatosParaNavegar).toHaveBeenCalledWith({ foo: 'bar' });
    expect(router.navigate).toHaveBeenCalledWith(['../cat'], { relativeTo: activatedRoute });
  });

  it('rutaLaFraccionDeComplemento should do nothing if event is invalid', () => {
    component.rutaLaFraccionDeComplemento(undefined as any);
    expect(store.setAnnexoUnoSeccionActiva).not.toHaveBeenCalled();
    expect(store.setDatosParaNavegar).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('setProyectoImmex should call store.setProyectoImmexTablaLista', () => {
    const event = [{ id: 1 }] as any;
    component.setProyectoImmex(event);
    expect(store.setProyectoImmexTablaLista).toHaveBeenCalledWith(event);
  });

  it('obtenerProveedorCliente should call setProveedorClienteDatosTablaUno if id is cliente', () => {
    const event = { data: [{ id: 1 }], id: 'cliente' };
    component.obtenerProveedorCliente(event as any);
    expect(store.setProveedorClienteDatosTablaUno).toHaveBeenCalledWith(event.data);
    expect(store.setProveedorClienteDatosTablaDos).not.toHaveBeenCalled();
  });

  it('obtenerProveedorCliente should call setProveedorClienteDatosTablaDos if id is not cliente', () => {
    const event = { data: [{ id: 2 }], id: 'proveedor' };
    component.obtenerProveedorCliente(event as any);
    expect(store.setProveedorClienteDatosTablaDos).toHaveBeenCalledWith(event.data);
    expect(store.setProveedorClienteDatosTablaUno).not.toHaveBeenCalled();
  });

  it('ngOnDestroy should complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});