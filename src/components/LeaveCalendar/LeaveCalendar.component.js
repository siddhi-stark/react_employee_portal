/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react';
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
  activeTab, // 'upcoming' or 'taken' – used for status-based filtering aligned with tabs
  filterByTab = true, // when false, show all statuses together (Pattern C)
}) {
  const [currentView, setCurrentView] = useState(view);
  const [currentDate, setCurrentDate] = useState(defaultDate);

  // Keep internal calendar state in sync with parent props
  useEffect(() => {
    setCurrentView(view);
  }, [view]);

  useEffect(() => {
    setCurrentDate(defaultDate);
  }, [defaultDate]);

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
  // Filter leaves to only show those that fall within the current month
  // and respect tab-based semantics (upcoming vs taken) by status:
  // - Upcoming: Pending + Approved
  // - Taken: Approved + Declined
  const leaveEvents = useMemo(() => {
    return leaves
      .filter((leave) => {
        // 1) Apply status-based filtering according to activeTab
        if (activeTab === 'upcoming') {
          // Show pending + approved
          if (leave.status_name !== 'Pending' && leave.status_name !== 'Approved') {
            return false;
          }
        } else if (activeTab === 'taken') {
          // Show approved + declined
          if (leave.status_name !== 'Approved' && leave.status_name !== 'Declined') {
            return false;
          }
        }

        const leaveStartDate = new Date(leave.leave_from_date);
        const leaveEndDate = new Date(leave.leave_to_date);
        
        // Normalize dates to start of day for comparison
        leaveStartDate.setHours(0, 0, 0, 0);
        leaveEndDate.setHours(23, 59, 59, 999);
        
        // Only include leaves that overlap with the current month
        // A leave overlaps if: leave starts before month ends AND leave ends after month starts
        return leaveStartDate <= currentMonthEnd && leaveEndDate >= currentMonthStart;
      })
      .map((leave) => {
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

      // Display employee name as title (for both team view and individual view)
      // For individual view, user_name may not be available, so use a fallback
      const employeeName = leave.user_name || 'My Leave';
      const title = employeeName;

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
  }, [leaves, currentMonthStart, currentMonthEnd, activeTab, filterByTab]);

  // Combine leave and holiday events
  const events = useMemo(() => {
    return [...leaveEvents, ...holidayEvents];
  }, [leaveEvents, holidayEvents]);

  // Get color for leave type
  const getLeaveTypeColor = (leaveType) => {
    if (!leaveType) return { bg: '#3174ad', border: '#3174ad', text: '#fff' };
    
    const normalizedType = leaveType.toLowerCase().trim();
    
    // Map leave types to colors
    if (normalizedType.includes('sick')) {
      return { bg: '#dc3545', border: '#c82333', text: '#fff' }; // Red
    } else if (normalizedType.includes('casual')) {
      return { bg: '#007bff', border: '#0056b3', text: '#fff' }; // Blue
    } else if (normalizedType.includes('privilege') || normalizedType.includes('earned')) {
      return { bg: '#28a745', border: '#218838', text: '#fff' }; // Green
    } else if (normalizedType.includes('optional holiday')) {
      return { bg: '#ff9800', border: '#f57c00', text: '#fff' }; // Orange
    } else if (normalizedType.includes('compensatory')) {
      return { bg: '#9c27b0', border: '#7b1fa2', text: '#fff' }; // Purple
    } else if (normalizedType.includes('leave without pay') || normalizedType.includes('lwp')) {
      return { bg: '#6c757d', border: '#5a6268', text: '#fff' }; // Gray
    } else if (normalizedType.includes('maternity')) {
      return { bg: '#e91e63', border: '#c2185b', text: '#fff' }; // Pink
    } else if (normalizedType.includes('paternity')) {
      return { bg: '#00bcd4', border: '#0097a7', text: '#fff' }; // Cyan
    } else {
      // Default color for unknown leave types
      return { bg: '#3174ad', border: '#3174ad', text: '#fff' }; // Default blue
    }
  };

  // Style events based on leave type (not status)
  const eventStyleGetter = (event) => {
    const { leave_type, isHalfDay, halfDayStatus, isHoliday, holidayType, status_name } = event.resource;

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
    
    // Get colors based on leave type
    const colors = getLeaveTypeColor(leave_type);
    let backgroundColor = colors.bg;
    let borderColor = colors.border;
    let color = colors.text;
    let borderStyle = 'solid';
    let opacity = 1;
    
    // If status is declined or cancelled, make it more muted
    if (status_name === 'Declined') {
      backgroundColor = '#dc3545'; // Red for declined
      borderColor = '#c82333';
      color = '#fff';
    } else if (status_name === 'Cancelled') {
      backgroundColor = '#6c757d'; // Gray for cancelled
      borderColor = '#5a6268';
      color = '#fff';
    }
    // Pending and Approved use leave type colors
    if (status_name === 'Pending') {
      opacity = 0.75;
      borderStyle = 'dotted';
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
            padding: '2px 6px',
            fontWeight: '500',
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
            padding: '2px 6px',
            fontWeight: '500',
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
        opacity,
        borderRadius: '4px',
        borderWidth: '2px',
        padding: '2px 6px',
        fontWeight: '500',
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


  // Custom event component with native tooltip showing reason on hover
  const EventComponent = ({ event }) => {
    const { reason, user_name, leave_type, half_day_status, isHoliday, holidayType, status_name } = event.resource || {};
    
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
    
    // Build tooltip text for native browser tooltip
    // Show leave type, employee name, status, and reason on hover
    let tooltipText = '';
    
    // Add leave type
    if (leave_type) {
      tooltipText += `Leave Type: ${leave_type}`;
    }
    
    // Add employee name (if different from title, or for clarity)
    const employeeName = user_name || event.title;
    if (employeeName) {
      tooltipText += `\nEmployee: ${employeeName}`;
    }
    
    // Add status
    if (status_name) {
      tooltipText += `\nStatus: ${status_name}`;
    }
    
    // Add day type (Full/Half)
    const dayType = half_day_status ? 'Half Day' : 'Full Day';
    tooltipText += `\nDuration: ${dayType}`;
    
    // Add reason (main content)
    if (reason) {
      tooltipText += `\n\nReason: ${reason}`;
    } else {
      tooltipText += `\n\nReason: Not provided`;
    }

    // Display employee name in the badge (event.title already contains employee name)
    return (
      <div title={tooltipText} className="leave-event-tooltip leave-badge">
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

