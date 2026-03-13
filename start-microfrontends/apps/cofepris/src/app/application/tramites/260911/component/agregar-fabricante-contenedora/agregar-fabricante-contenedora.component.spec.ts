import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarFabricanteContenedoraComponent } from './agregar-fabricante-contenedora.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AgregarFabricanteContenedoraComponent', () => {
  let component: AgregarFabricanteContenedoraComponent;
  let fixture: ComponentFixture<AgregarFabricanteContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { 
            params: of({}), 
            data: of({}), 
            queryParams: of({}), 
            fragment: of(null),  
            snapshot: { 
              paramMap: { get: () => null }, 
              queryParamMap: { get: () => null },
              data: {} 
            } 
          } 
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarFabricanteContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
