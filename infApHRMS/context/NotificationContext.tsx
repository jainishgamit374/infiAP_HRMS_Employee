import React, { createContext, useContext, useState, useMemo } from 'react';

export type NotificationType = 'leave' | 'attendance' | 'payroll' | 'performance' | 'system';

export interface NotificationAttachment {
  name: string;
  size: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  description: string;
  time: string;
  timestamp: string;
  isRead: boolean;
  sender: string;
  division: string;
  isOnline: boolean;
  highlights?: string[];
  attachment?: NotificationAttachment;
  route?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getNotificationById: (id: string) => Notification | undefined;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'leave',
    title: 'Leave Approved',
    message: 'Your privilege leave for Mar 25 - Mar 26 has been approved by HR.',
    description: 'We are pleased to inform you that your privilege leave application for the dates Mar 25 to Mar 26 has been reviewed and approved by the Human Resources department. Please ensure all your pending tasks are handed over to your team lead before you head out.',
    time: '2 hours ago',
    timestamp: 'Oct 24, 2023 • 02:30 PM',
    isRead: false,
    sender: 'HR Department',
    division: 'Leaves & Attendance',
    isOnline: true,
    highlights: [
      'Approved for Mar 25 - Mar 26',
      'Handover required',
      'Paid Leave (Privilege)',
    ],
    route: '/(employee)/leave',
  },
  {
    id: '2',
    type: 'attendance',
    title: 'Missing Punch Alert',
    message: 'You missed your check-out punch on Mar 19. Please apply for a punch regularization.',
    description: 'Our attendance system detected that you did not record a check-out punch for the work day of March 19, 2026. This might lead to an "Absent" or "Half-Day" status if not corrected. Please use the Attendance Logging screen to apply for a punch regularization immediately.',
    time: '5 hours ago',
    timestamp: 'Oct 24, 2023 • 11:15 AM',
    isRead: false,
    sender: 'Attendance Team',
    division: 'Operations Division',
    isOnline: true,
    highlights: [
      'Date: March 19, 2026',
      'Action: Regularization Required',
      'Deadline: End of the week',
    ],
    route: '/(employee)/attendance',
  },
  {
    id: '3',
    type: 'payroll',
    title: 'Salary Slip Generated',
    message: 'Your salary slip for February 2026 is now available for download.',
    description: 'Your salary slip for the month of February 2026 has been generated and is now ready for your review. You can view the breakdown of your earnings, deductions, and tax withholdings directly in the Payroll section of the app.',
    time: '1 day ago',
    timestamp: 'Oct 23, 2023 • 09:00 AM',
    isRead: true,
    sender: 'Finance Dept',
    division: 'Payroll Management',
    isOnline: false,
    attachment: {
      name: 'Salary_Slip_Feb_2026.pdf',
      size: '1.2 MB',
    },
    route: '/(employee)/payroll',
  },
  {
    id: '4',
    type: 'system',
    title: 'System Maintenance',
    message: 'The HRMS portal will be down for scheduled maintenance on Sunday.',
    description: 'Please be advised that the InfiAP HRMS portal will be undergoing scheduled system maintenance this coming Sunday, March 22, from 2:00 AM to 4:00 AM EST. During this window, all services including attendance logging and leave applications will be unavailable.',
    time: '2 days ago',
    timestamp: 'Oct 22, 2023 • 04:30 PM',
    isRead: true,
    sender: 'IT Platform',
    division: 'System Administration',
    isOnline: true,
    highlights: [
      'Window: 2:00 AM - 4:00 AM EST',
      'Date: Sunday, March 22',
      'Impact: All services offline',
    ],
  },
  {
    id: '5',
    type: 'performance',
    title: 'Quarterly Review',
    message: 'Your Q1 performance review meeting is scheduled for Monday, Mar 23.',
    description: 'It is time for your Q1 performance review. A meeting has been scheduled with your manager to discuss your achievements, goals for the next quarter, and professional development path. Please come prepared with your self-assessment report.',
    time: '3 days ago',
    timestamp: 'Oct 21, 2023 • 10:00 AM',
    isRead: false,
    sender: 'Performance Team',
    division: 'Talent Management',
    isOnline: true,
    highlights: [
      'Date: Monday, March 23',
      'Time: 11:00 AM',
      'Venue: Meeting Room B / Virtual',
    ],
    route: '/(employee)/performance',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  React.useEffect(() => {
    const api = require('../constants/api').ADMIN_API_URL;
    fetch(`${api}/notifications`).then(r => r.json()).then((json) => {
      if (json && json.status === 'Success' && Array.isArray(json.data)) {
        const mapped = json.data.map((n: any, i: number) => ({
          id: n.id || n._id || String(i + 1000),
          type: (n.category === 'announcement' ? 'system' : 'system') as NotificationType,
          title: n.headline || n.title || 'Notification',
          message: (n.details || '').slice(0, 120),
          description: n.details || '',
          time: n.scheduleAt ? new Date(n.scheduleAt).toLocaleString() : 'just now',
          timestamp: n.createdAt || new Date().toString(),
          isRead: false,
          sender: n.sentBy || 'System',
          division: 'General',
          isOnline: true,
        }));

        if (mapped.length) setNotifications(mapped as Notification[]);
      }
    }).catch(() => {
      // keep mocks on error
    });
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationById = (id: string) => {
    return notifications.find((n) => n.id === id);
  };

  const value = useMemo(
    () => ({
      notifications,
      markAsRead,
      markAllAsRead,
      getNotificationById,
    }),
    [notifications]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
