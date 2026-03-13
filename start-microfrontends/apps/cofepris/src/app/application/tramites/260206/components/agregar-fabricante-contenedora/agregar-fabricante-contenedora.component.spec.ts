import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarFabricanteContenedoraComponent } from './agregar-fabricante-contenedora.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgregarFabricanteContenedoraComponent', () => {
  let component: AgregarFabricanteContenedoraComponent;
  let fixture: ComponentFixture<AgregarFabricanteContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarFabricanteContenedoraComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarFabricanteContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
