import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubCardTeamComponent } from './club-card-team.component';

describe('ClubCardTeamComponent', () => {
  let component: ClubCardTeamComponent;
  let fixture: ComponentFixture<ClubCardTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubCardTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubCardTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
