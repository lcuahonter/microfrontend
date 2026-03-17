import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonasNotificarComponent } from './personas-notificar.component';
import { of, throwError } from 'rxjs';
import { PersonasNotificarRespuesta } from '../../models/suspension-permiso.model';
import { HttpClientModule } from '@angular/common/http';

describe('PersonasNotificarComponent', () => {
  let component: PersonasNotificarComponent;
  let fixture: ComponentFixture<PersonasNotificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonasNotificarComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonasNotificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call suspensionPermisoService.obtenerPersonasNotificar and update personasNotificarTabla', () => {
    const mockResponse: PersonasNotificarRespuesta = {
      code: 200,
      data: [
        {
          nombre: "MISAEL",
          apellidoPaterno: "BARRAGAN",
          apellidoMaterno: "RUIZ",
          correoElectronico: "VUCEMcbp@hotmail.com",
          pais: "",
          entidadFederative: "",
          municipioDelegacion: ""
        },
        {
          nombre: "EUROFOODS DE MEXICO",
          apellidoPaterno: "GONZALEZ",
          apellidoMaterno: "PINAL",
          correoElectronico: "vucem2.5@hotmail.com",
          pais: "",
          entidadFederative: "",
          municipioDelegacion: ""
        }
      ],
      message: 'Success'
    };

    const suspensionPermisoServiceSpy = jest
      .spyOn(component['suspensionPermisoService'], 'obtenerPersonasNotificar')
      .mockReturnValue(of(mockResponse));

    component.obtenerPersonasNotificar();

    expect(suspensionPermisoServiceSpy).toHaveBeenCalled();
    expect(component.personasNotificarTabla).toEqual(mockResponse.data);
  });

  it('should handle empty response from suspensionPermisoService.obtenerPersonasNotificar', () => {
    const mockResponse: PersonasNotificarRespuesta = { code: 200, data: [], message: 'No data' };

    jest.spyOn(component['suspensionPermisoService'], 'obtenerPersonasNotificar').mockReturnValue(of(mockResponse));

    component.obtenerPersonasNotificar();

    expect(component.personasNotificarTabla).toEqual([]);
  });

  it('should complete destruirNotificador$ on ngOnDestroy', () => {
    const destruirNotificadorSpy = jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(destruirNotificadorSpy).toHaveBeenCalled();
  });
});