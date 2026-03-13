import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLaSolicitudModificacionComponent } from './datos-de-la-solicitud-modificacion.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { DatosSolicitudStore } from '../../estados/stores/datos-de-la-solicitud-modificacion.store';
import { DatosSolicitudQuery } from '../../estados/queries/datos-de-la-solicitud-modificacion.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

describe('DatosDeLaSolicitudModificacionComponent', () => {
  let component: DatosDeLaSolicitudModificacionComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudModificacionComponent>;
  let establecimientoServiceMock: any;
  let datosSolicitudStoreMock: any;
  let datosSolicitudQueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    establecimientoServiceMock = {
      getJustificationData: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'desc' }])),
      getInformacionConfidencialRadioOptions: jest.fn().mockReturnValue(of([{ id: 2, descripcion: 'conf' }])),
      getEstadodata: jest.fn().mockReturnValue(of([{ id: 3, descripcion: 'estado' }])),
      getSciandata: jest.fn().mockReturnValue(of([{ id: 4, descripcion: 'scian' }])),
    };
    datosSolicitudStoreMock = {
      actualizarCampo: jest.fn(),
    };
    datosSolicitudQueryMock = {
      selectSolicitud$: of({
        genericos: 'gen',
        observaciones: 'obs',
        establecimientoRazonSocial: 'razon',
        establecimientoCorreoElectronico: 'mail',
        establecimientoDomicilioCodigoPostal: 'cp',
        establecimientoEstados: 'est',
        descripcionMunicipio: 'mun',
        localidad: 'loc',
        establishomentoColonias: 'col',
        calle: 'calle',
        lada: 'lada',
        telefono: 'tel',
        avisoCheckbox: true,
        noLicenciaSanitaria: 'lic',
        regimen: 'reg',
        aduanasEntradas: 'aduana',
        aifaCheckbox: true,
        manifests: 'manif',
        informacionConfidencialRadio: 'info',
        scian: 'scian',
        descripcionScian: 'descScian'
      })
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: true })
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosDeLaSolicitudModificacionComponent],
      providers: [
        FormBuilder,
        { provide: EstablecimientoService, useValue: establecimientoServiceMock },
        { provide: DatosSolicitudStore, useValue: datosSolicitudStoreMock },
        { provide: DatosSolicitudQuery, useValue: datosSolicitudQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería llamar a cargarEstado, cargarScian, establecerOpcionesGenericas, manejarConfidencial y configurarGrupoForm en ngOnInit', () => {
    const cargarEstadoSpy = jest.spyOn(component, 'cargarEstado');
    const cargarScianSpy = jest.spyOn(component, 'cargarScian');
    const establecerOpcionesGenericasSpy = jest.spyOn(component, 'establecerOpcionesGenericas');
    const manejarConfidencialSpy = jest.spyOn(component, 'manejarConfidencial');
    const configurarGrupoFormSpy = jest.spyOn(component, 'configurarGrupoForm');
    component.ngOnInit();
    expect(cargarEstadoSpy).toHaveBeenCalled();
    expect(cargarScianSpy).toHaveBeenCalled();
    expect(establecerOpcionesGenericasSpy).toHaveBeenCalled();
    expect(manejarConfidencialSpy).toHaveBeenCalled();
    expect(configurarGrupoFormSpy).toHaveBeenCalled();
  });

  it('debería configurar y deshabilitar los formularios en configurarGrupoForm', () => {
    component.solicitudState = {
      genericos: 'gen',
      observaciones: 'obs',
      establecimientoRazonSocial: 'razon',
      establecimientoCorreoElectronico: 'mail',
      establecimientoDomicilioCodigoPostal: 'cp',
      establecimientoEstados: 'est',
      descripcionMunicipio: 'mun',
      localidad: 'loc',
      establishomentoColonias: 'col',
      calle: 'calle',
      lada: 'lada',
      telefono: 'tel',
      avisoCheckbox: true,
      noLicenciaSanitaria: 'lic',
      regimen: 'reg',
      aduanasEntradas: 'aduana',
      aifaCheckbox: true,
      manifests: true,
      informacionConfidencialRadio: 'info',
      scian: 'scian',
      descripcionScian: 'descScian'
    };
    component.configurarGrupoForm();
    expect(component.datosSolicitudform instanceof FormGroup).toBe(true);
    expect(component.datosSolicitudform.disabled).toBe(true);
    expect(component.manifiestosRepresentanteForm.disabled).toBe(true);
    expect(component.scianForm.disabled).toBe(true);
  });

  it('debería establecer datosGenericos en establecerOpcionesGenericas', () => {
    component.datosGenericos = [];
    component.establecerOpcionesGenericas();
    expect(component.datosGenericos.length).toBeGreaterThan(0);
  });

  it('debería establecer informacionConfidencialRadioOption en manejarConfidencial', () => {
    component.informacionConfidencialRadioOption = [];
    component.manejarConfidencial();
    expect(component.informacionConfidencialRadioOption.length).toBeGreaterThan(0);
  });

  it('debería establecer estado en cargarEstado', () => {
    component.estado = [];
    component.cargarEstado();
    expect(component.estado.length).toBeGreaterThan(0);
  });

  it('debería establecer scianJson en cargarScian', () => {
    component.scianJson = [];
    component.cargarScian();
    expect(component.scianJson.length).toBeGreaterThan(0);
  });

  it('debería llamar a hide en modalInstance en cerrarModalScian', () => {
    component.modalInstance = { hide: jest.fn() } as any;
    component.cerrarModalScian();
    expect(component.modalInstance.hide).toHaveBeenCalled();
  });

  it('debería resetear scianForm en limpiarScianForm', () => {
    component.scianForm = new FormBuilder().group({ scian: ['test'] });
    const resetSpy = jest.spyOn(component.scianForm, 'reset');
    component.limpiarScianForm();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('debería agregar un nuevo dato SCIAN, resetear el formulario y cerrar el modal en guardarScian', () => {
    component.scianForm = new FormBuilder().group({
      scian: ['clave'],
      descripcionScian: ['desc']
    });
    component.scianForm.setValue({ scian: 'clave', descripcionScian: 'desc' });
    Object.defineProperty(component.scianForm, 'valid', { get: () => true });
    component.personaparas = [];
    component.modalInstance = { hide: jest.fn() } as any;
    const resetSpy = jest.spyOn(component.scianForm, 'reset');
    const cerrarSpy = jest.spyOn(component, 'cerrarModalScian');
    component.guardarScian();
    expect(component.personaparas.length).toBe(1);
    expect(resetSpy).toHaveBeenCalled();
    expect(cerrarSpy).toHaveBeenCalled();
  });

  it('debería eliminar un pedimento de la lista en eliminarPedimento', () => {
    component.pedimentos = [{ id: 1 }, { id: 2 }, { id: 3 }] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(true);
    expect(component.pedimentos).toEqual([{ id: 1 }, { id: 3 }]);
  });

  it('no debería eliminar un pedimento si borrar es false', () => {
    component.pedimentos = [{ id: 1 }, { id: 2 }, { id: 3 }] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(false);
    expect(component.pedimentos).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('debería llamar a show en modalInstance en mostrarModeloClave', () => {
    component.modalInstance = { show: jest.fn() } as any;
    component.mostrarModeloClave();
    expect(component.modalInstance.show).toHaveBeenCalled();
  });

  it('debería establecer modalInstance en ngAfterViewInit si establecimientoModal existe', () => {
    const nativeElement = document.createElement('div');
    component.establecimientoModal = new ElementRef(nativeElement);
    (window as any)['Modal'] = jest.fn().mockImplementation(() => ({ test: true }));
    component.ngAfterViewInit();
    expect(component.modalInstance).toBeDefined();
  });

  it('debería establecer nuevaNotificacion y elementoParaEliminar en abrirModal', () => {
    component.abrirModal(2);
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.elementoParaEliminar).toBe(2);
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería alternar colapsable en mostrar_colapsable', () => {
    component.colapsable = false;
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(true);
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(false);
  });

  it('debería alternar colapsableDos en mostrar_colapsableDos', () => {
    component.colapsableDos = false;
    component.mostrar_colapsableDos();
    expect(component.colapsableDos).toBe(true);
    component.mostrar_colapsableDos();
    expect(component.colapsableDos).toBe(false);
  });

  it('debería alternar colapsableTres en mostrar_colapsableTres', () => {
    component.colapsableTres = false;
    component.mostrar_colapsableTres();
    expect(component.colapsableTres).toBe(true);
    component.mostrar_colapsableTres();
    expect(component.colapsableTres).toBe(false);
  });

  it('debería limpiar el formulario de mercancías en limpiarFormulario', () => {
    component.formMercancias = new FormBuilder().group({
      clasificacion: ['test'],
      especificarClasificacionProducto: ['test'],
      denominacionEspecifica: ['test'],
      denominacionDistintiva: ['test'],
      denominacionComun: ['test'],
      tipoDeProducto: ['test'],
      estadoFisico: ['test'],
      fraccionArancelaria: ['test'],
      descripcionFraccion: ['test'],
      cantidadUMT: ['test'],
      UMT: ['test'],
      cantidadUMC: ['test'],
      UMC: ['test'],
      presentacion: ['test'],
      numeroRegistro: ['test'],
    });
    const resetSpy = jest.spyOn(component.formMercancias, 'reset');
    const pristineSpy = jest.spyOn(component.formMercancias, 'markAsPristine');
    const untouchedSpy = jest.spyOn(component.formMercancias, 'markAsUntouched');
    component.limpiarFormulario();
    expect(resetSpy).toHaveBeenCalled();
    expect(pristineSpy).toHaveBeenCalled();
    expect(untouchedSpy).toHaveBeenCalled();
  });

  it('debería abrir el modal de agregar mercancía en agregarMercancia', () => {
    const templateRefMock = {} as any;
    (component as any)['modalService'] = { show: jest.fn() } as any;
    component.agregarMercancia(templateRefMock);
    expect((component as any)['modalService'].show).toHaveBeenCalledWith(templateRefMock, { class: 'modal-xl', });
  });
});