import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { SanidadAcuicolaImportacionService } from '../../services/sanidad-acuicola-importacion.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

/**
 * Componente mock para 'solicitante' para evitar errores de dependencias.
 */
@Component({
  selector: 'solicitante',
  template: '<div></div>',
})
class MockSolicitanteComponent {}

/**
 * Componente mock para 'app-datos-del-tramite' para evitar errores de dependencias.
 */
@Component({
  selector: 'app-datos-del-tramite',
  template: '<div></div>',
})
class MockDatosDelTramiteComponent {}

/**
 * Componente mock para 'app-datos-de-instalacion' para evitar errores de dependencias.
 */
@Component({
  selector: 'app-datos-de-instalacion',
  template: '<div></div>',
})
class MockDatosDeInstalacionComponent {}

/**
 * Componente mock para 'app-datos-del-terceros' para evitar errores de dependencias.
 */
@Component({
  selector: 'app-datos-del-terceros',
  template: '<div></div>',
})
class MockDatosDelTercerosComponent {}

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let servicioMock: jest.Mocked<SanidadAcuicolaImportacionService>;
  let consultaQueryMock: jest.Mocked<ConsultaioQuery>;

  beforeEach(async () => {
    servicioMock = {
      getDatos: jest.fn().mockReturnValue(of({})),
      updateState: jest.fn(),
    } as unknown as jest.Mocked<SanidadAcuicolaImportacionService>;

    consultaQueryMock = {
      selectConsultaioState$: of({ update: true }),
    } as unknown as jest.Mocked<ConsultaioQuery>;

    await TestBed.configureTestingModule({
      declarations: [
        PasoUnoComponent,
        MockSolicitanteComponent,
        MockDatosDelTramiteComponent,
        MockDatosDeInstalacionComponent,
        MockDatosDelTercerosComponent,
      ],
      providers: [
        { provide: SanidadAcuicolaImportacionService, useValue: servicioMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignora errores de elementos desconocidos
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el estado en ngOnInit', () => {
    component.ngOnInit();
    expect(component.estadoConsulta).toEqual({ update: true });
  });

  it('debería llamar a obtenerDatosDeSolicitudes si update es true', () => {
    const OBTENER_DATOS_SPY = jest.spyOn(component, 'obtenerDatosDeSolicitudes');
    component.ngOnInit();
    expect(OBTENER_DATOS_SPY).toHaveBeenCalled();
  });

  it('debería establecer datosRespuestaDisponibles en true si update es false', () => {
    consultaQueryMock.selectConsultaioState$ = of({
      update: false,
      procedureId: null,
      parameter: null,
      department: null,
      folioTramite: null,
      readonly: false,
      create: false,
    } as any);
    component.ngOnInit();
    expect(component.datosRespuestaDisponibles).toBe(true);
  });

  it('debería seleccionar la pestaña correcta al llamar a seleccionarPestana', () => {
    component.seleccionarPestana(2);
    expect(component.indice).toBe(2);
  });

  it('debería renderizar el componente solicitante cuando el índice es 1', () => {
    component.indice = 1;
    fixture.detectChanges();
    const SOLICITANTE_ELEMENT = fixture.nativeElement.querySelector('solicitante');
    expect(SOLICITANTE_ELEMENT).toBeTruthy();
  });

  it('debería renderizar el componente app-datos-del-tramite cuando el índice es 2 y datosRespuestaDisponibles es true', () => {
    component.indice = 2;
    component.datosRespuestaDisponibles = true;
    fixture.detectChanges();
    const DATOS_DEL_TRAMITE_ELEMENT = fixture.nativeElement.querySelector('app-datos-del-tramite');
    expect(DATOS_DEL_TRAMITE_ELEMENT).toBeTruthy();
  });

  it('debería renderizar el componente app-datos-de-instalacion cuando el índice es 3 y datosRespuestaDisponibles es true', () => {
    component.indice = 3;
    component.datosRespuestaDisponibles = true;
    fixture.detectChanges();
    const DATOS_DE_INSTALACION_ELEMENT = fixture.nativeElement.querySelector('app-datos-de-instalacion');
    expect(DATOS_DE_INSTALACION_ELEMENT).toBeTruthy();
  });

  it('debería renderizar el componente app-datos-del-terceros cuando el índice es 4 y datosRespuestaDisponibles es true', () => {
    component.indice = 4;
    component.datosRespuestaDisponibles = true;
    fixture.detectChanges();
    const DATOS_DEL_TERCEROS_ELEMENT = fixture.nativeElement.querySelector('app-datos-del-terceros');
    expect(DATOS_DEL_TERCEROS_ELEMENT).toBeTruthy();
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const SPY_NEXT = jest.spyOn(component['notificadorDestruccion$'], 'next');
    const SPY_COMPLETE = jest.spyOn(component['notificadorDestruccion$'], 'complete');
    component.ngOnDestroy();
    expect(SPY_NEXT).toHaveBeenCalled();
    expect(SPY_COMPLETE).toHaveBeenCalled();
  });
});