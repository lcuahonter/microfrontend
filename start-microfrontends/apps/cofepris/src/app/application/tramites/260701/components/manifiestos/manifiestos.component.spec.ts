import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ManifiestosComponent } from './manifiestos.component';
import { Solicitud260701State, Tramite260701Store } from '../../estados/tramites/tramite260701.store';
import { Tramite260701Query } from '../../estados/queries/tramite260701.query';
import { of } from 'rxjs';

describe('ManifiestosComponent', () => {
  let component: ManifiestosComponent;
  let fixture: ComponentFixture<ManifiestosComponent>;
  let tramite260701StoreMock: Partial<Tramite260701Store>;
  let tramite260701QueryMock: Partial<Tramite260701Query>;

  beforeEach(async () => {
    tramite260701StoreMock = {
      setCumplimiento: jest.fn(),
    };

    tramite260701QueryMock = {
      selectSolicitud$: of({
        cumplimiento: 'sí',
        denominacionORazonSocial: '',
        correoElectronico: '',
        codigoPostal: '',
        estado: '',
        municipio: '',
        localidad: '',
        colonia: '',
        calle: '',
        lada: '',
        telefono: '',
        avisoCheckbox: '',
        licenciaSanitaria: '',
    
      } as Solicitud260701State),
    };

    await TestBed.configureTestingModule({
      imports: [ManifiestosComponent, ReactiveFormsModule],
      providers: [
        { provide: Tramite260701Store, useValue: tramite260701StoreMock },
        { provide: Tramite260701Query, useValue: tramite260701QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManifiestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con el valor por defecto correcto', () => {
    expect(component.manifiestos.get('cumplimiento')?.value).toBe('sí');
  });

  it('debería actualizar el valor del radio seleccionado cuando se llama cambiarRadio', () => {
    component.cambiarRadio('no');
    expect(component.valorSeleccionado).toBe('no');
  });

  it('debería llamar setValoresStore con los argumentos correctos', () => {
    const form = component.manifiestos;
    const campo = 'cumplimiento';
    const metodoNombre = 'setCumplimiento';
    form.get(campo)?.setValue('no');

    component.setValoresStore(form, campo, metodoNombre as keyof Tramite260701Store);

    expect(tramite260701StoreMock.setCumplimiento).toHaveBeenCalledWith('no');
  });

  it('debería desuscribirse de los observables al destruir el componente', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
