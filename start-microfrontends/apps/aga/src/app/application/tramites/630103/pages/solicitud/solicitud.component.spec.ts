import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosMercanciaComponent } from '../../components/datos-mercancia/datos-mercancia.component';
import { FechaDeImportacionComponent } from '../../components/fecha-de-importacion/fecha-de-importacion.component';
import { ManifiestoComponent } from '../../components/manifiesto/manifiesto.component';
import { TipoPropietarioComponent } from '../../components/tipo-propietario/tipo-propietario.component';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SolicitudComponent,
        DatosDeLaSolicitudComponent,
        DatosMercanciaComponent,
        FechaDeImportacionComponent,
        ManifiestoComponent,
        TipoPropietarioComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;

    // Mock child components
    component.datosDeLaSolicitud = { validarFormulario: jest.fn().mockReturnValue(true) } as any;
    component.fechaDeImportacion = { validarFormulario: jest.fn().mockReturnValue(true) } as any;
    component.tipoPropietario = { validarFormulario: jest.fn().mockReturnValue(true) } as any;
    component.datosMercancia = { validarFormulario: jest.fn().mockReturnValue(true) } as any;
    component.manifiesto = { validarFormulario: jest.fn().mockReturnValue(true) } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true when all child forms are valid', () => {
    expect(component.validarFormulario()).toBe(true);
  });

  it('should return false if any child form is invalid', () => {
    (component.datosDeLaSolicitud.validarFormulario as jest.Mock).mockReturnValueOnce(false);
    expect(component.validarFormulario()).toBe(false);
  });

  it('should call validarFormulario on all child components', () => {
    component.validarFormulario();
    expect(component.datosDeLaSolicitud.validarFormulario).toHaveBeenCalled();
    expect(component.fechaDeImportacion.validarFormulario).toHaveBeenCalled();
    expect(component.tipoPropietario.validarFormulario).toHaveBeenCalled();
    expect(component.datosMercancia.validarFormulario).toHaveBeenCalled();
    expect(component.manifiesto.validarFormulario).toHaveBeenCalled();
  });

  it('validarManifiesto should return manifiesto.validarFormulario value', () => {
    (component.manifiesto.validarFormulario as jest.Mock).mockReturnValueOnce(true);
    expect(component.validarManifiesto()).toBe(true);

    (component.manifiesto.validarFormulario as jest.Mock).mockReturnValueOnce(false);
    expect(component.validarManifiesto()).toBe(false);
  });

  it('validarManifiesto should return false if manifiesto is undefined', () => {
    component.manifiesto = undefined as any;
    expect(component.validarManifiesto()).toBe(false);
  });
});