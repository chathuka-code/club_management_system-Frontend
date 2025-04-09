import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldCardBookingComponent } from './field-card-booking.component';

describe('FieldCardBookingComponent', () => {
  let component: FieldCardBookingComponent;
  let fixture: ComponentFixture<FieldCardBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldCardBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldCardBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
