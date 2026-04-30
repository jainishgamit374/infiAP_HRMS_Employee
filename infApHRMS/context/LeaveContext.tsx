import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { applyEmployeeLeave, fetchEmployeeLeaves, type EmployeeLeaveApiRecord } from '../services/auth';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'DRAFT';

export interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  days: number;
  status: LeaveStatus;
  appliedDate: string;
  rejectionReason?: string;
  employeeName?: string;
  approverName?: string;
}

interface LeaveContextType {
  leaves: LeaveRequest[];
  balances: {
    privilege: number;
    casual: number;
    sick: number;
  };
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate' | 'days'>, status?: LeaveStatus) => Promise<void>;
  updateLeave: (id: string, leave: Partial<Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>>) => void;
  cancelLeave: (id: string) => void;
  mockReviewLeave: (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const LeaveProvider = ({ children }: { children: ReactNode }) => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  const [balances, setBalances] = useState({
    privilege: 12,
    casual: 5,
    sick: 8,
  });

  const mapApiStatus = (value?: string): LeaveStatus => {
    const normalized = (value || '').toLowerCase();
    if (normalized.includes('await') || normalized.includes('pending')) return 'PENDING';
    if (normalized.includes('approve')) return 'APPROVED';
    if (normalized.includes('reject')) return 'REJECTED';
    if (normalized.includes('cancel')) return 'CANCELLED';
    return 'PENDING';
  };

  const mapApiLeave = (item: EmployeeLeaveApiRecord): LeaveRequest => {
    const start = new Date(item.StartDate);
    const end = new Date(item.EndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return {
      id: String(item.LeaveApplicationMasterID),
      type: item.LeaveType,
      startDate: new Date(item.StartDate).toISOString().split('T')[0],
      endDate: new Date(item.EndDate).toISOString().split('T')[0],
      reason: item.Reason,
      days,
      status: mapApiStatus(item.ApprovalStatus),
      appliedDate: item.CreatedDate
        ? new Date(item.CreatedDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      employeeName: 'You',
      approverName: item.ApprovalUsername || 'Reporting Manager',
    };
  };

  const refreshLeaves = async () => {
    try {
      const response = await fetchEmployeeLeaves();
      const records = Array.isArray(response.data)
        ? response.data
        : response.data
          ? [response.data]
          : [];
      const seenIds = new Set<string>();
      const seenDuplicateKeys = new Set<string>();
      const uniqueLeaves = records.map(mapApiLeave).filter((leave) => {
        const duplicateKey = [
          leave.type,
          leave.startDate,
          leave.endDate,
          leave.reason,
          leave.status,
        ].join('|');

        if (seenIds.has(leave.id) || seenDuplicateKeys.has(duplicateKey)) {
          return false;
        }

        seenIds.add(leave.id);
        seenDuplicateKeys.add(duplicateKey);
        return true;
      });

      setLeaves(uniqueLeaves);
    } catch {
      setLeaves([]);
    }
  };

  useEffect(() => {
    refreshLeaves();
  }, []);

  const applyLeave = async (leave: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate' | 'days'>, status: LeaveStatus = 'PENDING') => {
    // Calculate days (simple difference for mock)
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (status !== 'DRAFT') {
      await applyEmployeeLeave({
        LeaveType: leave.type,
        Reason: leave.reason,
        StartDate: leave.startDate,
        EndDate: leave.endDate,
        IsHalfDay: false,
        IsFirstHalf: false,
      });
      await refreshLeaves();
      return;
    }

    const newLeave: LeaveRequest = {
      ...leave,
      id: Math.random().toString(36).slice(2, 11),
      employeeName: 'You',
      status,
      appliedDate: new Date().toISOString().split('T')[0],
      days: diffDays || 0,
      approverName: 'Reporting Manager',
    };

    setLeaves((prev) => [newLeave, ...prev]);
  };

  const updateLeave = (id: string, updatedFields: Partial<Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>>) => {
    setLeaves((prev) => 
      prev.map((l) => {
        if (l.id === id) {
          let newDays = l.days;
          if (updatedFields.startDate || updatedFields.endDate) {
            const start = new Date(updatedFields.startDate || l.startDate);
            const end = new Date(updatedFields.endDate || l.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            newDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          }
          return { ...l, ...updatedFields, days: newDays };
        }
        return l;
      })
    );
  };

  const cancelLeave = (id: string) => {
    setLeaves((prev) => 
      prev.map((l) => l.id === id ? { ...l, status: 'CANCELLED' } : l)
    );
  };

  const mockReviewLeave = (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
    setLeaves((prev) => 
      prev.map((l) => {
        if (l.id === id) {
          // If approved, deduct from balance (mock logic)
          if (status === 'APPROVED') {
             const typeKey = l.type.toLowerCase().split(' ')[0] as keyof typeof balances;
             if (balances[typeKey] !== undefined) {
               setBalances(prevBal => ({
                 ...prevBal,
                 [typeKey]: Math.max(0, prevBal[typeKey] - l.days)
               }));
             }
          }
          return { ...l, status, ...(status === 'REJECTED' && reason ? { rejectionReason: reason } : {}) };
        }
        return l;
      })
    );
  };

  return (
    <LeaveContext.Provider value={{ leaves, balances, applyLeave, updateLeave, cancelLeave, mockReviewLeave }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};
