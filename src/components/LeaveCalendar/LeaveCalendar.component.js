/* eslint-disable */
import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './LeaveCalendar.css';

const localizer = momentLocalizer(moment);

function LeaveCalendar({
  leaves = [],
  onSelectEvent,
  defaultDate = new Date(),
  view = 'month',
  onViewChange,
  onNavigate,
  isTeamView = false,
}) {
  const [currentView, setCurrentView] = useState(view);
  const [currentDate, setCurrentDate] = useState(defaultDate);

  // Transform leaves data to calendar events
  const events = useMemo(() => {
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

  // Style events based on status and type
  const eventStyleGetter = (event) => {
    const { status_name, isHalfDay, halfDayStatus } = event.resource;
    
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

  // Custom event component with native tooltip
  const EventComponent = ({ event }) => {
    const { reason, user_name, leave_type, half_day_status } = event.resource || {};
    
    // Determine Full/Half indicator
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
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
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

