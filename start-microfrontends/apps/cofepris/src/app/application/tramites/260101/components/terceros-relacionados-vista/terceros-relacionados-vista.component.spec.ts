import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosVistaComponent } from './terceros-relacionados-vista.component';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { ImportacionProductosService } from '../../services/importacion-productos.service';
import { TercerosRelacionadosFebService } from '../../../../shared/services/tereceros-relacionados-feb.service';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';
import { Tramite260101Store } from '../../estados/tramite260101Store.store';
import {
  Fabricante,
  Destinatario,
  Proveedor,
  Facturador,
} from '../../../../shared/models/terceros-relacionados.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('TercerosRelacionadosVistaComponent', () => {
  let component: TercerosRelacionadosVistaComponent;
  let fixture: ComponentFixture<TercerosRelacionadosVistaComponent>;
  let tramiteStore: jest.Mocked<Tramite260101Store>;
  let tramiteQuery: jest.Mocked<Tramite260101Query>;
  let importacionService: jest.Mocked<ImportacionProductosService>;

  const mockFabricantes: Fabricante[] = [];
  const mockDestinatarios: Destinatario[] = [];
  const mockProveedores: Proveedor[] = [];
  const mockFacturadores: Facturador[] = [];

  beforeEach(async () => {
    tramiteStore = {
      updateFabricanteTablaDatos: jest.fn(() => of()),
      updateDestinatarioFinalTablaDatos: jest.fn(() => of()),
      updateProveedorTablaDatos: jest.fn(() => of()),
      updateFacturadorTablaDatos: jest.fn(() => of()),
      fabricanteTablaModificaDatos: jest.fn(() => of()),
      destinatarioFinalTablaModificaDatos: jest.fn(() => of()),
      proveedorTablaModificaDatos: jest.fn(() => of()),
      facturadorTablaModificaDatos: jest.fn(() => of()),
    } as any;

    tramiteQuery = {
      getFabricanteTablaDatos$: of(mockFabricantes),
      getDestinatarioFinalTablaDatos$: of(mockDestinatarios),
      getProveedorTablaDatos$: of(mockProveedores),
      getFacturadorTablaDatos$: of(mockFacturadores),
    } as any;

    importacionService = {
      getFabricanteTablaDatos: jest.fn(() => of(mockFabricantes)),
      getDestinatarioTablaDatos: jest.fn(() => of(mockDestinatarios)),
      getProveedorTablaDatos: jest.fn(() => of(mockProveedores)),
      getFacturadorTablaDatos: jest.fn(() => of(mockFacturadores)),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TercerosRelacionadosComponent,
        TercerosRelacionadosVistaComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        { provide: Tramite260101Store, useValue: tramiteStore },
        { provide: Tramite260101Query, useValue: tramiteQuery },
        { provide: TercerosRelacionadosFebService, useValue: importacionService },
        {
          provide: ImportacionProductosService,
          useValue: importacionService,
        },
        {
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: '123' }),
          queryParams: of({}),
          snapshot: { paramMap: { get: () => '123' } },
        },
      },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosVistaComponent);
    component = fixture.componentInstance;
    importacionService.getFabricanteTablaDatos.mockReturnValue(
      of(mockFabricantes)
    );
    importacionService.getDestinatarioTablaDatos.mockReturnValue(
      of(mockDestinatarios)
    );
    importacionService.getProveedorTablaDatos.mockReturnValue(
      of(mockProveedores)
    );
    importacionService.getFacturadorTablaDatos.mockReturnValue(
      of(mockFacturadores)
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe and set fabricanteTablaDatos', () => {
    component.ngOnInit();
    expect(component.fabricanteTablaDatos).toEqual(mockFabricantes);
  });

  it('should subscribe and set destinatarioFinalTablaDatos', () => {
    component.ngOnInit();
    expect(component.destinatarioFinalTablaDatos).toEqual(mockDestinatarios);
  });

  it('should subscribe and set proveedorTablaDatos', () => {
    component.ngOnInit();
    expect(component.proveedorTablaDatos).toEqual(mockProveedores);
  });

  it('should subscribe and set facturadorTablaDatos', () => {
    component.ngOnInit();
    expect(component.facturadorTablaDatos).toEqual(mockFacturadores);
  });

  it('should call addFabricantes with response', () => {
    const spy = jest.spyOn(component, 'addFabricantes');
    component.cargarDatos();
    expect(spy).toHaveBeenCalledWith(mockFabricantes);
  });

  it('should call addDestinatarios with response', () => {
    const spy = jest.spyOn(component, 'addDestinatarios');
    component.cargarDatos();
    expect(spy).toHaveBeenCalledWith(mockDestinatarios);
  });

  it('should call addProveedores with response', () => {
    const spy = jest.spyOn(component, 'addProveedores');
    component.cargarDatos();
    expect(spy).toHaveBeenCalledWith(mockProveedores);
  });

  it('should call addFacturadores with response', () => {
    const spy = jest.spyOn(component, 'addFacturadores');
    component.cargarDatos();
    expect(spy).toHaveBeenCalledWith(mockFacturadores);
  });

  it('addFabricantes should call updateFabricanteTablaDatos', () => {
    component.addFabricantes(mockFabricantes);
    expect(tramiteStore.updateFabricanteTablaDatos).toHaveBeenCalledWith(
      mockFabricantes
    );
  });

  it('addDestinatarios should call updateDestinatarioFinalTablaDatos', () => {
    component.addDestinatarios(mockDestinatarios);
    expect(tramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith(
      mockDestinatarios
    );
  });

  it('addProveedores should call updateProveedorTablaDatos', () => {
    component.addProveedores(mockProveedores);
    expect(tramiteStore.updateProveedorTablaDatos).toHaveBeenCalledWith(
      mockProveedores
    );
  });

  it('addFacturadores should call updateFacturadorTablaDatos', () => {
    component.addFacturadores(mockFacturadores);
    expect(tramiteStore.updateFacturadorTablaDatos).toHaveBeenCalledWith(
      mockFacturadores
    );
  });

  it('fabricanteEventoModificar should call fabricanteTablaModificaDatos', () => {
    component.fabricanteEventoModificar(mockFabricantes);
    expect(tramiteStore.fabricanteTablaModificaDatos).toHaveBeenCalledWith(
      mockFabricantes
    );
  });

  it('destinatarioEventoModificar should call destinatarioFinalTablaModificaDatos', () => {
    component.destinatarioEventoModificar(mockDestinatarios);
    expect(
      tramiteStore.destinatarioFinalTablaModificaDatos
    ).toHaveBeenCalledWith(mockDestinatarios);
  });

  it('should complete destroy$', () => {
    const destroy$ = (component as any).destroy$ as Subject<void>;
    const nextSpy = jest.spyOn(destroy$, 'next');
    const completeSpy = jest.spyOn(destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
