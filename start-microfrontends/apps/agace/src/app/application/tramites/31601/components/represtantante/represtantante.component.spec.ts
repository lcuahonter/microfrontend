import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReprestantanteComponent } from './represtantante.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

jest.mock('@libs/shared/theme/assets/json/31601/represtantante-data.json', () => ({
  __esModule: true,
  default: {
    resigtro: '',
    rfc: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    correo: ''
  }
}), { virtual: true });

describe('ReprestantanteComponent', () => {
  let component: ReprestantanteComponent;
  let fixture: ComponentFixture<ReprestantanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        ReprestantanteComponent,
        TituloComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReprestantanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario correctamente', () => {
    expect(component.represtantante).toBeDefined();
    expect(component.represtantante.get('resigtro')).toBeDefined();
    expect(component.represtantante.get('rfcDatos')).toBeDefined();
    expect(component.represtantante.get('nombre')).toBeDefined();
    expect(component.represtantante.get('apellidoPaterno')).toBeDefined();
    expect(component.represtantante.get('apellidoMaterno')).toBeDefined();
    expect(component.represtantante.get('telefono')).toBeDefined();
    expect(component.represtantante.get('correo')).toBeDefined();
  });

 it('debe deshabilitar controles específicos del formulario', () => {
  component.esFormularioSoloLectura = true;
  component.inicializarEstadoFormulario();

  const rfc = component.represtantante.get('rfcDatos');
  const nombre = component.represtantante.get('nombre');
  const apellidoPaterno = component.represtantante.get('apellidoPaterno');
  const apellidoMaterno = component.represtantante.get('apellidoMaterno');

  expect(rfc?.disabled).toBe(true);
  expect(nombre?.disabled).toBe(true);
  expect(apellidoPaterno?.disabled).toBe(true);
  expect(apellidoMaterno?.disabled).toBe(true);
});

  it('debe asignar correctamente los valores al formulario', () => {
    const representativeData = component.datosRepresentativos;

    const resigtro = component.represtantante.get('resigtro');
    const rfc = component.represtantante.get('rfcDatos');
    const nombre = component.represtantante.get('nombre');
    const apellidoPaterno = component.represtantante.get('apellidoPaterno');
    const apellidoMaterno = component.represtantante.get('apellidoMaterno');
    const telefono = component.represtantante.get('telefono');
    const correo = component.represtantante.get('correo');

    expect(resigtro?.value).toBe(representativeData.resigtro);
    expect(rfc?.value).toBe(representativeData.rfc);
    expect(nombre?.value).toBe(representativeData.nombre);
    expect(apellidoPaterno?.value).toBe(representativeData.apellidoPaterno);
    expect(apellidoMaterno?.value).toBe(representativeData.apellidoMaterno);
    expect(telefono?.value).toBe(representativeData.telefono);
    expect(correo?.value).toBe(representativeData.correo);
  });
  
it('debe llamar a ngOnInit y configurar el formulario correctamente', () => {
  component.esFormularioSoloLectura = true;
  const spyPatchValue = jest.spyOn(component, 'ngOnInit');
  component.ngOnInit();

  expect(spyPatchValue).toHaveBeenCalled();
  expect(component.represtantante.get('rfcDatos')?.disabled).toBe(true);
  expect(component.represtantante.get('nombre')?.disabled).toBe(true);
  expect(component.represtantante.get('apellidoPaterno')?.disabled).toBe(true);
  expect(component.represtantante.get('apellidoMaterno')?.disabled).toBe(true);
});
});