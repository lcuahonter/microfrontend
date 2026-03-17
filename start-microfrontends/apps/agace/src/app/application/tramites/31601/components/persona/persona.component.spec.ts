import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { PersonaComponent } from './persona.component';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { TituloComponent } from '@ng-mf/data-access-user';

class MockServiciosPantallaService {
  getPersonapara() {
    return of([
      {
        rfc: 'AAXX010101HNROZZA',
        curp: 'AAXX010101HNROZZA',
        nombre: 'John Doe',
        apellidoPaterno: 'Doe',
        apellidoMaterno: 'Smith',
      },
      {
        rfc: 'BBYY020202MCLGZZB',
        curp: 'BBYY020202MCLGZZB',
        nombre: 'Jane Smith',
        apellidoPaterno: 'Smith',
        apellidoMaterno: 'Johnson',
      },
    ]);
  }
}

fdescribe('PersonaComponent', () => {
  let component: PersonaComponent;
  let fixture: ComponentFixture<PersonaComponent>;
  let pantallaSvc: ServiciosPantallaService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientModule,
        FormsModule,
        CommonModule,
        PersonaComponent,
        TituloComponent,
      ],
      providers: [
        {
          provide: ServiciosPantallaService,
          useClass: MockServiciosPantallaService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaComponent);
    component = fixture.componentInstance;
    pantallaSvc = TestBed.inject(ServiciosPantallaService);
    fixture.detectChanges();
  });

  it('debe crear el componente PersonaComponent', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar y cargar personaparas en ngOnInit', () => {
    component.ngOnInit();

    expect(component.personaParas.length).toBe(2);
    expect(component.personaParas[0].nombre).toBe('John Doe');
    expect(component.personaParas[1].nombre).toBe('Jane Smith');
  });

  it('debe alternar showContent', () => {
    expect(component.showContent).toBeFalsy(); 
    component.toggleContent();
    expect(component.showContent).toBe(true); 
    component.toggleContent();
    expect(component.showContent).toBeFalsy(); 
  });

  it('debe llamar a loadPersonas y actualizar personaparas', () => {
    component.loadPersonas();

    expect(component.personaParas).toEqual([
      {
        rfc: 'AAXX010101HNROZZA',
        curp: 'AAXX010101HNROZZA',
        nombre: 'John Doe',
        apellidoPaterno: 'Doe',
        apellidoMaterno: 'Smith',
      },
      {
        rfc: 'BBYY020202MCLGZZB',
        curp: 'BBYY020202MCLGZZB',
        nombre: 'Jane Smith',
        apellidoPaterno: 'Smith',
        apellidoMaterno: 'Johnson',
      },
    ]);
  });

it('debe llamar a getPersonapara y asignar datos a personaparas cuando se llama loadPersonas', () => {
  jest.spyOn(pantallaSvc, 'getPersonapara');
  component.loadPersonas();
  expect(pantallaSvc.getPersonapara).toHaveBeenCalledTimes(1);
  expect(component.personaParas.length).toBe(2);
  expect(component.personaParas[0].nombre).toBe('John Doe');
  expect(component.personaParas[1].nombre).toBe('Jane Smith');
});
});
