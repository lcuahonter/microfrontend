import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcesoRequerimientoComponent } from './proceso-requerimiento.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CatalogosService } from '@ng-mf/data-access-user';
import { AtenderRequerimientoService } from '@ng-mf/data-access-user';
import { ConsultaioStore, ConsultaioQuery, TramiteFolioQueries } from '@ng-mf/data-access-user';

class ConsultaioQueryStub {
  selectConsultaioState$ = of({
    procedureId: 1,
    parameter: 'param',
    department: 'AGA',
    folioTramite: 'FOLIO123',
    tipoDeTramite: 'TIPO',
    estadoDeTramite: 'ESTADO'
  });
}

describe('ProcesoRequerimientoComponent', () => {
  let component: ProcesoRequerimientoComponent;
  let fixture: ComponentFixture<ProcesoRequerimientoComponent>;
  let routerMock: any;
  let consultaioStoreMock: any;
  let consultaioQueryMock: any;
  let catalogosServiceMock: any;
  let requerimientoServiceMock: any;
  let tramiteQueriesMock: any;

  beforeEach(async () => {
    routerMock = { navigate: jest.fn(), url: '/aga/seleccion-tramite' };
    consultaioStoreMock = { establecerConsultaio: jest.fn() };
    consultaioQueryMock = {
      selectConsultaioState$: of({
        procedureId: 1,
        parameter: 'param',
        department: 'AGA',
        folioTramite: 'FOLIO123',
        tipoDeTramite: 'TIPO',
        estadoDeTramite: 'ESTADO'
      })
    };
    catalogosServiceMock = { getCatalogo: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Doc' }])) };
    requerimientoServiceMock = {
      informacionRequisitos: jest.fn().mockReturnValue(of({ data: { fechaRequerimiento: '2024-01-01', justificacionRequerimiento: 'Justificación' } }))
    };
    tramiteQueriesMock = { getTramite: jest.fn().mockReturnValue('FOLIO123') };

    await TestBed.configureTestingModule({
  imports: [ProcesoRequerimientoComponent], // <-- Use imports, not declarations!
  providers: [
    { provide: Router, useValue: routerMock },
    { provide: ConsultaioStore, useValue: consultaioStoreMock },
    { provide: CatalogosService, useValue: catalogosServiceMock },
    { provide: AtenderRequerimientoService, useValue: requerimientoServiceMock },
    { provide: TramiteFolioQueries, useValue: tramiteQueriesMock },
    // Do NOT provide ConsultaioQuery here!
  ]
})
.overrideComponent(ProcesoRequerimientoComponent, {
  set: {
    providers: [
      { provide: ConsultaioQuery, useClass: ConsultaioQueryStub }
    ]
  }
})
.compileComponents();

  fixture = TestBed.createComponent(ProcesoRequerimientoComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and call selectTramite if tramite exists', () => {
    const spy = jest.spyOn(component, 'selectTramite');
    component.tramite = 1;
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(1);
    expect(component.url).toBe('aga');
    expect(component.folio).toBe('FOLIO123');
    expect(component.txtAlerta).toContain('FOLIO123');
  });

  it('should navigate if tramite does not exist', () => {
    component.tramite = 0;
    component.departamento = 'aga';
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/aga/seleccion-tramite']);
  });

  it('should get tipos de documentos', () => {
    component.getTiposDocumentos();
    expect(catalogosServiceMock.getCatalogo).toHaveBeenCalled();
    expect(component.catalogoDocumentos.length).toBeGreaterThan(0);
  });

it('should handle getTiposDocumentos with descripcion', () => {
  catalogosServiceMock.getCatalogo.mockReturnValueOnce(of([
    { id: 1, descripcion: "", nombre: "Doc" }
  ]));
  component.getTiposDocumentos();
  expect(component.catalogoDocumentos).toEqual([
    { id: 1, descripcion: "", nombre: "Doc" }
  ]);
});

  it('should select tramite', () => {
  component.listaTrimites = [{ tramite: 1, listaComponentes: [] }] as any;
  component.selectTramite(1);
  expect(component.tramite).toBe(1);
  expect(component.slectTramite).toBeUndefined();
});

  it('should update indice and call wizard methods in getValorIndice', () => {
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.guardarDatos = {
      procedureId: "1",
      parameter: 'param',
      department: 'AGA',
      folioTramite: 'FOLIO123',
      tipoDeTramite: 'TIPO',
      estadoDeTramite: 'ESTADO',
      readonly: false,
      create: false,
      update: false,
      consultaioSolicitante: null

    };
    component.indice = 2;
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();

    component.getValorIndice({ valor: 1, accion: 'back' });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(consultaioStoreMock.establecerConsultaio).toHaveBeenCalled();
  });

  it('should not update indice if valor is out of range', () => {
    component.indice = 2;
    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(component.indice).toBe(2);
    component.getValorIndice({ valor: 5, accion: 'cont' });
    expect(component.indice).toBe(2);
  });

  it('should load component dynamically', async () => {
    const fakeComponent = () => Promise.resolve(class {});
    const li = { componentPath: fakeComponent };
    await component.loadComponent(li as any);
    expect(component.viewChild).toBeDefined();
  });

  it('should handle loadComponent with missing componentPath', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    await component.loadComponent({} as any);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should change tab in viewChildcambioDePestana', async () => {
    component.slectTramite = {
      listaComponentes: [
        { id: 1, componentPath: () => Promise.resolve(class {}) }
      ]
    } as any;
    const spy = jest.spyOn(component, 'loadComponent');
    component.viewChildcambioDePestana({ id: 1 } as any);
    expect(spy).toHaveBeenCalled();
  });

  it('should set esAcuse to true on obtieneFirma', () => {
    component.esAcuse = false;
    component.obtieneFirma('firma');
    expect(component.esAcuse).toBe(true);
  });

  it('should not set esAcuse if firma is falsy', () => {
    component.esAcuse = false;
    component.obtieneFirma('');
    expect(component.esAcuse).toBe(false);
  });

  it('should clean up on destroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spy2 = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});

window.scrollTo = jest.fn();