import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarFabricanteContenedoraComponent } from './agregar-fabricante-contenedora.component';
import { HttpClientModule } from '@angular/common/http';

describe('AgregarFabricanteContenedoraComponent', () => {
  let component: AgregarFabricanteContenedoraComponent;
  let fixture: ComponentFixture<AgregarFabricanteContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarFabricanteContenedoraComponent,HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarFabricanteContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
