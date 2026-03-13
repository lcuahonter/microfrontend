import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoDeAdicionComponent } from './aviso-de-adicion.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud33304Store } from '../../estados/solicitud33304Store';
import { Solicitud33304Query } from '../../estados/solicitud33304Query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TablaEmpresaTransportista } from '../../modelos/aviso-de-transportistas.model';

describe('AvisoDeAdicionComponent', () => {
  let component: AvisoDeAdicionComponent;
  let fixture: ComponentFixture<AvisoDeAdicionComponent>;
  let mockSolicitudService: any;
  let mockStore: any;
  let mockQuery: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockSolicitudService = {
      getEstatus: jest.fn(() => of({ data: [] }))
    };

    mockStore = {
      actualizarEstado: jest.fn()
    };

    mockQuery = {
      selectSolicitud$: of({ transportistasLista: [] })
    };

    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [AvisoDeAdicionComponent, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: Solicitud33304Store, useValue: mockStore },
        { provide: Solicitud33304Query, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoDeAdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con campos vacíos', () => {
    const form = component.transportistaForm;
    expect(form).toBeDefined();
    expect(form.get('rfc')?.value).toBe('');
    expect(form.get('denominacion')?.value).toBe('');
  });

  it('debe marcar los campos como tocados si el formulario es inválido al enviar', () => {
    const spy = jest.spyOn(component.transportistaForm, 'markAllAsTouched');
    component.enviarDialogData();
    expect(spy).toHaveBeenCalled();
  });

  it('debe actualizar un registro existente si está en modo edición', () => {
    const datoOriginal: TablaEmpresaTransportista = {
      id: 1,
      rfc: 'RFC000',
      denominacion: 'Vieja Empresa',
      domicilio: 'Antiguo domicilio',
      registroCaat: 'CAAT000',
      estatus: 'INACTIVO'
    };

    component.empresaTransportistaData = [datoOriginal];
    component.modoEdicion = true;
    component.registroEditandoId = 1;

    component.transportistaForm.setValue({
      id: 1,
      rfc: 'RFC111',
      denominacion: 'Empresa Actualizada',
      domicilio: 'Nuevo domicilio',
      registroCaat: 'CAAT999',
      estatus: 'ACTIVO',
      registroContribuyente: ''
    });

    component.enviarDialogData();

    expect(component.empresaTransportistaData.length).toBe(1);
    expect(component.empresaTransportistaData[0].denominacion).toBe('Empresa Actualizada');
    expect(component.modoEdicion).toBe(true);
  });

  it('debe llenar el formulario con datos seleccionados al modificar', () => {
    const fila = {
      id: 5,
      rfc: 'RFCX',
      denominacion: 'Empresa Modificar',
      domicilio: 'Zeta 456',
      registroCaat: 'CAATX',
      estatus: 'ACTIVO'
    };

    component.listaFilaSeleccionadaTransportista = [fila];
    component.empresaTransportistaData = [fila];
    component.modificarItemTransportista();

    expect(component.transportistaForm.get('rfc')?.value).toBe('RFCX');
    expect(component.modoEdicion).toBe(true);
    expect(component.registroEditandoId).toBe(5);
  });

  it('debe mostrar popup si no hay filas seleccionadas al modificar', () => {
    component.listaFilaSeleccionadaTransportista = [];
    component.empresaTransportistaData = [];

    component.modificarItemTransportista();

    expect(component.esFilaSeleccionada).toBe(true);
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toBe('No se encontró información');
  });

  it('debe limpiar el formulario al cancelar el modal', () => {
    component.transportistaForm.patchValue({ rfc: 'TEMP' });
    component.modalCancelar();
    expect(component.transportistaForm.get('rfc')?.value).toBeNull();
  });

  it('debe manejar correctamente la selección de una fila', () => {
    const filaMock = {
      id: 10,
      rfc: 'RFCTEST',
      denominacion: 'Prueba',
      domicilio: 'Calle Test',
      registroCaat: 'CAATTEST',
      estatus: 'ACTIVO'
    };

    component.manejarFilaSeleccionada([filaMock]);
    expect(component.filaSeleccionadaTransportista).toEqual(filaMock);
  });

  it('debe limpiar la selección si no hay filas seleccionadas', () => {
    component.manejarFilaSeleccionada([]);
    expect(component.filaSeleccionadaTransportista).toEqual({});
    expect(component.enableModficarBoton).toBe(false);
  });
});
