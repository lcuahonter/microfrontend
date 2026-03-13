import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembroDeLaEmpresaComponent } from './miembro-de-la-empresa.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32607Store } from '../../estados/solicitud32607.store';
import { Solicitud32607Query } from '../../estados/solicitud32607.query';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  InputRadioComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { InputRadio } from '../../models/solicitud.model';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MiembroDeLaEmpresaComponent', () => {
  let component: MiembroDeLaEmpresaComponent;
  let fixture: ComponentFixture<MiembroDeLaEmpresaComponent>;
  let solicitudService: SolicitudService;
  let solicitud32607Store: Solicitud32607Store;
  let solicitud32607Query: Solicitud32607Query;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MiembroDeLaEmpresaComponent,
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        CatalogoSelectComponent,
        InputRadioComponent,
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: SolicitudService,
          useValue: {
            conseguirSolicitudCatologoSelectLista: jest.fn(() =>
              of({
                enSuCaracterDe: {
                  labelNombre: 'En su caracter de',
                  required: true,
                  primerOpcion: 'Selecciona un tipo',
                  catalogos: [
                    {
                      id: 1,
                      descripcion: 'Accionista',
                    },
                    {
                      id: 2,
                      descripcion: 'Accionista - 1',
                    },
                  ],
                },
                nacionalidad: {
                  labelNombre: 'Nacionalidad',
                  required: true,
                  primerOpcion: 'Selecciona un tipo',
                  catalogos: [
                    {
                      id: 1,
                      descripcion: 'AZERBAIJAN (REPUBLICA AZERBAIJANI)',
                    },
                    {
                      id: 2,
                      descripcion: 'AZERBAIJAN (REPUBLICA AZERBAIJANI) - 1',
                    },
                  ],
                },
                tipoDePersona: {
                  labelNombre: 'Tipo de Persona',
                  required: true,
                  primerOpcion: 'Selecciona un tipo',
                  catalogos: [
                    {
                      id: 1,
                      descripcion: 'Física',
                    },
                    {
                      id: 2,
                      descripcion: 'Moral',
                    },
                  ],
                },
              })
            ),
            conseguirOpcionDeRadio: jest.fn(() =>
              of({
                requisitos: {
                  radioOptions: [
                    {
                      label: 'Sí',
                      value: 1,
                    },
                    {
                      label: 'No',
                      value: 2,
                    },
                  ],
                  isRequired: true,
                },
              })
            ),
          },
        },
        {
          provide: Solicitud32607Store,
          useValue: {
            actualizarMiembroCaracterDe: jest.fn(() => of('Test')),
            actualizarMiembroTributarMexico: jest.fn(),
            actualizarMiembroNacionalidad: jest.fn(),
            actualizarMiembroRFC: jest.fn(() => of('RFC123')),
            actualizarMiembroTipoPersonaMuestra: jest.fn(() => of('Física')),
            actualizarMiembroNombre: jest.fn(),
            actualizarMiembroApellidoPaterno: jest.fn(),
            actualizarMiembroApellidoMaterno: jest.fn(),
            actualizarMiembroNombreEmpresa: jest.fn(),
            actualizarMiembroRegistroFederal: jest.fn(),
            actualizarMiembroNombreCompleto: jest.fn(() => of('John Doe')),
          },
        },
        {
          provide: Solicitud32607Query,
          useValue: {
            selectSolicitud$: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MiembroDeLaEmpresaComponent);
    component = fixture.componentInstance;
    solicitudService = TestBed.inject(SolicitudService);
    solicitud32607Store = TestBed.inject(Solicitud32607Store);
    solicitud32607Query = TestBed.inject(Solicitud32607Query);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.miembroEmpresaForm).toBeDefined();
    expect(component.miembroEmpresaForm.get('miembroCaracterDe')).toBeTruthy();
  });

  it('should call conseguirSolicitudCatologoSelectLista on initialization', () => {
    const spy = jest.spyOn(
      solicitudService,
      'conseguirSolicitudCatologoSelectLista'
    );
    component.conseguirSolicitudCatologoSelectLista();
    expect(spy).toHaveBeenCalled();
  });

  it('should call conseguirOpcionDeRadio on initialization', () => {
    const spy = jest.spyOn(solicitudService, 'conseguirOpcionDeRadio');
    component.conseguirOpcionDeRadio();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit eventoCerrarModal when cerrarModal is called', () => {
    const spy = jest.spyOn(component.eventoCerrarModal, 'emit');
    component.cerrarModal();
    expect(spy).toHaveBeenCalled();
  });

  it('should call actualizarMiembroCaracterDe with correct value', () => {
    const spy = jest.spyOn(solicitud32607Store, 'actualizarMiembroCaracterDe');
    component.actualizarMiembroCaracterDe({ id: 1 } as Catalogo);
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should call actualizarMiembroTributarMexico with correct value', () => {
    const spy = jest.spyOn(
      solicitud32607Store,
      'actualizarMiembroTributarMexico'
    );
    component.actualizarMiembroTributarMexico(1);
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should call actualizarMiembroNacionalidad with correct value', () => {
    const spy = jest.spyOn(
      solicitud32607Store,
      'actualizarMiembroNacionalidad'
    );
    component.actualizarMiembroNacionalidad({ id: 1 } as Catalogo);
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should call actualizarMiembroRFC with correct value', () => {
    const spy = jest.spyOn(solicitud32607Store, 'actualizarMiembroRFC');
    const event = { target: { value: 'RFC123' } } as unknown as Event;
    component.actualizarMiembroRFC(event);
    expect(spy).toHaveBeenCalledWith('RFC123');
  });

  it('should call buscarRFCDatos and update store values', () => {
    component.miembroEmpresaForm.get('miembroRfc')?.setValue('RFC123');
    const spyRegistro = jest.spyOn(
      solicitud32607Store,
      'actualizarMiembroRegistroFederal'
    );
    const spyNombre = jest.spyOn(
      solicitud32607Store,
      'actualizarMiembroNombreCompleto'
    );
    component.buscarRFCDatos();
    expect(spyRegistro).toHaveBeenCalledWith('MAVL621207C95');
    expect(spyNombre).toHaveBeenCalledWith(
      'EUROFOODS DE MEXICO GONZALEZ PINAL'
    );
  });

  it('should call actualizarMiembroTipoPersonaMuestra with correct value and set seleccionarTipoDePersona', () => {
    const spy = jest.spyOn(solicitud32607Store, 'actualizarMiembroTipoPersonaMuestra');
    const catalogo = { id: 2 } as Catalogo;
    component.actualizarMiembroTipoPersonaMuestra(catalogo);
    expect(spy).toHaveBeenCalledWith(2);
    expect(component.seleccionarTipoDePersona).toBe(2);
  });

  it('should call actualizarMiembroNombre with correct value', () => {
    const spy = jest.spyOn(solicitud32607Store, 'actualizarMiembroNombre');
    const event = { target: { value: 'Juan' } } as unknown as Event;
    component.actualizarMiembroNombre(event);
    expect(spy).toHaveBeenCalledWith('Juan');
  });

  it('should call actualizarMiembroApellidoPaterno with correct value', () => {
    const spy = jest.spyOn(solicitud32607Store, 'actualizarMiembroApellidoPaterno');
    const event = { target: { value: 'Pérez' } } as unknown as Event;
    component.actualizarMiembroApellidoPaterno(event);
    expect(spy).toHaveBeenCalledWith('Pérez');
  });

  it('should call actualizarMiembroApellidoMaterno with correct value', () => {
    const spy = jest.spyOn(solicitud32607Store, 'actualizarMiembroApellidoMaterno');
    const event = { target: { value: 'García' } } as unknown as Event;
    component.actualizarMiembroApellidoMaterno(event);
    expect(spy).toHaveBeenCalledWith('García');
  });

  it('should call actualizarMiembroNombreEmpresa with correct value', () => {
    const spy = jest.spyOn(solicitud32607Store, 'actualizarMiembroNombreEmpresa');
    const event = { target: { value: 'Empresa S.A.' } } as unknown as Event;
    component.actualizarMiembroNombreEmpresa(event);
    expect(spy).toHaveBeenCalledWith('Empresa S.A.');
  });
  
  it('should emit eventoActualizarMiembro with correct values when aceptarModal is called', () => {
    component.enSuCaracterDeLista = {
      labelNombre: 'En su caracter de',
      required: true,
      primerOpcion: 'Selecciona un tipo',
      catalogos: [
        { id: 1, descripcion: 'Accionista' },
        { id: 2, descripcion: 'Accionista - 1' },
      ],
    } as CatalogosSelect;
    component.nacionalidadLista = {
      labelNombre: 'Nacionalidad',
      required: true,
      primerOpcion: 'Selecciona un tipo',
      catalogos: [
        { id: 1, descripcion: 'AZERBAIJAN (REPUBLICA AZERBAIJANI)' },
        { id: 2, descripcion: 'AZERBAIJAN (REPUBLICA AZERBAIJANI) - 1' },
      ],
    } as CatalogosSelect;
    component.tipoDePersonaLista = {
      labelNombre: 'Tipo de Persona',
      required: true,
      primerOpcion: 'Selecciona un tipo',
      catalogos: [
        { id: 1, descripcion: 'Física' },
        { id: 2, descripcion: 'Moral' },
      ],
    } as CatalogosSelect;
    component.sinoOpcion = {
      radioOptions: [
        { label: 'Sí', value: 1 },
        { label: 'No', value: 2 },
      ],
      isRequired: true,
    } as InputRadio;
    component.miembroEmpresaForm.get('miembroCaracterDe')?.setValue(1);
    component.miembroEmpresaForm.get('miembroNacionalidad')?.setValue(2);
    component.miembroEmpresaForm.get('miembroTipoPersonaMuestra')?.setValue(1);
    component.miembroEmpresaForm.get('miembroTributarMexico')?.setValue(2);
    component.miembroEmpresaForm.get('miembroNombreCompleto')?.setValue('John Doe');
    component.miembroEmpresaForm.get('miembroRfc')?.setValue('RFC123');
    component.miembroEmpresaForm.get('miembroNombre')?.setValue('Juan');
    component.miembroEmpresaForm.get('miembroNombreEmpresa')?.setValue('Empresa S.A.');
    component.miembroEmpresaForm.get('miembroRegistroFederal')?.setValue('REG123');
    const spy = jest.spyOn(component.eventoActualizarMiembro, 'emit');
    component.aceptarModal();
    expect(spy).toHaveBeenCalledWith({
      tipoPersonaMuestra: 'Física',
      nombreCompleto: 'John Doe',
      rfc: 'RFC123',
      caracterDe: 'Accionista',
      nacionalidad: 'AZERBAIJAN (REPUBLICA AZERBAIJANI) - 1',
      paisNombre: 'Juan',
      nombreEmpresa: 'Empresa S.A.',
      tributarMexico: 'No',
      razonSocial: 'REG123',
    });
  });


  it('should mark a form field as invalid when noEsValido is called', () => {
    component.miembroEmpresaForm
      .get('miembroCaracterDe')
      ?.setErrors({ required: true });
    component.miembroEmpresaForm.get('miembroCaracterDe')?.markAsTouched();
    expect(component.noEsValido('miembroCaracterDe')).toBe(true);
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
