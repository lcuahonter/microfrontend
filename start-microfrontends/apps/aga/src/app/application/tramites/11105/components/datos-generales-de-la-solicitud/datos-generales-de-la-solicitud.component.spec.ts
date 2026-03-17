import { TestBed } from '@angular/core/testing';
import { DatosGeneralesDeLaSolicitudComponent } from './datos-generales-de-la-solicitud.component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RetiradaDeLaAutorizacionDeDonacionesService } from '../../services/retirad-de-la-autorizacion-de-donaciones.service';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('DatosGeneralesDeLaSolicitudComponent', () => {
  let component: DatosGeneralesDeLaSolicitudComponent;
  let fixture: any;
  let retiradaServiceMock: any;
  let validacionesServiceMock: any;

  beforeEach(async () => {
    retiradaServiceMock = {
      getAduanaIngresara: jest.fn().mockReturnValue(of([])),
      getDetallesDelMercanciaDatos: jest.fn().mockReturnValue(of({})),
      getPaisCatalogo: jest.fn().mockReturnValue(of({})),
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule,DatosGeneralesDeLaSolicitudComponent],
      declarations: [],
      providers: [
        { provide: RetiradaDeLaAutorizacionDeDonacionesService, useValue: retiradaServiceMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosGeneralesDeLaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tramiteForm).toBeDefined();
    expect(component.tramiteForm.get('retiradaDeDonaciones')).toBeDefined();
  });

  it('should fetch aduana data on initialization', () => {
    component.ngOnInit();
    expect(retiradaServiceMock.getAduanaIngresara).toHaveBeenCalled();
  });

  it('should fetch detalles del mercancía data on initialization', () => {
    component.ngOnInit();
    expect(retiradaServiceMock.getDetallesDelMercanciaDatos).toHaveBeenCalled();
  });

  it('should update valorSeleccionado when cambiarRadio is called', () => {
    component.cambiarRadio('sí');
    expect(component.valorSeleccionado).toBe('sí');
  });

  it('should open the popup when openPopup is called', () => {
    component.openPopup();
    expect(component.isPopupOpen).toBe(true);
  });

  it('should close the popup when closePopup is called', () => {
    component.closePopup();
    expect(component.isPopupOpen).toBe(false);
    expect(component.isPopupClose).toBe(false);
  });

  it('should hide the table when nextTabla is called', () => {
    component.nextTabla();
    expect(component.mostrarTabla).toBe(false);
  });

  it('should validate a form field using isValid', () => {
    const result = component.isValid(component.tramiteForm, 'retiradaDeDonaciones');
    expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(component.tramiteForm, 'retiradaDeDonaciones');
    expect(result).toBe(true);
  });

  it('should mark all fields as touched if the form is invalid', () => {
    component.tramiteForm = component.formBuilder.group({
      retiradaDeDonaciones: component.formBuilder.group({
        aduana: ['', Validators.required],
      }),
    });
    component.validarDestinatarioFormulario();
    expect(component.tramiteForm.touched).toBe(true);
  });

  it('should emit continuarEvento when continuar is called', () => {
    const spy = jest.spyOn(component.continuarEvento, 'emit');
    component.continuar();
    expect(spy).toHaveBeenCalledWith('');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyed$'], 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalledWith(true);
  });
});