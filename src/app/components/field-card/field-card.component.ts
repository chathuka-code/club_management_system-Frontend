import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-field-card',
  standalone: true,
  imports: [],
  templateUrl: './field-card.component.html',
  styleUrl: './field-card.component.css',
})
export class FieldCardComponent {
  @Input() field!: {
    fieldName: string;
    address: string;
    facilitiesInfo: string;
    description: string;
    deckType: string;
    hasLighting: boolean;
    hasHeating: boolean;
    clubId: string;
    isDeleted: boolean;
  };

  @Output() cardClick = new EventEmitter<void>();

  onClick() {
    this.cardClick.emit();
  }
}
