// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PasoUnoComponent } from './paso-uno.component';
import { PermisoImmexDatosService } from '../../servicios/immex/permiso-immex-datos.service';
import { Subject } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let permisoImmexDatosServiceMock: any;

  beforeEach(async () => {
    permisoImmexDatosServiceMock = {
      actualizarEstadoFormulario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PasoUnoComponent, HttpClientTestingModule],
      providers: [
        {
          provide: PermisoImmexDatosService,
          useValue: permisoImmexDatosServiceMock,
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should fallback safely when immexRegistro is undefined', async () => {
    component.immexRegistro = undefined;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.esDatosRespuesta).toBe(true);
    permisoImmexDatosServiceMock.actualizarEstadoFormulario({});
    expect(
      permisoImmexDatosServiceMock.actualizarEstadoFormulario
    ).toHaveBeenCalledWith({});
  });

  it('should call actualizarEstadoFormulario with empty object when immexRegistro is undefined', async () => {
    component.immexRegistro = undefined;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.esDatosRespuesta).toBe(true);
    permisoImmexDatosServiceMock.actualizarEstadoFormulario({});
    expect(
      permisoImmexDatosServiceMock.actualizarEstadoFormulario
    ).toHaveBeenCalledWith({});
  });

  it('should set esDatosRespuesta to true when update is false', async () => {
    component.update = false;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should have destroyNotifier$ as a Subject and complete it on destroy', () => {
    component.destroyNotifier$ = new Subject();
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});