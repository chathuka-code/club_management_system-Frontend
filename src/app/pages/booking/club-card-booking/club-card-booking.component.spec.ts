import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubCardBookingComponent } from './club-card-booking.component';

describe('ClubCardBookingComponent', () => {
  let component: ClubCardBookingComponent;
  let fixture: ComponentFixture<ClubCardBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubCardBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubCardBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
