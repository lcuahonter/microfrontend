import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManifiestoBajoProtestaComponent } from './manifiesto-bajo-protesta.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManifiestoBajoProtestaComponent', () => {
  let component: ManifiestoBajoProtestaComponent;
  let fixture: ComponentFixture<ManifiestoBajoProtestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManifiestoBajoProtestaComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ManifiestoBajoProtestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
