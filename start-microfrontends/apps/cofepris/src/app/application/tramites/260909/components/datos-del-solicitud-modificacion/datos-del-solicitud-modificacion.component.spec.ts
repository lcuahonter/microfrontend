import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DatosDelSolicitudModificacionComponent } from './datos-del-solicitud-modificacion.component';
import { EstablecimientoService } from '../../service/establecimiento.service';
import { DatosDelSolicituteSeccionStateStoreI } from '../../estados/datos-del-solicitud-seccion.store';
import { DatosDelSeccionQuery } from '../../estados/datos-del-solicitud-seccion.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DatosDelSolicitudModificacionComponent', () => {
  let component: DatosDelSolicitudModificacionComponent;
  let fixture: ComponentFixture<DatosDelSolicitudModificacionComponent>;
  let mockEstablecimientoService: any;
  let mockStateStore: any;
  let mockQuery: any;
  let mockDomicilioEstablecimientoQuery: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockEstablecimientoService = {
      getSciandata: jest.fn().mockReturnValue(of([])),
      getEstadodata: jest.fn().mockReturnValue(of([])),
      getJustificationData: jest.fn().mockReturnValue(of([])),
    };

    mockStateStore = {
      update: jest.fn(),
    };

    mockDomicilioEstablecimientoQuery = {
      select: jest.fn().mockReturnValue(of({})),
    };

    mockQuery = {
      select: jest.fn().mockReturnValue(of({})),
    };

    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        require('@angular/common/http/testing').HttpClientTestingModule,
        DatosDelSolicitudModificacionComponent,
      ],
      providers: [
        { provide: EstablecimientoService, useValue: mockEstablecimientoService },
        { provide: DatosDelSolicituteSeccionStateStoreI, useValue: mockStateStore },
        { provide: DatosDelSeccionQuery, useValue: mockDomicilioEstablecimientoQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDelSolicitudModificacionComponent);
    component = fixture.componentInstance;
    component['destroy$'] = new Subject<void>();
    component.mercanciasTablaDatos = [];
    fixture.detectChanges();
  });

  afterEach(() => {
    component['destroy$'].next();
    component['destroy$'].complete();
    fixture.destroy();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería inicializar los formularios en ngOnInit', () => {
    component.ngOnInit();
    expect(component.domicilioEstablecimiento).toBeDefined();
    expect(component.scianForm).toBeDefined();
    expect(component.solicitudEstablecimientoForm).toBeDefined();
    expect(component.formMercancias).toBeDefined();
  });

  it('debería cargar datos SCIAN', () => {
    const mockScianData = [{ id: 1, descripcion: 'SCIAN 1' }];
    mockEstablecimientoService.getSciandata.mockReturnValue(of(mockScianData));
    component.loadScian();
    expect(component.scianJson).toEqual(mockScianData);
  });

  it('debería cargar datos de estado', () => {
    const mockEstadoData = [{ id: 1, descripcion: 'Estado 1' }];
    mockEstablecimientoService.getEstadodata.mockReturnValue(of(mockEstadoData));
    component.loadEstadoData();
    expect(component.estado).toEqual(mockEstadoData);
  });

  it('debería alternar el estado colapsable', () => {
    expect(component.colapsable).toBe(false);
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(true);
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(false);
  });

  it('debería alternar el estado colapsableDos', () => {
    expect(component.colapsableDos).toBe(false);
    component.mostrar_colapsableDos();
    expect(component.colapsableDos).toBe(true);
    component.mostrar_colapsableDos();
    expect(component.colapsableDos).toBe(false);
  });

  it('debería alternar el estado colapsableTres', () => {
    expect(component.colapsableTres).toBe(false);
    component.mostrar_colapsableTres();
    expect(component.colapsableTres).toBe(true);
    component.mostrar_colapsableTres();
    expect(component.colapsableTres).toBe(false);
  });

  it('debería abrir el modal y establecer la notificación y el índice', () => {
    component.abrirModal(2);
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.elementoParaEliminar).toBe(2);
  });

  it('debería eliminar un pedimento si borrar es true', () => {
    component.pedimentos = [{}, {}, {}] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(2);
  });

  it('no debería eliminar un pedimento si borrar es false', () => {
    component.pedimentos = [{}, {}, {}] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(false);
    expect(component.pedimentos.length).toBe(3);
  });

  it('debería limpiar el formulario SCIAN', () => {
    component.scianForm = new FormBuilder().group({
      scian: ['valor'],
      descripcionScian: ['valor'],
    });
    component.scianForm.get('scian')?.setValue('algo');
    component.limpiarScianForm();
    expect(component.scianForm.get('scian')?.value).toBeNull();
    expect(component.scianForm.get('descripcionScian')?.value).toBeNull();
  });

  it('debería actualizar el estado del formulario en onContriloChange', () => {
    component.scianForm = new FormBuilder().group({
      scian: ['valor'],
      descripcionScian: ['valor'],
    });
    component.domicilioEstablecimiento = new FormBuilder().group({
      scian: ['valor'],
    });
    component['domicilioEstablecimientoStore'] = mockStateStore;
    component.onContriloChange('scian');
    expect(mockStateStore.update).toHaveBeenCalled();
  });

  it('debería actualizar el estado y habilitar/deshabilitar observaciones en enCambioDeControl', () => {
    component.domicilioEstablecimiento = new FormBuilder().group({
      ideGenerica1: [''],
      observaciones: [{ value: '', disabled: true }],
    });
    component['domicilioEstablecimientoStore'] = mockStateStore;
    component.domicilioEstablecimiento.get('ideGenerica1')?.setValue('modificacion');
    component.enCambioDeControl('ideGenerica1');
    expect(component.domicilioEstablecimiento.get('observaciones')?.enabled).toBe(true);

    component.domicilioEstablecimiento.get('ideGenerica1')?.setValue('otro');
    component.enCambioDeControl('ideGenerica1');
    expect(component.domicilioEstablecimiento.get('observaciones')?.disabled).toBe(true);
  });

  it('debería actualizar el estado del formulario en enControlCambioFormulario', () => {
    component.solicitudEstablecimientoForm = new FormBuilder().group({
      noLicenciaSanitaria: ['valor'],
    });
    component['domicilioEstablecimientoStore'] = mockStateStore;
    component.enControlCambioFormulario('noLicenciaSanitaria');
    expect(mockStateStore.update).toHaveBeenCalled();
  });

  it('debería deshabilitar y habilitar el campo noLicenciaSanitaria según el checkbox', () => {
    component.solicitudEstablecimientoForm = new FormBuilder().group({
      noLicenciaSanitaria: ['valor'],
    });
    const event = { target: { checked: true } } as any;
    component.toggleNoLicenciaSanitaria(event);
    expect(component.solicitudEstablecimientoForm.get('noLicenciaSanitaria')?.disabled).toBe(true);

    const event2 = { target: { checked: false } } as any;
    component.toggleNoLicenciaSanitaria(event2);
    expect(component.solicitudEstablecimientoForm.get('noLicenciaSanitaria')?.enabled).toBe(true);
  });

  it('debería abrir el modal de mercancía', () => {
    component.modalAddAgentMercanciasInstance = { show: jest.fn() } as any;
    component.abrirModalMercancia();
    expect(component.modalAddAgentMercanciasInstance.show).toHaveBeenCalled();
  });

  it('debería mostrar el modal de clave SCIAN', () => {
    component.modalInstance = { show: jest.fn() } as any;
    component.mostrarModeloClave();
    expect(component.modalInstance.show).toHaveBeenCalled();
  });

  it('debería cerrar el modal si existe la instancia', () => {
    component.modalInstance = { hide: jest.fn() } as any;
    component.cerrarModal();
    expect(component.modalInstance.hide).toHaveBeenCalled();
  });

  it('no debería fallar cerrarModal si no existe la instancia', () => {
    component.modalInstance = undefined as any;
    expect(() => component.cerrarModal()).not.toThrow();
  });
});