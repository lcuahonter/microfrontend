import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DatosBusquedaComponent } from './datos-busqueda.component';

describe('DatosBusquedaComponent', () => {
  let component: DatosBusquedaComponent;
  let fixture: ComponentFixture<DatosBusquedaComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      params: of({}),
      queryParams: of({}),
      snapshot: {
        params: {},
        queryParams: {},
        data: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [DatosBusquedaComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});