import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AcusesYResolucionesFolioDelTramiteBusquedaComponent } from './acuses-y-resoluciones-folio-del-tramite-busqueda.component';
import { AcuseYResolucionesFolioTramiteService } from '../../../core/services/shared/acuses-y-resolucions-folio-tramite/acuses-y-resoluciones-folio-tramite.service';
import { CommonModule } from '@angular/common';
import { InputFechaComponent, TablaDinamicaComponent } from '@libs/shared/data-access-user/src';

describe('AcusesYResolucionesFolioDelTramiteBusquedaComponent', () => {
  let component: AcusesYResolucionesFolioDelTramiteBusquedaComponent;
  let fixture: any;
  let routerMock: any;
  let acuseYResolucionesFolioTramiteServiceMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn(),
    };

    acuseYResolucionesFolioTramiteServiceMock = {
      getAcuseYResolucionesFolioTramite: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, InputFechaComponent, TablaDinamicaComponent,AcusesYResolucionesFolioDelTramiteBusquedaComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AcuseYResolucionesFolioTramiteService, useValue: acuseYResolucionesFolioTramiteServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AcusesYResolucionesFolioDelTramiteBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.formBusqueda).toBeDefined();
    expect(component.formBusqueda.get('solicitante')).toBeDefined();
    expect(component.formBusqueda.get('rfc')).toBeDefined();
    expect(component.formBusqueda.get('folio')).toBeDefined();
    expect(component.formBusqueda.get('fechaInicial')).toBeDefined();
    expect(component.formBusqueda.get('fechaFinal')).toBeDefined();
  });

  it('should fetch data on initialization', () => {
    component.ngOnInit();
    expect(acuseYResolucionesFolioTramiteServiceMock.getAcuseYResolucionesFolioTramite).toHaveBeenCalled();
  });

  it('should update fechaInicial when cambioFechaInicio is called', () => {
    component.cambioFechaInicio('2025-04-01');
    expect(component.formBusqueda.get('fechaInicial')?.value).toBe('2025-04-01');
  });

  it('should update fechaFinal when cambioFechaFinal is called', () => {
    component.cambioFechaFinal('2025-04-02');
    expect(component.formBusqueda.get('fechaFinal')?.value).toBe('2025-04-02');
  });

  it('should navigate to procedureUrl when continuar is called', () => {
    component.procedureUrl = '/test-url';
    component.continuar();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/test-url']);
  });

  it('should navigate to procedureUrl when onFilaClic is called', () => {
    component.procedureUrl = '/test-url';
    component.onFilaClic();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/test-url']);
  });

  it('should set espectaculoAcuseYResolucionesFolioTramiteDatos to true when folioTramite is called', () => {
    component.folioTramite();
    expect(component.espectaculoAcuseYResolucionesFolioTramiteDatos).toBe(true);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});