import React, { useState, useMemo, useEffect } from 'react';
import {
  Inbox,
  PlusCircle,
  BarChart2,
  BookOpen,
  Clock,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit3,
  Filter,
  Send,
  MessageSquare,
  Lock,
  ChevronRight,
  ChevronDown,
  Download,
  Check,
  X,
  User,
  Shield,
  LifeBuoy,
  FileText,
  PhoneCall,
  Mail,
  Smartphone,
  MessageCircle,
  HelpCircle,
  Paperclip,
  Star,
  RefreshCw,
  MoreVertical,
  Plus,
  Play,
  Globe,
  ChevronLeft,
  Building2
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// --- INITIAL SEED DATA ---
const INITIAL_AGENTS = [
  { id: 'ag-1', name: 'Budi Santoso', email: 'budi.s@company.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', role: 'L2 Support', openTickets: 5 },
  { id: 'ag-2', name: 'Siti Rahma', email: 'siti.r@company.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', role: 'L1 Support', openTickets: 3 },
  { id: 'ag-3', name: 'Dewi Lestari', email: 'dewi.l@company.com', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', role: 'Network Admin', openTickets: 4 },
  { id: 'ag-4', name: 'Ahmad Rizky', email: 'ahmad.r@company.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', role: 'DevOps Lead', openTickets: 2 },
];

const CANNED_RESPONSES = [
  { id: 'cr-1', title: 'Panduan Restart Wi-Fi / Router', content: 'Halo, mohon coba lakukan restart pada router Wi-Fi Anda dengan mematikan daya selama 30 detik lalu menyalakannya kembali.' },
  { id: 'cr-2', title: 'Reset Password Akun Domain', content: 'Halo, permintaan reset password Anda sedang diproses. Silakan buka tautan aman berikut untuk membuat password baru: https://sso.company.com/reset' },
  { id: 'cr-3', title: 'Konfirmasi Perbaikan Printer Network', content: 'Teknisi kami telah mengganti cartridge toner dan membersihkan paper jam. Silakan lakukan tes cetak ulang.' },
  { id: 'cr-4', title: 'Estimasi Pengadaan Perangkat', content: 'Permintaan pengadaan unit baru telah disetujui oleh Finance. Pengiriman diperkirakan memakan waktu 3 hari kerja.' }
];

const INITIAL_TICKETS = [
  {
    id: 'TKT-1029',
    subject: '[INBOUND EMAIL] Printer Ruang Rapat Lt 4 Macet & Mati Lampu Indikator',
    description: 'Halo Tim IT, printer Epson di ruang rapat lantai 4 tidak merespons cetakan dari laptop manapun. Indikator paper jam menyala merah terus.',
    category: 'Hardware & Laptop',
    type: 'Insiden',
    priority: 'Sedang',
    status: 'Open',
    channel: 'Email',
    requester: { name: 'budi.sales', email: 'budi.sales@company.com', dept: 'General Office' },
    assignedAgent: 'Siti Rahma',
    agentId: 'ag-2',
    createdAt: '2026-10-28T08:30:00Z',
    slaDue: '2026-10-28T14:30:00Z',
    slaResponseDue: '2026-10-28T09:30:00Z',
    rating: null,
    comments: [
      { id: 'c1', author: 'budi.sales', text: 'Tolong diperbaiki segera sebelum rapat pukul 10:00 WIB.', isInternal: false, timestamp: '2026-10-28T08:30:00Z' }
    ],
    timeline: [
      { id: 't1', action: 'Tiket dibuat via Inbound Email Webhook', user: 'System', time: '08:30' }
    ]
  },
  {
    id: 'TKT-1028',
    subject: '[WHATSAPP] VPN Kantor Terputus untuk Semua Karyawan Remote',
    description: 'VPN Fortinet error TLS handshake saat mau login dari rumah. Muncul pesan Certificate Expired.',
    category: 'Jaringan & Wi-Fi',
    type: 'Insiden Utama',
    priority: 'Urgent',
    status: 'Open',
    channel: 'WhatsApp',
    requester: { name: 'rudi.remote', email: 'rudi.remote@company.com', dept: 'Engineering' },
    assignedAgent: 'Dewi Lestari',
    agentId: 'ag-3',
    createdAt: '2026-10-28T07:15:00Z',
    slaDue: '2026-10-28T11:15:00Z',
    slaResponseDue: '2026-10-28T07:30:00Z',
    rating: null,
    comments: [
      { id: 'c1', author: 'Dewi Lestari', text: 'Sertifikat SSL SSL-VPN terdeteksi expired tadi malam. Sedang proses renewal.', isInternal: true, timestamp: '2026-10-28T07:45:00Z' }
    ],
    timeline: [
      { id: 't1', action: 'Tiket dibuat via WA Cloud API', user: 'System', time: '07:15' },
      { id: 't2', action: 'Prioritas dinaikkan ke Urgent secara otomatis', user: 'SLA Automation Rule', time: '07:16' }
    ]
  },
  {
    id: 'TKT-1027',
    subject: 'Permintaan Lisensi Adobe Creative Cloud Tambahan',
    description: 'Tim Marketing butuh 2 seat lisensi Photoshop & Illustrator untuk tim magang baru.',
    category: 'Aplikasi & Software',
    type: 'Permintaan Layanan',
    priority: 'Rendah',
    status: 'Pending',
    channel: 'Portal Web',
    requester: { name: 'dina.design', email: 'dina.design@company.com', dept: 'Marketing' },
    assignedAgent: 'Budi Santoso',
    agentId: 'ag-1',
    createdAt: '2026-10-27T14:20:00Z',
    slaDue: '2026-10-30T17:00:00Z',
    slaResponseDue: '2026-10-28T10:00:00Z',
    rating: null,
    comments: [],
    timeline: [{ id: 't1', action: 'Tiket dibuat melalui Service Portal', user: 'dina.design', time: '14:20' }]
  },
  {
    id: 'TKT-1026',
    subject: 'Layar Macbook Pro M2 Flicker & Bergaris Biru',
    description: 'Layar suka flicker mati nyala sendiri saat membuka aplikasi berat Figma/Photoshop.',
    category: 'Hardware & Laptop',
    type: 'Insiden',
    priority: 'Tinggi',
    status: 'Belum Ditugaskan',
    channel: 'Walk-in',
    requester: { name: 'andri.hr', email: 'andri.hr@company.com', dept: 'HR & GA' },
    assignedAgent: null,
    agentId: null,
    createdAt: '2026-10-27T11:00:00Z',
    slaDue: '2026-10-28T17:00:00Z',
    slaResponseDue: '2026-10-27T12:00:00Z',
    rating: null,
    comments: [],
    timeline: [{ id: 't1', action: 'Tiket diinput oleh Agen Frontdesk', user: 'Siti Rahma', time: '11:00' }]
  },
  {
    id: 'TKT-1025',
    subject: 'Akses Database Production Timeout Saat Query Report',
    description: 'Query analitik bulanan mengalami timeout error 504 pada jam peak-hour.',
    category: 'Aplikasi & Software',
    type: 'Insiden',
    priority: 'Urgent',
    status: 'Resolved',
    channel: 'Chat Portal',
    requester: { name: 'kevin.data', email: 'kevin.data@company.com', dept: 'Data Analytics' },
    assignedAgent: 'Ahmad Rizky',
    agentId: 'ag-4',
    createdAt: '2026-10-26T09:00:00Z',
    slaDue: '2026-10-26T13:00:00Z',
    slaResponseDue: '2026-10-26T09:15:00Z',
    rating: 5,
    comments: [
      { id: 'c1', author: 'Ahmad Rizky', text: 'Indeks query database telah ditambahkan. Respons time turun dari 12s ke 200ms.', isInternal: false, timestamp: '2026-10-26T11:30:00Z' }
    ],
    timeline: [
      { id: 't1', action: 'Tiket diselesaikan (Resolved)', user: 'Ahmad Rizky', time: '11:30' },
      { id: 't2', action: 'Pemohon memberikan rating CSAT 5 Bintang', user: 'kevin.data', time: '12:00' }
    ]
  }
];

const KB_ARTICLES = [
  { id: 'kb-1', title: 'Cara Menghubungkan Laptop Windows 11 ke Wi-Fi Corporate (802.1X)', category: 'Jaringan & Wi-Fi', reads: 342, helpful: 45, unhelpful: 2, content: '1. Buka Settings > Network & Internet...\n2. Pilih jaringan Corporate-Secure...\n3. Masukkan domain username dan password AD anda.' },
  { id: 'kb-2', title: 'Troubleshooting Printer Jam & Pergantian Toner Mandiri', category: 'Hardware & Laptop', reads: 215, helpful: 28, unhelpful: 1, content: 'Pastikan baki kertas tidak melebihi batas penampung. Lepaskan cartridge dengan perlahan saat terjadi kemacetan.' },
  { id: 'kb-3', title: 'Konfigurasi VPN Client FortiClient pada macOS', category: 'Jaringan & Wi-Fi', reads: 512, helpful: 89, unhelpful: 4, content: 'Unduh versi FortiClient 7.0 dari portal internal. Gunakan server vpn.company.com port 443.' },
  { id: 'kb-4', title: 'Prosedur Pengajuan Perangkat Laptop Baru (Reimbursement/Procurement)', category: 'Kebijakan IT', reads: 180, helpful: 19, unhelpful: 0, content: 'Setiap pengadaan unit laptop baru harus mengantongi persetujuan VP Department serta form persetujuan spesifikasi IT.' }
];

export default function App() {
  // --- STATES ---
  const [activeTab, setActiveTab] = useState('inbox'); // inbox, detail, requester_portal, analytics, kb, sla, team
  const [role, setRole] = useState('Admin'); // Admin, Agent, Requester
  const [darkMode, setDarkMode] = useState(false);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtering States
  const [filterTab, setFilterTab] = useState('all'); // all, unassigned, my_tickets, pending, resolved
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterPriority, setFilterPriority] = useState('Semua');
  const [filterChannel, setFilterChannel] = useState('Semua');

  // Modals States for Bulk Actions
  const [bulkAssignModal, setBulkAssignModal] = useState(false);
  const [bulkStatusModal, setBulkStatusModal] = useState(false);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [newTicketModal, setNewTicketModal] = useState(false);

  // Modal Input Values
  const [targetAgent, setTargetAgent] = useState('');
  const [targetStatus, setTargetStatus] = useState('Open');

  // Current logged in agent ID for Agent view (simulated logged in as Siti Rahma ag-2)
  const currentAgentName = 'Siti Rahma';

  // Automatically adjust default view when switching role
  useEffect(() => {
    if (role === 'Requester') {
      setActiveTab('requester_portal');
    } else {
      setActiveTab('inbox');
    }
  }, [role]);

  // Show Toast Utility
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Helper for Selected Ticket
  const currentTicket = useMemo(() => {
    return tickets.find(t => t.id === selectedTicketId) || tickets[0];
  }, [tickets, selectedTicketId]);

  // --- FILTERED TICKETS INBOX ---
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      // Role-based visibility for User (Requester sees only their tickets)
      if (role === 'Requester' && activeTab === 'inbox') {
        const isMyTicket = t.requester.name.toLowerCase().includes('budi.sales') || t.requester.email.includes('budi.sales');
        if (!isMyTicket) return false;
      }

      // Search
      const matchSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.requester.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter Tabs
      let matchTab = true;
      if (filterTab === 'unassigned') matchTab = !t.assignedAgent || t.status === 'Belum Ditugaskan';
      if (filterTab === 'my_tickets') matchTab = t.assignedAgent === currentAgentName;
      if (filterTab === 'pending') matchTab = t.status === 'Pending';
      if (filterTab === 'resolved') matchTab = t.status === 'Resolved' || t.status === 'Closed';

      // Dropdown Filters
      const matchStatus = filterStatus === 'Semua' || t.status === filterStatus;
      const matchPriority = filterPriority === 'Semua' || t.priority === filterPriority;
      const matchChannel = filterChannel === 'Semua' || t.channel === filterChannel;

      return matchSearch && matchTab && matchStatus && matchPriority && matchChannel;
    });
  }, [tickets, searchQuery, filterTab, filterStatus, filterPriority, filterChannel, role, activeTab]);

  // --- BULK ACTION HANDLERS ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTicketIds(filteredTickets.map(t => t.id));
    } else {
      setSelectedTicketIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedTicketIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const executeBulkAssign = () => {
    if (!targetAgent) return;
    const agentObj = INITIAL_AGENTS.find(a => a.name === targetAgent);
    setTickets(prev => prev.map(t => {
      if (selectedTicketIds.includes(t.id)) {
        return {
          ...t,
          assignedAgent: agentObj ? agentObj.name : targetAgent,
          agentId: agentObj ? agentObj.id : null,
          status: t.status === 'Belum Ditugaskan' ? 'Open' : t.status,
          timeline: [
            ...t.timeline,
            { id: Date.now().toString(), action: `Ditugaskan ke agen: ${targetAgent}`, user: `${role} (${targetAgent})`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
          ]
        };
      }
      return t;
    }));
    showToast(`${selectedTicketIds.length} tiket berhasil ditugaskan ke ${targetAgent}`);
    setSelectedTicketIds([]);
    setBulkAssignModal(false);
  };

  const executeBulkStatus = () => {
    setTickets(prev => prev.map(t => {
      if (selectedTicketIds.includes(t.id)) {
        return {
          ...t,
          status: targetStatus,
          timeline: [
            ...t.timeline,
            { id: Date.now().toString(), action: `Status diubah menjadi ${targetStatus}`, user: role, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
          ]
        };
      }
      return t;
    }));
    showToast(`Status ${selectedTicketIds.length} tiket berhasil diperbarui ke ${targetStatus}`);
    setSelectedTicketIds([]);
    setBulkStatusModal(false);
  };

  const executeBulkDelete = () => {
    const count = selectedTicketIds.length;
    setTickets(prev => prev.filter(t => !selectedTicketIds.includes(t.id)));
    showToast(`${count} tiket berhasil dihapus dari sistem`, 'danger');
    setSelectedTicketIds([]);
    setBulkDeleteModal(false);
  };

  // --- NEW TICKET SUBMISSION ---
  const handleCreateTicket = (formData) => {
    const newId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: newId,
      subject: formData.subject,
      description: formData.description,
      category: formData.category || 'Lainnya',
      type: formData.type || 'Insiden',
      priority: formData.priority || 'Sedang',
      status: 'Open',
      channel: formData.channel || 'Portal Web',
      requester: { 
        name: formData.requesterName || (role === 'Requester' ? 'budi.sales' : 'user.demo'), 
        email: formData.requesterEmail || (role === 'Requester' ? 'budi.sales@company.com' : 'user@company.com'), 
        dept: 'Sales & Marketing' 
      },
      assignedAgent: formData.agent || null,
      agentId: null,
      createdAt: new Date().toISOString(),
      slaDue: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      slaResponseDue: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      rating: null,
      comments: [],
      timeline: [{ id: '1', action: `Tiket dibuat via ${formData.channel || 'Portal Web'}`, user: formData.requesterName || role, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]
    };

    setTickets([newTicket, ...tickets]);
    showToast(`Tiket ${newId} berhasil dibuat!`);
    setNewTicketModal(false);
  };

  // --- REPLY / NOTE IN TICKET DETAIL ---
  const handleAddComment = (ticketId, text, isInternal) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          comments: [
            ...t.comments,
            { id: Date.now().toString(), author: role === 'Requester' ? t.requester.name : `${currentAgentName} (${role})`, text, isInternal, timestamp: new Date().toISOString() }
          ],
          timeline: [
            ...t.timeline,
            { id: Date.now().toString(), action: isInternal ? 'Menambahkan Catatan Internal' : 'Mengirim Balasan Publik', user: role, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
          ]
        };
      }
      return t;
    }));
    showToast(isInternal ? 'Catatan internal ditambahkan' : 'Balasan berhasil dikirim');
  };

  // Status Badge Colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">Open</span>;
      case 'Pending': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Pending</span>;
      case 'Resolved': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Resolved</span>;
      case 'Closed': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Closed</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">Belum Ditugaskan</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/50 dark:text-red-300">Urgent</span>;
      case 'Tinggi': return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">Tinggi</span>;
      case 'Sedang': return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">Sedang</span>;
      default: return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">Rendah</span>;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Toast Notification Floating */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-xl text-white font-medium transition-all transform translate-y-0 ${
          toast.type === 'danger' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'danger' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER / NAVBAR */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab(role === 'Requester' ? 'requester_portal' : 'inbox')}>
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              H
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">HelpDesk<span className="text-teal-600">IT</span></span>
              <span className={`hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full font-semibold border ${
                role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800' :
                role === 'Agent' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800' :
                'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
              }`}>
                {role === 'Admin' ? '⚡ Panel Admin' : role === 'Agent' ? '🎧 Workbench Agen' : '👤 User Self-Service'}
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={role === 'Requester' ? "Cari solusi / tiket saya..." : "Cari tiket (#ID, Subjek, Pelapor)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-teal-500 rounded-lg outline-none transition"
            />
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center space-x-3">
          {/* Company Name Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>PT. Nusantara Makmur Sejahtera</span>
          </div>

          {/* Role Switcher Demo */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <Shield className="w-3.5 h-3.5 text-teal-600 ml-1.5 mr-1" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer pr-1"
            >
              <option value="Admin">Tampilan: Admin IT</option>
              <option value="Agent">Tampilan: Agen Support</option>
              <option value="Requester">Tampilan: Pemohon (User)</option>
            </select>
          </div>

          <button
            onClick={() => setNewTicketModal(true)}
            className="flex items-center space-x-1 bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tiket Baru</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER (SIDEBAR + CONTENT) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* DYNAMIC SIDEBAR NAVIGATION PER ROLE */}
        <aside className={`w-64 text-slate-300 flex flex-col flex-shrink-0 select-none transition-colors duration-200 ${
          role === 'Admin' ? 'bg-[#0f172a]' : role === 'Agent' ? 'bg-[#12344D]' : 'bg-[#1b2a38]'
        }`}>
          <div className="p-4 border-b border-slate-700/50 flex items-center space-x-3">
            <div className="relative">
              <img 
                src={
                  role === 'Admin' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' :
                  role === 'Agent' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' :
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                } 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-teal-400 object-cover" 
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                role === 'Admin' ? 'bg-purple-500' : role === 'Agent' ? 'bg-blue-500' : 'bg-emerald-500'
              }`}></span>
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">
                {role === 'Admin' ? 'Budi Santoso' : role === 'Agent' ? 'Siti Rahma' : 'Budi Sales'}
              </p>
              <p className="text-xs text-teal-300">
                {role === 'Admin' ? 'Administrator IT' : role === 'Agent' ? 'L1 Support Agent' : 'User (General Office)'}
              </p>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {/* ROLE: REQUESTER (USER) SIDEBAR */}
            {role === 'Requester' && (
              <>
                <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">User Menu</div>
                
                <button
                  onClick={() => setActiveTab('requester_portal')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'requester_portal' ? 'bg-teal-600 text-white font-semibold shadow-md' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <LifeBuoy className="w-4 h-4" />
                  <span>Portal Bantuan</span>
                </button>

                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'inbox' ? 'bg-teal-600 text-white font-semibold shadow-md' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  <span>Tiket Saya</span>
                  <span className="ml-auto bg-slate-900/60 px-2 py-0.5 rounded-full text-xs font-bold text-teal-300">
                    {tickets.filter(t => t.requester.name.includes('budi.sales')).length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('kb')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'kb' ? 'bg-teal-600 text-white font-semibold shadow-md' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Pusat Solusi Mandiri</span>
                </button>
              </>
            )}

            {/* ROLE: AGENT SIDEBAR */}
            {role === 'Agent' && (
              <>
                <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">Workbench Agen</div>
                
                <button
                  onClick={() => { setActiveTab('inbox'); setFilterTab('my_tickets'); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'inbox' && filterTab === 'my_tickets' ? 'bg-teal-600 text-white font-semibold shadow-md' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  <span>Tiket Ditugaskan Ke Saya</span>
                  <span className="ml-auto bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded-full text-xs font-bold">
                    {tickets.filter(t => t.assignedAgent === currentAgentName).length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('inbox'); setFilterTab('all'); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'inbox' && filterTab !== 'my_tickets' ? 'bg-teal-600 text-white font-semibold shadow-md' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  <span>Semua Inbound Tiket</span>
                  <span className="ml-auto bg-slate-900/60 px-2 py-0.5 rounded-full text-xs font-bold text-teal-300">
                    {tickets.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('kb')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'kb' ? 'bg-teal-600 text-white font-semibold shadow-md' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Canned & KB Internal</span>
                </button>
              </>
            )}

            {/* ROLE: ADMIN IT SIDEBAR */}
            {role === 'Admin' && (
              <>
                <div className="px-3 text-[10px] font-bold tracking-wider text-purple-300 uppercase mb-1">Manajemen Admin</div>
                
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'inbox' ? 'bg-purple-600 text-white font-semibold shadow-md' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  <span>Kelola Tiket Desk</span>
                  <span className="ml-auto bg-purple-900/60 px-2 py-0.5 rounded-full text-xs font-bold text-purple-200">
                    {tickets.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'analytics' ? 'bg-purple-600 text-white font-semibold shadow-md' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Analitik & KPI Team</span>
                </button>

                <button
                  onClick={() => setActiveTab('team')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'team' ? 'bg-purple-600 text-white font-semibold shadow-md' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Tim & Beban Agen</span>
                </button>

                <button
                  onClick={() => setActiveTab('sla')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'sla' ? 'bg-purple-600 text-white font-semibold shadow-md' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Aturan SLA & Otomasi</span>
                </button>

                <button
                  onClick={() => setActiveTab('kb')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'kb' ? 'bg-purple-600 text-white font-semibold shadow-md' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Knowledge Base</span>
                </button>
              </>
            )}
          </nav>

          <div className="p-3 border-t border-slate-700/50 text-xs text-slate-400 text-center">
            PT. Nusantara Makmur Sejahtera
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* Role Mode Informational Banner */}
          <div className={`mb-4 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between border ${
            role === 'Admin' ? 'bg-purple-50 text-purple-900 border-purple-200 dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-800' :
            role === 'Agent' ? 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-800' :
            'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800'
          }`}>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>Mode Tampilan: {role === 'Admin' ? 'Admin IT (Akses Penuh)' : role === 'Agent' ? `Agen Support (${currentAgentName})` : 'Pemohon (End User)'}</strong> — 
                {role === 'Admin' && ' Anda memiliki otoritas penuh untuk penetapan beban kerja agen, aksi bulk, dan analitik KPI.'}
                {role === 'Agent' && ' Fokus pada balasan tiket, penanganan insiden, dan penutupan tiket agen.'}
                {role === 'Requester' && ' Buat permohonan baru, pantau progres tiket pribadi, dan beri umpan balik CSAT.'}
              </span>
            </div>
            <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-wider opacity-75">Ganti role via header</span>
          </div>

          {/* ========================================================= */}
          {/* VIEW 1: CENTRALIZED TICKET INBOX WITH FULL BULK ACTIONS */}
          {/* ========================================================= */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              
              {/* Inbox Header & Quick Stats */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {role === 'Requester' ? 'Daftar Tiket Permohonan Saya' : role === 'Agent' ? 'Queue Tiket Support Agen' : 'Centralized Ticket Inbox'}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {role === 'Requester' ? 'Pantau status perbaikan dan permohonan layanan yang Anda ajukan.' : 'Kelola keluhan dari Email, WA, Telepon, Chat, dan Walk-in.'}
                  </p>
                </div>
              </div>

              {/* FILTER TABS & BULK ACTIONS BAR */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 space-y-4">
                
                {/* Upper Filter Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                    <button
                      onClick={() => setFilterTab('all')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${filterTab === 'all' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                    >
                      {role === 'Requester' ? 'Semua Tiket Saya' : 'Semua Tiket'} ({filteredTickets.length})
                    </button>

                    {role !== 'Requester' && (
                      <>
                        <button
                          onClick={() => setFilterTab('my_tickets')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${filterTab === 'my_tickets' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                        >
                          Ditugaskan ke Saya ({tickets.filter(t => t.assignedAgent === currentAgentName).length})
                        </button>
                        <button
                          onClick={() => setFilterTab('unassigned')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${filterTab === 'unassigned' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                        >
                          Belum Ditugaskan ({tickets.filter(t => !t.assignedAgent).length})
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setFilterTab('pending')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${filterTab === 'pending' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                    >
                      Pending ({tickets.filter(t => t.status === 'Pending').length})
                    </button>
                    <button
                      onClick={() => setFilterTab('resolved')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${filterTab === 'resolved' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                    >
                      Resolved ({tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length})
                    </button>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    Menampilkan {filteredTickets.length} tiket
                  </span>
                </div>

                {/* Dropdown Filters & Search */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="text-xs border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 outline-none"
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Open">Open</option>
                      <option value="Pending">Pending</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="text-xs border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Semua">Semua Prioritas</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>

                  <select
                    value={filterChannel}
                    onChange={(e) => setFilterChannel(e.target.value)}
                    className="text-xs border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Semua">Semua Channel Intake</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Portal Web">Portal Web</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Chat Portal">Chat Portal</option>
                  </select>
                </div>

                {/* INTERACTIVE BULK ACTION BAR (ONLY FOR ADMIN & AGENT) */}
                {selectedTicketIds.length > 0 && role !== 'Requester' && (
                  <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg border border-blue-200 dark:border-blue-800 animate-fadeIn">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                        {selectedTicketIds.length}
                      </span>
                      <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                        tiket dipilih
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {role === 'Admin' && (
                        <button
                          onClick={() => setBulkAssignModal(true)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold shadow-sm transition"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Tugaskan Agen</span>
                        </button>
                      )}

                      <button
                        onClick={() => setBulkStatusModal(true)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold shadow-sm transition"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ubah Status</span>
                      </button>

                      {role === 'Admin' && (
                        <button
                          onClick={() => setBulkDeleteModal(true)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Bulk</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* TICKET TABLE INBOX */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                        {role !== 'Requester' && (
                          <th className="p-3 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={selectedTicketIds.length === filteredTickets.length && filteredTickets.length > 0}
                              onChange={handleSelectAll}
                              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                            />
                          </th>
                        )}
                        <th className="p-3">ID Tiket</th>
                        <th className="p-3">Subjek & Kategori</th>
                        <th className="p-3">Channel</th>
                        <th className="p-3">Pemohon</th>
                        <th className="p-3">Prioritas</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Agen</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      {filteredTickets.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center py-12 text-slate-400">
                            Tidak ada tiket yang cocok dengan filter pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredTickets.map((t) => (
                          <tr
                            key={t.id}
                            className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition cursor-pointer ${
                              selectedTicketIds.includes(t.id) ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                            }`}
                          >
                            {role !== 'Requester' && (
                              <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={selectedTicketIds.includes(t.id)}
                                  onChange={() => handleSelectOne(t.id)}
                                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                                />
                              </td>
                            )}

                            <td
                              className="p-3 font-mono font-bold text-teal-600 dark:text-teal-400 hover:underline"
                              onClick={() => { setSelectedTicketId(t.id); setActiveTab('detail'); }}
                            >
                              #{t.id}
                            </td>

                            <td
                              className="p-3 max-w-xs"
                              onClick={() => { setSelectedTicketId(t.id); setActiveTab('detail'); }}
                            >
                              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{t.subject}</p>
                              <p className="text-xs text-slate-400">{t.category} • {t.type}</p>
                            </td>

                            <td className="p-3">
                              <span className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {t.channel === 'Email' && <Mail className="w-3 h-3 text-blue-500" />}
                                {t.channel === 'WhatsApp' && <Smartphone className="w-3 h-3 text-emerald-500" />}
                                {t.channel === 'Portal Web' && <Globe className="w-3 h-3 text-indigo-500" />}
                                {t.channel === 'Walk-in' && <User className="w-3 h-3 text-amber-500" />}
                                {t.channel === 'Chat Portal' && <MessageCircle className="w-3 h-3 text-teal-500" />}
                                <span>{t.channel}</span>
                              </span>
                            </td>

                            <td className="p-3">
                              <p className="text-xs font-semibold">{t.requester.name}</p>
                              <p className="text-[10px] text-slate-400">{t.requester.dept}</p>
                            </td>

                            <td className="p-3">{getPriorityBadge(t.priority)}</td>

                            <td className="p-3">{getStatusBadge(t.status)}</td>

                            <td className="p-3">
                              {t.assignedAgent ? (
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.assignedAgent}</span>
                              ) : (
                                <span className="text-xs italic text-amber-500 font-semibold">Belum Ada</span>
                              )}
                            </td>

                            <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => { setSelectedTicketId(t.id); setActiveTab('detail'); }}
                                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500"
                                title="Buka Detail Tiket"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: DUAL-PANE TICKET DETAIL VIEW */}
          {/* ========================================================= */}
          {activeTab === 'detail' && currentTicket && (
            <div className="space-y-4">
              {/* Back button */}
              <button
                onClick={() => setActiveTab('inbox')}
                className="flex items-center space-x-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali ke Inbox Tiket</span>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Pane: Conversation & Replies */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Ticket Main Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-mono font-bold text-teal-600">{currentTicket.id}</span>
                          {getStatusBadge(currentTicket.status)}
                          {getPriorityBadge(currentTicket.priority)}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{currentTicket.subject}</h2>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        <p>Dibuat: {new Date(currentTicket.createdAt).toLocaleString('id-ID')}</p>
                        <p className="text-emerald-600 font-semibold mt-0.5">SLA Response: Pass</p>
                      </div>
                    </div>

                    {/* Requester Profile Banner */}
                    <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                        {currentTicket.requester.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{currentTicket.requester.name}</p>
                        <p className="text-xs text-slate-500">{currentTicket.requester.email} • {currentTicket.requester.dept}</p>
                      </div>
                    </div>

                    {/* Original Issue Description */}
                    <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                      <p className="whitespace-pre-line">{currentTicket.description}</p>
                    </div>
                  </div>

                  {/* Conversation History */}
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-teal-600" />
                      <span>Riwayat Komunikasi & Catatan</span>
                    </h3>

                    {currentTicket.comments
                      .filter(c => role !== 'Requester' || !c.isInternal) // Requester hides internal notes
                      .map((comment) => (
                        <div
                          key={comment.id}
                          className={`p-4 rounded-xl border shadow-sm transition ${
                            comment.isInternal
                              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-700/40 pb-2 mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs">{comment.author}</span>
                              {comment.isInternal && (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full flex items-center space-x-1">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Catatan Internal</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] opacity-70">
                              {new Date(comment.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-line">{comment.text}</p>
                        </div>
                      ))}
                  </div>

                  {/* Reply Form (Dual Mode for Agents/Admins, Public for Users) */}
                  <ReplyFormBox
                    role={role}
                    cannedResponses={CANNED_RESPONSES}
                    onSendReply={(text, isInternal) => handleAddComment(currentTicket.id, text, isInternal)}
                  />
                </div>

                {/* Right Pane: Editable Ticket Properties */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2">
                      Properti Tiket
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Status Tiket</label>
                        {role === 'Requester' ? (
                          <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">{getStatusBadge(currentTicket.status)}</div>
                        ) : (
                          <select
                            value={currentTicket.status}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTickets(prev => prev.map(t => t.id === currentTicket.id ? { ...t, status: val } : t));
                              showToast(`Status diperbarui ke ${val}`);
                            }}
                            className="w-full text-xs font-semibold p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 outline-none"
                          >
                            <option value="Open">Open</option>
                            <option value="Pending">Pending</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                          </select>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Tugaskan Agen</label>
                        {role === 'Admin' ? (
                          <select
                            value={currentTicket.assignedAgent || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTickets(prev => prev.map(t => t.id === currentTicket.id ? { ...t, assignedAgent: val } : t));
                              showToast(`Tiket ditugaskan ke ${val}`);
                            }}
                            className="w-full text-xs font-semibold p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 outline-none"
                          >
                            <option value="">-- Pilih Agen --</option>
                            {INITIAL_AGENTS.map(ag => (
                              <option key={ag.id} value={ag.name}>{ag.name} ({ag.role})</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={currentTicket.assignedAgent || 'Belum Ditugaskan'}
                            readOnly
                            className="w-full text-xs font-semibold p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                          />
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Prioritas</label>
                        {role === 'Admin' || role === 'Agent' ? (
                          <select
                            value={currentTicket.priority}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTickets(prev => prev.map(t => t.id === currentTicket.id ? { ...t, priority: val } : t));
                              showToast(`Prioritas diubah ke ${val}`);
                            }}
                            className="w-full text-xs font-semibold p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 outline-none"
                          >
                            <option value="Urgent">Urgent</option>
                            <option value="Tinggi">Tinggi</option>
                            <option value="Sedang">Sedang</option>
                            <option value="Rendah">Rendah</option>
                          </select>
                        ) : (
                          <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">{getPriorityBadge(currentTicket.priority)}</div>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Kategori</label>
                        <input
                          type="text"
                          value={currentTicket.category}
                          readOnly
                          className="w-full text-xs font-semibold p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Audit Timeline */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2">
                      Audit Timeline
                    </h3>
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {currentTicket.timeline.map((item) => (
                        <div key={item.id} className="text-xs flex items-start space-x-2 border-l-2 border-teal-500 pl-2 py-1">
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{item.action}</p>
                            <p className="text-[10px] text-slate-400">{item.user} • {item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: SERVICE PORTAL FOR REQUESTERS */}
          {/* ========================================================= */}
          {activeTab === 'requester_portal' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-teal-700 to-slate-800 rounded-2xl p-8 text-white text-center shadow-lg space-y-4">
                <h1 className="text-3xl font-extrabold">Bagaimana kami dapat membantu Anda hari ini?</h1>
                <p className="text-teal-100 text-sm max-w-xl mx-auto">Cari solusi masalah teknis di Knowledge Base kami atau buat tiket bantuan baru secara langsung.</p>
                <div className="max-w-lg mx-auto relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ketik kata kunci masalah (misal: Wi-Fi, VPN, Printer)..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none shadow-md"
                  />
                </div>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setNewTicketModal(true)}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md cursor-pointer transition text-center space-y-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Buat Tiket Layanan</h3>
                  <p className="text-xs text-slate-500">Laporkan insiden atau minta perangkat keras/lunak baru.</p>
                </div>

                <div
                  onClick={() => setActiveTab('kb')}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md cursor-pointer transition text-center space-y-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Panduan & Artikel</h3>
                  <p className="text-xs text-slate-500">Buka panduan solusi mandiri untuk kendala umum IT kantor.</p>
                </div>

                <div
                  onClick={() => setActiveTab('inbox')}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md cursor-pointer transition text-center space-y-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Status Tiket Saya</h3>
                  <p className="text-xs text-slate-500">Pantau perkembangan penyelesaian tiket yang Anda ajukan.</p>
                </div>
              </div>

              {/* Interactive CSAT Rating Demo */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white">Beri Penilaian Layanan CSAT (Demo Tiket #TKT-1025)</h3>
                <p className="text-xs text-slate-500">Seberapa puas Anda dengan penyelesaian masalah database produksi baru-baru ini?</p>
                <div className="flex space-x-2 pt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => showToast(`Terima kasih! Anda memberikan rating CSAT ${star} Bintang.`)}
                      className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-950 rounded-lg text-amber-400 transition"
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 4: DASHBOARD ANALYTICS WITH RECHARTS (ADMIN ONLY) */}
          {/* ========================================================= */}
          {activeTab === 'analytics' && role === 'Admin' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Analytics & Performa SLA</h1>
                <p className="text-sm text-slate-500">Visualisasi metrik Helpdesk, kepatuhan SLA, dan tren insiden real-time.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p className="text-xs text-slate-500 font-semibold">Total Tiket Masuk</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">128</p>
                  <p className="text-xs text-emerald-600 font-bold mt-1">↑ +14% minggu ini</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p className="text-xs text-slate-500 font-semibold">Kepatuhan SLA Respons</p>
                  <p className="text-3xl font-black text-teal-600 mt-1">96.4%</p>
                  <p className="text-xs text-slate-400 mt-1">Target: &gt;95%</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p className="text-xs text-slate-500 font-semibold">Rata-rata Waktu Resolusi</p>
                  <p className="text-3xl font-black text-indigo-600 mt-1">2.4 jam</p>
                  <p className="text-xs text-emerald-600 font-bold mt-1">↓ -30m lebih cepat</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p className="text-xs text-slate-500 font-semibold">Skor CSAT</p>
                  <p className="text-3xl font-black text-amber-500 mt-1">4.85 / 5</p>
                  <p className="text-xs text-slate-400 mt-1">Berdasarkan 42 responden</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volume Trend Line Chart */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Volume Tiket Masuk vs Penyelesaian (7 Hari Terakhir)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { day: 'Sen', masuk: 18, selesai: 16 },
                        { day: 'Sel', masuk: 25, selesai: 22 },
                        { day: 'Rab', masuk: 30, selesai: 28 },
                        { day: 'Kam', masuk: 22, selesai: 24 },
                        { day: 'Jum', masuk: 20, selesai: 19 },
                        { day: 'Sab', masuk: 8, selesai: 9 },
                        { day: 'Min', masuk: 5, selesai: 6 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="masuk" stroke="#3b82f6" strokeWidth={2} name="Tiket Masuk" />
                        <Line type="monotone" dataKey="selesai" stroke="#10b981" strokeWidth={2} name="Diselesaikan" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Channel Donut Chart */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Persentase Tiket per Channel Intake</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Email Webhook', value: 45 },
                            { name: 'WhatsApp', value: 30 },
                            { name: 'Portal Web', value: 15 },
                            { name: 'Walk-in / Phone', value: 10 }
                          ]}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#0088FE" />
                          <Cell fill="#00C49F" />
                          <Cell fill="#FFBB28" />
                          <Cell fill="#FF8042" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 5: KNOWLEDGE BASE (KB) */}
          {/* ========================================================= */}
          {activeTab === 'kb' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Knowledge Base (Pusat Pengetahuan)</h1>
                  <p className="text-sm text-slate-500">Kumpulan artikel solusi teknis mandiri untuk pengguna & agen.</p>
                </div>
                {role !== 'Requester' && (
                  <button
                    onClick={() => showToast('Form artikel baru dibuka')}
                    className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    + Artikel Baru
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {KB_ARTICLES.map((art) => (
                  <div key={art.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                    <span className="text-[10px] font-bold text-teal-600 uppercase bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                      {art.category}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{art.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{art.content}</p>
                    <div className="flex items-center justify-between pt-2 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-700">
                      <span>{art.reads} Pembaca</span>
                      <div className="flex space-x-2">
                        <button onClick={() => showToast('Umpan balik tersimpan')} className="hover:text-emerald-500">👍 {art.helpful}</button>
                        <button onClick={() => showToast('Umpan balik tersimpan')} className="hover:text-red-500">👎 {art.unhelpful}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 6: SLA & AUTOMATION RULES */}
          {/* ========================================================= */}
          {activeTab === 'sla' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SLA & Otomasi Tiket</h1>
                <p className="text-sm text-slate-500">Matriks target tenggat waktu respons dan penyelesaian PT. Nusantara Makmur Sejahtera.</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="p-3">Matriks Prioritas</th>
                      <th className="p-3">Target Respon Pertama</th>
                      <th className="p-3">Target Penyelesaian</th>
                      <th className="p-3">Eskalasi Otomatis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    <tr>
                      <td className="p-3 font-bold text-red-600">Urgent</td>
                      <td className="p-3">15 Menit</td>
                      <td className="p-3">4 Jam</td>
                      <td className="p-3 text-xs">Email ke Lead Engineer jika &gt; 2 jam</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-orange-600">Tinggi</td>
                      <td className="p-3">1 Jam</td>
                      <td className="p-3">8 Jam</td>
                      <td className="p-3 text-xs">Notifikasi Slack ke Agen</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-sky-600">Sedang</td>
                      <td className="p-3">4 Jam</td>
                      <td className="p-3">24 Jam</td>
                      <td className="p-3 text-xs">Pengingat harian</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-600">Rendah</td>
                      <td className="p-3">8 Jam</td>
                      <td className="p-3">48 Jam</td>
                      <td className="p-3 text-xs">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 7: TEAM WORKLOAD MANAGER (ADMIN ONLY) */}
          {/* ========================================================= */}
          {activeTab === 'team' && role === 'Admin' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kelola Tim & Beban kerja Agen</h1>
                  <p className="text-sm text-slate-500">Distribusi tiket aktif per anggota tim IT Support.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_AGENTS.map((ag) => (
                  <div key={ag.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={ag.avatar} alt={ag.name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-500" />
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">{ag.name}</h3>
                        <p className="text-xs text-slate-400">{ag.role} • {ag.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-teal-600">{ag.openTickets}</span>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Tiket Aktif</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: INTERACTIVE BULK TUGASKAN AGEN */}
      {/* ========================================================= */}
      {bulkAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-teal-600" />
                <span>Tugaskan Agen (Bulk Action)</span>
              </h3>
              <button onClick={() => setBulkAssignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pilih agen yang akan ditugaskan untuk <strong className="text-slate-800 dark:text-slate-200">{selectedTicketIds.length} tiket</strong> terpilih:
            </p>

            <select
              value={targetAgent}
              onChange={(e) => setTargetAgent(e.target.value)}
              className="w-full text-sm font-semibold p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 outline-none"
            >
              <option value="">-- Pilih Agen Support --</option>
              {INITIAL_AGENTS.map((ag) => (
                <option key={ag.id} value={ag.name}>{ag.name} ({ag.role})</option>
              ))}
            </select>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                onClick={() => setBulkAssignModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={executeBulkAssign}
                disabled={!targetAgent}
                className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg shadow-sm transition"
              >
                Konfirmasi Penugasan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: INTERACTIVE BULK UBAH STATUS */}
      {/* ========================================================= */}
      {bulkStatusModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-teal-600" />
                <span>Ubah Status Tiket (Bulk Action)</span>
              </h3>
              <button onClick={() => setBulkStatusModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pilih status baru yang akan diterapkan pada <strong className="text-slate-800 dark:text-slate-200">{selectedTicketIds.length} tiket</strong> terpilih:
            </p>

            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value)}
              className="w-full text-sm font-semibold p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 outline-none"
            >
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                onClick={() => setBulkStatusModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={executeBulkStatus}
                className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm transition"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: INTERACTIVE BULK HAPUS KONFIRMASI */}
      {/* ========================================================= */}
      {bulkDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700 animate-fadeIn">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="w-7 h-7 flex-shrink-0" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Konfirmasi Hapus Tiket Bulk</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong className="text-red-600">{selectedTicketIds.length} tiket</strong> terpilih? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setBulkDeleteModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={executeBulkDelete}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition"
              >
                Ya, Hapus Permanent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: BUAT TIKET BARU (MANUAL INTAKE FORM) */}
      {/* ========================================================= */}
      {newTicketModal && (
        <CreateTicketModal
          onClose={() => setNewTicketModal(false)}
          onSubmit={handleCreateTicket}
          agents={INITIAL_AGENTS}
          role={role}
        />
      )}

    </div>
  );
}

// --- SUB-COMPONENT 1: REPLY & INTERNAL NOTE BOX ---
function ReplyFormBox({ role, cannedResponses, onSendReply }) {
  const [replyMode, setReplyMode] = useState('public'); // public vs internal
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSendReply(text, replyMode === 'internal');
    setText('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3">
      {/* Mode Selector Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setReplyMode('public')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              replyMode === 'public'
                ? 'bg-teal-600 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Balasan Publik
          </button>
          
          {role !== 'Requester' && (
            <button
              onClick={() => setReplyMode('internal')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center space-x-1 ${
                replyMode === 'internal'
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Catatan Internal (Yellow Note)</span>
            </button>
          )}
        </div>

        {/* Canned Responses Dropdown for Agents/Admins */}
        {role !== 'Requester' && (
          <select
            onChange={(e) => {
              if (e.target.value) {
                const item = cannedResponses.find(c => c.id === e.target.value);
                if (item) setText(prev => prev + (prev ? '\n' : '') + item.content);
              }
            }}
            className="text-xs bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 outline-none"
          >
            <option value="">+ Sisipkan Canned Response</option>
            {cannedResponses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        )}
      </div>

      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          role === 'Requester' ? 'Tulis tanggapan atau informasi tambahan mengenai keluhan Anda...' :
          replyMode === 'public' ? 'Ketik balasan untuk pemohon...' : 'Ketik catatan internal yang hanya bisa dilihat tim IT Support...'
        }
        className={`w-full p-3 text-xs rounded-lg border outline-none transition ${
          replyMode === 'internal'
            ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 placeholder-amber-400'
            : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700'
        }`}
      />

      <div className="flex justify-end">
        <button
          onClick={handleSend}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition ${
            replyMode === 'internal' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{replyMode === 'internal' ? 'Simpan Catatan Internal' : 'Kirim Balasan'}</span>
        </button>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT 2: WEBHOOK TESTER SIMULATOR ---
function WebhookTester({ onSimulateSuccess }) {
  const [webhookType, setWebhookType] = useState('email');
  const [sender, setSender] = useState('karyawan.baru@company.com');
  const [subject, setSubject] = useState('[INBOUND EMAIL] Permintaan Akses Folder Shared Marketing');
  const [body, setBody] = useState('Halo IT, tolong tambahkan akun saya ke folder shared drive Marketing untuk project kuartal 4.');

  const handleRunSimulation = () => {
    onSimulateSuccess({
      channel: webhookType === 'email' ? 'Email' : 'WhatsApp',
      sender,
      subject,
      body
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-700 pb-3">
        <button
          onClick={() => {
            setWebhookType('email');
            setSubject('[INBOUND EMAIL] Permintaan Akses Folder Shared');
          }}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${webhookType === 'email' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}
        >
          Email Inbound Webhook (/api/inbound/email)
        </button>
        <button
          onClick={() => {
            setWebhookType('whatsapp');
            setSubject('[WHATSAPP] WhatsApp Emergency Helpdesk');
          }}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${webhookType === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}
        >
          WhatsApp Cloud API (/api/inbound/whatsapp)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="font-semibold text-slate-500 block mb-1">Pengirim (Sender ID)</label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="font-semibold text-slate-500 block mb-1">Subjek / Header</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="font-semibold text-slate-500 text-xs block mb-1">Isi Pesan (Body Payload)</label>
        <textarea
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900"
        />
      </div>

      <button
        onClick={handleRunSimulation}
        className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-teal-400 px-4 py-2 rounded-lg text-xs font-mono font-bold transition shadow"
      >
        <Play className="w-4 h-4" />
        <span>Jalankan Payload & Trigger Auto-Creation</span>
      </button>
    </div>
  );
}

// --- SUB-COMPONENT 3: CREATE TICKET MODAL ---
function CreateTicketModal({ onClose, onSubmit, agents, role }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hardware & Laptop');
  const [priority, setPriority] = useState('Sedang');
  const [channel, setChannel] = useState(role === 'Requester' ? 'Portal Web' : 'Walk-in');
  const [agent, setAgent] = useState('');
  const [requesterName, setRequesterName] = useState(role === 'Requester' ? 'budi.sales' : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !description) return;
    onSubmit({ subject, description, category, priority, channel, agent, requesterName });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700 animate-fadeIn my-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Buat Tiket Layanan Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Subjek Permasalahan *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Laptop mati total setelah update OS"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Channel Intake</label>
              <select
                value={channel}
                disabled={role === 'Requester'}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 disabled:opacity-75"
              >
                <option value="Portal Web">Portal Web</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Telepon">Telepon</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Kategori IT</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900"
              >
                <option value="Hardware & Laptop">Hardware & Laptop</option>
                <option value="Jaringan & Wi-Fi">Jaringan & Wi-Fi</option>
                <option value="Aplikasi & Software">Aplikasi & Software</option>
                <option value="Kebijakan IT">Kebijakan IT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900"
              >
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Nama Pemohon</label>
              <input
                type="text"
                readOnly={role === 'Requester'}
                placeholder="misal: andi.sales"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 read-only:bg-slate-100 dark:read-only:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Deskripsi Detail *</label>
            <textarea
              rows={4}
              required
              placeholder="Jelaskan langkah-langkah penyebab error dan kronologinya..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm transition"
            >
              Buat Tiket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}