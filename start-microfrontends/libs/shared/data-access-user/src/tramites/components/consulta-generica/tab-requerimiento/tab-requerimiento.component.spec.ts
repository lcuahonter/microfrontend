import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TabRequerimientoComponent } from "./tab-requerimiento.component";


describe('TabRequerimientoComponent', () => {
  let component: TabRequerimientoComponent;
  let fixture: ComponentFixture<TabRequerimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabRequerimientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});