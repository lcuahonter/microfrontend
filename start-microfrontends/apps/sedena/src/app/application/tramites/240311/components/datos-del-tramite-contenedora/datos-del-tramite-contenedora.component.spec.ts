import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelTramiteContenedoraComponent } from './datos-del-tramite-contenedora.component';
import {
  DatosDelTramiteFormState,
  JustificacionTramiteFormState,
  MercanciaDetalle,
} from '../../../../shared/models/datos-del-tramite.model';
import { Tramite240311Query } from '../../estados/tramite240311Query.query';
import { Tramite240311Store } from '../../estados/tramite240311Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ActivatedRoute } from '@angular/router';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-crosslist',
  standalone: true,
  template: '',
})
class MockCrosslistComponent {}

import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-datos-del-tramite',
  standalone: true,
  template: `
    <ng-content></ng-content>
  `,
  inputs: [
    'datosMercanciaTabla',
    'datosDelTramiteFormState',
    'justificacionTramiteFormState',
    'aduanasBotones',
    'idProcedimiento',
    'esFormularioSoloLectura'
  ],
  outputs: [
    'updateDatosDelTramiteFormulario',
    'updateJustificacionFormulario',
    'openModal'
  ]
})

@Component({
  selector: 'app-datos-del-tramite',
  standalone: true,
  template: `<ng-content></ng-content>`
})
class MockDatosDelTramiteComponent {
  @Input() datosMercanciaTabla: any;
  @Input() datosDelTramiteFormState: any;
  @Input() justificacionTramiteFormState: any;
  @Input() aduanasBotones: any;
  @Input() idProcedimiento: any;
  @Input() esFormularioSoloLectura: any;

  @Output() updateDatosDelTramiteFormulario = new EventEmitter<any>();
  @Output() updateJustificacionFormulario = new EventEmitter<any>();
  @Output() openModal = new EventEmitter<string>();
}


@Component({
  selector: 'app-modal',
  standalone: true,
  template: '',
})
class MockModalComponent {
  abrir = jest.fn();
  cerrar = jest.fn();
}

describe('DatosDelTramiteContenedoraComponent', () => {
  let component: DatosDelTramiteContenedoraComponent;
  let fixture: ComponentFixture<DatosDelTramiteContenedoraComponent>;

  const mockDatosTramite: DatosDelTramiteFormState = { campo: 'valor' } as any;
  const mockJustificacion: JustificacionTramiteFormState = { razon: 'Ejemplo' } as any;
  const mockMercancia: MercanciaDetalle[] = [{ descripcion: 'Producto' }] as any;
  const mockConsultaioState = { readonly: true };

 
  const tramiteQueryMock = {
    getDatosDelTramite$: of(mockDatosTramite),
    getJustificacionTramite$: of(mockJustificacion),
    getMercanciaTablaDatos$: of(mockMercancia),
  };

  const tramiteStoreMock = {
    updateDatosDelTramiteFormState: jest.fn(),
    updateJustificacionFormulario: jest.fn(),
  };

  const consultaQueryMock = {
    selectConsultaioState$: of(mockConsultaioState),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosDelTramiteContenedoraComponent],
      providers: [
        { provide: Tramite240311Query, useValue: tramiteQueryMock },
        { provide: Tramite240311Store, useValue: tramiteStoreMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
            paramMap: of(new Map()),
            queryParams: of({}),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA], 
    })
      .overrideComponent(DatosDelTramiteContenedoraComponent, {
        set: {
          imports: [
            MockDatosDelTramiteComponent,
            MockCrosslistComponent,
            MockModalComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DatosDelTramiteContenedoraComponent);
    component = fixture.componentInstance;

    
    component.modalComponent = new MockModalComponent() as any;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar los valores desde los observables', () => {
    expect(component.datosDelTramiteFormState).toEqual(mockDatosTramite);
    expect(component.justificacionTramiteFormState).toEqual(mockJustificacion);
    expect(component.datosMercanciaTabla).toEqual(mockMercancia);
    expect(component.esFormularioSoloLectura).toBe(true);
  });

  it('debería llamar a updateDatosDelTramiteFormulario', () => {
    const updatedState = { campo: 'nuevo' } as any;
    component.updateDatosDelTramiteFormulario(updatedState);
    expect(tramiteStoreMock.updateDatosDelTramiteFormState).toHaveBeenCalledWith(updatedState);
  });

  it('debería llamar a updateJustificacionFormulario', () => {
    const justificacion = { razon: 'nueva' } as any;
    component.updateJustificacionFormulario(justificacion);
    expect(tramiteStoreMock.updateJustificacionFormulario).toHaveBeenCalledWith(justificacion);
  });

  it('debería abrir el modal con DatosMercanciaContenedoraComponent al evento "Datosmercancia"', () => {
    const abrirSpy = jest.spyOn(component.modalComponent, 'abrir');
    component.openModal('Datosmercancia');
    expect(abrirSpy).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({
      cerrarModal: expect.any(Function),
    }));
  });

  it('no debería abrir el modal en un evento desconocido', () => {
    const abrirSpy = jest.spyOn(component.modalComponent, 'abrir');
    component.openModal('otroEvento');
    expect(abrirSpy).not.toHaveBeenCalled();
  });

  it('debería cerrar el modal', () => {
    const cerrarSpy = jest.spyOn(component.modalComponent, 'cerrar');
    component.cerrarModal();
    expect(cerrarSpy).toHaveBeenCalled();
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const nextSpy = jest.spyOn(component['unsubscribe$'], 'next');
    const completeSpy = jest.spyOn(component['unsubscribe$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
