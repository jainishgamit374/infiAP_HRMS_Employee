import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../utils/axios';
import { useAuth } from './AuthContext';

const AdminDashboardContext = createContext();

const managerNameMap = {
  rahul: 'Rahul Sharma',
  priya: 'Priya Kapur',
  amit: 'Amit Verma',
  sneha: 'Sneha Desai',
  rohan: 'Rohan Sharma',
  vikas: 'Vikas Roy'
};

const defaultDepartments = [
  {
    id: 'dept_fallback_1',
    name: 'Engineering',
    sub: 'TECH',
    head: 'Rahul Sharma',
    teams: 2,
    employees: 42,
    color: 'indigo'
  }
];

const defaultTeams = [
  {
    id: 'team_fallback_1',
    name: 'Frontend Team',
    lead: 'Sneha Desai',
    members: 12,
    type: 'Development',
    keyMembers: []
  }
];

const defaultJobs = [
  {
    id: 'job_fallback_1',
    title: 'Frontend Developer',
    department: 'Engineering',
    type: 'Full-time',
    experience: 'Mid (3-5 years)',
    location: 'Remote',
    status: 'Active',
    applicants: 0,
    postedDate: '2026-04-01'
  }
];

const normalizeDepartment = (department) => ({
  id: department.id || department._id,
  name: department.name,
  sub: department.sub || 'NEW UNIT',
  head: department.head || 'Unassigned',
  teams: Number(department.teams) || 0,
  employees: Number(department.employees) || 0,
  color: department.color || 'indigo',
  description: department.description || ''
});

const normalizeTeam = (team) => ({
  id: team.id || team._id,
  name: team.name,
  lead: team.lead || 'Unassigned',
  members: Number(team.members) || 0,
  type: team.type || 'Development',
  keyMembers: Array.isArray(team.keyMembers) ? team.keyMembers : [],
  departmentId: team.departmentId || null,
  departmentName: team.departmentName || ''
});

const normalizeJob = (job) => {
  const status = String(job.status || '').toLowerCase();

  return {
    id: job.id || job._id,
    title: job.title,
    department: job.department,
    type: job.type || 'Full-time',
    experience: job.experience || 'Mid (3-5 years)',
    location: job.location || 'Remote',
    status: status === 'open' ? 'Active' : (job.status || 'Active'),
    applicants: Number(job.applicants) || 0,
    postedDate: job.postedDate || job.createdAt || new Date().toISOString().slice(0, 10),
    deadline: job.deadline || null
  };
};

export const AdminDashboardProvider = ({ children }) => {
  const { role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    departments: defaultDepartments.length,
    teams: defaultTeams.length,
    activeStaff: 0,
    openJobs: defaultJobs.length,
    pendingLeaves: 0,
    announcements: 0
  });
  const [insights, setInsights] = useState(null);
  const [departments, setDepartments] = useState(defaultDepartments);
  const [teams, setTeams] = useState(defaultTeams);
  const [jobs, setJobs] = useState(defaultJobs);
  const [staffDirectory, setStaffDirectory] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [activities, setActivities] = useState([]);

  const isAdminView = ['admin', 'main admin'].includes(String(role || '').toLowerCase());

  const fetchSummary = async () => {
    try {
      const res = await api.get('/admin-dashboard/summary');
      setSummary(res.data?.data || summary);
      return res.data?.data;
    } catch (error) {
      const fallback = {
        departments: departments.length,
        teams: teams.length,
        activeStaff: staffDirectory.length,
        openJobs: jobs.filter((job) => job.status === 'Active').length,
        pendingLeaves: pendingLeaves.length,
        announcements: 0
      };
      setSummary(fallback);
      return fallback;
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await api.get('/admin-dashboard/insights');
      setInsights(res.data?.data || null);
      return res.data?.data;
    } catch (error) {
      setInsights(null);
      return null;
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/admin-dashboard/departments');
      const mapped = (res.data?.data || []).map(normalizeDepartment);
      setDepartments(mapped.length ? mapped : defaultDepartments);
      return mapped;
    } catch (error) {
      return departments;
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await api.get('/admin-dashboard/teams');
      const mapped = (res.data?.data || []).map(normalizeTeam);
      setTeams(mapped.length ? mapped : defaultTeams);
      return mapped;
    } catch (error) {
      return teams;
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/admin-dashboard/jobs');
      const mapped = (res.data?.data || []).map(normalizeJob);
      setJobs(mapped.length ? mapped : defaultJobs);
      return mapped;
    } catch (error) {
      return jobs;
    }
  };

  const fetchStaffDirectory = async () => {
    try {
      const res = await api.get('/admin-dashboard/staff-directory');
      const data = res.data?.data || [];
      setStaffDirectory(data);
      return data;
    } catch (error) {
      return staffDirectory;
    }
  };

  const fetchPendingLeaves = async () => {
    try {
      const res = await api.get('/admin-dashboard/leaves/pending');
      const data = res.data?.data || [];
      setPendingLeaves(data);
      return data;
    } catch (error) {
      return pendingLeaves;
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await api.get('/admin-dashboard/activities');
      const data = res.data?.data || [];
      setActivities(data);
      return data;
    } catch (error) {
      return activities;
    }
  };

  const addDepartment = async (payload) => {
    const requestPayload = {
      name: payload.name,
      description: payload.description,
      head: managerNameMap[payload.manager] || payload.manager,
      teams: Number(payload.teams) || 0,
      color: 'indigo'
    };

    try {
      const res = await api.post('/admin-dashboard/departments', requestPayload);
      const created = normalizeDepartment(res.data?.data || requestPayload);
      setDepartments((prev) => [created, ...prev]);
      await fetchSummary();
      return { success: true, data: created };
    } catch (error) {
      const fallback = normalizeDepartment({
        ...requestPayload,
        id: `dept_local_${Date.now()}`,
        sub: 'NEW UNIT',
        employees: 0
      });
      setDepartments((prev) => [fallback, ...prev]);
      return { success: false, data: fallback, error: error.response?.data?.error || 'Failed to create department' };
    }
  };

  const addTeam = async (payload) => {
    const requestPayload = {
      name: payload.name,
      department: payload.department,
      lead: managerNameMap[payload.lead] || payload.lead,
      capacity: Number(payload.capacity) || 0,
      mission: payload.mission
    };

    try {
      const res = await api.post('/admin-dashboard/teams', requestPayload);
      const created = normalizeTeam(res.data?.data || requestPayload);
      setTeams((prev) => [created, ...prev]);
      await fetchSummary();
      return { success: true, data: created };
    } catch (error) {
      const fallback = normalizeTeam({
        ...requestPayload,
        id: `team_local_${Date.now()}`,
        members: Number(payload.capacity) || 0,
        type: 'Development',
        keyMembers: []
      });
      setTeams((prev) => [fallback, ...prev]);
      return { success: false, data: fallback, error: error.response?.data?.error || 'Failed to create team' };
    }
  };

  const addJob = async (payload) => {
    const requestPayload = {
      title: payload.title,
      department: payload.department,
      type: payload.type,
      description: payload.description,
      experience: payload.experience,
      location: payload.location,
      deadline: payload.deadline,
      skills: payload.skills,
      status: 'Open'
    };

    try {
      const res = await api.post('/admin-dashboard/jobs', requestPayload);
      const created = normalizeJob(res.data?.data || requestPayload);
      setJobs((prev) => [created, ...prev]);
      await fetchSummary();
      return { success: true, data: created };
    } catch (error) {
      const fallback = normalizeJob({
        ...requestPayload,
        id: `job_local_${Date.now()}`,
        applicants: 0,
        postedDate: new Date().toISOString().slice(0, 10),
        status: 'Active'
      });
      setJobs((prev) => [fallback, ...prev]);
      return { success: false, data: fallback, error: error.response?.data?.error || 'Failed to create job' };
    }
  };

  const refreshAll = async () => {
    if (!isAdminView) {
      return;
    }

    setLoading(true);
    await Promise.all([
      fetchDepartments(),
      fetchTeams(),
      fetchJobs(),
      fetchStaffDirectory(),
      fetchPendingLeaves(),
      fetchActivities(),
      fetchInsights()
    ]);
    await fetchSummary();
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminView]);

  const totals = useMemo(() => ({
    deptCount: departments.length,
    teamCount: teams.length,
    activeCount: jobs.filter((job) => job.status === 'Active').length,
    totalApplicants: jobs.reduce((acc, current) => acc + (current.applicants || 0), 0)
  }), [departments, teams, jobs]);

  return (
    <AdminDashboardContext.Provider
      value={{
        loading,
        summary,
        insights,
        departments,
        teams,
        jobs,
        staffDirectory,
        pendingLeaves,
        activities,
        totals,
        refreshAll,
        fetchSummary,
        fetchInsights,
        fetchDepartments,
        fetchTeams,
        fetchJobs,
        fetchStaffDirectory,
        fetchPendingLeaves,
        fetchActivities,
        addDepartment,
        addTeam,
        addJob
      }}
    >
      {children}
    </AdminDashboardContext.Provider>
  );
};

export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);

  if (!context) {
    throw new Error('useAdminDashboard must be used within an AdminDashboardProvider');
  }

  return context;
};
