import React, { useState, useEffect } from 'react';
import { usePolicyContext } from '../../../context/PolicyContext';
import { 
  ShieldCheck, 
  Lock, 
  Search, 
  Plus, 
  FileText, 
  MoreVertical, 
  Upload, 
  Download, 
  AlertTriangle, 
  User, 
  Clock, 
  Users, 
  ChevronLeft, 
  X,
  PlusCircle,
  Settings,
  Edit3
} from 'lucide-react';

const SecurityDocuments = () => {
  const { policies, fetchPolicies, addPolicy } = usePolicyContext();
  const [view, setView] = useState('hub'); // 'hub', 'upload', 'bulk', 'details'
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showAlert, setShowAlert] = useState(true);

  // New Document State
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'General',
    description: '',
    status: 'Confidential',
    department: 'Engineering'
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const stats = [
    { label: 'Total Documents', value: policies?.length > 0 ? policies.length : '45', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Confidential', value: policies?.filter(p => p.status === 'Confidential').length || '12', icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Compliance', value: policies?.filter(p => p.status === 'Compliance').length || '8', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Recently Updated', value: '5', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const getTagColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'confidential': return 'text-amber-600 bg-amber-50';
      case 'compliance': return 'text-emerald-600 bg-emerald-50';
      case 'public': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  const mockDocs = [
    { id: 1, title: 'Employee NDA Agreement', author: 'Sarah Jenkins', dept: 'Legal', date: '2h ago', tag: 'CONFIDENTIAL', tagColor: 'text-amber-600 bg-amber-50' },
    { id: 2, title: 'Security Audit 2024', author: 'Mike Ross', dept: 'IT Ops', date: 'Oct 12, 2023', tag: 'COMPLIANCE', tagColor: 'text-emerald-600 bg-emerald-50' },
    { id: 3, title: 'Infrastructure Diagram', author: 'David Chen', dept: 'Dev', date: 'Oct 10, 2023', tag: 'CONFIDENTIAL', tagColor: 'text-amber-600 bg-amber-50' },
    { id: 4, title: 'Vendor Security Policy', author: 'Sarah Jenkins', dept: 'Legal', date: 'Oct 05, 2023', tag: 'INTERNAL', tagColor: 'text-slate-500 bg-slate-50' },
  ];

  const recentDocs = policies?.length > 0 ? policies.map(p => ({
     id: p._id,
     title: p.title,
     author: p.author || 'Admin User',
     dept: p.department,
     date: new Date(p.createdAt).toLocaleDateString(),
     tag: p.status?.toUpperCase() || 'INTERNAL',
     tagColor: getTagColor(p.status)
  })) : mockDocs;

  const queue = [
    { name: 'employment_contract_john.pdf', size: '2.4 MB', status: 'Syncing...', progress: 65, type: 'pdf' },
    { name: 'passport_copy_scan.jpg', size: '1.2 MB', status: 'Ready to Process', progress: 100, type: 'image' },
    { name: 'background_clearance_2023.pdf', size: '4.8 MB', status: 'Waiting...', progress: 0, type: 'pdf' },
    { name: 'unsupported_format.exe', size: '0.5 MB', status: 'Invalid Format', progress: 0, type: 'error' },
  ];

  const activityLog = [
    { title: 'Document Version Updated', detail: 'Sarah Jenkins updated protocol guidelines to v2.4.0', time: '2h ago' },
    { title: 'File Accessed', detail: 'Michael Chen (HR) viewed the document', time: '5h ago' },
    { title: 'Initial Upload', detail: 'System created base security document', time: 'Oct 12' },
  ];

  const handleUploadSubmit = async () => {
     await addPolicy({
         title: newDoc.title || 'Untitled Document',
         author: 'Master Admin',
         department: newDoc.department,
         status: newDoc.status,
         category: newDoc.category,
         description: newDoc.description
     });
     setView('hub');
     fetchPolicies();
  };

  const handleBulkUpload = async () => {
    const validFiles = queue.filter(f => f.type !== 'error');
    if(validFiles.length === 0) return;

    for (let file of validFiles) {
       await addPolicy({
         title: file.name,
         author: 'Batch Processor',
         department: 'System Default',
         status: 'Confidential',
         category: 'Bulk Ingestion (Automated)',
         description: `Ingested document artifact. Registered file size: ${file.size}. Checksum verified.`
       });
    }
    setView('hub');
    fetchPolicies();
  };

  // --- SUB-VIEWS ---

  const HubView = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
        <div>
           <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 underline decoration-indigo-300 underline-offset-4 uppercase">Security Documents</h1>
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">Manage and secure sensitive company protocol nodes</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search documents..."
                className="bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all w-[300px] shadow-soft"
              />
           </div>
           <button onClick={() => setView('bulk')} className="p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all rounded-2xl hover:bg-white shadow-soft font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
              <Upload size={18} /> Bulk Upload
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
         {stats.map((stat, idx) => (
           <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-soft group hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-8">
                 <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                    <stat.icon className={stat.color} size={28} />
                 </div>
              </div>
              <div>
                 <h3 className="text-4xl font-black text-slate-800 tracking-tighter mb-1">{stat.value}</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">{stat.label}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="px-2">
         <div className="flex items-center justify-between mb-8 px-4">
            <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400">Recent Documents</h2>
            <button 
              onClick={() => alert('Accessing Institutional Vault: Redirecting to complete document ledger...')}
              className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
            >
              View All
            </button>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {recentDocs.map((doc) => (
              <div 
                key={doc.id}
                onClick={() => { setSelectedDoc(doc); setView('details'); }}
                className="p-8 bg-white rounded-[48px] border border-slate-50 shadow-soft group hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
              >
                 <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-indigo-500 transition-all">
                          <FileText size={24} />
                       </div>
                       <div>
                          <h3 className="text-[15px] font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors mb-1">{doc.title}</h3>
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.1em]">
                             <User size={12} /> {doc.author} • {doc.dept}
                          </div>
                       </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${doc.tagColor}`}>
                       {doc.tag}
                    </div>
                 </div>
                 <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.2em]">Updated {doc.date}</p>
                    <button className="p-2 text-slate-200 hover:text-slate-400"><MoreVertical size={16} /></button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => setView('upload')}
        className="fixed bottom-12 right-12 w-20 h-20 bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-[32px] shadow-2xl flex items-center justify-center hover:bg-slate-700 hover:scale-110 active:scale-95 transition-all group z-30"
      >
         <Plus size={36} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
      </button>
    </div>
  );

  const BulkUploadView = () => (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-12 duration-700 pb-20">
       <button onClick={() => setView('hub')} className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-all">
          <ChevronLeft size={16} /> Back to Hub
       </button>
       
       <div className="flex items-center gap-8 px-2">
          <div className="w-20 h-20 bg-slate-900 text-white rounded-[32px] flex items-center justify-center shadow-2xl">
             <PlusCircle size={32} />
          </div>
          <div>
             <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 underline decoration-indigo-300 underline-offset-4 uppercase">Bulk Upload Nodes</h1>
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">Multi-document batch processing intelligence</p>
          </div>
       </div>

       <div className="bg-white p-12 rounded-[56px] border border-slate-50 shadow-soft space-y-10">
          <div className="p-16 border-4 border-dashed border-slate-50 rounded-[48px] bg-slate-50/50 text-center space-y-6 group hover:bg-white hover:border-indigo-100 transition-all duration-700 cursor-pointer">
             <div className="w-24 h-24 bg-white rounded-[32px] mx-auto flex items-center justify-center text-indigo-500 shadow-inner group-hover:rotate-12 transition-transform">
                <Upload size={40} />
             </div>
             <div>
                <p className="text-2xl font-black text-slate-800 tracking-tight mb-2 uppercase">Tap or drag files here</p>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">Select multiple security documents (PDF, JPG, PNG)<br/>Maximum file size: 15MB each</p>
             </div>
             <button className="px-10 py-4 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 transition-all">Select Files</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <Settings size={16} className="text-indigo-500" />
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Batch Settings</h3>
                </div>
                <div className="space-y-4">
                   <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[11px] font-black text-slate-400 flex items-center justify-between hover:bg-white transition-all cursor-pointer">
                      Security Level: Confidential
                      <ChevronLeft className="-rotate-90 text-slate-300" size={14} />
                   </div>
                   <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[11px] font-black text-slate-400 flex items-center justify-between hover:bg-white transition-all cursor-pointer">
                      Document Category: Employees
                      <ChevronLeft className="-rotate-90 text-slate-300" size={14} />
                   </div>
                </div>
             </div>
             <div>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Queue (4 files)</h3>
                   <button className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Clear all</button>
                </div>
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 no-scrollbar">
                   {queue.map((file, idx) => (
                     <div key={idx} className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center gap-6 group hover:shadow-lg transition-all relative overflow-hidden">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${file.type === 'error' ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-300 animate-pulse'}`}>
                           <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between mb-1">
                              <h4 className="text-[13px] font-black text-slate-800 truncate pr-4">{file.name}</h4>
                              <span className="text-[9px] font-black text-slate-300 uppercase shrink-0">{file.size}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <p className={`text-[9px] font-black uppercase tracking-widest ${file.type === 'error' ? 'text-rose-500' : 'text-slate-400'}`}>{file.status}</p>
                              {file.type !== 'error' && <span className="text-[9px] font-black text-indigo-500">{file.progress}%</span>}
                           </div>
                           {file.type !== 'error' && (
                             <div className="w-full h-1 bg-slate-50 rounded-full mt-2 overflow-hidden shadow-inner">
                                <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${file.progress}%` }}></div>
                             </div>
                           )}
                        </div>
                        <button className="p-2 text-slate-200 hover:text-rose-500 transition-colors"><X size={14} /></button>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="flex items-center justify-between pt-10 border-t border-slate-100">
             <div className="flex items-center gap-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Size: 8.9 MB</p>
                <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest font-black">1 of 4 files ready</p>
             </div>
             <div className="flex items-center gap-4">
                <button onClick={() => setView('hub')} className="px-10 py-4 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white border border-transparent hover:border-slate-100 transition-all">Save Draft</button>
                <button 
                  onClick={handleBulkUpload}
                  className="px-10 py-4 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center gap-3"
                >
                   <Upload size={16} strokeWidth={2.5} /> Upload All Files
                </button>
             </div>
          </div>
       </div>
    </div>
  );

  const UploadView = () => (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-12 duration-700 pb-20">
       <button onClick={() => setView('hub')} className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-all">
          <ChevronLeft size={16} /> Back to Hub
       </button>
       
       <div className="flex items-center gap-8 px-2">
          <div className="w-20 h-20 bg-slate-900 text-white rounded-[32px] flex items-center justify-center shadow-2xl">
             <Upload size={32} />
          </div>
          <div>
             <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 underline decoration-indigo-300 underline-offset-4 uppercase">Vault Submission</h1>
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 leading-none">Encrypted Institutional Ingestion Node</p>
          </div>
       </div>

       <div className="bg-white p-16 rounded-[64px] border border-slate-50 shadow-soft space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Title</label>
                <input 
                  type="text" 
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({...newDoc, title: e.target.value})}
                  placeholder="e.g. Annual Security Audit 2023" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-200" 
                />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <select 
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({...newDoc, category: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-black text-slate-400 flex items-center justify-between hover:bg-white transition-all cursor-pointer outline-none appearance-none"
                >
                   <option value="General">General</option>
                   <option value="Engineering">Engineering</option>
                   <option value="HR">Human Resources</option>
                   <option value="Legal">Legal</option>
                </select>
             </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
             <textarea 
               value={newDoc.description}
               onChange={(e) => setNewDoc({...newDoc, description: e.target.value})}
               placeholder="Briefly describe the purpose of this document..." 
               rows={4} 
               className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-200 resize-none" 
             />
          </div>

          <div className="space-y-6">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Level</label>
             <div className="flex gap-4">
                {['Public', 'Compliance', 'Confidential'].map((lvl) => (
                  <button 
                    key={lvl} 
                    onClick={() => setNewDoc({...newDoc, status: lvl})}
                    className={`px-10 py-5 rounded-[20px] text-[11px] font-black uppercase tracking-widest border transition-all ${newDoc.status === lvl ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-white'}`}
                  >
                    {lvl}
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-6">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department Access</label>
             <div className="flex flex-wrap gap-3">
                {['Engineering', 'HR'].map((dept) => (
                   <div key={dept} className={`flex items-center gap-3 px-5 py-3 ${newDoc.department === dept ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-600 border-slate-100'} border rounded-xl text-[11px] font-black uppercase cursor-pointer`} onClick={() => setNewDoc({...newDoc, department: dept})}>
                      {dept} <X size={14} className="text-slate-300 hover:text-rose-500 cursor-pointer" />
                   </div>
                ))}
                <button 
                  onClick={() => alert('Departmental Access Matrix: Adding new organizational node...')}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-black text-indigo-500 hover:bg-indigo-50 hover:border-indigo-100 transition-all"
                >
                   <Plus size={14} /> Add Dept
                </button>
             </div>
          </div>

          <div className="p-12 border-4 border-dashed border-slate-50 rounded-[48px] bg-slate-50/50 text-center space-y-6 group hover:bg-white hover:border-indigo-100 transition-all duration-700 cursor-pointer">
             <div className="w-20 h-20 bg-white rounded-[28px] mx-auto flex items-center justify-center text-indigo-500 shadow-inner group-hover:scale-110 transition-transform">
                <Upload size={32} />
             </div>
             <div>
                <p className="text-xl font-black text-slate-800 tracking-tight mb-1">Click or drag PDF/DOC</p>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Maximum file size: 25MB</p>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-50">
             <button 
               onClick={handleUploadSubmit}
               disabled={!newDoc.title}
               className={`flex-1 py-6 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[28px] shadow-3xl shadow-indigo-100 transition-all flex items-center justify-center gap-4 ${newDoc.title ? 'bg-indigo-600 hover:bg-slate-900 active:scale-95' : 'bg-slate-300 cursor-not-allowed'}`}
             >
                <ShieldCheck size={18} /> Upload Document
             </button>
             <button onClick={() => setView('hub')} className="px-12 py-6 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] rounded-[28px] hover:bg-white border border-transparent hover:border-slate-100 transition-all">Cancel</button>
          </div>
       </div>
    </div>
  );

  const DetailsView = () => (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700 pb-20">
       <button onClick={() => setView('hub')} className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-all">
          <ChevronLeft size={16} /> Back to Hub
       </button>

       <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          <div className="xl:col-span-8 space-y-10">
             <div className="bg-white p-16 rounded-[64px] border border-slate-50 shadow-soft space-y-12 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-8">
                      <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[36px] flex items-center justify-center shadow-inner">
                         <FileText size={48} />
                      </div>
                      <div>
                         <div className="flex gap-4 mb-4">
                             <span className="px-4 py-1.5 bg-emerald-50 text-emerald-500 text-[9px] font-black rounded-full uppercase tracking-widest">Active</span>
                             <span className={`px-4 py-1.5 ${selectedDoc?.tagColor} text-[9px] font-black rounded-full uppercase tracking-widest`}>{selectedDoc?.tag || 'CONFIDENTIAL'}</span>
                          </div>
                          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2 underline decoration-indigo-300 underline-offset-4 uppercase leading-none">{selectedDoc?.title || 'InfiAP Security Protocol 2024'}</h1>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-4 leading-none">{selectedDoc?.dept || 'Cybersecurity Policy'} • v2.4.0 • Vault Node</p>
                      </div>
                   </div>
                   <button className="p-4 bg-slate-50 text-slate-300 rounded-2xl hover:text-indigo-600 transition-all"><MoreVertical size={24} /></button>
                </div>

                <div className="grid grid-cols-2 gap-10 pt-10 border-t border-slate-50">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Uploaded By</p>
                      <h4 className="text-xl font-black text-slate-800 tracking-tight">{selectedDoc?.author || 'Sarah Jenkins'}</h4>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Upload Date</p>
                      <h4 className="text-xl font-black text-slate-800 tracking-tight">{selectedDoc?.date || 'Oct 12, 2023'}</h4>
                   </div>
                </div>

                <button 
                  onClick={() => alert('Secure Download Node: Synchronizing with Vault... Document will be exported currently.')}
                  className="w-full py-6 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[32px] shadow-3xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-4"
                >
                   <Download size={20} strokeWidth={2.5} /> Download Document
                </button>
             </div>

             {showAlert && (
               <div className="bg-rose-50 border-1.5 border-rose-100 p-10 rounded-[48px] flex items-center justify-between text-rose-500 shadow-xl shadow-rose-100/20 group relative overflow-hidden">
                  <div className="flex items-center gap-8 relative z-10">
                     <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm">
                        <AlertTriangle size={32} className="animate-bounce" />
                     </div>
                     <div>
                        <h3 className="text-[13px] font-black uppercase tracking-tight leading-none mb-1">Security Alert</h3>
                        <p className="text-[11px] font-bold opacity-80 leading-relaxed max-w-[400px]">3 unauthorized access attempts detected from IP 192.168.1.45 in the last 24 hours.</p>
                     </div>
                  </div>
                  <button onClick={() => setShowAlert(false)} className="p-4 hover:bg-rose-100 rounded-2xl transition-all relative z-10"><X size={20} /></button>
               </div>
             )}

             <div className="bg-white p-16 rounded-[64px] border border-slate-100 shadow-soft">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-12">Document Activity Log</h3>
                <div className="space-y-12 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                   {activityLog.map((log, idx) => (
                      <div key={idx} className="relative pl-12 group">
                         <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10 
                           ${idx === 0 ? 'bg-indigo-600' : 'bg-slate-100'} group-hover:scale-125 transition-transform duration-500`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-white' : 'bg-slate-300'}`}></div>
                         </div>
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">{log.title}</h4>
                               <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">{log.detail}</p>
                            </div>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{log.time}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="xl:col-span-4 space-y-10">
             <div className="bg-white p-12 rounded-[56px] border border-slate-50 shadow-soft space-y-10">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-800">Access Control</h3>
                   <button 
                     onClick={() => alert('Access Control Matrix: Requesting administrative modification permission...')}
                     className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2"
                   >
                      <Edit3 size={14} /> Edit Access
                   </button>
                </div>
                <div className="space-y-8">
                   {[
                     { role: 'Admin', detail: 'Full Permissions', status: 'Access Granted', color: 'text-emerald-500 bg-emerald-50' },
                     { role: 'HR Manager', detail: 'Read/Write Access', status: 'Access Granted', color: 'text-emerald-500 bg-emerald-50' },
                     { role: 'Employees', detail: 'No Access', status: 'Restricted', color: 'text-slate-400 bg-slate-50' }
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-500">
                              <Users size={20} />
                           </div>
                           <div>
                              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.role}</h4>
                              <p className="text-[10px] font-bold text-slate-300 tracking-widest">{item.detail}</p>
                           </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {view === 'hub' && <HubView />}
      {view === 'upload' && <UploadView />}
      {view === 'bulk' && <BulkUploadView />}
      {view === 'details' && <DetailsView />}
    </div>
  );
};

export default SecurityDocuments;
