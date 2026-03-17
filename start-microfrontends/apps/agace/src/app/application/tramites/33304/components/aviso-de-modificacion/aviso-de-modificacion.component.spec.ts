import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoDeModificacionComponent } from './aviso-de-modificacion.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Solicitud33304Store } from '../../estados/solicitud33304Store';
import { Solicitud33304Query } from '../../estados/solicitud33304Query';
import { AvisoModificacionService } from '../../services/aviso-modificacion.service';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';


describe('AvisoDeModificacionComponent', () => {
  let component: AvisoDeModificacionComponent;
  let fixture: ComponentFixture<AvisoDeModificacionComponent>;
  let avisoModificacionServiceMock: any;
  let solicitudStoreMock: any;
  let solicitudQueryMock: any;

  beforeEach(async () => {
    avisoModificacionServiceMock = {
      getEntidadFederativa: jest.fn().mockReturnValue(of([])),
      getFraccionArancelaria: jest.fn().mockReturnValue(of([])),
      getCveTipoDoc: jest.fn().mockReturnValue(of([])),
    };

    solicitudStoreMock = {
      actualizarEstado: jest.fn()
    };

    solicitudQueryMock = {
      selectSolicitud$: of({}),
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [AvisoDeModificacionComponent, CatalogoSelectComponent, InputFechaComponent, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AvisoModificacionService, useValue: avisoModificacionServiceMock },
        { provide: Solicitud33304Store, useValue: solicitudStoreMock },
        { provide: Solicitud33304Query, useValue: solicitudQueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvisoDeModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores vacíos', () => {
    expect(component.formularioAvisoDeModification).toBeDefined();
    expect(component.formularioAvisoDeModification.get('direccion')?.value).toBe('');
  });

  it('debe actualizar el store al cambiar un campo', () => {
    const control = component.formularioAvisoDeModification.get('direccion');
    control?.setValue('Nueva Dirección');
    component.setValoresStore(component.formularioAvisoDeModification, 'direccion');
    expect(solicitudStoreMock.actualizarEstado).toHaveBeenCalledWith({ direccion: 'Nueva Dirección' });
  });

  it('debe agregar una parte C correctamente', () => {
    component.formularioAvisoDeModification.patchValue({
      rfcPartesCons: 'RFC123',
      nombrePartesCons: 'Nombre Parte',
      caracterDeCons: 'Representante'
    });
    component.agregarParteC();
    expect(component.modificacionPartesData[0].tbodyData).toContain('RFC123');
    expect(component.modificacionPartesData[0].tbodyData).toContain('Nombre Parte');
    expect(component.modificacionPartesData[0].tbodyData).toContain('Representante');
  });

  it('debe limpiar los campos de la parte C', () => {
    component.formularioAvisoDeModification.patchValue({
      rfcPartesC: 'RFC',
      rfcPartesCons: 'RFC Cons',
      nombrePartesCons: 'Nombre',
      caracterDeCons: 'Caracter'
    });
    component.limpiaCamposParteC();
    expect(component.formularioAvisoDeModification.get('rfcPartesC')?.value).toBe('');
    expect(component.formularioAvisoDeModification.get('rfcPartesCons')?.value).toBe('');
    expect(component.formularioAvisoDeModification.get('nombrePartesCons')?.value).toBe('');
    expect(component.formularioAvisoDeModification.get('caracterDeCons')?.value).toBe('');
  });

  it('debe eliminar la última parte C añadida', () => {
    component.modificacionPartesData[0].tbodyData = ['RFC1', 'Nombre1', 'Caracter1', 'RFC2', 'Nombre2', 'Caracter2'];
    component.eliminarParteC();
    expect(component.modificacionPartesData[0].tbodyData).toEqual(['RFC1', 'Nombre1', 'Caracter1']);
  });
});