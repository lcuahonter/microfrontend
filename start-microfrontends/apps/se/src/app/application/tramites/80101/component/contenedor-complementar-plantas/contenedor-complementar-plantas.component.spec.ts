import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContenedorComplementarPlantasComponent } from './contenedor-complementar-plantas.component';
import { ActivatedRoute } from '@angular/router';

describe('ContenedorComplementarPlantasComponent', () => {
  let component: ContenedorComplementarPlantasComponent;
  let fixture: ComponentFixture<ContenedorComplementarPlantasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenedorComplementarPlantasComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContenedorComplementarPlantasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
