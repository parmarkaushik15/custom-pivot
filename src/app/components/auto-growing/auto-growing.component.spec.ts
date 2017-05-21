import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoGrowingComponent } from './auto-growing.component';

describe('AutoGrowingComponent', () => {
  let component: AutoGrowingComponent;
  let fixture: ComponentFixture<AutoGrowingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoGrowingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoGrowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
