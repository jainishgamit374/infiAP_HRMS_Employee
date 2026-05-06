import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getEmployees, createEmployee as apiCreateEmployee, updateEmployee as apiUpdateEmployee, getEmployeeProfile as apiGetEmployeeProfile } from '../services/hrApi';
import { useAuth } from './AuthContext';

const EmployeeContext = createContext();

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployeeContext must be used within an EmployeeProvider');
  }
  return context;
};

export const EmployeeProvider = ({ children }) => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1,
  });

  // ── Fetch employees from API ───────────────────────────────────────────
  const fetchEmployees = useCallback(async (params = {}) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await getEmployees({
        page: params.page || 1,
        limit: params.limit || 50,
        ...(params.status && { status: params.status }),
        ...(params.department && { department: params.department }),
      });
      
      const data = res.data;
      const employeeList = (data?.data || []).map(emp => ({
        id: emp._id || emp.id,
        _id: emp._id,
        employeeId: emp.employeeId || emp._id,
        name: emp.name || 'Unknown',
        email: emp.email || '',
        phone: emp.phone || '',
        role: emp.role || emp.designation || 'Employee',
        department: emp.department || 'General',
        manager: emp.manager || '',
        status: emp.status || 'Active',
        joiningDate: emp.joiningDate || '',
        salary: emp.salary || 0,
        avatar: emp.avatar || `https://i.pravatar.cc/150?u=${(emp.name || 'user').split(' ')[0].toLowerCase()}`,
      }));

      setEmployees(employeeList);
      setPagination({
        page: data.page || 1,
        limit: data.limit || 50,
        total: data.total || employeeList.length,
        pages: data.pages || 1,
      });

      return employeeList;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to fetch employees';
      setError(message);
      console.error('Fetch employees error:', message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Auto-fetch when token is available
  useEffect(() => {
    if (token) {
      fetchEmployees();
    }
  }, [token, fetchEmployees]);

  // ── Add employee via API ───────────────────────────────────────────────
  const addEmployee = async (newEmployeeData) => {
    setError(null);
    try {
      const res = await apiCreateEmployee({
        employeeId: newEmployeeData.employeeId,
        name: newEmployeeData.name,
        email: newEmployeeData.email,
        phone: newEmployeeData.phone,
        department: newEmployeeData.department,
        designation: newEmployeeData.role,
        reportingManager: newEmployeeData.manager,
        joiningDate: newEmployeeData.joiningDate,
        annualSalary: newEmployeeData.salary,
        status: newEmployeeData.status || 'Active',
      });

      const created = res.data?.data;
      if (created) {
        // Add to local state without refetching
        const normalizedEmployee = {
          id: created._id || created.id,
          _id: created._id,
          employeeId: created.employeeId || created._id,
          name: created.name,
          email: created.email,
          phone: created.phone,
          role: created.role || created.designation,
          department: created.department,
          manager: created.manager,
          status: created.status || 'Active',
          joiningDate: created.joiningDate,
          salary: created.salary,
          avatar: newEmployeeData.avatar || `https://i.pravatar.cc/150?u=${created.name?.split(' ')[0]?.toLowerCase()}`,
        };
        setEmployees(prev => [normalizedEmployee, ...prev]);
        return { success: true, data: normalizedEmployee };
      }
      return { success: true, data: created };
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to add employee';
      setError(message);
      return { success: false, error: message };
    }
  };

  // ── Update employee via API ────────────────────────────────────────────
  const updateEmployee = async (id, updatedData) => {
    setError(null);
    try {
      const res = await apiUpdateEmployee(id, {
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        department: updatedData.department,
        designation: updatedData.role,
        reportingManager: updatedData.manager,
        joiningDate: updatedData.joiningDate,
        annualSalary: updatedData.salary,
        status: updatedData.status,
      });

      const updated = res.data?.data;
      if (updated) {
        setEmployees(prev =>
          prev.map(emp =>
            (emp._id === id || emp.id === id)
              ? {
                  ...emp,
                  ...updatedData,
                  id: updated._id || updated.id,
                  _id: updated._id,
                }
              : emp
          )
        );
        return { success: true, data: updated };
      }
      return { success: true, data: updated };
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to update employee';
      setError(message);
      return { success: false, error: message };
    }
  };

  // ── Get single employee profile ────────────────────────────────────────
  const getProfile = async (id) => {
    try {
      const res = await apiGetEmployeeProfile(id);
      return res.data?.data || null;
    } catch (err) {
      console.error('Get profile error:', err);
      return null;
    }
  };

  // ── Remove from local state (soft delete) ──────────────────────────────
  const removeEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id && emp._id !== id));
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        error,
        pagination,
        fetchEmployees,
        addEmployee,
        updateEmployee,
        removeEmployee,
        getProfile,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
