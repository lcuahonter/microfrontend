import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportacionMineralesDeHierroComponent } from './exportacion-minerales-de-hierro.component';
import { BtnContinuarComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExportacionMineralesDeHierroComponent', () => {
  let component: ExportacionMineralesDeHierroComponent;
  let fixture: ComponentFixture<ExportacionMineralesDeHierroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportacionMineralesDeHierroComponent],
      imports: [WizardComponent, BtnContinuarComponent, TituloComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportacionMineralesDeHierroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pasosSolicitar and datosPasos', () => {
    expect(component.pasosSolicitar.length).toBeGreaterThan(0);
    expect(component.datosPasos.nroPasos).toEqual(component.pasosSolicitar.length);
    expect(component.datosPasos.indice).toEqual(component.indice);
  });

  it('should set activarBotonCargaArchivos when manejaEventoCargaDocumentos is called', () => {
    component.manejaEventoCargaDocumentos(true);
    component.manejaEventoCargaDocumentos(false);
  });

  it('should update seccionCargarDocumentos when cargaRealizada is called', () => {
    component.cargaRealizada(true);
    component.cargaRealizada(false);
   
  });

  it('should emit cargarArchivosEvento when onClickCargaArchivos is called', () => {
    spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
  });

  it('should clean up on ngOnDestroy', () => {
    spyOn(component['destroyed$'], 'next');
    spyOn(component['destroyed$'], 'complete');
    const storeSpy = spyOn(component['tramite130202Store'], 'resetStore');
    component.ngOnDestroy();
    expect(component['destroyed$'].next).toHaveBeenCalled();
    expect(component['destroyed$'].complete).toHaveBeenCalled();
    expect(storeSpy).toHaveBeenCalled();
  });
});