import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, MatButtonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);

  bookingData = signal<any[]>([]);

  calendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: [
      {
        title: 'Team Meeting',
        start: '2025-04-10T10:00:00',
        end: '2025-04-10T11:00:00',
      },
      {
        title: 'Client Call',
        start: '2025-04-10T10:00:00',
        end: '2025-04-10T11:00:00',
      },
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay',
    },
    eventColor: '#4a90e2',
    eventTextColor: '#ffffff',
    nowIndicator: true,
    allDaySlot: false,
    expandRows: true,
    eventClick: this.handleEventClick.bind(this),
  };

  fieldId: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.fieldId = params.get('fieldId');
    });

    if (this.fieldId) {
      this.bookingService
        .getAllBookingsByFieldId(this.fieldId)
        .subscribe((bookings: any[]) => {
          this.bookingData.set(bookings);
            this.calendarOptions.events = bookings.map((booking) => ({
            id: booking.id,
            title: booking.bookingTitle,
            start: `${booking.bookingDate}T${booking.startTime}:00`,
            end: `${booking.bookingDate}T${booking.endTime}:00`,
            color: booking.bookingStatus === 'Pending' ? '#BE3D2A' : '#4a90e2',
            }));
        });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    // Prevent default browser behavior
    clickInfo.jsEvent.preventDefault();

    // Log event details to console
    console.log('Event clicked:', clickInfo.event.id);

    // Navigate to booking page with event ID
    this.router.navigate([
      'chooseClubforBooking/chooseFieldforBooking/calendar/editBooking',
      clickInfo.event.id,
    ]);
  }

  navigateToCreateBooking() {
    this.router.navigate([
      'chooseClubforBooking/chooseFieldforBooking/calendar/createBooking',
      this.fieldId,
    ]);
  }
}
