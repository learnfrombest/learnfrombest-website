import React, { useState, useEffect } from 'react';

const INITIAL_PROJECTS = [
  { id: 'PRJ-IDP', key: 'IDP', name: 'Intelligent Document Processing (IDP)', lead: 'Raghav Swaminathan', desc: 'OCR & Bedrock pipeline for multi-format invoices.' },
  { id: 'PRJ-RAG', key: 'RAG', name: 'Enterprise Knowledge Assistant (RAG)', lead: 'Priya Nair', desc: 'Bedrock Knowledge Base + OpenSearch retrieval.' },
  { id: 'PRJ-FRD', key: 'FRD', name: 'Fraud & Transaction Anomaly Platform', lead: 'Arun Menon', desc: 'Real-time transaction risk scoring with Lambda.' }
];

const INITIAL_TASKS = [
  {
    id: 'IDP-101',
    projectId: 'PRJ-IDP',
    title: 'Deploy AWS Textract OCR Lambda for Bank Statements',
    description: 'Implement asynchronous PDF extraction on S3 upload trigger. Parse key-value tables and send structured JSON output to DynamoDB.',
    status: 'Done',
    priority: 'High',
    type: 'Story',
    assignee: 'Raghav Swaminathan',
    points: 5,
    dueDate: '2026-11-15',
    comments: [
      {
        id: 'c-1',
        author: 'Raghav Swaminathan',
        text: 'Task is complete! Verified on 50 sample bank statements. Precision benchmark logged at 99.4%.',
        timestamp: new Date().toISOString(),
        isCompletion: true
      }
    ],
    proofs: [
      {
        id: 'p-1',
        name: 'textract-benchmark-results.svg',
        type: 'image/svg+xml',
        size: '420 KB',
        uploadedBy: 'Raghav Swaminathan',
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="240" viewBox="0 0 600 240"><rect width="600" height="240" fill="%230f172a"/><text x="30" y="50" fill="%2338bdf8" font-family="monospace" font-size="16" font-weight="bold">AWS TEXTRACT PIPELINE VERIFIED</text><rect x="30" y="70" width="540" height="140" rx="8" fill="%231e293b"/><text x="50" y="110" fill="%2322c55e" font-family="monospace" font-size="13">✓ Accuracy: 99.4% (50/50 test PDFs passed)</text><text x="50" y="145" fill="%23e2e8f0" font-family="monospace" font-size="12">Latency: 1.14s per statement | Lambda Cold Start: 310ms</text><text x="50" y="180" fill="%2394a3b8" font-family="monospace" font-size="11">Checksum: SHA-256: 8fca9b19e07823f</text></svg>'
      }
    ]
  },
  {
    id: 'IDP-102',
    projectId: 'PRJ-IDP',
    title: 'Evaluate Bedrock Claude 3.5 Sonnet Prompt for Discrepancy Detection',
    description: 'Design structured prompt schema for cross-referencing invoice line items with purchase orders.',
    status: 'In Progress',
    priority: 'High',
    type: 'Task',
    assignee: 'Raghav Swaminathan',
    points: 8,
    dueDate: '2026-11-18',
    comments: [],
    proofs: []
  },
  {
    id: 'RAG-201',
    projectId: 'PRJ-RAG',
    title: 'Index Enterprise Knowledge Base into Amazon OpenSearch Serverless',
    description: 'Chunk and vectorize technical training curricula using Amazon Titan Embeddings v2.',
    status: 'In Review',
    priority: 'Medium',
    type: 'Story',
    assignee: 'Priya Nair',
    points: 5,
    dueDate: '2026-11-14',
    comments: [],
    proofs: []
  },
  {
    id: 'FRD-301',
    projectId: 'PRJ-FRD',
    title: 'Configure Real-Time Anomaly Scoring Inference Endpoint',
    description: 'Deploy SageMaker Random Cut Forest algorithm with sub-100ms response targets.',
    status: 'To Do',
    priority: 'Critical',
    type: 'Bug',
    assignee: 'Raghav Swaminathan',
    points: 3,
    dueDate: '2026-11-20',
    comments: [],
    proofs: []
  }
];

export default function ProjectStudio({ onSignOut, currentUserEmail }) {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('lfb_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('lfb_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [selectedProjectId, setSelectedProjectId] = useState('ALL');
  const [activeTask, setActiveTask] = useState(null);
  const [activeView, setActiveView] = useState('kanban'); // 'kanban' | 'backlog'
  const [onlyProofFilter, setOnlyProofFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [lightboxProof, setLightboxProof] = useState(null);

  // New Project Form State
  const [newProjName, setNewProjName] = useState('');
  const [newProjKey, setNewProjKey] = useState('');
  const [newProjLead, setNewProjLead] = useState('Raghav Swaminathan');

  // New Task Form State
  const [newTaskProjectId, setNewTaskProjectId] = useState('PRJ-IDP');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskType, setNewTaskType] = useState('Story');
  const [newTaskPriority, setNewTaskPriority] = useState('High');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Raghav Swaminathan');
  const [newTaskPoints, setNewTaskPoints] = useState(5);

  // Comment & Proof Input inside Task Detail
  const [commentText, setCommentText] = useState('');
  const [isOfficialCompletion, setIsOfficialCompletion] = useState(false);

  useEffect(() => {
    localStorage.setItem('lfb_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('lfb_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const activeProject = projects.find(p => p.id === selectedProjectId);
  const userDisplayName = currentUserEmail ? currentUserEmail.split('@')[0] : 'Raghav Swaminathan';

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (selectedProjectId !== 'ALL' && t.projectId !== selectedProjectId) return false;
    if (onlyProofFilter && (!t.proofs || t.proofs.length === 0)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchKey = t.id.toLowerCase().includes(q);
      const matchAssignee = t.assignee.toLowerCase().includes(q);
      if (!matchTitle && !matchKey && !matchAssignee) return false;
    }
    return true;
  });

  // Handle Project Creation
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjKey.trim()) return;
    const cleanKey = newProjKey.trim().toUpperCase();
    const created = {
      id: 'PRJ-' + cleanKey,
      key: cleanKey,
      name: newProjName.trim(),
      lead: newProjLead.trim() || userDisplayName,
      desc: 'Enterprise AI initiative.'
    };
    const updated = [...projects, created];
    setProjects(updated);
    setSelectedProjectId(created.id);
    setNewProjName('');
    setNewProjKey('');
    setShowNewProjectModal(false);
  };

  // Handle Task Creation
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const targetProj = projects.find(p => p.id === newTaskProjectId) || projects[0];
    const randNum = Math.floor(100 + Math.random() * 900);
    const createdTask = {
      id: `${targetProj.key}-${randNum}`,
      projectId: targetProj.id,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      type: newTaskType,
      priority: newTaskPriority,
      assignee: newTaskAssignee.trim() || userDisplayName,
      points: Number(newTaskPoints) || 3,
      status: 'To Do',
      dueDate: '2026-11-25',
      comments: [],
      proofs: []
    };
    setTasks([createdTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowNewTaskModal(false);
    setActiveTask(createdTask);
  };

  // Drag and drop
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTasks(updated);
    if (activeTask && activeTask.id === taskId) {
      setActiveTask({ ...activeTask, status: newStatus });
    }
  };

  // Proof Upload
  const handleProofUpload = (e) => {
    const files = e.target.files;
    if (!files || !files.length || !activeTask) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newProof = {
          id: 'p-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: (file.size / 1024).toFixed(1) + ' KB',
          uploadedBy: userDisplayName,
          dataUrl: event.target.result
        };
        const updatedTask = {
          ...activeTask,
          proofs: [...(activeTask.proofs || []), newProof]
        };
        setTasks(tasks.map(t => t.id === activeTask.id ? updatedTask : t));
        setActiveTask(updatedTask);
      };
      reader.readAsDataURL(file);
    });
  };

  // Comments & Sign-off
  const handleCommentSubmit = (isQuick = false) => {
    if (!activeTask) return;
    const text = isQuick
      ? 'Task is complete! Verified deliverables and signed off for production delivery.'
      : commentText.trim();
    if (!text) return;

    const shouldMarkDone = isQuick || isOfficialCompletion;
    const newComment = {
      id: 'c-' + Date.now(),
      author: userDisplayName,
      text,
      timestamp: new Date().toISOString(),
      isCompletion: shouldMarkDone
    };

    const updatedTask = {
      ...activeTask,
      status: shouldMarkDone ? 'Done' : activeTask.status,
      comments: [...(activeTask.comments || []), newComment]
    };

    setTasks(tasks.map(t => t.id === activeTask.id ? updatedTask : t));
    setActiveTask(updatedTask);
    setCommentText('');
    setIsOfficialCompletion(false);
  };

  const columns = ['To Do', 'In Progress', 'In Review', 'Done'];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0b1329', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      
      {/* ─── SIDEBAR ─── */}
      <aside style={{ width: '260px', background: '#0f172a', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #3b82f6)', display: 'grid', placeItems: 'center', fontWeight: 900, color: '#fff', fontSize: '18px' }}>
            L
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '-0.3px', color: '#fff' }}>LearnFromBest</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Enterprise Jira Suite</div>
          </div>
        </div>

        {/* Project Selector & "+ New Project" link */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Project</span>
            <button
              onClick={() => setShowNewProjectModal(true)}
              style={{ background: 'transparent', border: 0, color: '#818cf8', fontSize: '11px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              ＋ New Project
            </button>
          </div>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            style={{ width: '100%', background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="ALL">✦ All Projects ({projects.length})</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>[{p.key}] {p.name}</option>
            ))}
          </select>
        </div>

        {/* Navigation items */}
        <nav style={{ padding: '14px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 8px' }}>
            Delivery Views
          </div>
          <button
            onClick={() => setActiveView('kanban')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', border: 0, fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', background: activeView === 'kanban' ? '#4f46e5' : 'transparent', color: activeView === 'kanban' ? '#fff' : '#94a3b8' }}
          >
            <span>▦</span>
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setActiveView('backlog')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: '8px', border: 0, fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', background: activeView === 'backlog' ? '#4f46e5' : 'transparent', color: activeView === 'backlog' ? '#fff' : '#94a3b8' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>☷</span>
              <span>Backlog & Tasks</span>
            </span>
            <span style={{ background: '#1e293b', padding: '2px 7px', borderRadius: '10px', fontSize: '11px', color: '#cbd5e1' }}>
              {tasks.length}
            </span>
          </button>

          <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '16px 8px 6px' }}>
            Workspace Actions
          </div>
          <button
            onClick={() => { setNewTaskProjectId(selectedProjectId === 'ALL' ? projects[0].id : selectedProjectId); setShowNewTaskModal(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: 0, color: '#cbd5e1', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ color: '#818cf8', fontWeight: 800 }}>＋</span> Create Task
          </button>
          <button
            onClick={() => setShowNewProjectModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: 0, color: '#cbd5e1', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ color: '#818cf8', fontWeight: 800 }}>＋</span> Create Project
          </button>

          <div style={{ marginTop: 'auto', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(51, 65, 85, 0.6)', borderRadius: '10px', padding: '12px', fontSize: '11px', color: '#94a3b8', lineHeight: 1.5 }}>
            <span style={{ color: '#34d399', fontWeight: 700, display: 'block', marginBottom: '3px' }}>✓ Verified Proof Engine</span>
            Tasks marked "Done" allow attaching screenshot or document evidence directly to the task stream.
          </div>
        </nav>

        {/* User bar */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid #1e293b', background: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '12px', color: '#fff', flexShrink: 0 }}>
              RS
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {userDisplayName}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Lead Architect</div>
            </div>
          </div>
          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out"
              style={{ background: 'transparent', border: 0, color: '#64748b', fontSize: '14px', cursor: 'pointer', padding: '4px' }}
            >
              ✕
            </button>
          )}
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        
        {/* Top Header */}
        <header style={{ height: '64px', background: '#0f172a', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#64748b', fontSize: '12px' }}>Workspace /</span>
            <span style={{ background: '#1e293b', color: '#f8fafc', fontWeight: 700, fontSize: '12px', padding: '4px 10px', borderRadius: '6px', border: '1px solid #334155' }}>
              {selectedProjectId === 'ALL' ? 'All Enterprise Projects' : activeProject?.name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search work items..."
              style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '7px 12px', fontSize: '12px', color: '#fff', outline: 'none', width: '210px' }}
            />

            <button
              onClick={() => setOnlyProofFilter(!onlyProofFilter)}
              style={{ background: onlyProofFilter ? 'rgba(16, 185, 129, 0.15)' : '#1e293b', border: onlyProofFilter ? '1px solid #10b981' : '1px solid #334155', color: onlyProofFilter ? '#34d399' : '#cbd5e1', padding: '7px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>📎</span>
              <span>With Proof Only</span>
            </button>

            {/* Create Project Button */}
            <button
              onClick={() => setShowNewProjectModal(true)}
              style={{ background: '#1e293b', border: '1px solid #4338ca', color: '#a5b4fc', padding: '7px 13px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              ＋ New Project
            </button>

            {/* Create Task Button */}
            <button
              onClick={() => { setNewTaskProjectId(selectedProjectId === 'ALL' ? projects[0].id : selectedProjectId); setShowNewTaskModal(true); }}
              style={{ background: '#4f46e5', border: 0, color: '#fff', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(79, 70, 229, 0.35)' }}
            >
              ＋ Create Task
            </button>
          </div>
        </header>

        {/* VIEW 1: KANBAN BOARD */}
        {activeView === 'kanban' && (
          <div style={{ flex: 1, padding: '20px 24px', overflowX: 'auto', overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(280px, 1fr))', gap: '16px', flex: 1, height: '100%' }}>
              {columns.map(col => {
                const colTasks = filteredTasks.filter(t => t.status === col);
                const colColors = {
                  'To Do': '#94a3b8',
                  'In Progress': '#60a5fa',
                  'In Review': '#fbbf24',
                  'Done': '#34d399'
                }[col];

                return (
                  <div
                    key={col}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, col)}
                    style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid #1e293b', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: colColors, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {col}
                      </span>
                      <span style={{ background: '#1e293b', color: '#cbd5e1', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                        {colTasks.length}
                      </span>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '2px' }}>
                      {colTasks.map(t => {
                        const hasProof = t.proofs && t.proofs.length > 0;
                        const proj = projects.find(p => p.id === t.projectId);

                        return (
                          <div
                            key={t.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, t.id)}
                            onClick={() => setActiveTask(t)}
                            style={{ background: '#1e293b', border: t.status === 'Done' ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid #334155', borderRadius: '10px', padding: '14px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#818cf8', fontWeight: 700 }}>{t.id}</span>
                              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: t.priority === 'Critical' || t.priority === 'High' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: t.priority === 'Critical' || t.priority === 'High' ? '#f87171' : '#60a5fa' }}>
                                {t.priority}
                              </span>
                            </div>

                            <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 600, color: '#f8fafc', lineHeight: 1.4 }}>
                              {t.title}
                            </h4>

                            {hasProof && (
                              <div style={{ background: 'rgba(6, 78, 59, 0.5)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                                <span>✓</span>
                                <span>Proof Verified ({t.proofs.length})</span>
                              </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(51, 65, 85, 0.5)', paddingTop: '8px', fontSize: '11px', color: '#94a3b8' }}>
                              <span style={{ fontSize: '10px', background: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>
                                {proj ? proj.key : 'PRJ'} • {t.points || 3} pts
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {t.comments && t.comments.length > 0 && <span>💬 {t.comments.length}</span>}
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#4338ca', color: '#fff', fontSize: '10px', fontWeight: 800, display: 'grid', placeItems: 'center' }}>
                                  {t.assignee.slice(0, 2).toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {colTasks.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '50px 10px', color: '#475569', fontSize: '12px' }}>
                          Drag tasks here
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: BACKLOG TABLE */}
        {activeView === 'backlog' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Enterprise Backlog Inventory</h2>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{filteredTasks.length} Work Items</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px' }}>Key</th>
                    <th style={{ padding: '10px' }}>Summary</th>
                    <th style={{ padding: '10px' }}>Project</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Priority</th>
                    <th style={{ padding: '10px' }}>Proof</th>
                    <th style={{ padding: '10px' }}>Assignee</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(t => {
                    const hasProof = t.proofs && t.proofs.length > 0;
                    return (
                      <tr
                        key={t.id}
                        onClick={() => setActiveTask(t)}
                        style={{ borderBottom: '1px solid #1e293b', cursor: 'pointer' }}
                      >
                        <td style={{ padding: '12px 10px', fontFamily: 'monospace', fontWeight: 700, color: '#818cf8' }}>{t.id}</td>
                        <td style={{ padding: '12px 10px', fontWeight: 600, color: '#f8fafc' }}>{t.title}</td>
                        <td style={{ padding: '12px 10px', color: '#94a3b8' }}>{t.projectId}</td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ background: t.status === 'Done' ? 'rgba(16, 185, 129, 0.2)' : '#1e293b', color: t.status === 'Done' ? '#34d399' : '#cbd5e1', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px', color: t.priority === 'High' || t.priority === 'Critical' ? '#f87171' : '#60a5fa', fontWeight: 700 }}>
                          {t.priority}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          {hasProof ? (
                            <span style={{ color: '#34d399', fontWeight: 600 }}>✓ {t.proofs.length} File(s)</span>
                          ) : (
                            <span style={{ color: '#475569', fontStyle: 'italic' }}>None</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{t.assignee}</td>
                        <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                          <button style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ─── MODAL 1: CREATE PROJECT ─── */}
      {showNewProjectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Create Enterprise Project</h3>
              <button onClick={() => setShowNewProjectModal(false)} style={{ background: 'transparent', border: 0, color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Customer Service Agent"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '13px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Key (3-5 letters) *</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="CSA"
                    value={newProjKey}
                    onChange={(e) => setNewProjKey(e.target.value.toUpperCase())}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Project Lead</label>
                  <input
                    type="text"
                    value={newProjLead}
                    onChange={(e) => setNewProjLead(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '13px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  style={{ background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#4f46e5', border: 0, color: '#fff', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: CREATE TASK ─── */}
      {showNewTaskModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Create Work Item</h3>
              <button onClick={() => setShowNewTaskModal(false)} style={{ background: 'transparent', border: 0, color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Project *</label>
                <select
                  value={newTaskProjectId}
                  onChange={(e) => setNewTaskProjectId(e.target.value)}
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px' }}
                >
                  {projects.map(p => <option key={p.id} value={p.id}>[{p.key}] {p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement AWS Bedrock invoice extraction prompt"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Acceptance criteria and proof requirements..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '12px', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Type</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value)}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px' }}
                  >
                    <option value="Story">📖 User Story</option>
                    <option value="Task">⚙️ Task</option>
                    <option value="Bug">🐛 Bug</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  style={{ background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#4f46e5', border: 0, color: '#fff', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create Work Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: TASK DETAIL & COMPLETION PROOF ─── */}
      {activeTask && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '16px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: '#818cf8', background: 'rgba(79, 70, 229, 0.2)', padding: '2px 8px', borderRadius: '4px', border: '1px solid #4338ca' }}>
                  {activeTask.id}
                </span>
                <h2 style={{ margin: '8px 0 0', fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                  {activeTask.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveTask(null)}
                style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>

            {/* Quick Metadata Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', background: '#1e293b', padding: '14px', borderRadius: '10px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Status</span>
                <select
                  value={activeTask.status}
                  onChange={(e) => {
                    const updated = { ...activeTask, status: e.target.value };
                    setActiveTask(updated);
                    setTasks(tasks.map(t => t.id === activeTask.id ? updated : t));
                  }}
                  style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px', padding: '5px 8px', width: '100%', fontSize: '12px' }}
                >
                  {columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Priority</span>
                <span style={{ fontWeight: 700, color: activeTask.priority === 'High' || activeTask.priority === 'Critical' ? '#f87171' : '#60a5fa' }}>{activeTask.priority}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Assignee</span>
                <span style={{ color: '#cbd5e1' }}>{activeTask.assignee}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Story Points</span>
                <span style={{ color: '#cbd5e1' }}>{activeTask.points || 3} pts</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 style={{ margin: '0 0 6px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8' }}>Description & Scope</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, background: '#1e293b', padding: '14px', borderRadius: '10px' }}>
                {activeTask.description || 'No description provided.'}
              </p>
            </div>

            {/* Proof of Completion Section */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📎</span>
                  <span>Attached Proof of Completion ({activeTask.proofs ? activeTask.proofs.length : 0})</span>
                </h4>
                <label style={{ background: '#4f46e5', color: '#fff', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                  ＋ Upload Proof File
                  <input type="file" multiple onChange={handleProofUpload} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Proofs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {activeTask.proofs && activeTask.proofs.map(p => (
                  <div key={p.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLightboxProof(p)}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{p.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{p.size} • by {p.uploadedBy}</div>
                    </div>
                    <button
                      onClick={() => setLightboxProof(p)}
                      style={{ background: 'transparent', border: 0, color: '#818cf8', fontSize: '12px', cursor: 'pointer' }}
                    >
                      👁
                    </button>
                  </div>
                ))}
                {(!activeTask.proofs || activeTask.proofs.length === 0) && (
                  <div style={{ color: '#64748b', fontSize: '12px', fontStyle: 'italic', padding: '10px 0' }}>
                    No execution proofs attached yet. Upload screenshots or test result logs above.
                  </div>
                )}
              </div>
            </div>

            {/* Activity Comments & Sign Off */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8' }}>
                  Activity & Completion Logs
                </h4>
                <button
                  onClick={() => handleCommentSubmit(true)}
                  style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                >
                  ✓ Quick: "Task is Complete & Signed Off"
                </button>
              </div>

              {/* Comment Input */}
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
                <textarea
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Leave an execution log, test result note, or update..."
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 10px', color: '#fff', fontSize: '12px', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isOfficialCompletion}
                      onChange={(e) => setIsOfficialCompletion(e.target.checked)}
                    />
                    <span>Mark as Official Completion Log & Transition to Done</span>
                  </label>
                  <button
                    onClick={() => handleCommentSubmit(false)}
                    style={{ background: '#4f46e5', border: 0, color: '#fff', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Post Log
                  </button>
                </div>
              </div>

              {/* Comments History */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeTask.comments && activeTask.comments.map(c => (
                  <div
                    key={c.id}
                    style={{ background: c.isCompletion ? 'rgba(6, 78, 59, 0.3)' : '#1e293b', border: c.isCompletion ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid #334155', borderRadius: '8px', padding: '10px 12px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: c.isCompletion ? '#34d399' : '#818cf8' }}>
                        {c.author} {c.isCompletion && '• Signed Off'}
                      </span>
                      <span style={{ color: '#64748b' }}>{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.5 }}>{c.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: PROOF LIGHTBOX ─── */}
      {lightboxProof && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '16px', maxWidth: '800px', width: '100%', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#fff' }}>{lightboxProof.name}</h4>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{lightboxProof.size} • by {lightboxProof.uploadedBy}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={lightboxProof.dataUrl} download={lightboxProof.name} style={{ background: '#334155', color: '#fff', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', textDecoration: 'none' }}>Download</a>
                <button onClick={() => setLightboxProof(null)} style={{ background: 'transparent', border: 0, color: '#94a3b8', fontSize: '16px', cursor: 'pointer' }}>✕</button>
              </div>
            </div>
            <div style={{ padding: '20px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', overflow: 'auto' }}>
              <img src={lightboxProof.dataUrl} alt={lightboxProof.name} style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '8px' }} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}