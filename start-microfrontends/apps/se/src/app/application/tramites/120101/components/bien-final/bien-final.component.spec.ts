import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BienFinalComponent } from './bien-final.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BienFinalComponent', () => {
  let component: BienFinalComponent;
  let fixture: ComponentFixture<BienFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BienFinalComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BienFinalComponent);
    component = fixture.componentInstance;

    component.consultaState = {
      readonly: false,
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
