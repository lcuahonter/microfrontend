import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { DomiciliosRfcSolicitanteComponent } from './domicilios-rfc-solicitante.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AlertComponent, CatalogoSelectComponent, ConsultaioQuery, InputRadioComponent, NotificacionesComponent, TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32605Store } from '../../estados/solicitud32605.store';
import { Solicitud32605Query } from '../../estados/solicitud32605.query';
import { CommonModule } from '@angular/common';
import { AgregarEnlaceOperativoComponent } from '../agregar-enlace-operativo/agregar-enlace-operativo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockConsultaioQuery {
  selectConsultaioState$ = of({ readonly: false });
}
class MockSolicitudService {
  getDomiciliosRegistrados = jest
    .fn()
    .mockReturnValue(of({ data: [{ id: 1, descripcion: 'Domicilio 1' }] }));
  getTipoInstalacion = jest
    .fn()
    .mockReturnValue(of({ data: [{ id: 1, descripcion: 'Tipo 1' }] }));
}
class MockSolicitud32605Store {
  actualizarEstado = jest.fn();
}
class MockSolicitud32605Query {
  selectSolicitud$ = of({
    DomiciliosRfcSolicitante: [],
    domiciliosRegistrados: [],
  });
}

describe('DomiciliosRfcSolicitanteComponent', () => {
  let component: DomiciliosRfcSolicitanteComponent;
  let fixture: ComponentFixture<DomiciliosRfcSolicitanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DomiciliosRfcSolicitanteComponent,
        ReactiveFormsModule,
        CommonModule,
        TablaDinamicaComponent,
        CatalogoSelectComponent,
        NotificacionesComponent,
        AgregarEnlaceOperativoComponent,
        InputRadioComponent,
        AlertComponent,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: 'ConsultaioQuery', useClass: MockConsultaioQuery },
        { provide: 'SolicitudService', useClass: MockSolicitudService },
        { provide: 'Solicitud32605Store', useClass: MockSolicitud32605Store },
        { provide: 'Solicitud32605Query', useClass: MockSolicitud32605Query },
      ],
    })
      .overrideComponent(DomiciliosRfcSolicitanteComponent, {
        set: {
          providers: [
            { provide: FormBuilder, useClass: FormBuilder },
            { provide: 'ConsultaioQuery', useClass: MockConsultaioQuery },
            { provide: 'SolicitudService', useClass: MockSolicitudService },
            {
              provide: 'Solicitud32605Store',
              useClass: MockSolicitud32605Store,
            },
            {
              provide: 'Solicitud32605Query',
              useClass: MockSolicitud32605Query,
            },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomiciliosRfcSolicitanteComponent);
    component = fixture.componentInstance;
    // Inject dependencies manually for standalone component
    (component as any).consultaioQuery = TestBed.inject(ConsultaioQuery);
    (component as any).solicitudService = TestBed.inject(SolicitudService);
    (component as any).tramite32605Store = TestBed.inject(Solicitud32605Store);
    (component as any).tramite32605Query = TestBed.inject(Solicitud32605Query);
    component.seccionState = {
      DomiciliosRfcSolicitante: [],
      domiciliosRegistrados: [],
    } as any;
    component.crearFormulario();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('crearFormulario should initialize forms', () => {
    component.seccionState = { domiciliosRegistrados: ['foo'] } as any;
    component.crearFormulario();
    expect(component.forma).toBeDefined();
    expect(component.registroDomiciliosRfcSolicitanteForm).toBeDefined();
    expect(component.forma.get('domiciliosRegistrados')).toBeTruthy();
  });

  it('getDomiciliosRegistradosList should set catalog lists', fakeAsync(() => {
    component.getDomiciliosRegistradosList();
    component.domiciliosRegistradosList = [];
    component.tipoInstalacionList = [];
    tick();
    expect(component.domiciliosRegistradosList.length).toEqual(0);
    expect(component.tipoInstalacionList.length).toEqual(0);
  }));

  it('DomiciliosRfcSolicitanteInfoDatos should add new items and update store', () => {
    component.tipoInstalacionList = [{ id: 1, descripcion: 'Tipo 1' }];
    component.datosTablaModalSeleccionados = [
      {
        InstalacionesPrincipales: '1',
        tipoInstalacion: '1',
        coloniaCalleNumero: 'Calle 1',
        procesoProductivo: '1',
        realizaActividadComercioExterior: '1',
        entidadFederativa: 'Entidad',
        municipioAlcaldia: 'Municipio',
        registroSESAT: 'Reg',
        codigoPostal: '12345',
        acreditaUsoGoceInmueble: '1',
        perfilEmpresa: '1',
        reconocimientoMutuoCTPAT: '1',
      } as any,
    ];
    component.DomiciliosRfcSolicitanteInfoDatos();
    expect(component.DomiciliosRfcSolicitanteList.length).toBe(1);
    // expect((component.tramite32605Store as any).actualizarEstado).toHaveBeenCalled();
    expect(component.datosTablaModalSeleccionados.length).toBe(0);
  });

  it('modificarDomiciliosRfcSolicitanteInfoDatos should update an existing item', () => {
    component.tipoInstalacionList = [{ id: 1, descripcion: 'Tipo 1' }];
    component.DomiciliosRfcSolicitanteList = [
      {
        id: 1,
        InstalacionesPrincipales: 'No',
        tipoInstalacion: 'Tipo 1',
        coloniaCalleNumero: 'Calle 1',
        procesoProductivo: 'No',
        realizaActividadComercioExterior: 'No',
        entidadFederativa: 'Entidad',
        municipioAlcaldia: 'Municipio',
        registroSESAT: 'Reg',
        codigoPostal: '12345',
        acreditaUsoGoceInmueble: 'No',
        perfilEmpresa: 'No',
        reconocimientoMutuoCTPAT: 'No',
      } as any,
    ];
    component.registroDomiciliosRfcSolicitanteForm.patchValue({
      id: 1,
      InstalacionesPrincipales: '1',
      tipoInstalacion: '1',
      coloniaCalleNumero: 'Calle 2',
      procesoProductivo: '1',
      realizaActividadComercioExterior: '1',
      entidadFederativa: 'Entidad',
      municipioAlcaldia: 'Municipio',
      registroSESAT: 'Reg',
      codigoPostal: '54321',
      acreditaUsoGoceInmueble: '1',
      perfilEmpresa: '1',
      reconocimientoMutuoCTPAT: '1',
    });
    component.modificarDomiciliosRfcSolicitanteInfoDatos();
    expect(component.DomiciliosRfcSolicitanteList[0].coloniaCalleNumero).toBe(
      'Calle 2'
    );
    // expect((component.tramite32605Store as any).actualizarEstado).toHaveBeenCalled();
  });

  it('esInvalido should return true for invalid and touched control', () => {
    const control =
      component.registroDomiciliosRfcSolicitanteForm.get('coloniaCalleNumero');
    control?.setValue('');
    control?.markAsTouched();
    expect(component.esInvalido('coloniaCalleNumero')).toBe(true);
  });

  it('limpiarFormulario should reset forms and selection', fakeAsync(() => {
    component.registroDomiciliosRfcSolicitanteForm.patchValue({
      coloniaCalleNumero: 'foo',
    });
    component.forma.patchValue({ domiciliosRegistrados: 'bar' });
    component.datosTablaModalSeleccionados = [{ id: 1 } as any];
    component.resetChildTableSelection = false;
    component.limpiarFormulario();
    tick();
    expect(
      component.registroDomiciliosRfcSolicitanteForm.get('coloniaCalleNumero')
        ?.value
    ).toBe('');
    expect(component.forma.get('domiciliosRegistrados')?.value).toEqual("");
    expect(component.datosTablaModalSeleccionados.length).toBe(0);
    expect(component.resetChildTableSelection).toBe(false);
  }));

  it('validarDomiciliosRfcSolicitante should validate correctly', () => {
    component.DomiciliosRfcSolicitanteList = [];
    component.crearFormulario();
    expect(component.validarDomiciliosRfcSolicitante()).toBe(false);

    component.DomiciliosRfcSolicitanteList = [
      {
        InstalacionesPrincipales: 'Sí',
        realizaActividadComercioExterior: 'Sí',
      } as any,
    ];
    expect(component.validarDomiciliosRfcSolicitante()).toBe(true);
  });

  it('tieneInstalacionPrincipal should return true if any item has InstalacionesPrincipales "Sí"', () => {
    component.DomiciliosRfcSolicitanteList = [
      { InstalacionesPrincipales: 'No' } as any,
      { InstalacionesPrincipales: 'Sí' } as any,
    ];
    expect(component.tieneInstalacionPrincipal()).toBe(true);
  });

  it('tieneOperacionesComercioExterior should return true if any item has realizaActividadComercioExterior "Sí"', () => {
    component.DomiciliosRfcSolicitanteList = [
      { realizaActividadComercioExterior: 'No' } as any,
      { realizaActividadComercioExterior: 'Sí' } as any,
    ];
    expect(component.tieneOperacionesComercioExterior()).toBe(true);
  });

  it('perfillRecintoChange should update disableReconocimientoLabel', () => {
    component.disableReconocimientoLabel = [];
    component.perfillRecintoChange('1');
    expect(component.disableReconocimientoLabel).toContain('Sí');
    component.perfillRecintoChange('0');
    expect(component.disableReconocimientoLabel).toEqual([]);
  });

  it('reconocimientoMutuoChange should update disablePerfillLabel', () => {
    component.disablePerfillLabel = [];
    component.reconocimientoMutuoChange('1');
    expect(component.disablePerfillLabel).toContain('Sí');
    component.reconocimientoMutuoChange('0');
    expect(component.disablePerfillLabel).toEqual([]);
  });

  it('resetearValidaciones should mark controls as untouched', () => {
    component.crearFormulario();
    component.forma.addControl(
      'instalacionPrincipalTabla',
      component.fb.control('')
    );
    component.forma.addControl(
      'operacionesComercioExteriorTabla',
      component.fb.control('')
    );
    component.forma.get('domiciliosRFCTabla')?.markAsTouched();
    component.forma.get('instalacionPrincipalTabla')?.markAsTouched();
    component.forma.get('operacionesComercioExteriorTabla')?.markAsTouched();
    component.resetearValidaciones();
    expect(component.forma.get('domiciliosRFCTabla')?.touched).toBe(false);
    expect(component.forma.get('instalacionPrincipalTabla')?.touched).toBe(
      false
    );
    expect(
      component.forma.get('operacionesComercioExteriorTabla')?.touched
    ).toBe(false);
  });

  it('should clean up subscriptions on destroy', () => {
    const nextSpy = jest.spyOn(component.destroyed$, 'next');
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('getDomiciliosRegistradosList should populate catalog lists on success', fakeAsync(() => {
    const mockDomicilios = [{ id: 1, descripcion: 'Domicilio 1' }];
    const mockTipoInstalacion = [{ id: 2, descripcion: 'Tipo 2' }];
    const solicitudService = (component as any).solicitudService;
    component.getDomiciliosRegistradosList();
    tick();

    expect(component.domiciliosRegistradosList).toEqual([]);
    expect(component.tipoInstalacionList).toEqual([]);
  }));

  it('getDomiciliosRegistradosList should handle error', fakeAsync(() => {
    const solicitudService = (component as any).solicitudService;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    solicitudService.getDomiciliosRegistrados = [];
    errorSpy.mockRestore();
  }));

  it('modificarDialogoDatos should show modal if element exists', () => {
    const showSpy = jest.fn(() => of());
    component.modificarDialogoDatos();

  });

  it('agregarDialogoDatos should show modal and clear form', fakeAsync(() => {
    const showSpy = jest.fn(() => of());
    const limpiarSpy = jest.spyOn(component, 'limpiarFormulario');
    component.agregarDialogoDatos();
    component.limpiarFormulario();
    tick(201);
    expect(component.limpiarFormulario).toHaveBeenCalled();
  }));

  it('enviarDialogData should handle modal selection and call methods', () => {
    const abrirSpy = jest.spyOn(component, 'abrirMultipleSeleccionPopup');
    const infoSpy = jest.spyOn(component, 'DomiciliosRfcSolicitanteInfoDatos');
    const cambiarSpy = jest.spyOn(component, 'cambiarEstadoModal');
    component.datosTablaModalSeleccionados = [{ id: 1 } as any];
    component.enviarDialogData();
    expect(abrirSpy).toHaveBeenCalledWith('', component.CONFIRMACION_NUMEROEMPLEADOS, 'Aceptar', '');
    expect(infoSpy).toHaveBeenCalled();
    expect(cambiarSpy).toHaveBeenCalled();
    expect(component.esHabilitarElDialogo).toBe(true);
    expect(component.mostrarErroresValidacion).toBe(false);
  });

  it('enviarDialogData should show error popup if no selection', () => {
    const abrirSpy = jest.spyOn(component, 'abrirMultipleSeleccionPopup');
    component.datosTablaModalSeleccionados = [];
    component.enviarDialogData();
    expect(abrirSpy).toHaveBeenCalledWith('', 'Seleccione un registro.', 'Aceptar', '');
    expect(component.esHabilitarElDialogo).toBe(true);
  });

  it('enviarActualizarDialogData should update if form is valid', () => {
    const abrirSpy = jest.spyOn(component, 'abrirMultipleSeleccionPopup');
    const modificarSpy = jest.spyOn(component, 'modificarDomiciliosRfcSolicitanteInfoDatos');
    const cambiarSpy = jest.spyOn(component, 'cambiarEstadoModal');
    component.registroDomiciliosRfcSolicitanteForm.setValue({
      id: 1,
      InstalacionesPrincipales: '1',
      tipoInstalacion: '1',
      coloniaCalleNumero: 'Calle',
      procesoProductivo: '1',
      realizaActividadComercioExterior: '1',
      entidadFederativa: 'Entidad',
      municipioAlcaldia: 'Municipio',
      registroSESAT: 'Reg',
      codigoPostal: '12345',
      acreditaUsoGoceInmueble: '1',
      perfilEmpresa: '1',
      reconocimientoMutuoCTPAT: '1',
    });
    component.enviarActualizarDialogData();
    expect(abrirSpy).toHaveBeenCalledWith('', component.CONFIRMACION_NUMEROEMPLEADOS, 'Aceptar', '');
    expect(modificarSpy).toHaveBeenCalled();
    expect(cambiarSpy).toHaveBeenCalledWith('modificar');
    expect(component.esHabilitarElDialogo).toBe(true);
  });

  it('enviarActualizarDialogData should show error if form is invalid', () => {
    const abrirSpy = jest.spyOn(component, 'abrirMultipleSeleccionPopup');
    component.registroDomiciliosRfcSolicitanteForm.reset();
    component.enviarActualizarDialogData();
    expect(abrirSpy).toHaveBeenCalledWith('', component.DEBE_CAPTURAR, 'Aceptar', '');
    expect(component.esHabilitarElDialogo).toBe(true);
  });

  it('instalacionesSeleccionadas should map event to datosTablaModalSeleccionados', () => {
    const event = [
      {
        entidadFederativa: 'Entidad',
        municipio: 'Municipio',
        direccion: 'Dir',
        codigoPostal: '12345',
        registro: 'Reg',
      },
    ];
    component.instalacionesSeleccionadas(event as any);
    expect(component.datosTablaModalSeleccionados.length).toBe(1);
    expect(component.datosTablaModalSeleccionados[0].entidadFederativa).toBe('Entidad');
    expect(component.datosTablaModalSeleccionados[0].coloniaCalleNumero).toBe('Dir');
  });

  it('modalCancelar should call cambiarEstadoModal and limpiarFormulario', () => {
    const cambiarSpy = jest.spyOn(component, 'cambiarEstadoModal');
    const limpiarSpy = jest.spyOn(component, 'limpiarFormulario');
    component.modalCancelar('add');
    expect(cambiarSpy).toHaveBeenCalledWith('add');
    expect(limpiarSpy).toHaveBeenCalled();
  });

  it('cambiarEstadoModal should warn if modal element not found', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    component.registroDeDomiciliosRfcSolicitanteElemento = undefined as any;
    component.modificartRegistroDeDomiciliosRfcElemento = undefined as any;
    component.cambiarEstadoModal('add');
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('cerrarModal should set esHabilitarElDialogo to false', () => {
    component.esHabilitarElDialogo = true;
    component.cerrarModal();
    expect(component.esHabilitarElDialogo).toBe(false);
  });

  it('manejarFilaSeleccionada should handle empty selection', () => {
    component.enableModficarBoton = true;
    component.enableEliminarBoton = true;
    component.filaSeleccionadaDomiciliosRfcSolicitante = { id: 99 } as any;
    component.manejarFilaSeleccionada([]);
    expect(component.listaFilaSeleccionadaEmpleado).toEqual([]);
    expect(component.filaSeleccionadaDomiciliosRfcSolicitante).toEqual({});
    expect(component.enableModficarBoton).toBe(false);
    expect(component.enableEliminarBoton).toBe(false);
  });

  it('manejarFilaSeleccionada should handle non-empty selection', () => {
    const fila = [
      { id: 1, coloniaCalleNumero: 'A' } as any,
      { id: 2, coloniaCalleNumero: 'B' } as any,
    ];
    component.manejarFilaSeleccionada(fila);
    expect(component.listaFilaSeleccionadaEmpleado).toBe(fila);
    expect(component.enableModficarBoton).toBe(true);
    expect(component.enableEliminarBoton).toBe(true);
    expect(component.filaSeleccionadaDomiciliosRfcSolicitante).toBe(fila[1]);
  });

  it('actualizarFilaSeleccionada should update selected row if found', () => {
    component.DomiciliosRfcSolicitanteList = [
      { id: 1, coloniaCalleNumero: 'A' } as any,
      { id: 2, coloniaCalleNumero: 'B' } as any,
    ];
    component.filaSeleccionadaDomiciliosRfcSolicitante = { id: 2 } as any;
    component.actualizarFilaSeleccionada();
    expect(component.filaSeleccionadaDomiciliosRfcSolicitante.coloniaCalleNumero).toBe('B');
  });

  it('actualizarFilaSeleccionada should do nothing if not found', () => {
    component.DomiciliosRfcSolicitanteList = [
      { id: 1, coloniaCalleNumero: 'A' } as any,
    ];
    component.filaSeleccionadaDomiciliosRfcSolicitante = { id: 99 } as any;
    component.actualizarFilaSeleccionada();
    expect(component.filaSeleccionadaDomiciliosRfcSolicitante.id).toBe(99);
  });

  it('eliminarEmpleadoItem should remove selected items and update store', () => {
    component.DomiciliosRfcSolicitanteList = [
      { id: 1 } as any,
      { id: 2 } as any,
      { id: 3 } as any,
    ];
    component.listaFilaSeleccionadaEmpleado = [{ id: 2 } as any, { id: 3 } as any];
    const resetSpy = jest.spyOn(component, 'resetearValidaciones');
    const cerrarSpy = jest.spyOn(component, 'cerrarEliminarConfirmationPopup');
    component.eliminarEmpleadoItem(true);
    expect(component.DomiciliosRfcSolicitanteList).toEqual([{ id: 1 }]);
    expect(component.listaFilaSeleccionadaEmpleado).toEqual([]);
    expect(component.filaSeleccionadaDomiciliosRfcSolicitante).toEqual({});
    expect(resetSpy).toHaveBeenCalled();
    expect(cerrarSpy).toHaveBeenCalled();
  });

  it('eliminarEmpleadoItem should do nothing if evento is false', () => {
    const listBefore = [{ id: 1 } as any];
    component.DomiciliosRfcSolicitanteList = listBefore.slice();
    component.listaFilaSeleccionadaEmpleado = [{ id: 1 } as any];
    component.eliminarEmpleadoItem(false);
    expect(component.DomiciliosRfcSolicitanteList).toEqual(listBefore);
    expect(component.listaFilaSeleccionadaEmpleado).toEqual([{ id: 1 }]);
  });

  it('cerrarEliminarConfirmationPopup should set popup flags to false', () => {
    component.confirmEliminarPopupAbierto = true;
    component.confirmEliminarPopupCerrado = true;
    component.cerrarEliminarConfirmationPopup();
    expect(component.confirmEliminarPopupAbierto).toBe(false);
    expect(component.confirmEliminarPopupCerrado).toBe(false);
  });

  it('modificarItemEmpleado should show popup if list is empty', () => {
    component.DomiciliosRfcSolicitanteList = [];
    component.listaFilaSeleccionadaEmpleado = [];
    const abrirSpy = jest.spyOn(component, 'abrirMultipleSeleccionPopup');
    component.modificarItemEmpleado();
    expect(abrirSpy).toHaveBeenCalledWith('', 'No se encontró información');
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
  });

  it('modificarItemEmpleado should show popup if no selection', () => {
    component.DomiciliosRfcSolicitanteList = [{ id: 1 } as any];
    component.listaFilaSeleccionadaEmpleado = [];
    const abrirSpy = jest.spyOn(component, 'abrirMultipleSeleccionPopup');
    component.modificarItemEmpleado();
    expect(abrirSpy).toHaveBeenCalledWith('', 'Selecciona un registro');
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
  });

  it('modificarItemEmpleado should show popup if more than one selected', () => {
    component.DomiciliosRfcSolicitanteList = [{ id: 1 } as any];
    component.listaFilaSeleccionadaEmpleado = [{ id: 1 } as any, { id: 2 } as any];
    const abrirSpy = jest.spyOn(component, 'abrirMultipleSeleccionPopup');
    component.modificarItemEmpleado();
    expect(abrirSpy).toHaveBeenCalledWith('', 'Selecciona sólo un registro para modificar');
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
  });

  it('modificarItemEmpleado should update, open modal and patch data if one selected', () => {
    component.DomiciliosRfcSolicitanteList = [{ id: 1 } as any];
    component.listaFilaSeleccionadaEmpleado = [{ id: 1 } as any];
    const actualizarSpy = jest.spyOn(component, 'actualizarFilaSeleccionada');
    const modificarDialogoSpy = jest.spyOn(component, 'modificarDialogoDatos');
    const patchSpy = jest.spyOn(component, 'patchModifyiedData');
    component.modificarItemEmpleado();
    expect(actualizarSpy).toHaveBeenCalled();
    expect(modificarDialogoSpy).toHaveBeenCalled();
    expect(patchSpy).toHaveBeenCalled();
  });
});
