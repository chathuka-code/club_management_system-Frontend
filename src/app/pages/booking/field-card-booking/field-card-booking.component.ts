import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldCardComponent } from '../../../components/field-card/field-card.component';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FieldService, Field } from '../../field/field.service';

@Component({
  selector: 'app-field-card-booking',
  standalone: true,
  imports: [CommonModule, FieldCardComponent],
  templateUrl: './field-card-booking.component.html',
  styleUrl: './field-card-booking.component.css',
})
export class FieldCardBookingComponent implements OnInit {
  constructor(private router: Router) {}

  private fieldService = inject(FieldService);
  private route = inject(ActivatedRoute);

  userData: Field[] = [];
  clubId: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.clubId = params.get('clubId');
      console.log('Received clubId:', this.clubId);
    });
    if (this.clubId) {
      this.fieldService.getAllFields(this.clubId).subscribe((data) => {
        this.userData = data;
      });
    } else {
      console.error('clubId is null');
    }
  }

  onCardClick(fieldId: string) {
    this.router.navigate([
      'chooseClubforBooking/chooseFieldforBooking/calendar',
      fieldId,
    ]);
  }
}
