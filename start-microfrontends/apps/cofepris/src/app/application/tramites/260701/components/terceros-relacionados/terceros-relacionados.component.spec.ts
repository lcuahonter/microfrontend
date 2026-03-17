import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CertificadosLicenciasService } from '../../services/certificados-licencias.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

const certificadosLicenciasSvcMock = {
  getDestinatarioDatos: jest.fn().mockReturnValue(of([])),
  getFabricanteDatos: jest.fn().mockReturnValue(of([])),
};
const consultaioQueryMock = {
  selectConsultaioState$: of({ readonly: false }),
};
const modalServiceMock = {
  show: jest.fn()
};

describe('TercerosRelacionadosComponent', () => {
  let component: TercerosRelacionadosComponent;
  let fixture: ComponentFixture<TercerosRelacionadosComponent>;

  beforeEach(async () => {
    certificadosLicenciasSvcMock.getDestinatarioDatos.mockClear();
    certificadosLicenciasSvcMock.getFabricanteDatos.mockClear();
    modalServiceMock.show.mockClear();

    await TestBed.configureTestingModule({
      imports: [TercerosRelacionadosComponent],
      providers: [
        { provide: CertificadosLicenciasService, useValue: certificadosLicenciasSvcMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: BsModalService, useValue: modalServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe establecer destinatarioDatos y fabricanteTablaDatos al inicializar', () => {
    expect(component.destinatarioDatos).toEqual([]);
    expect(component.fabricanteTablaDatos).toEqual([]);
  });

  it('debe establecer esFormularioSoloLectura desde consultaioQuery', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('debe establecer tieneFilaSeleccionada cuando se llama setTablaSeleccionDestinatario', () => {
    component.setTablaSeleccionDestinatario([{ nombre: 'test' } as any]);
    expect(component.tieneFilaSeleccionada).toBe(true);
    component.setTablaSeleccionDestinatario([]);
    expect(component.tieneFilaSeleccionada).toBe(false);
  });

  it('debe establecer tieneFilaSeleccionadaFabricante cuando se llama setTablaSeleccionFabricante', () => {
    component.setTablaSeleccionFabricante([{ nombre: 'fab' } as any]);
    expect(component.tieneFilaSeleccionadaFabricante).toBe(true);
    component.setTablaSeleccionFabricante([]);
    expect(component.tieneFilaSeleccionadaFabricante).toBe(false);
  });

  it('debe establecer nuevaNotificacion y elementoParaEliminar cuando se llama abrirModal', () => {
    component.abrirModal(2);
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.elementoParaEliminar).toBe(2);
  });

  it('debe eliminar pedimento y actualizar tablas al llamar eliminarPedimento', () => {
    component.pedimentos = [
      { id: 1 } as any,
      { id: 2 } as any,
      { id: 3 } as any
    ];
    component.elementoParaEliminar = 1;
    component.tieneFilaSeleccionada = true;
    component.tieneFilaSeleccionadaFabricante = true;
    component.destinatarioDatos = [{}, {}] as any;
    component.fabricanteTablaDatos = [{}, {}] as any;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(2);
    expect(component.destinatarioDatos.length).toBe(1);
    expect(component.fabricanteTablaDatos.length).toBe(1);
  });

  it('no debe eliminar pedimento si borrar es false', () => {
    component.pedimentos = [
      { id: 1 } as any,
      { id: 2 } as any,
      { id: 3 } as any
    ];
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(false);
    expect(component.pedimentos.length).toBe(3);
  });

  it('debe limpiar destroyNotifier$ en ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('debe eliminar solo destinatarioDatos si tieneFilaSeleccionada es true', () => {
    component.pedimentos = [{}, {}] as any;
    component.elementoParaEliminar = 0;
    component.tieneFilaSeleccionada = true;
    component.tieneFilaSeleccionadaFabricante = false;
    component.destinatarioDatos = [{}, {}] as any;
    component.fabricanteTablaDatos = [{}, {}] as any;
    component.eliminarPedimento(true);
    expect(component.destinatarioDatos.length).toBe(1);
    expect(component.fabricanteTablaDatos.length).toBe(2);
  });

  it('debe eliminar solo fabricanteTablaDatos si tieneFilaSeleccionadaFabricante es true', () => {
    component.pedimentos = [{}, {}] as any;
    component.elementoParaEliminar = 0;
    component.tieneFilaSeleccionada = false;
    component.tieneFilaSeleccionadaFabricante = true;
    component.destinatarioDatos = [{}, {}] as any;
    component.fabricanteTablaDatos = [{}, {}] as any;
    component.eliminarPedimento(true);
    expect(component.destinatarioDatos.length).toBe(2);
    expect(component.fabricanteTablaDatos.length).toBe(1);
  });

  it('no debe eliminar destinatarioDatos ni fabricanteTablaDatos si ninguno está seleccionado', () => {
    component.pedimentos = [{}, {}] as any;
    component.elementoParaEliminar = 0;
    component.tieneFilaSeleccionada = false;
    component.tieneFilaSeleccionadaFabricante = false;
    component.destinatarioDatos = [{}, {}] as any;
    component.fabricanteTablaDatos = [{}, {}] as any;
    component.eliminarPedimento(true);
    expect(component.destinatarioDatos.length).toBe(2);
    expect(component.fabricanteTablaDatos.length).toBe(2);
  });

  it('debe establecer destinatarioDatos y fabricanteTablaDatos desde el servicio en ngOnInit', () => {
    certificadosLicenciasSvcMock.getDestinatarioDatos.mockReturnValue(of([{ nombre: 'dest' }]));
    certificadosLicenciasSvcMock.getFabricanteDatos.mockReturnValue(of([{ nombre: 'fab' }]));
    component.ngOnInit();
    expect(component.destinatarioDatos).toEqual([{ nombre: 'dest' }]);
    expect(component.fabricanteTablaDatos).toEqual([{ nombre: 'fab' }]);
  });

  it('no debe fallar eliminarPedimento si los arrays están vacíos', () => {
    component.pedimentos = [];
    component.destinatarioDatos = [];
    component.fabricanteTablaDatos = [];
    component.elementoParaEliminar = 0;
    component.tieneFilaSeleccionada = true;
    component.tieneFilaSeleccionadaFabricante = true;
    expect(() => component.eliminarPedimento(true)).not.toThrow();
    expect(component.pedimentos.length).toBe(0);
    expect(component.destinatarioDatos.length).toBe(0);
    expect(component.fabricanteTablaDatos.length).toBe(0);
  });

  it('no debe eliminar nada si eliminarPedimento se llama con false y los arrays están vacíos', () => {
    component.pedimentos = [];
    component.destinatarioDatos = [];
    component.fabricanteTablaDatos = [];
    component.elementoParaEliminar = 0;
    expect(() => component.eliminarPedimento(false)).not.toThrow();
    expect(component.pedimentos.length).toBe(0);
    expect(component.destinatarioDatos.length).toBe(0);
    expect(component.fabricanteTablaDatos.length).toBe(0);
  });

  it('debe llamar ngOnDestroy y completar destroyNotifier$', () => {
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});