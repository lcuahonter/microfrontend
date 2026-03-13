import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { Solicitud260701State, Tramite260701Store } from '../../estados/tramites/tramite260701.store';
import { Tramite260701Query } from '../../estados/queries/tramite260701.query';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let tramite260701StoreMock: Partial<Tramite260701Store>;
  let tramite260701QueryMock: Partial<Tramite260701Query>;

  beforeEach(async () => {
    tramite260701StoreMock = {
      setTipoOperacion: jest.fn(),
      setJustificacion: jest.fn(),
    };

    tramite260701QueryMock = {
      selectSolicitud$: of({
        tipoOperacion: 'Operacion1',
        justificacion: 'Justificacion1',
        denominacionORazonSocial: 'Empresa1',
        correoElectronico: 'test@example.com',
        codigoPostal: '',
        estado: '',
        municipio: '',
        localidad: '',
        
      } as Solicitud260701State),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosDeLaSolicitudComponent,HttpClientTestingModule],
      providers: [
        { provide: Tramite260701Store, useValue: tramite260701StoreMock },
        { provide: Tramite260701Query, useValue: tramite260701QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería alternar el estado colapsable', () => {
    expect(component.colapsable).toBe(true);
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(false);
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(true);
  });

  it('debería habilitar todos los controles del formulario cuando se llama toggleFormControls', () => {
    component.toggleFormControls();
    Object.keys(component.forma.controls).forEach((controlName) => {
      expect(component.forma.get(controlName)?.enabled).toBe(true);
    });
  });

  it('debería llamar al método apropiado del store cuando se llama setValoresStore', () => {
    const form = component.forma;
    form.get('tipoOperacion')?.setValue('NewOperacion');
    component.setValoresStore(form, 'tipoOperacion', 'setTipoOperacion');
    expect(tramite260701StoreMock.setTipoOperacion).toHaveBeenCalledWith('NewOperacion');
  });

  it('debería completar destroyNotifier$ en ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });
});
