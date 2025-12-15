/* eslint-disable */
import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './LeaveCalendar.css';

const localizer = momentLocalizer(moment);

function LeaveCalendar({
  leaves = [],
  holidays = [],
  onSelectEvent,
  defaultDate = new Date(),
  view = 'month',
  onViewChange,
  onNavigate,
  isTeamView = false,
}) {
  const [currentView, setCurrentView] = useState(view);
  const [currentDate, setCurrentDate] = useState(defaultDate);

  // Get current month boundaries for filtering holidays
  const currentMonthStart = useMemo(() => {
    return moment(currentDate).startOf('month').toDate();
  }, [currentDate]);

  const currentMonthEnd = useMemo(() => {
    return moment(currentDate).endOf('month').toDate();
  }, [currentDate]);

  // Transform holidays data to calendar events
  const holidayEvents = useMemo(() => {
    return holidays
      .filter((holiday) => {
        const holidayDate = new Date(holiday.date);
        // Only include holidays in the current month view
        return holidayDate >= currentMonthStart && holidayDate <= currentMonthEnd;
      })
      .map((holiday) => {
        const holidayDate = new Date(holiday.date);
        holidayDate.setHours(0, 0, 0, 0);
        const endDate = new Date(holidayDate);
        endDate.setHours(23, 59, 59, 999);

        return {
          id: `holiday-${holiday.id}`,
          title: holiday.occasion || 'Holiday',
          start: holidayDate,
          end: endDate,
          resource: {
            ...holiday,
            isHoliday: true,
            holidayType: holiday.holiday_type,
          },
          className: `holiday-event holiday-type-${holiday.holiday_type}`,
        };
      });
  }, [holidays, currentMonthStart, currentMonthEnd]);

  // Transform leaves data to calendar events
  const leaveEvents = useMemo(() => {
    return leaves.map((leave) => {
      const startDate = new Date(leave.leave_from_date);
      const endDate = new Date(leave.leave_to_date);
      
      // For half-day leaves, adjust end time
      if (leave.half_day_status) {
        if (leave.half_day_status === 1) {
          // First half - end at noon
          endDate.setHours(12, 0, 0, 0);
        } else {
          // Second half - start at noon, end at end of day
          startDate.setHours(12, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
        }
      } else {
        // Full day leaves - end at end of day
        if (leave.leave_from_date === leave.leave_to_date) {
          endDate.setHours(23, 59, 59, 999);
        } else {
          endDate.setHours(23, 59, 59, 999);
        }
      }

      // Determine event title based on view
      let title = '';
      if (isTeamView) {
        title = `${leave.user_name || ''} - ${leave.leave_type || ''}`.trim();
      } else {
        title = `${leave.leave_type || 'Leave'}`;
      }

      return {
        id: leave.id,
        title: title,
        start: startDate,
        end: endDate,
        resource: {
          ...leave,
          isHalfDay: !!leave.half_day_status,
          halfDayStatus: leave.half_day_status,
        },
        className: leave.half_day_status 
          ? (leave.half_day_status === 1 ? 'half-day-first' : 'half-day-second')
          : '',
      };
    });
  }, [leaves, isTeamView]);

  // Combine leave and holiday events
  const events = useMemo(() => {
    return [...leaveEvents, ...holidayEvents];
  }, [leaveEvents, holidayEvents]);

  // Style events based on status and type
  const eventStyleGetter = (event) => {
    const { status_name, isHalfDay, halfDayStatus, isHoliday, holidayType } = event.resource;

    // Handle holiday events
    if (isHoliday) {
      if (holidayType === 1) {
        // Mandatory holiday - bright red
        return {
          style: {
            backgroundColor: '#ff9999',
            borderColor: '#ff9999',
            color: '#8b0000',
            borderStyle: 'solid',
            borderRadius: '4px',
            borderWidth: '2px',
            fontWeight: '600',
          },
        };
      } else if (holidayType === 2) {
        // Optional holiday - bright orange
        return {
          style: {
            backgroundColor: '#ffcc99',
            borderColor: '#ffcc99',
            color: '#cc6600',
            borderStyle: 'solid',
            borderRadius: '4px',
            borderWidth: '2px',
            fontWeight: '600',
          },
        };
      }
    }
    
    let backgroundColor = '#3174ad'; // Default blue
    let borderColor = '#3174ad';
    let color = '#fff';
    let borderStyle = 'solid';
    let height = '100%';

    // Color coding based on status
    if (status_name === 'Pending') {
      backgroundColor = '#ffc107'; // Yellow/Orange
      borderColor = '#ff9800';
      color = '#000';
    } else if (status_name === 'Approved') {
      backgroundColor = '#28a745'; // Green
      borderColor = '#218838';
    } else if (status_name === 'Declined') {
      backgroundColor = '#dc3545'; // Red
      borderColor = '#c82333';
    } else if (status_name === 'Cancelled') {
      backgroundColor = '#6c757d'; // Gray
      borderColor = '#5a6268';
    }

    // Half-day indicator styling
    if (isHalfDay) {
      borderStyle = 'dashed';
      // Position based on half day type
      if (halfDayStatus === 1) {
        // First half - align to top
        return {
          style: {
            backgroundColor,
            borderColor,
            color,
            borderStyle,
            borderRadius: '4px',
            borderWidth: '2px',
          },
        };
      } else {
        // Second half - align to bottom
        return {
          style: {
            backgroundColor,
            borderColor,
            color,
            borderStyle,
            borderRadius: '4px',
            borderWidth: '2px',
          },
        };
      }
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color,
        borderStyle,
        borderRadius: '4px',
        borderWidth: '2px',
      },
    };
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (onViewChange) {
      onViewChange(view);
    }
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
    if (onNavigate) {
      onNavigate(date);
    }
  };

  // Style day cells for holidays and weekends
  const dayPropGetter = (date) => {
    const dateStr = moment(date).format('YYYY-MM-DD');
    const holiday = holidays.find((h) => {
      const holidayDateStr = moment(h.date).format('YYYY-MM-DD');
      return holidayDateStr === dateStr;
    });

    // Only apply styling to dates in the current month view
    const isCurrentMonth = moment(date).isSame(currentDate, 'month');

    // Check if it's a weekend (Saturday = 6, Sunday = 0)
    const dayOfWeek = moment(date).day();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Holidays take precedence over weekend styling
    if (holiday && isCurrentMonth) {
      if (holiday.holiday_type === 1) {
        // Mandatory holiday - bright red background
        return {
          className: 'holiday-day mandatory-holiday',
          style: {
            backgroundColor: '#ff9999',
          },
        };
      } else if (holiday.holiday_type === 2) {
        // Optional holiday - bright orange background
        return {
          className: 'holiday-day optional-holiday',
          style: {
            backgroundColor: '#ffcc99',
          },
        };
      }
    }

    // Apply weekend styling if it's a weekend and in current month
    if (isWeekend && isCurrentMonth) {
      return {
        className: 'weekend-day',
        style: {
          backgroundColor: '#F5F1F0',
        },
      };
    }

    return {};
  };


  // Custom event component with native tooltip
  const EventComponent = ({ event }) => {
    const { reason, user_name, leave_type, half_day_status, isHoliday, holidayType } = event.resource || {};
    
    // Handle holiday events differently
    if (isHoliday) {
      const holidayTypeName = holidayType === 1 ? 'Mandatory Holiday' : 'Optional Holiday';
      const tooltipText = `${event.title}\nType: ${holidayTypeName}`;
      
      return (
        <div title={tooltipText} className="leave-event-tooltip holiday-event-readonly">
          {event.title}
        </div>
      );
    }
    
    // Determine Full/Half indicator for leave events
    const dayType = half_day_status ? '(Half' : '(Full';
    
    // Build tooltip text for native browser tooltip
    let tooltipText = '';
    if (isTeamView && user_name) {
      tooltipText = `${user_name} - ${leave_type || 'Leave'} ${dayType} Day)`;
    } else {
      tooltipText = `${leave_type || 'Leave'} ${dayType} Day)`;
    }

    
    if (reason) {
      tooltipText += `\nReason: ${reason}`;
    } else {
      tooltipText += '\nReason: Not provided';
    }

    return (
      <div title={tooltipText} className="leave-event-tooltip">
        {event.title}
      </div>
    );
  };

  // Handle event selection - prevent holiday events from being clickable
  const handleSelectEvent = (event) => {
    // Check if the event is a holiday
    if (event.resource && event.resource.isHoliday) {
      // Do nothing for holiday events - they are read-only
      return;
    }
    
    // For non-holiday events, call the original handler
    if (onSelectEvent) {
      onSelectEvent(event);
    }
  };

  return (
    <div className="leave-calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        defaultDate={currentDate}
        defaultView={currentView}
        view={currentView}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        components={{
          event: EventComponent,
        }}
        views={['month', 'week']}
        popup
        showMultiDayTimes
        step={60}
        showAllEvents
      />
    </div>
  );
}

export default LeaveCalendar;

