import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  RefreshCw,
  Download,
  CheckCircle,
  XCircle,
  Search,
  Lock,
  KeyRound,
  LogOut,
  Image as ImageIcon,
  Users
} from 'lucide-react';
import { fetchAllRsvps, RsvpData } from '../lib/firebase';
import { AdminImgbbManager } from './AdminImgbbManager';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VALID_PASSWORDS = ['15ruby', 'ruby', 'ruby2026', 'admin123'];

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rsvps' | 'imgbb'>('rsvps');
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loadRsvps = async () => {
    setLoading(true);
    const data = await fetchAllRsvps();
    setRsvps(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && isAuthenticated && activeTab === 'rsvps') {
      loadRsvps();
    }
  }, [isOpen, isAuthenticated, activeTab]);

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (VALID_PASSWORDS.includes(password.trim().toLowerCase())) {
      setIsAuthenticated(true);
      setError('');
      setPassword('');
      loadRsvps();
    } else {
      setError('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRsvps([]);
    setPassword('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#0D0204]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {!isAuthenticated ? (
          /* Password Login Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-[#1E060B] border border-[#D4AF37]/30 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative my-auto text-center"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-[#B89B93] hover:text-[#FBF7F2] rounded-full bg-[#2E0C14] transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-[#24090F] border border-[#D4AF37]/40 rounded-xl flex items-center justify-center text-[#D4AF37] mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-display text-[#FBF7F2] font-semibold mb-1">
              Administración — XV de Ruby
            </h2>
            <p className="text-xs text-[#B89B93] mb-6 font-light">
              Ingresa la contraseña para gestionar confirmaciones de asistencia e imágenes en ImgBB.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <KeyRound className="w-5 h-5 text-[#B89B93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Contraseña de administración"
                  className="w-full bg-[#140407] border border-[#4A1822] rounded-xl pl-11 pr-4 py-3 text-sm text-[#FBF7F2] placeholder-[#B89B93]/50 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-xs text-[#F6E6B4] bg-[#3A0812] border border-[#C41E3A] py-2 px-3 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                id="login-admin-btn"
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#E8CE86] text-[#140407] font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Ingresar al Panel
              </button>
            </form>
          </motion.div>
        ) : (
          /* Admin Dashboard Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-[#1E060B] border border-[#D4AF37]/30 rounded-2xl w-full max-w-5xl p-5 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/15">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#24090F] text-[#D4AF37] rounded-xl border border-[#D4AF37]/35">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-display text-[#FBF7F2] font-semibold">
                    Panel de Administración — XV de Ruby
                  </h2>
                  <p className="text-xs text-[#B89B93] font-light">
                    Confirmaciones de asistencia y gestión de galería en ImgBB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Cerrar Sesión"
                  className="p-2 text-[#E8D5CE] hover:text-[#E8CE86] rounded-lg bg-[#24090F] border border-[#4A1822] transition-colors flex items-center gap-1.5 text-xs px-3 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 text-[#B89B93] hover:text-[#FBF7F2] rounded-lg bg-[#24090F] border border-[#4A1822] transition-colors cursor-pointer"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 pt-4 pb-3 border-b border-[#D4AF37]/15">
              <button
                type="button"
                onClick={() => setActiveTab('rsvps')}
                id="admin-tab-rsvps"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'rsvps'
                    ? 'bg-[#D4AF37] text-[#140407] font-semibold'
                    : 'bg-[#140407] text-[#E8D5CE] border border-[#4A1822] hover:border-[#D4AF37]/40'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Confirmaciones ({rsvps.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('imgbb')}
                id="admin-tab-imgbb"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'imgbb'
                    ? 'bg-[#D4AF37] text-[#140407] font-semibold'
                    : 'bg-[#140407] text-[#E8D5CE] border border-[#4A1822] hover:border-[#D4AF37]/40'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Gestor de Imágenes ImgBB</span>
              </button>
            </div>

            {/* Tab 1: ImgBB Image Manager */}
            {activeTab === 'imgbb' && (
              <div className="pt-4 flex-1 flex flex-col overflow-hidden">
                <AdminImgbbManager />
              </div>
            )}

            {/* Tab 2: RSVP Management */}
            {activeTab === 'rsvps' &&
              (() => {
                const totalConfirmedHeadcount = rsvps
                  .filter((r) => r.attendance === 'yes')
                  .reduce((acc, curr) => acc + (curr.guestsCount || 1), 0);

                const totalAttendingResponses = rsvps.filter((r) => r.attendance === 'yes').length;
                const totalDeclinedResponses = rsvps.filter((r) => r.attendance === 'no').length;

                const filteredRsvps = rsvps.filter(
                  (r) =>
                    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (r.message && r.message.toLowerCase().includes(searchTerm.toLowerCase()))
                );

                const exportToCsv = () => {
                  const headers = ['Nombre', 'Asistencia', 'Pases/Personas', 'Mensaje', 'Fecha'];
                  const rows = rsvps.map((r) => [
                    `"${r.name}"`,
                    r.attendance === 'yes' ? 'SÍ' : 'NO',
                    r.guestsCount || 0,
                    `"${r.message || ''}"`,
                    `"${r.createdAt}"`
                  ]);

                  const csvContent =
                    'data:text/csv;charset=utf-8,' +
                    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement('a');
                  link.setAttribute('href', encodedUri);
                  link.setAttribute(
                    'download',
                    `Confirmaciones_XV_Ruby_${new Date().toISOString().slice(0, 10)}.csv`
                  );
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                };

                return (
                  <div className="pt-4 flex-1 flex flex-col overflow-hidden space-y-4">
                    {/* KPI Summary */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#140407] p-4 rounded-xl border border-[#4A1822] text-center">
                        <span className="text-[11px] text-[#B89B93] uppercase tracking-wider block mb-0.5">
                          Pases Confirmados
                        </span>
                        <span className="text-2xl sm:text-3xl font-display text-[#E8CE86] font-semibold tabular-nums">
                          {totalConfirmedHeadcount}
                        </span>
                      </div>

                      <div className="bg-[#140407] p-4 rounded-xl border border-[#4A1822] text-center">
                        <span className="text-[11px] text-[#B89B93] uppercase tracking-wider block mb-0.5">
                          Asistirán
                        </span>
                        <span className="text-2xl sm:text-3xl font-display text-emerald-400 font-semibold tabular-nums">
                          {totalAttendingResponses}
                        </span>
                      </div>

                      <div className="bg-[#140407] p-4 rounded-xl border border-[#4A1822] text-center">
                        <span className="text-[11px] text-[#B89B93] uppercase tracking-wider block mb-0.5">
                          Declinaron
                        </span>
                        <span className="text-2xl sm:text-3xl font-display text-rose-400 font-semibold tabular-nums">
                          {totalDeclinedResponses}
                        </span>
                      </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-[#B89B93] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Buscar por nombre..."
                          className="w-full bg-[#140407] border border-[#4A1822] rounded-xl pl-9 pr-4 py-2 text-xs text-[#FBF7F2] placeholder-[#B89B93]/60 focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={loadRsvps}
                          disabled={loading}
                          className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#24090F] hover:bg-[#2E0C14] text-[#FBF7F2] text-xs rounded-xl border border-[#4A1822] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 text-[#D4AF37] ${loading ? 'animate-spin' : ''}`}
                          />
                          <span>Actualizar</span>
                        </button>

                        <button
                          type="button"
                          onClick={exportToCsv}
                          className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#D4AF37] hover:bg-[#E8CE86] text-[#140407] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Exportar CSV</span>
                        </button>
                      </div>
                    </div>

                    {/* RSVPs Table */}
                    <div className="overflow-x-auto flex-1 border border-[#4A1822] rounded-xl bg-[#140407]">
                      <table className="w-full text-left text-xs text-[#E8D5CE]">
                        <thead className="bg-[#24090F] uppercase text-[10px] text-[#E8CE86] font-semibold tracking-wider sticky top-0">
                          <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Estatus</th>
                            <th className="p-3">Pases</th>
                            <th className="p-3">Mensaje</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#4A1822]/50">
                          {filteredRsvps.length > 0 ? (
                            filteredRsvps.map((rsvp, idx) => (
                              <tr
                                key={`rsvp-${rsvp.id || 'entry'}-${idx}`}
                                className="hover:bg-[#24090F]/50 transition-colors"
                              >
                                <td className="p-3 font-medium text-[#FBF7F2]">{rsvp.name}</td>
                                <td className="p-3">
                                  {rsvp.attendance === 'yes' ? (
                                    <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                                      <CheckCircle className="w-3.5 h-3.5" /> Asistirá
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                                      <XCircle className="w-3.5 h-3.5" /> Declinó
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 tabular-nums">
                                  {rsvp.attendance === 'yes' ? rsvp.guestsCount : 0}
                                </td>
                                <td className="p-3 text-[#B89B93] max-w-[260px] truncate">
                                  {rsvp.message || '—'}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="p-6 text-center text-[#B89B93] italic">
                                {loading
                                  ? 'Cargando confirmaciones...'
                                  : 'Aún no hay confirmaciones registradas.'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
