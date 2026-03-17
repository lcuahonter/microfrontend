import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SolicitanteComponent } from './solicitante.component';
import { By } from '@angular/platform-browser';

describe('SolicitanteComponent', () => {
  let component: SolicitanteComponent;
  let fixture: ComponentFixture<SolicitanteComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, SolicitanteComponent],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitanteComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.solicitudForm = formBuilder.group({
      rfc: [''],
      denominacion: [''],
      actividadEconomica: [''],
      correoElectronico: [''],
      pais: [''],
      codigoPostal: [''],
      estado: [''],
      municipioOAlcadia: [''],
      localidad: [''],
      colonia: [''],
      calle: [''],
      numeroExterior: [''],
      numeroInterior: [''],
      lada: [''],
      telefono: [''],
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title "Datos generales del solicitante"', () => {
    const tituloElement = fixture.debugElement.query(By.css('ng-titulo[titulo="Datos generales del solicitante"]'));
    expect(tituloElement).toBeTruthy();
  });

  it('should render the title "Domicilio fiscal del solicitante"', () => {
    const tituloElement = fixture.debugElement.query(By.css('ng-titulo[titulo="Domicilio fiscal del solicitante"]'));
    expect(tituloElement).toBeTruthy();
  });

  it('should have all form controls with readonly attribute', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input[readonly]'));
    expect(inputs.length).toBe(15);
  });

  it('should have correct formControlName attributes', () => {
    const formControls = [
      'rfc',
      'denominacion',
      'actividadEconomica',
      'correoElectronico',
      'pais',
      'codigoPostal',
      'estado',
      'municipioOAlcadia',
      'localidad',
      'colonia',
      'calle',
      'numeroExterior',
      'numeroInterior',
      'lada',
      'telefono',
    ];

    formControls.forEach((controlName) => {
      const input = fixture.debugElement.query(By.css(`input[formControlName="${controlName}"]`));
      expect(input).toBeTruthy();
    });
  });
});