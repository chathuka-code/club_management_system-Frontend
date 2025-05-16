import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClubAdminsComponent } from './manage-club-admins.component';

describe('ManageClubAdminsComponent', () => {
  let component: ManageClubAdminsComponent;
  let fixture: ComponentFixture<ManageClubAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageClubAdminsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClubAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
