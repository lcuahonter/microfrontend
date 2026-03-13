import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Tramite630103Query } from '../../estados/tramite630103.query';
import { Tramite630103Store } from '../../estados/tramite630103.store';
import { AutorizacionImportacionTemporalService } from '../../services/autorizacion-importacion-temporal.service';

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let mockTramite630103Store: any;
  let mockTramite630103Query: any;
  let mockAutorizacionImportacionTemporalService: any;
  let destroyed$: Subject<void>;

  const mockAduanaDeIngreso = [
    { id: '1', descripcion: 'Aduana Ciudad de México' },
    { id: '2', descripcion: 'Aduana Monterrey' }
  ];

  const mockSeccionAduanera = [
    { id: '1', descripcion: 'Sección A' },
    { id: '2', descripcion: 'Sección B' }
  ];

  const mockState = {
    cveAduana: '1',
    cveSeccionAduanera: '2'
  };

  beforeEach(async () => {
    mockTramite630103Store = {
      setTramite630103State: jest.fn(),
    };

    mockTramite630103Query = {
      selectTramite630103State$: of(mockState),
    };

    mockAutorizacionImportacionTemporalService = {
      getAduanaDeIngreso: jest.fn().mockReturnValue(of(mockAduanaDeIngreso)),
      getSeccionAduanera: jest.fn().mockReturnValue(of(mockSeccionAduanera)),
    };

    destroyed$ = new Subject<void>();

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormasDinamicasComponent,
        DatosDeLaSolicitudComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite630103Store, useValue: mockTramite630103Store },
        { provide: Tramite630103Query, useValue: mockTramite630103Query },
        { provide: AutorizacionImportacionTemporalService, useValue: mockAutorizacionImportacionTemporalService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    destroyed$.next();
    destroyed$.complete();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería deshabilitar el formulario si esSoloLectura es true', () => {
    component.esSoloLectura = true;
    const disableSpy = jest.spyOn(component.datosImportacionTemporalFormulario, 'disable');
    component.guardarDatosFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('debería habilitar el formulario si esSoloLectura es false', () => {
    component.esSoloLectura = false;
    const enableSpy = jest.spyOn(component.datosImportacionTemporalFormulario, 'enable');
    component.guardarDatosFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('debería obtener el estado actual del store', () => {
    component.getValorStore();
    expect(component.estadoSeleccionado).toEqual(mockState);
  });

  it('debería actualizar el store cuando establecerCambioDeValor es llamado con objeto con id', () => {
    const event = { campo: 'testField', valor: { id: '123', name: 'Test' } };
    component.establecerCambioDeValor(event);
    expect(mockTramite630103Store.setTramite630103State).toHaveBeenCalledWith('testField', '123');
  });

  it('debería actualizar el store cuando establecerCambioDeValor es llamado con valor directo', () => {
    const event = { campo: 'testField', valor: 'testValue' };
    component.establecerCambioDeValor(event);
    expect(mockTramite630103Store.setTramite630103State).toHaveBeenCalledWith('testField', 'testValue');
  });

  it('debería obtener las aduanas y actualizar formularioDatosSolicitud', () => {
    component.formularioDatosSolicitud = [{ id: 'cveAduana', opciones: [] } as any];
    component.getAduanaDeIngreso();
    expect(mockAutorizacionImportacionTemporalService.getAduanaDeIngreso).toHaveBeenCalled();
    expect(component.formularioDatosSolicitud[0].opciones).toEqual(mockAduanaDeIngreso);
  });

  it('debería obtener las secciones aduaneras y actualizar formularioDatosSolicitud', () => {
    component.formularioDatosSolicitud = [{ id: 'cveSeccionAduanera', opciones: [] } as any];
    component.getSeccionAduanera();
    expect(mockAutorizacionImportacionTemporalService.getSeccionAduanera).toHaveBeenCalled();
    expect(component.formularioDatosSolicitud[0].opciones).toEqual(mockSeccionAduanera);
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const destroyedSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});