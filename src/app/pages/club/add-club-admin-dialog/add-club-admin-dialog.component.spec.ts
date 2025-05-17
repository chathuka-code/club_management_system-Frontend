import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClubAdminDialogComponent } from './add-club-admin-dialog.component';

describe('AddClubAdminDialogComponent', () => {
  let component: AddClubAdminDialogComponent;
  let fixture: ComponentFixture<AddClubAdminDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClubAdminDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClubAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
