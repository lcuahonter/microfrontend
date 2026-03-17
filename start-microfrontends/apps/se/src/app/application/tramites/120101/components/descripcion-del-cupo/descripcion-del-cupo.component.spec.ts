import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescripcionDelCupoComponent } from './descripcion-del-cupo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DescripcionDelCupoComponent', () => {
  let component: DescripcionDelCupoComponent;
  let fixture: ComponentFixture<DescripcionDelCupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescripcionDelCupoComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DescripcionDelCupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
