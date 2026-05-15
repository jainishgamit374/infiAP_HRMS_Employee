import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Globe,
  User,
  Users,
  Building2,
  Plus,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  Clock,
  ChevronDown,
  Filter,
  RefreshCw,
  StickyNote,
  Pencil,
  Trash2,
} from 'lucide-react';
import api from '../../utils/axios';

const LEVEL_CONFIG = {
  global: { icon: Globe, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', label: 'Global' },
  employee: { icon: User, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Employee' },
  team: { icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Team' },
  department: { icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Department' },
};

const WFHPermissions = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('global');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [notes, setNotes] = useState('');
  const [granting, setGranting] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);

  const fetchData = async () => {
    try {
      const [permRes, empRes, teamRes, deptRes] = await Promise.all([
        api.get('/wfh/permissions'),
        api.get('/admin-dashboard/staff-directory'),
        api.get('/admin-dashboard/teams'),
        api.get('/admin-dashboard/departments'),
      ]);
      setPermissions(permRes.data?.data || []);
      setEmployees(empRes.data?.data || []);
      const teamData = teamRes.data?.data || {};
      setTeams(teamData.departments ? teamData.departments.flatMap(d => d.teams || []) : []);
      setDepartments(deptRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load WFH data:', err);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAll();
  }, []);

  const handleGrant = async () => {
    if (selectedLevel === 'employee' && !selectedEmployeeId) {
      alert('Please select an employee.');
      return;
    }
    if (selectedLevel === 'team' && !selectedTeamId) {
      alert('Please select a team.');
      return;
    }
    if (selectedLevel === 'department' && !selectedDepartmentId) {
      alert('Please select a department.');
      return;
    }

    setGranting(true);
    try {
      if (editingPermission) {
        await api.put(`/wfh/permissions/${editingPermission.id}`, {
          level: selectedLevel,
          employeeId: selectedLevel === 'employee' ? selectedEmployeeId : undefined,
          teamId: selectedLevel === 'team' ? selectedTeamId : undefined,
          departmentId: selectedLevel === 'department' ? selectedDepartmentId : undefined,
          notes: notes.trim() || undefined,
        });
      } else {
        await api.post('/wfh/permissions', {
          level: selectedLevel,
          employeeId: selectedLevel === 'employee' ? selectedEmployeeId : undefined,
          teamId: selectedLevel === 'team' ? selectedTeamId : undefined,
          departmentId: selectedLevel === 'department' ? selectedDepartmentId : undefined,
          notes: notes.trim() || undefined,
        });
      }
      setShowGrantModal(false);
      resetForm();
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save permission.');
    } finally {
      setGranting(false);
    }
  };

  const openEditModal = (p) => {
    setEditingPermission(p);
    setSelectedLevel(p.level);
    setSelectedEmployeeId(p.employee?.id || '');
    setSelectedTeamId(p.team?.id || '');
    setSelectedDepartmentId(p.department?.id || '');
    setNotes(p.notes || '');
    setShowGrantModal(true);
  };

  const handleRevoke = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this WFH permission?')) return;
    try {
      await api.patch(`/wfh/permissions/${id}/revoke`);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to revoke permission.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently DELETE this WFH permission? This action cannot be undone.')) return;
    try {
      await api.delete(`/wfh/permissions/${id}`);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete permission.');
    }
  };

  const resetForm = () => {
    setSelectedLevel('global');
    setSelectedEmployeeId('');
    setSelectedTeamId('');
    setSelectedDepartmentId('');
    setNotes('');
    setEditingPermission(null);
  };

  const filteredPermissions = useMemo(() => {
    let data = [...permissions];
    if (filter === 'active') data = data.filter((p) => p.isActive);
    if (filter === 'revoked') data = data.filter((p) => !p.isActive);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter((p) => {
        const target = getTargetLabel(p).toLowerCase();
        return target.includes(q) || p.level.includes(q);
      });
    }
    return data;
  }, [permissions, filter, searchQuery]);

  const activeCount = permissions.filter((p) => p.isActive).length;
  const revokedCount = permissions.filter((p) => !p.isActive).length;

  const getTargetLabel = (p) => {
    if (p.level === 'global') return 'All Employees';
    if (p.level === 'employee') return p.employee?.name || 'Unknown Employee';
    if (p.level === 'team') return p.team?.name || 'Unknown Team';
    if (p.level === 'department') return p.department?.name || 'Unknown Department';
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">WFH Access Control</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none">Manage work-from-home permissions by level</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 text-xs font-black uppercase tracking-widest shadow-sm"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => { resetForm(); setShowGrantModal(true); }}
            className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-2xl shadow-xl shadow-violet-100 hover:shadow-violet-200 hover:-translate-y-1 transition-all active:scale-95 text-xs font-black uppercase tracking-widest"
          >
            <Plus size={18} strokeWidth={3} />
            Grant Permission
          </button>
        </div>
      </div>

      {/* Stats */}
      <section className="px-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Permissions', value: String(permissions.length), icon: ShieldCheck, color: 'text-slate-800', bg: 'bg-white' },
            { label: 'Active', value: String(activeCount), icon: Unlock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Revoked', value: String(revokedCount), icon: Lock, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((stat, idx) => (
            <div key={idx} className={`rounded-3xl border border-slate-100 ${stat.bg} p-6 shadow-sm flex items-center justify-between`}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <stat.icon size={24} className="text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          {['all', 'active', 'revoked'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative group w-full md:w-[320px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/20 transition-all w-full shadow-soft"
          />
        </div>
      </div>

      {/* Permissions Table */}
      <section className="px-2">
        {filteredPermissions.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">No permissions found</h3>
            <p className="text-sm text-slate-400 font-medium max-w-md mx-auto">
              {searchQuery ? 'Try adjusting your search query.' : 'Grant WFH access to employees, teams, or departments to get started.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Level</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Target</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Granted By</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                    <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPermissions.map((p) => {
                    const cfg = LEVEL_CONFIG[p.level] || LEVEL_CONFIG.global;
                    const Icon = cfg.icon;
                    return (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${cfg.bg} ${cfg.border} border`}>
                            <Icon size={14} className={cfg.color} />
                            <span className={`text-xs font-black uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-800">{getTargetLabel(p)}</span>
                          {p.level === 'employee' && p.employee?.employeeId && (
                            <span className="block text-xs text-slate-400 font-medium mt-0.5">ID: {p.employee.employeeId}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {p.isActive ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-lg">
                              <CheckCircle2 size={12} className="text-emerald-500" />
                              <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Active</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-lg">
                              <AlertCircle size={12} className="text-red-500" />
                              <span className="text-xs font-black uppercase tracking-wider text-red-600">Revoked</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-600">{p.grantedBy?.name || 'Admin'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-400">{new Date(p.grantedAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-colors"
                            >
                              <Pencil size={12} />
                              Edit
                            </button>
                            {p.isActive ? (
                              <button
                                onClick={() => handleRevoke(p.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-100 transition-colors"
                              >
                                <Lock size={12} />
                                Revoke
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRevoke(p.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-100 transition-colors"
                              >
                                <Unlock size={12} />
                                Re-grant
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-400 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Grant Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">{editingPermission ? 'Edit WFH Permission' : 'Grant WFH Permission'}</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{editingPermission ? 'Update access level and target' : 'Select access level and target'}</p>
              </div>
              <button
                onClick={() => { setShowGrantModal(false); resetForm(); }}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[60vh]">
              {/* Level Selector */}
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Access Level</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {Object.entries(LEVEL_CONFIG).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  const isSelected = selectedLevel === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedLevel(key)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'bg-violet-50 border-violet-500 shadow-lg shadow-violet-100'
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <Icon size={22} className={isSelected ? 'text-violet-600' : 'text-slate-400'} />
                      <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-violet-700' : 'text-slate-500'}`}>
                        {cfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Target Selector */}
              {selectedLevel === 'employee' && (
                <div className="mb-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Select Employee</label>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-2 max-h-[200px] overflow-y-auto">
                    {employees.map((emp) => (
                      <button
                        key={emp.id}
                        onClick={() => setSelectedEmployeeId(emp.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-all ${
                          selectedEmployeeId === emp.id ? 'bg-violet-50 border border-violet-200' : 'hover:bg-white'
                        }`}
                      >
                        <div className="text-left flex-1">
                          <span className="block text-sm font-bold text-slate-800">{emp.staffName}</span>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500 font-medium">{emp.contactInfo?.email}</span>
                            {emp.staffDepartment && (
                              <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-md text-slate-500 font-bold uppercase tracking-wider">{emp.staffDepartment}</span>
                            )}
                            {emp.staffJobRole && (
                              <span className="text-[10px] px-2 py-0.5 bg-violet-50 rounded-md text-violet-600 font-bold uppercase tracking-wider">{emp.staffJobRole}</span>
                            )}
                          </div>
                          {emp.employeeId && (
                            <span className="text-[10px] text-slate-400 font-medium mt-1 block">ID: {emp.employeeId}</span>
                          )}
                        </div>
                        {selectedEmployeeId === emp.id && <CheckCircle2 size={18} className="text-violet-500 ml-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedLevel === 'team' && (
                <div className="mb-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Select Team</label>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-2 max-h-[200px] overflow-y-auto">
                    {teams.map((t) => (
                      <button
                        key={t._id}
                        onClick={() => setSelectedTeamId(t._id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-all ${
                          selectedTeamId === t._id ? 'bg-violet-50 border border-violet-200' : 'hover:bg-white'
                        }`}
                      >
                        <span className="text-sm font-bold text-slate-800">{t.name}</span>
                        {selectedTeamId === t._id && <CheckCircle2 size={18} className="text-violet-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedLevel === 'department' && (
                <div className="mb-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Select Department</label>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-2 max-h-[200px] overflow-y-auto">
                    {departments.map((d) => (
                      <button
                        key={d._id}
                        onClick={() => setSelectedDepartmentId(d._id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-all ${
                          selectedDepartmentId === d._id ? 'bg-violet-50 border border-violet-200' : 'hover:bg-white'
                        }`}
                      >
                        <span className="text-sm font-bold text-slate-800">{d.name}</span>
                        {selectedDepartmentId === d._id && <CheckCircle2 size={18} className="text-violet-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add a note about this permission..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/20 transition-all resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => { setShowGrantModal(false); resetForm(); }}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGrant}
                disabled={granting}
                className="px-8 py-3 bg-violet-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {granting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShieldCheck size={16} />
                )}
                {editingPermission ? 'Save Changes' : 'Grant Permission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WFHPermissions;
