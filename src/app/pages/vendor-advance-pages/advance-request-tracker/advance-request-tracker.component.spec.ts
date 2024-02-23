import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceRequestTrackerComponent } from './advance-request-tracker.component';

describe('AdvanceRequestTrackerComponent', () => {
  let component: AdvanceRequestTrackerComponent;
  let fixture: ComponentFixture<AdvanceRequestTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceRequestTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceRequestTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
