import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarMiembroDeLaEmpresaComponent } from './agregar-miembro-de-la-empresa.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite31601Store } from '../../../../estados/tramites/tramite31601.store';
import { Tramite31601Query } from '../../../../estados/queries/tramite31601.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';

jest.mock('@libs/shared/theme/assets/json/31601/miembroDeLaEmpresa .json', () => ({
  __esModule: true,
  default: [
    {
      ensucaracterde: "1",
      rfc: "HEUE780514BVA",
      obligadoaTributarenMexico: "Si",
      nacionalidad: "1",
      registroFederaldeContribuyentes: "HEUE780514BVA",
      nombreCompleto: "ERNESTO HERNANDEZ URIBE",
      tipoDePersonaMiembro: "Fisica 1",
      nombreMiembro: "ERNESTO",
      apellidoPaternoMiembro: "HERNANDEZ",
      apellidoMaternoMiembro: "URIBE",
      nombreDeLaEmpresaMiembro: ""
    },
    {
      ensucaracterde: "2",
      rfc: "HEUE780514BVA",
      obligadoaTributarenMexico: "Si",
      nacionalidad: "1",
      registroFederaldeContribuyentes: "HEUE780514BVA",
      nombreCompleto: "ERNESTO HERNANDEZ URIBE",
      tipoDePersonaMiembro: "Fisica 2",
      nombreMiembro: "ERNESTO",
      apellidoPaternoMiembro: "HERNANDEZ",
      apellidoMaternoMiembro: "URIBE",
      nombreDeLaEmpresaMiembro: ""
    }
  ]
}), { virtual: true });

describe('AgregarMiembroDeLaEmpresaComponent', () => {
  let component: AgregarMiembroDeLaEmpresaComponent;
  let fixture: ComponentFixture<AgregarMiembroDeLaEmpresaComponent>;
  let mockStore: any;
  let mockQuery: any;
  let mockConsultaioQuery: any;
  let miembrodelaempresaTable: any[];

  beforeEach(async () => {
    mockStore = {
      agregarMiembrodelaempresaTable: jest.fn(),
      eliminarMiembrodelaempresaTable: jest.fn(),
      setTipoDePersonaMiembro: jest.fn(),
      setEnsucaracterde: jest.fn(),
      setObligadoaTributarenMexico: jest.fn(),
      setNacionalidad: jest.fn(),
      setSquemaIntegral: jest.fn(),
      setSidoModificadas: jest.fn(),
      setRfc: jest.fn(),
      setNombreMiembro: jest.fn(),
      setApellidoPaternoMiembro: jest.fn(),
      setApellidoMaternoMiembro: jest.fn(),
      setNombreDeLaEmpresaMiembro: jest.fn()
    };
    mockQuery = {
      selectSolicitud$: of({
        miembrosSeleccionados: [],
        ensucaracterde: '',
        rfc: '',
        obligadoaTributarenMexico: '',
        nacionalidad: '',
        registroFederaldeContribuyentes: '',
        nombreCompleto: '',
        tipoDePersonaMiembro: '',
        nombreMiembro: '',
        apellidoPaternoMiembro: '',
        apellidoMaternoMiembro: '',
        nombreDeLaEmpresaMiembro: '',
        squemaIntegral: '',
        sidoModificadas: ''
      })
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    miembrodelaempresaTable = [{ id: 1, nombre: 'Test Miembro' }];

    await TestBed.configureTestingModule({
      imports: [AgregarMiembroDeLaEmpresaComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite31601Store, useValue: mockStore },
        { provide: Tramite31601Query, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarMiembroDeLaEmpresaComponent);
    component = fixture.componentInstance;

    // Mock modal instance and element
    component.AgregarMOdel = { nativeElement: document.createElement('div') } as ElementRef;
    component.AgregarModelInstance = {
      show: jest.fn(),
      hide: jest.fn(),
      toggle: jest.fn(),
      handleUpdate: jest.fn(),
      dispose: jest.fn()
    };

    (component as any).miembrodelaempresaTable = miembrodelaempresaTable;

    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar los formularios y el estado', () => {
    expect(component.agregarMiembroDeLaEmpresaFrom).toBeDefined();
    expect(component.checkBoxesForm).toBeDefined();
    expect(component.solicitudState).toBeDefined();
  });

  it('debe establecer esFormularioSoloLectura desde consultaioQuery', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('debe actualizar miembrosSeleccionados en obtenerMiembroSeleccionadas', () => {
    const miembros = [{ id: 1 }];
    component.obtenerMiembroSeleccionadas(miembros as any);
    expect(component.miembrosSeleccionados).toEqual(miembros as any);
  });

  it('debe establecer valor en el store en setValoresStore', () => {
    component.agregarMiembroDeLaEmpresaFrom.get('tipoDePersonaMiembro')?.setValue('física');
    component.setValoresStore(component.agregarMiembroDeLaEmpresaFrom, 'tipoDePersonaMiembro', 'setTipoDePersonaMiembro');
    expect(mockStore.setTipoDePersonaMiembro).toHaveBeenCalled();
  });

  it('debe actualizar la paginación en onPageChange', () => {
    jest.spyOn(component, 'updatePagination');
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.updatePagination).toHaveBeenCalled();
  });

  it('debe actualizar itemsPerPage y la paginación en onItemsPerPageChange', () => {
    jest.spyOn(component, 'updatePagination');
    component.onItemsPerPageChange(10);
    expect(component.itemsPerPage).toBe(10);
    expect(component.currentPage).toBe(1);
    expect(component.updatePagination).toHaveBeenCalled();
  });

  it('debe abrir el modal y resetear el formulario en openAgregarModal', () => {
  component.AgregarModelInstance.show = jest.fn();

  jest.spyOn(component.agregarMiembroDeLaEmpresaFrom, 'reset');
  component.openAgregarModal();
  expect(component.AgregarModelInstance.show).toHaveBeenCalled();
  expect(component.agregarMiembroDeLaEmpresaFrom.reset).toHaveBeenCalled();
});

  it('debe cerrar el modal en closeAgregarModal', () => {
    component.AgregarModelInstance.hide = jest.fn();
    component.closeAgregarModal();
    expect(component.AgregarModelInstance.hide).toHaveBeenCalled();
  });

  it('debe mostrar el modal y establecer el valor del formulario en modificarModal si miembrosSeleccionados existe', () => {
  component.miembrosSeleccionados = [{
    ensucaracterde: '',
    rfc: '',
    obligadoaTributarenMexico: '',
    nacionalidad: '',
    registroFederaldeContribuyentes: '',
    nombreCompleto: '',
    tipoDePersonaMiembro: '',
    nombreMiembro: 'Test',
    apellidoPaternoMiembro: '',
    apellidoMaternoMiembro: '',
    nombreDeLaEmpresaMiembro: ''
  }] as any;
  jest.spyOn(component.agregarMiembroDeLaEmpresaFrom, 'setValue');
  component.AgregarModelInstance.show = jest.fn(); 
  component.modificarModal();
  expect(component.agregarMiembroDeLaEmpresaFrom.setValue).toHaveBeenCalledWith(component.miembrosSeleccionados[0]);
  expect(component.AgregarModelInstance.show).toHaveBeenCalled();
});

  it('debe mostrar alerta si modificarModal se llama sin selección', () => {
    component.miembrosSeleccionados = [];
    component.modificarModal();
    expect(component.alertaNotificacion?.mensaje).toContain('Seleccione un registro');
  });

  it('debe mostrar alerta si eliminarMiembro se llama sin selección', () => {
    component.miembrosSeleccionados = [];
    component.eliminarMiembro();
    expect(component.alertaNotificacion?.mensaje).toContain('Seleccione un registro');
  });

  it('debe mostrar alerta de confirmación si eliminarMiembro se llama con selección', () => {
    component.miembrosSeleccionados = [{ id: 1 }] as any;
    component.eliminarMiembro();
    expect(component.alertaNotificacion?.ttl).toBe('eliminar confirmation');
  });

  it('debe llamar a eliminarMiembrodelaempresaTable y mostrar éxito en confirmarEliminacion', async () => {
    component.miembrosSeleccionados = [{ id: 1 }] as any;
    component.alertaNotificacion = { ttl: 'eliminar confirmation' } as any;
    const miembro = component.miembrosSeleccionados[0];
    component.confirmarEliminacion(true);
    expect(mockStore.eliminarMiembrodelaempresaTable).toHaveBeenCalledWith(miembro);
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(component.alertaNotificacion?.mensaje).toContain('Datos eliminados correctamente');
  });

  it('no debe llamar a eliminarMiembrodelaempresaTable si no se confirma', () => {
    component.miembrosSeleccionados = [{ id: 1 }] as any;
    component.alertaNotificacion = { ttl: 'eliminar confirmation' } as any;
    component.confirmarEliminacion(false);
    expect(mockStore.eliminarMiembrodelaempresaTable).not.toHaveBeenCalled();
  });

  it('debe mostrar alerta en mostrarAlertaSeleccionarRegistro', () => {
    component.mostrarAlertaSeleccionarRegistro();
    expect(component.alertaNotificacion?.mensaje).toContain('Seleccione un registro');
  });

  it('debe marcar todos como tocados si aceptar se llama con formulario inválido', () => {
    jest.spyOn(component.agregarMiembroDeLaEmpresaFrom, 'markAllAsTouched');
    component.agregarMiembroDeLaEmpresaFrom.setErrors({ invalid: true });
    component.aceptar();
    expect(component.agregarMiembroDeLaEmpresaFrom.markAllAsTouched).toHaveBeenCalled();
  });

  it('debe establecer validadores requeridos para RFC, registroFederaldeContribuyentes, nombreCompleto si obligadoaTributarenMexico es "Si"', () => {
    component.agregarMiembroDeLaEmpresaFrom.get('obligadoaTributarenMexico')?.setValue('Si');
    component.setValidacionesObligadoa();
    ['registroFederaldeContribuyentes', 'rfc', 'nombreCompleto'].forEach(campo => {
      expect(component.agregarMiembroDeLaEmpresaFrom.get(campo)?.validator).toBeTruthy();
    });
  });

  it('debe establecer validadores requeridos para tipoDePersonaMiembro si obligadoaTributarenMexico no es "Si"', () => {
    component.agregarMiembroDeLaEmpresaFrom.get('obligadoaTributarenMexico')?.setValue('No');
    component.setValidacionesObligadoa();
    expect(component.agregarMiembroDeLaEmpresaFrom.get('tipoDePersonaMiembro')?.validator).toBeTruthy();
  });

  it('debe establecer validadores requeridos para nombreMiembro, apellidoPaternoMiembro, apellidoMaternoMiembro si tipoDePersonaMiembro es 1', () => {
    component.agregarMiembroDeLaEmpresaFrom.get('tipoDePersonaMiembro')?.setValue(1);
    component.setValidacionestipo();
    ['nombreMiembro', 'apellidoPaternoMiembro', 'apellidoMaternoMiembro'].forEach(campo => {
      expect(component.agregarMiembroDeLaEmpresaFrom.get(campo)?.validator).toBeTruthy();
    });
  });

  it('debe establecer validador requerido para nombreDeLaEmpresaMiembro si tipoDePersonaMiembro no es 1', () => {
    component.agregarMiembroDeLaEmpresaFrom.get('tipoDePersonaMiembro')?.setValue(2);
    component.setValidacionestipo();
    expect(component.agregarMiembroDeLaEmpresaFrom.get('nombreDeLaEmpresaMiembro')?.validator).toBeTruthy();
  });

  it('debe actualizar tipoDePersonaMiembro en el formulario y llamar a setValoresStore en tipoDePersonaMiembroChange', () => {
    const spy = jest.spyOn(component, 'setValoresStore');
    const catalogo = { id: 2, descripcion: 'Moral' };
    component.agregarMiembroDeLaEmpresaFrom.get('tipoDePersonaMiembro')?.setValue('');
    component.tipoDePersonaMiembroChange(catalogo as any);
    expect(component.agregarMiembroDeLaEmpresaFrom.get('tipoDePersonaMiembro')?.value).toBe(2);
    expect(spy).toHaveBeenCalledWith(
      component.agregarMiembroDeLaEmpresaFrom,
      'tipoDePersonaMiembro',
      'setTipoDePersonaMiembro'
    );
  });

  it('debe limpiar destroyNotifier$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});