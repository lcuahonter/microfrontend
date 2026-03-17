import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleTitularComponent } from './detalle-titular.component';
import { of } from 'rxjs';
import { TitularDetalleRespuesta } from '../../models/suspension-permiso.model';
import { HttpClientModule } from '@angular/common/http';

describe('DetalleTitularComponent', () => {
  let component: DetalleTitularComponent;
  let fixture: ComponentFixture<DetalleTitularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleTitularComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleTitularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call suspensionPermisoService.obtenerDetalleTitular and patch form values', () => {
    const mockResponse: TitularDetalleRespuesta = {
      code: 200,
      data: [
        {
          denominacion: 'Empresa XYZ',
          actividadEconomica: 'Comercio',
          correoElectronico: 'empresa@xyz.com',
          rfc: 'XYZ123456789',
          calle: 'Calle 123',
          numeroExterior: '45',
          numeroInterior: 'A',
          codigoPostal: '12345',
          colonia: 'Centro',
          pais: 'México',
          estado: 'CDMX',
          localidad: 'Ciudad de México',
          municipioAlcaldia: 'Cuauhtémoc',
          telefono: '5555555555',
        },
      ],
      message: 'Success'
    };

    jest.spyOn(component['suspensionPermisoService'], 'obtenerDetalleTitular').mockReturnValue(of(mockResponse));
    const datosGeneralesSpy = jest.spyOn(component.datosGenerales, 'patchValue');
    const domicilioFiscalSpy = jest.spyOn(component.domicilioFiscal, 'patchValue');

    component.obtenerDetalleTitular();

    expect(component['suspensionPermisoService'].obtenerDetalleTitular).toHaveBeenCalled();
    expect(datosGeneralesSpy).toHaveBeenCalledWith({
      denominacion: 'Empresa XYZ',
      actividadEconomica: 'Comercio',
      correoElectronico: 'empresa@xyz.com',
      rfc: 'XYZ123456789',
    });
    expect(domicilioFiscalSpy).toHaveBeenCalledWith({
      calle: 'Calle 123',
      numeroExterior: '45',
      numeroInterior: 'A',
      codigoPostal: '12345',
      colonia: 'Centro',
      pais: 'México',
      estado: 'CDMX',
      localidad: 'Ciudad de México',
      municipioAlcaldia: 'Cuauhtémoc',
      telefono: '5555555555',
    });
  });

  it('should not patch form values if obtenerDetalleTitular response is empty', () => {
    const mockResponse: TitularDetalleRespuesta = { code: 200, data: [], message: 'Success' };

    jest.spyOn(component['suspensionPermisoService'], 'obtenerDetalleTitular').mockReturnValue(of(mockResponse));
    const datosGeneralesSpy = jest.spyOn(component.datosGenerales, 'patchValue');
    const domicilioFiscalSpy = jest.spyOn(component.domicilioFiscal, 'patchValue');

    component.obtenerDetalleTitular();

    expect(component['suspensionPermisoService'].obtenerDetalleTitular).toHaveBeenCalled();
    expect(datosGeneralesSpy).not.toHaveBeenCalled();
    expect(domicilioFiscalSpy).not.toHaveBeenCalled();
  });

  it('should complete destruirNotificador$ on ngOnDestroy', () => {
    const destruirNotificadorSpy = jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(destruirNotificadorSpy).toHaveBeenCalled();
  });
});