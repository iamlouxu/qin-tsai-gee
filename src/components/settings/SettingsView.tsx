import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Pencil,
  Wallet,
  Link2,
  Globe,
  History,
  HelpCircle,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  Check,
  Copy,
  Sparkles,
  X,
  Heart,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { Ledger, Transaction, UserProfile } from '../../types';
import { currentUser, partnerUser } from '../../data/mockData';

interface SettingsViewProps {
  currentLedger: Ledger;
  ledgers: Ledger[];
  onSelectLedger: (ledger: Ledger) => void;
  transactions: Transaction[];
  onResetData?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentLedger,
  ledgers,
  onSelectLedger,
  transactions,
  onResetData,
}) => {
  const navigate = useNavigate();

  // Active Modals state
  const [activeModal, setActiveModal] = useState<
    'wallet' | 'invite' | 'currency' | 'history' | 'about' | 'logout' | 'notification' | null
  >(null);

  // User Profile edit state
  const [userProfile, setUserProfile] = useState<UserProfile>(currentUser);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempEmail, setTempEmail] = useState(userProfile.email || '');

  // Currency State
  const [selectedCurrency, setSelectedCurrency] = useState<'TWD' | 'USD' | 'JPY'>('TWD');

  // Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Copy Invite Link
  const handleCopyInviteLink = () => {
    const inviteLink = 'https://qintsaigee.app/invite/WED-2026-LOVE';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink);
    }
    showToast('已複製伴侶邀請連結！發送給另一半即可加入共同帳本 💍');
  };

  // Export JSON Backup
  const handleExportData = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ currentLedger, transactions }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `qintsaigee_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('收支資料已成功打包匯出！💾');
    setActiveModal(null);
  };

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      ...userProfile,
      name: tempName,
      email: tempEmail,
    });
    setIsEditingProfile(false);
    showToast('個人資料已成功更新 ✨');
  };

  return (
    <div className="space-y-4 mb-28 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-glow-pink flex items-center space-x-2 animate-in fade-in slide-in-from-top-3 duration-200 max-w-[360px] text-center">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Bar matching reference screenshot */}
      <div className="flex items-center justify-between pt-1 pb-2">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="返回首頁"
          className="w-11 h-11 rounded-full bg-white shadow-2xs border border-rose-100/70 flex items-center justify-center text-slate-700 hover:bg-rose-50/50 active:scale-90 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Title */}
        <h1 className="font-display font-extrabold text-[22px] tracking-tight text-slate-900 select-none">
          Profile
        </h1>

        {/* Notification Bell Button */}
        <button
          type="button"
          onClick={() => setActiveModal('notification')}
          aria-label="查看通知"
          className="w-11 h-11 rounded-full bg-white shadow-2xs border border-rose-100/70 flex items-center justify-center text-slate-700 hover:bg-rose-50/50 active:scale-90 transition-all relative cursor-pointer"
        >
          <Bell className="w-5 h-5 stroke-[2.2]" />
          {/* Green Active Dot matching screenshot */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>
      </div>

      {/* 2. User Profile Card matching reference screenshot */}
      <div className="bg-white/95 rounded-3xl p-4.5 sm:p-5 border border-rose-100/70 shadow-[0_4px_24px_-4px_rgba(244,63,94,0.06)] flex items-center justify-between transition-all">
        <div className="flex items-center space-x-3.5 overflow-hidden">
          {/* Avatar with soft border */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-2xs bg-rose-100/70 flex items-center justify-center">
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl select-none">👦</span>
            )}
          </div>

          {/* User Details */}
          <div className="truncate">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-base leading-tight truncate">
                {userProfile.name}
              </span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
                {userProfile.role || '建立者'}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-normal truncate mt-1">
              {userProfile.email || 'peijie.hong@example.com'}
            </div>
            {currentLedger.type === 'shared' && (
              <div className="flex items-center space-x-1 text-[11px] font-semibold text-rose-500 mt-1">
                <span>💍 已連線伴侶：{partnerUser.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => {
            setTempName(userProfile.name);
            setTempEmail(userProfile.email || '');
            setIsEditingProfile(true);
          }}
          aria-label="編輯個人資訊"
          className="w-9 h-9 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors shrink-0 active:scale-95 cursor-pointer ml-2"
        >
          <Pencil className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* 3. Independent Floating Capsule Menu List matching screenshot */}
      <div className="space-y-3 pt-1">
        {/* Item 1: Wallet (帳本切換與管理) */}
        <button
          type="button"
          onClick={() => setActiveModal('wallet')}
          className="w-full bg-white/95 rounded-full py-3.5 px-4 sm:px-5 border border-rose-100/70 shadow-[0_2px_10px_rgba(244,63,94,0.03)] hover:shadow-[0_4px_16px_rgba(244,63,94,0.06)] flex items-center justify-between transition-all duration-150 active:scale-[0.985] cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-full bg-slate-100/90 border border-slate-200/60 flex items-center justify-center shrink-0 text-slate-800 shadow-2xs">
              <Wallet className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-bold text-slate-800 text-[15px] tracking-tight">
              Wallet
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-400">
            <span className="text-xs font-semibold text-rose-500 bg-rose-50/80 px-2 py-0.5 rounded-full border border-rose-100/60">
              {currentLedger.name}
            </span>
            <ChevronRight className="w-4 h-4 stroke-[2.2]" />
          </div>
        </button>

        {/* Item 2: Copy invited link (複製伴侶邀請連結) */}
        <button
          type="button"
          onClick={() => setActiveModal('invite')}
          className="w-full bg-white/95 rounded-full py-3.5 px-4 sm:px-5 border border-rose-100/70 shadow-[0_2px_10px_rgba(244,63,94,0.03)] hover:shadow-[0_4px_16px_rgba(244,63,94,0.06)] flex items-center justify-between transition-all duration-150 active:scale-[0.985] cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-full bg-slate-100/90 border border-slate-200/60 flex items-center justify-center shrink-0 text-slate-800 shadow-2xs">
              <Link2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-bold text-slate-800 text-[15px] tracking-tight">
              Copy invited link
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2.2]" />
        </button>

        {/* Item 3: Language (幣別與語言設定) */}
        <button
          type="button"
          onClick={() => setActiveModal('currency')}
          className="w-full bg-white/95 rounded-full py-3.5 px-4 sm:px-5 border border-rose-100/70 shadow-[0_2px_10px_rgba(244,63,94,0.03)] hover:shadow-[0_4px_16px_rgba(244,63,94,0.06)] flex items-center justify-between transition-all duration-150 active:scale-[0.985] cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-full bg-slate-100/90 border border-slate-200/60 flex items-center justify-center shrink-0 text-slate-800 shadow-2xs">
              <Globe className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-bold text-slate-800 text-[15px] tracking-tight">
              Language
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-400">
            <span className="text-xs font-medium text-slate-400">
              {selectedCurrency === 'TWD' ? '繁體中文 (NT$)' : selectedCurrency}
            </span>
            <ChevronRight className="w-4 h-4 stroke-[2.2]" />
          </div>
        </button>

        {/* Item 4: Check history (資料備份與歷史匯出) */}
        <button
          type="button"
          onClick={() => setActiveModal('history')}
          className="w-full bg-white/95 rounded-full py-3.5 px-4 sm:px-5 border border-rose-100/70 shadow-[0_2px_10px_rgba(244,63,94,0.03)] hover:shadow-[0_4px_16px_rgba(244,63,94,0.06)] flex items-center justify-between transition-all duration-150 active:scale-[0.985] cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-full bg-slate-100/90 border border-slate-200/60 flex items-center justify-center shrink-0 text-slate-800 shadow-2xs">
              <History className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-bold text-slate-800 text-[15px] tracking-tight">
              Check history
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2.2]" />
        </button>

        {/* Item 5: Help center (關於 🌸 沁菜記) */}
        <button
          type="button"
          onClick={() => setActiveModal('about')}
          className="w-full bg-white/95 rounded-full py-3.5 px-4 sm:px-5 border border-rose-100/70 shadow-[0_2px_10px_rgba(244,63,94,0.03)] hover:shadow-[0_4px_16px_rgba(244,63,94,0.06)] flex items-center justify-between transition-all duration-150 active:scale-[0.985] cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-full bg-slate-100/90 border border-slate-200/60 flex items-center justify-center shrink-0 text-slate-800 shadow-2xs">
              <HelpCircle className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-bold text-slate-800 text-[15px] tracking-tight">
              Help center
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-400">
            <span className="text-[11px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
              v1.0.0
            </span>
            <ChevronRight className="w-4 h-4 stroke-[2.2]" />
          </div>
        </button>

        {/* Item 6: Settings (前往目標與預算管理) */}
        <button
          type="button"
          onClick={() => navigate('/goals')}
          className="w-full bg-white/95 rounded-full py-3.5 px-4 sm:px-5 border border-rose-100/70 shadow-[0_2px_10px_rgba(244,63,94,0.03)] hover:shadow-[0_4px_16px_rgba(244,63,94,0.06)] flex items-center justify-between transition-all duration-150 active:scale-[0.985] cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-full bg-slate-100/90 border border-slate-200/60 flex items-center justify-center shrink-0 text-slate-800 shadow-2xs">
              <SettingsIcon className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-bold text-slate-800 text-[15px] tracking-tight">
              Settings
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2.2]" />
        </button>

        {/* Item 7: Logout (重置資料與登出) */}
        <button
          type="button"
          onClick={() => setActiveModal('logout')}
          className="w-full bg-white/95 rounded-full py-3.5 px-4 sm:px-5 border border-rose-100/70 shadow-[0_2px_10px_rgba(244,63,94,0.03)] hover:shadow-[0_4px_16px_rgba(244,63,94,0.06)] flex items-center justify-between transition-all duration-150 active:scale-[0.985] cursor-pointer group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-500 shadow-2xs group-hover:bg-rose-100 transition-colors">
              <LogOut className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-bold text-rose-600 text-[15px] tracking-tight">
              Logout
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400 stroke-[2.2]" />
        </button>
      </div>

      {/* ================= MODALS & DIALOGS ================= */}

      {/* Modal 1: Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-rose-100 shadow-soft-pink">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">編輯個人資訊</h3>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  暱稱
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-rose-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  電子信箱
                </label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-rose-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-2.5 rounded-xl shadow-glow-pink mt-2 active:scale-95 transition-all text-sm"
              >
                儲存變更
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Wallet / Ledger Management */}
      {activeModal === 'wallet' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-rose-100 shadow-soft-pink space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-base">切換與管理帳本</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {ledgers.map((l) => {
                const isSelected = l.id === currentLedger.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      onSelectLedger(l);
                      setActiveModal(null);
                      showToast(`已切換至「${l.name}」✨`);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-rose-50/80 border-rose-400 text-rose-950 shadow-2xs'
                        : 'bg-slate-50/80 border-slate-100 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm flex items-center space-x-1.5">
                        <span>{l.type === 'shared' ? '💍' : '👤'}</span>
                        <span>{l.name}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {l.type === 'shared' ? '與伴侶共同記帳' : '個人日常專屬記帳'}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-rose-600 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Copy Invited Link */}
      {activeModal === 'invite' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-rose-100 shadow-soft-pink space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100/80 text-rose-500 mx-auto flex items-center justify-center">
              <Heart className="w-6 h-6 stroke-[2.2] fill-rose-500/20" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-lg">邀請另一半共同記帳</h3>
              <p className="text-xs text-slate-400 mt-1 px-4 leading-relaxed">
                將專屬邀請碼發送給伴侶，登入後即可即時同步結婚基金與共同開銷。
              </p>
            </div>

            {/* Invite Code Box */}
            <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="text-left pl-1">
                <div className="text-[10px] font-bold text-rose-500 tracking-wider">
                  專屬邀請碼
                </div>
                <div className="font-display font-extrabold text-lg text-rose-950 tracking-wider">
                  WED-2026-LOVE
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs flex items-center space-x-1 active:scale-95 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>複製</span>
              </button>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Language & Currency */}
      {activeModal === 'currency' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-rose-100 shadow-soft-pink space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-base">幣別與語言設定</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { code: 'TWD', name: '新台幣 (NT$)', flag: '🇹🇼' },
                { code: 'USD', name: '美元 ($)', flag: '🇺🇸' },
                { code: 'JPY', name: '日圓 (¥)', flag: '🇯🇵' },
              ].map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    setSelectedCurrency(curr.code as any);
                    setActiveModal(null);
                    showToast(`預設幣別已切換為 ${curr.name}！`);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedCurrency === curr.code
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-semibold text-sm flex items-center space-x-2">
                    <span>{curr.flag}</span>
                    <span>{curr.name}</span>
                  </span>
                  {selectedCurrency === curr.code && (
                    <Check className="w-4 h-4 text-rose-600 stroke-[2.5]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Check history / Backup */}
      {activeModal === 'history' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-rose-100 shadow-soft-pink space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-base">收支資料備份與匯出</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              目前共累積 <strong>{transactions.length} 筆</strong> 記帳紀錄。你可以隨時將資料完整匯出存檔。
            </p>

            <button
              type="button"
              onClick={handleExportData}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-2xl shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all text-sm"
            >
              <Download className="w-4 h-4" />
              <span>立即匯出 JSON 備份檔</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal 6: Help center (關於 🌸 沁菜記) */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-rose-100 shadow-soft-pink space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white mx-auto flex items-center justify-center shadow-glow-pink text-2xl">
              🌸
            </div>

            <div>
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                沁菜記 (Qin Tsai Gee)
              </h3>
              <p className="text-xs text-rose-500 font-semibold mt-0.5">
                v1.0.0 · 極簡粉色記帳 Web App
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed px-2 bg-rose-50/50 p-3 rounded-2xl border border-rose-100/60">
              取自台語「青菜記」諧音，象徵無壓力、隨手輕鬆記帳。專為情侶共同基金與個人生活開銷打造的粉色沉浸式財務工具。
            </p>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl active:scale-95 transition-all text-xs"
            >
              我知道了 ✨
            </button>
          </div>
        </div>
      )}

      {/* Modal 7: Logout & Reset Confirmation */}
      {activeModal === 'logout' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-rose-100 shadow-soft-pink space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-500 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">確認清除快取並登出？</h3>
              <p className="text-xs text-slate-500 mt-1 px-3 leading-relaxed">
                這將清除本機暫存的記帳資料並重新回到初始範例狀態。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onResetData) onResetData();
                  setActiveModal(null);
                  showToast('已重置為初始範例狀態！');
                  navigate('/');
                }}
                className="py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-glow-pink hover:bg-rose-600 active:scale-95 transition-all"
              >
                確認清除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 8: Notification Panel */}
      {activeModal === 'notification' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-rose-100 shadow-soft-pink space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-base">最新通知</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-start space-x-2.5">
                <span className="text-base shrink-0">💍</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    結婚基金突破 60% 門檻！
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    伴侶已存入 $10,000，婚紗照基金已達標 🎉
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-2.5">
                <span className="text-base shrink-0">🌸</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">歡迎使用沁菜記</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    點擊右側邀請連結即可綁定另一半共同記帳。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
