import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoDeModificacionComponent } from '../aviso-de-modificacion/aviso-de-modificacion.component';
import { ModificacionPartesComponent } from './modificacion-partes.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Solicitud33304Store } from '../../estados/solicitud33304Store';
import { Solicitud33304Query } from '../../estados/solicitud33304Query';
import { AvisoModificacionService } from '../../services/aviso-modificacion.service';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';


describe('ModificacionPartesComponent', () => {
  let component: ModificacionPartesComponent;
  let fixture: ComponentFixture<ModificacionPartesComponent>;
  let solicitudStoreMock: any;
  let solicitudQueryMock: any;

  beforeEach(async () => {
    solicitudStoreMock = {
      actualizarEstado: jest.fn()
    };

    solicitudQueryMock = {
      selectSolicitud$: of({}),
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, ModificacionPartesComponent, CatalogoSelectComponent, InputFechaComponent],
      providers: [
        { provide: Solicitud33304Store, useValue: solicitudStoreMock },
        { provide: Solicitud33304Query, useValue: solicitudQueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificacionPartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores vacíos', () => {
    expect(component.formularioModificationPartes).toBeDefined();
    expect(component.formularioModificationPartes.get('modificacionPartes')?.value).toBeNull();
  });

  it('debe actualizar el store al cambiar un campo', () => {
    const control = component.formularioModificationPartes.get('rfcPartesC2');
    control?.setValue('RFC-TEST');
    component.setValoresStore(component.formularioModificationPartes, 'rfcPartesC2');
    expect(solicitudStoreMock.actualizarEstado).toHaveBeenCalledWith({ rfcPartesC2: 'RFC-TEST' });
  });

  it('debe aplicar validadores cuando modificacionPartes es 1', () => {
    component.formularioModificationPartes.get('modificacionPartes')?.setValue('1');
    component.aplicarValidadoresPorOpcion('1');
    expect(component.formularioModificationPartes.get('rfcPartesC2')?.validator).toBeTruthy();
    expect(component.formularioModificationPartes.get('caracterDeCons2')?.validator).toBeTruthy();
  });

  it('debe limpiar los campos de las partes correctamente', () => {
    component.formularioModificationPartes.patchValue({
      rfcPartesC2: 'RFC123',
      rfcPartesCons2: 'RFC Cons',
      nombrePartesCons2: 'Nombre',
      caracterDeCons2: 'Caracter'
    });
    component.limpiaCamposParteC();
    expect(component.formularioModificationPartes.get('rfcPartesC2')?.value).toBe('');
    expect(component.formularioModificationPartes.get('rfcPartesCons2')?.value).toBe('');
    expect(component.formularioModificationPartes.get('nombrePartesCons2')?.value).toBe('');
    expect(component.formularioModificationPartes.get('caracterDeCons2')?.value).toBe('');
  });

  it('debe copiar el RFC y asignar nombre al cargarDatosRfcPartesC', () => {
    component.formularioModificationPartes.get('rfcPartesC2')?.setValue('RFC123');
    component.cargarDatosRfcPartesC();
    expect(component.formularioModificationPartes.get('rfcPartesCons2')?.value).toBe('RFC123');
    expect(component.formularioModificationPartes.get('nombrePartesCons2')?.value).toBe('Nombre de la parte (ejemplo)');
  });
});
