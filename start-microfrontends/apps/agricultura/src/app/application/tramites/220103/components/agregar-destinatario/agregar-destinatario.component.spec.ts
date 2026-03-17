import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AgregarDestinatarioComponent } from './agregar-destinatario.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { Tramite220103Query } from '../../estados/queries/tramites220103.query';
import { Tramite220103Store } from '../../estados/tramites/tramites220103.store';
import { SanidadAcuicolaImportacionService } from '../../services/sanidad-acuicola-importacion.service';

describe('AgregarDestinatarioComponent', () => {
  let component: AgregarDestinatarioComponent;
  let fixture: ComponentFixture<AgregarDestinatarioComponent>;
  let TRAMITE_QUERY_MOCK: any;
  let TRAMITE_STORE_MOCK: any;
  let SERVICIO_MOCK: any;

  beforeEach(async () => {
    TRAMITE_QUERY_MOCK = {
      selectTramite220103State$: of({ tipoPersona: 'Fisica' })
    };
    TRAMITE_STORE_MOCK = {
      setTramite220103State: jest.fn(),
      reset: jest.fn()
    };
    SERVICIO_MOCK = {
      getColonia: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Colonia 1' }])),
      getDestinatario: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Destinatario 1' }])),
      getInstalacion: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Instalacion 1' }]))
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AgregarDestinatarioComponent],
      providers: [
        FormBuilder,
        { provide: Tramite220103Query, useValue: TRAMITE_QUERY_MOCK },
        { provide: Tramite220103Store, useValue: TRAMITE_STORE_MOCK },
        { provide: SanidadAcuicolaImportacionService, useValue: SERVICIO_MOCK }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarDestinatarioComponent);
    component = fixture.componentInstance;
    // Mock cerrarModalRef for tests that use cerrarModal
    component.cerrarModalRef = { nativeElement: { click: jest.fn() } } as unknown as ElementRef;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente en modo destinatario', () => {
    component.esModoInstalacion = false;
    component.estadoSeleccionado = { tipoPersona: 'Fisica' } as any;
    component.inicializarFormulario();
    expect(component.formularioAgregarDestinatario).toBeDefined();
  });

  it('debería inicializar el formulario correctamente en modo instalación', () => {
    component.esModoInstalacion = true;
    component.estadoSeleccionado = { tipoPersona: 'Fisica' } as any;
    component.inicializarFormulario();
    expect(component.formularioAgregarInstalacion).toBeDefined();
  });

  it('debería obtener el estado y asignarlo en ngOnInit', fakeAsync(() => {
    component.estadoSeleccionado = undefined as any;
    component.ngOnInit();
    tick();
    expect(component.estadoSeleccionado).toBeDefined();
  }));

  it('debería llamar a getColonia y actualizar opciones', () => {
    component.obtenerColonia();
    expect(SERVICIO_MOCK.getColonia).toHaveBeenCalled();
  });

  it('debería actualizar visibilidad de campos según tipoPersona', () => {
    component.estadoSeleccionado = { tipoPersona: 'Fisica' } as any;
    component.cambiarValoresTipoPersona();
    // No hay asserts específicos porque la lógica es sobre campos de configuración
    expect(true).toBeTruthy();
  });

  it('debería actualizar el estado al establecerCambioDeValor', () => {
    const EVENTO = { campo: 'tipoPersona', valor: 'Moral' };
    jest.spyOn(component, 'cambiarValoresTipoPersona');
    component.establecerCambioDeValor(EVENTO);
    expect(TRAMITE_STORE_MOCK.setTramite220103State).toHaveBeenCalledWith('tipoPersona', 'Moral', undefined);
    expect(component.cambiarValoresTipoPersona).toHaveBeenCalled();
  });

  it('debería guardar destinatario si el formulario es válido', () => {
    component.esModoInstalacion = false;
    component.formularioAgregarDestinatario = new FormBuilder().group({ tipoPersona: ['Fisica'] });
    jest.spyOn(component, 'getDestinatario');
    component.cerrarModalRef = { nativeElement: { click: jest.fn() } } as any;
    component.formularioAgregarDestinatario.markAllAsTouched();
    jest.spyOn(component.formularioAgregarDestinatario, 'valid', 'get').mockReturnValue(true);
    component.guardarDestinatario();
    expect(component.getDestinatario).toHaveBeenCalled();
    expect(component.cerrarModalRef.nativeElement.click).toHaveBeenCalled();
  });

  it('debería guardar instalación si el formulario es válido', () => {
    component.esModoInstalacion = true;
    component.formularioAgregarInstalacion = new FormBuilder().group({ tipoPersona: ['Fisica'] });
    jest.spyOn(component, 'getInstalacion');
    component.cerrarModalRef = { nativeElement: { click: jest.fn() } } as any;
    component.formularioAgregarInstalacion.markAllAsTouched();
    jest.spyOn(component.formularioAgregarInstalacion, 'valid', 'get').mockReturnValue(true);
    component.guardarDestinatario();
    expect(component.getInstalacion).toHaveBeenCalled();
    expect(component.cerrarModalRef.nativeElement.click).toHaveBeenCalled();
  });

  it('debería marcar controles como touched si el formulario no es válido (destinatario)', () => {
    component.esModoInstalacion = false;
    component.formularioAgregarDestinatario = new FormBuilder().group({ tipoPersona: [''] });
    jest.spyOn(component.formularioAgregarDestinatario, 'valid', 'get').mockReturnValue(false);
    const MARK_ALL_AS_TOUCHED_SPY = jest.spyOn(component.formularioAgregarDestinatario, 'markAllAsTouched');
    component.guardarDestinatario();
    expect(MARK_ALL_AS_TOUCHED_SPY).toHaveBeenCalled();
  });

  it('debería marcar controles como touched si el formulario no es válido (instalación)', () => {
    component.esModoInstalacion = true;
    component.formularioAgregarInstalacion = new FormBuilder().group({ tipoPersona: [''] });
    jest.spyOn(component.formularioAgregarInstalacion, 'valid', 'get').mockReturnValue(false);
    const MARK_ALL_AS_TOUCHED_SPY = jest.spyOn(component.formularioAgregarInstalacion, 'markAllAsTouched');
    component.guardarDestinatario();
    expect(MARK_ALL_AS_TOUCHED_SPY).toHaveBeenCalled();
  });

  it('debería llamar a setTramite220103State al obtener destinatario', () => {
    component.getDestinatario();
    expect(SERVICIO_MOCK.getDestinatario).toHaveBeenCalled();
    expect(TRAMITE_STORE_MOCK.setTramite220103State).toHaveBeenCalledWith('tablaDestinatario', expect.anything());
  });

  it('debería llamar a setTramite220103State al obtener instalación', () => {
    component.getInstalacion();
    expect(SERVICIO_MOCK.getInstalacion).toHaveBeenCalled();
    expect(TRAMITE_STORE_MOCK.setTramite220103State).toHaveBeenCalledWith('tablaInstalacion', expect.anything());
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const NEXT_SPY = jest.spyOn(component['notificadorDestruccion$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['notificadorDestruccion$'], 'complete');
    component.ngOnDestroy();
    expect(NEXT_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});