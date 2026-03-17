import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AcusesYResolucionesFolioDelTramiteDetallesComponent } from './acuses-y-resoluciones-folio-del-tramite-detalles.component';
import { CommonModule } from '@angular/common';

describe('AcusesYResolucionesFolioDelTramiteDetallesComponent', () => {
  let component: AcusesYResolucionesFolioDelTramiteDetallesComponent;
  let fixture: any;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule,AcusesYResolucionesFolioDelTramiteDetallesComponent],
      declarations: [],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AcusesYResolucionesFolioDelTramiteDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.acusesYResolucionesFormGroup).toBeDefined();
    expect(component.acusesYResolucionesFormGroup.get('folio')).toBeDefined();
    expect(component.acusesYResolucionesFormGroup.get('dependencia')).toBeDefined();
    expect(component.acusesYResolucionesFormGroup.get('fechaInicial')).toBeDefined();
    expect(component.acusesYResolucionesFormGroup.get('fechaFinal')).toBeDefined();
    expect(component.acusesYResolucionesFormGroup.get('unidadAdministrativaORepresentacionFederal')).toBeDefined();
    expect(component.acusesYResolucionesFormGroup.get('tipoDeSolicitud')).toBeDefined();
    expect(component.acusesYResolucionesFormGroup.get('estatusDeLaSolicitud')).toBeDefined();
    expect(component.acusesYResolucionesFormGroup.get('diasHabilesTranscurridos')).toBeDefined();
  });

  it('should navigate to procedureUrl when desistir is called', () => {
    component.procedureUrl = '/test-url';
    component.desistir();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/test-url']);
  });

  it('should navigate to procedureRegresorUrl when regresar is called', () => {
    component.procedureRegresorUrl = '/previous-url';
    component.regresar();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/previous-url']);
  });
});