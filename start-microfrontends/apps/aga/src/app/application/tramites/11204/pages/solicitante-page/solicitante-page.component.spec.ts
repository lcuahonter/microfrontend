import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { BtnContinuarComponent, WizardComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http'; // Import HttpClientModule

describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;
  let fixture: ComponentFixture<SolicitantePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        WizardComponent, // Import standalone component
        PasoUnoComponent, // Import standalone component
        PasoTresComponent, // Import standalone component
        BtnContinuarComponent, // Import standalone component
      ],
      declarations: [PasoDosComponent, SolicitantePageComponent], // Declare the main component
      providers: [
        provideHttpClient(), // Provide HttpClient
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pasos and update the title of the second step on ngOnInit', () => {
    component.ngOnInit();
    expect(component.pasos).toBeDefined();
    const paso = component.pasos.find(p => p.indice === 2);
    expect(paso?.titulo).toBe('Cargar pago');
  });

  it('should set indice to the provided value on seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should update indice and call wizardComponent.siguiente on getValorIndice with accion "cont"', () => {
    const siguienteSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(siguienteSpy).toHaveBeenCalled();
  });

  it('should update indice and call wizardComponent.atras on getValorIndice with accion "back"', () => {
    const atrasSpy = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'back', valor: 1 });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(atrasSpy).toHaveBeenCalled();
  });

  it('should call getValorIndice with incremented indice on continuar', () => {
    const getValorIndiceSpy = jest.spyOn(component, 'getValorIndice');
    component.indice = 1;
    component.continuar();
    expect(getValorIndiceSpy).toHaveBeenCalledWith({ accion: 'cont', valor: 2 });
  });

});