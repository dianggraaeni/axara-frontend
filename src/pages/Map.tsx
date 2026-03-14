import { React, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, ChevronLeft, ChevronRight,
  Plus, Minus, RotateCcw, BookOpen, X, Compass, Flame, Lock, CheckCircle, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { provinces as allProvinces } from '../services/provinces.data';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../hooks/useBackendData';

const geoUrl = "/indonesia-province-simple.json";

const normalizeId = (name: string) =>
  name ? name.toLowerCase().trim().replace(/\s+/g, '-').replace(/\./g, '').replace('d.i.-', 'di-') : "";

// ─────────────────────────────────────────────────────────────────────────────
// Province unlock system:
//   • index 0 → level 1 required, index 1 → level 2, etc.
//   • "completed" = all 3 games finished (derived from completedIndices set)
//   • "current"   = unlocked & not yet completed (highest available)
//   • "locked"    = level requirement not met yet
// ─────────────────────────────────────────────────────────────────────────────
type ProvinceStatus = 'locked' | 'completed' | 'current' | 'unlocked';

function getProvinceStatus(
  index: number,
  userLevel: number,
  completedIndices: Set<number>
): ProvinceStatus {
  const required = index + 1;
  if (userLevel < required) return 'locked';
  if (completedIndices.has(index)) return 'completed';
  if (index === userLevel - 1) return 'current';
  return 'unlocked';
}

const STATUS_MAP_FILL: Record<ProvinceStatus, string> = {
  locked:    '#d1d5db',
  completed: '#F14C38',
  current:   '#FBBF24',
  unlocked:  '#FFFFFF',
};

export default function MapPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats } = useUserStats();

  const userLevel = stats?.level ?? user?.level ?? 1;

  // All provinces below current level are "completed" for demo.
  // Replace with real backend data in production.
  const completedIndices = useMemo(() => {
    const s = new Set<number>();
    for (let i = 0; i < userLevel - 1; i++) s.add(i);
    return s;
  }, [userLevel]);

  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [position, setPosition]         = useState({ coordinates: [118, -2] as [number, number], zoom: 1.2 });
  const [hoveredName, setHoveredName]   = useState<string | null>(null);
  const [lockedBounce, setLockedBounce] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedProv = useMemo(
    () => allProvinces.find(p => p.id === selectedId) ?? null,
    [selectedId]
  );
  const selectedProvIndex = useMemo(
    () => allProvinces.findIndex(p => p.id === selectedId),
    [selectedId]
  );
  const selectedStatus: ProvinceStatus | null = selectedProv
    ? getProvinceStatus(selectedProvIndex, userLevel, completedIndices)
    : null;

  const handleZoomIn  = () => setPosition(p => ({ ...p, zoom: Math.min(p.zoom * 1.5, 8) }));
  const handleZoomOut = () => setPosition(p => ({ ...p, zoom: Math.max(p.zoom / 1.5, 1) }));
  const handleReset   = () => setPosition({ coordinates: [118, -2], zoom: 1.2 });

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    scrollRef.current.scrollTo({
      left: dir === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2,
      behavior: 'smooth'
    });
  };

  const handleProvinceClick = (id: string) => {
    const idx = allProvinces.findIndex(p => p.id === id);
    if (idx === -1) return;
    const status = getProvinceStatus(idx, userLevel, completedIndices);
    if (status === 'locked') {
      setLockedBounce(id);
      setTimeout(() => setLockedBounce(null), 600);
      return;
    }
    setSelectedId(prev => (prev === id ? null : id));
  };

  // ── small helper for press-down button style ──────────────────────────────
  const pressHandlers = {
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
      (e.currentTarget).style.boxShadow = '0 0 0 #1a0f0a';
      (e.currentTarget).style.transform = 'translate(2px,2px)';
    },
    onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => {
      (e.currentTarget).style.boxShadow = '2px 2px 0 #1a0f0a';
      (e.currentTarget).style.transform = 'none';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      (e.currentTarget).style.boxShadow = '2px 2px 0 #1a0f0a';
      (e.currentTarget).style.transform = 'none';
    },
  };

  return (
    <div
      className="flex flex-col w-full overflow-hidden relative"
      style={{ height: '100dvh', background: '#F4F1E0', fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Dot-grid texture */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(241,76,56,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px'
        }} />

      {/* ════════════ HEADER ════════════ */}
      <header className="shrink-0 z-10 pl-5 pr-24 pt-3 pb-2 flex items-center justify-between gap-3">

        {/* Brand */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#F14C38', border: '3px solid #1a0f0a', boxShadow: '2px 2px 0 #1a0f0a' }}>
            <Compass size={17} className="text-white" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-xl font-black leading-none" style={{ color: '#1a0f0a' }}>
              AXARA <span style={{ color: '#F14C38' }}>WORLD</span>
            </h1>
            <p className="text-[9px] font-black tracking-widest uppercase leading-none mt-0.5" style={{ color: '#F14C38' }}>
              Jelajahi Nusantara
            </p>
          </div>
        </motion.div>

        {/* Hover label – centred */}
        <div className="flex-1 flex justify-center pointer-events-none">
          <AnimatePresence>
            {hoveredName && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                style={{ background: 'white', border: '2.5px solid #1a0f0a', boxShadow: '3px 3px 0 #1a0f0a' }}>
                <MapPin size={11} style={{ color: '#F14C38' }} strokeWidth={3} />
                <span className="font-black text-xs uppercase" style={{ color: '#1a0f0a' }}>{hoveredName}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend + Zoom */}
        <div className="flex items-center gap-2">
          {/* Legend (desktop only) */}
          <div className="hidden lg:flex items-center gap-3 mr-2">
            {([
              { color: '#FBBF24', label: 'Saat ini',  border: '#1a0f0a' },
              { color: '#F14C38', label: 'Selesai',   border: '#1a0f0a' },
              { color: '#FFFFFF', label: 'Tersedia',  border: '#9ca3af' },
              { color: '#d1d5db', label: 'Terkunci',  border: '#9ca3af' },
            ] as const).map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: item.color, border: `1.5px solid ${item.border}` }} />
                <span className="text-[8px] font-black uppercase tracking-wide"
                  style={{ color: 'rgba(26,15,10,0.45)' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Zoom */}
          {[
            { icon: <Plus size={13} strokeWidth={3} />,     fn: handleZoomIn  },
            { icon: <Minus size={13} strokeWidth={3} />,    fn: handleZoomOut },
            { icon: <RotateCcw size={11} strokeWidth={3}/>, fn: handleReset   },
          ].map((btn, i) => (
            <button key={i} onClick={btn.fn}
              className="w-8 h-8 flex items-center justify-center rounded-xl"
              style={{ background: '#F14C38', border: '2.5px solid #1a0f0a',
                boxShadow: '2px 2px 0 #1a0f0a', color: 'white', transition: 'all 0.1s' }}
              {...pressHandlers}>
              {btn.icon}
            </button>
          ))}
        </div>
      </header>

      {/* ════════════ MAP ════════════ */}
      <div className="relative z-10 ml-5 mr-24 rounded-[24px] overflow-hidden flex-1 min-h-0"
        style={{
          border: '4px solid #1a0f0a',
          boxShadow: '0 6px 24px rgba(241,76,56,0.12)',
          background: 'linear-gradient(160deg, #dbeafe 0%, #bfdbfe 60%, #e0f2fe 100%)'
        }}>
        {/* Ocean lines */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 24px,rgba(59,130,246,0.4) 24px,rgba(59,130,246,0.4) 25px)' }} />

        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 850 }}
          className="w-full h-full cursor-grab active:cursor-grabbing relative z-10">
          <ZoomableGroup zoom={position.zoom} center={position.coordinates}
            onMoveEnd={(pos) => setPosition(pos)}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const rawName = geo.properties.Propinsi || geo.properties.NAME_1 || geo.properties.name;
                  const id = normalizeId(rawName);
                  const idx = allProvinces.findIndex(p => p.id === id);
                  const isExist = idx !== -1;
                  const status: ProvinceStatus = isExist
                    ? getProvinceStatus(idx, userLevel, completedIndices)
                    : 'locked';
                  const isSelected = selectedId === id;

                  return (
                    <Geography key={geo.rsmKey} geography={geo}
                      onMouseEnter={() => isExist && setHoveredName(rawName)}
                      onMouseLeave={() => setHoveredName(null)}
                      onClick={() => isExist && handleProvinceClick(id)}
                      style={{
                        default: {
                          fill: isSelected ? (status === 'current' ? '#FBBF24' : '#F14C38') : STATUS_MAP_FILL[status],
                          stroke: '#1a0f0a', strokeWidth: isSelected ? 1.2 : 0.5,
                          outline: 'none',
                          filter: isSelected ? 'drop-shadow(0 0 5px rgba(241,76,56,0.55))' : 'none',
                          transition: 'fill 0.2s'
                        },
                        hover: {
                          fill: !isExist || status === 'locked' ? '#e5e7eb' : '#FBBF24',
                          cursor: !isExist || status === 'locked' ? 'not-allowed' : 'pointer',
                          outline: 'none', stroke: '#1a0f0a', strokeWidth: 0.8,
                        },
                        pressed: { fill: '#F14C38', outline: 'none' }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Level badge */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
          style={{ background: '#1a0f0a', border: '2px solid #FBBF24' }}>
          <Star size={11} className="text-yellow-400" strokeWidth={3} fill="#FBBF24" />
          <span className="text-xs font-black text-white">Level {userLevel}</span>
        </div>
      </div>

      {/* ════════════ PROVINCE STRIP ════════════ */}
      {/*
        Left side  : px-5 matches map margin (flush left)
        Right side : pr-24 gives ~96px breathing room so cards never overlap
                     the chatbot bubble (bottom-right) or audio button
      */}
      <div className="shrink-0 pl-5 pr-24 pt-3 pb-4 z-10">
        <div className="flex items-center gap-3">

          {/* ← */}
          <button onClick={() => scroll('left')}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: '#F14C38', border: '2.5px solid #1a0f0a',
              boxShadow: '2px 2px 0 #1a0f0a', color: 'white', transition: 'all 0.1s' }}
            {...pressHandlers}>
            <ChevronLeft size={17} strokeWidth={3} />
          </button>

          {/* Cards */}
          <div ref={scrollRef}
            className="flex gap-3 overflow-x-auto py-1.5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}>
            {allProvinces.map((prov, index) => {
              const status     = getProvinceStatus(index, userLevel, completedIndices);
              const isActive   = selectedId === prov.id;
              const isLocked   = status === 'locked';
              const isCurrent  = status === 'current';
              const isDone     = status === 'completed';
              const isBouncing = lockedBounce === prov.id;

              return (
                <motion.button key={prov.id}
                  onClick={() => handleProvinceClick(prov.id)}
                  animate={isBouncing ? { x: [-5, 5, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  whileHover={!isLocked ? { y: -5 } : {}}
                  whileTap={!isLocked ? { scale: 0.96 } : {}}
                  className="shrink-0 flex flex-col rounded-2xl overflow-hidden"
                  style={{
                    width: '130px',
                    background: isActive ? (isCurrent ? '#FBBF24' : '#F14C38') : 'white',
                    border: `3px solid ${
                      isActive   ? '#1a0f0a'               :
                      isCurrent  ? '#FBBF24'               :
                      isDone     ? 'rgba(241,76,56,0.45)'  :
                                   'rgba(26,15,10,0.13)'
                    }`,
                    boxShadow: isActive
                      ? '4px 4px 0 #1a0f0a'
                      : isCurrent
                      ? '4px 4px 0 rgba(251,191,36,0.55)'
                      : '2px 2px 0 rgba(26,15,10,0.08)',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.6 : 1,
                    transition: 'border-color 0.15s, opacity 0.15s',
                  }}>

                  {/* Thumbnail — taller so it's clearly readable */}
                  <div className="relative overflow-hidden" style={{ height: '72px' }}>
                    <img src={prov.image} alt={prov.name}
                      className="w-full h-full object-cover"
                      style={{
                        filter: isLocked
                          ? 'grayscale(100%) brightness(0.6)'
                          : isActive ? 'brightness(0.82)' : 'none',
                        transition: 'filter 0.2s'
                      }} />

                    {/* Lock overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                        style={{ background: 'rgba(0,0,0,0.42)' }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(0,0,0,0.7)', border: '2px solid rgba(255,255,255,0.2)' }}>
                          <Lock size={16} className="text-white" strokeWidth={3} />
                        </div>
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-wider">
                          Lv.{index + 1}
                        </span>
                      </div>
                    )}

                    {/* Completed badge */}
                    {isDone && !isActive && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: '#F14C38', border: '2px solid white' }}>
                        <CheckCircle size={11} className="text-white" strokeWidth={3} />
                      </div>
                    )}

                    {/* Current star badge */}
                    {isCurrent && !isActive && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: '#FBBF24', border: '2px solid #1a0f0a' }}>
                        <Star size={9} fill="white" className="text-white" strokeWidth={2} />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div className="px-2 py-2">
                    <p className="text-[10px] font-black uppercase leading-tight line-clamp-2 text-center"
                      style={{
                        color: isActive ? 'white' : isLocked ? 'rgba(26,15,10,0.28)' : '#1a0f0a'
                      }}>
                      {prov.name}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* → */}
          <button onClick={() => scroll('right')}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: '#F14C38', border: '2.5px solid #1a0f0a',
              boxShadow: '2px 2px 0 #1a0f0a', color: 'white', transition: 'all 0.1s' }}
            {...pressHandlers}>
            <ChevronRight size={17} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* ════════════ DETAIL MODAL ════════════ */}
      <AnimatePresence>
        {selectedProv && selectedStatus && selectedStatus !== 'locked' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-5"
            style={{ background: 'rgba(26,15,10,0.72)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedId(null)}>

            <motion.div
              initial={{ scale: 0.88, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="w-full max-w-5xl rounded-[28px] overflow-hidden flex flex-col"
              style={{
                background: '#F4F1E0', border: '5px solid #1a0f0a',
                boxShadow: '10px 10px 0 #1a0f0a', maxHeight: '90vh'
              }}
              onClick={e => e.stopPropagation()}>

              {/* Modal header bar */}
              <div className="flex items-center justify-between px-7 py-4 shrink-0"
                style={{
                  background: selectedStatus === 'current' ? '#FBBF24' : '#F14C38',
                  borderBottom: '4px solid #1a0f0a'
                }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.25)' }}>
                    {selectedStatus === 'completed'
                      ? <CheckCircle size={16} className="text-white" strokeWidth={3} />
                      : selectedStatus === 'current'
                      ? <Star size={16} fill="white" className="text-white" strokeWidth={2} />
                      : <Flame size={16} className="text-white" strokeWidth={3} />}
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest leading-none"
                      style={{ color: selectedStatus === 'current' ? 'rgba(26,15,10,0.55)' : 'rgba(255,255,255,0.65)' }}>
                      {selectedStatus === 'current' ? '⭐ Provinsi Aktif Kamu'
                        : selectedStatus === 'completed' ? '✅ Sudah Diselesaikan'
                        : '🗺️ Lokasi'}
                    </p>
                    <h2 className="text-xl font-black uppercase leading-tight"
                      style={{ color: selectedStatus === 'current' ? '#1a0f0a' : 'white' }}>
                      {selectedProv.name}
                    </h2>
                  </div>
                </div>
                <button onClick={() => setSelectedId(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.4)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget).style.background = 'rgba(255,255,255,0.4)'}
                  onMouseLeave={e => (e.currentTarget).style.background = 'rgba(255,255,255,0.25)'}>
                  <X size={18} strokeWidth={3}
                    style={{ color: selectedStatus === 'current' ? '#1a0f0a' : 'white' }} />
                </button>
              </div>

              {/* Modal body */}
              <div className="overflow-y-auto flex-1 p-7" style={{ scrollbarWidth: 'thin' }}>
                <div className="grid md:grid-cols-2 gap-7">

                  {/* Left */}
                  <div className="space-y-4">
                    <div className="rounded-[20px] overflow-hidden"
                      style={{ border: '4px solid #1a0f0a', boxShadow: '5px 5px 0 #1a0f0a', aspectRatio: '16/9' }}>
                      <img src={selectedProv.image} alt={selectedProv.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="rounded-[18px] p-5"
                      style={{ background: 'white', border: '3px solid #1a0f0a', boxShadow: '4px 4px 0 #1a0f0a' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#F14C38' }}>
                          <BookOpen size={12} className="text-white" strokeWidth={3} />
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest" style={{ color: '#F14C38' }}>
                          Ringkasan Sejarah
                        </span>
                      </div>
                      <p className="text-sm font-bold leading-relaxed" style={{ color: '#1a0f0a', opacity: 0.8 }}>
                        {selectedProv.summary}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: selectedStatus === 'current' ? '#FBBF24' : '#F14C38',
                          border: '3px solid #1a0f0a', boxShadow: '2px 2px 0 #1a0f0a'
                        }}>
                        <MapPin className="text-white" size={20} strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1" style={{ color: '#F14C38' }}>
                          Ibukota: {selectedProv.capital}
                        </p>
                        <h3 className="text-2xl font-black leading-tight" style={{ color: '#1a0f0a' }}>
                          {selectedProv.tradition.name}
                        </h3>
                      </div>
                    </div>

                    <div className="rounded-[18px] overflow-hidden"
                      style={{ border: '3px solid #1a0f0a', boxShadow: '3px 3px 0 #1a0f0a', height: '140px' }}>
                      <img src={selectedProv.tradition.image} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Filosofi', content: selectedProv.tradition.philosophy },
                        { label: 'Deskripsi', content: selectedProv.tradition.desc },
                      ].map(card => (
                        <div key={card.label} className="rounded-xl p-3.5"
                          style={{ background: 'white', border: '2px solid rgba(26,15,10,0.12)' }}>
                          <p className="text-[8px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#F14C38' }}>
                            {card.label}
                          </p>
                          <p className="text-xs font-bold leading-relaxed line-clamp-5"
                            style={{ color: '#1a0f0a', opacity: 0.75 }}>
                            {card.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    {selectedStatus === 'completed' ? (
                      <div className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
                        style={{ background: '#F4F1E0', border: '3px solid rgba(26,15,10,0.2)' }}>
                        <CheckCircle size={16} strokeWidth={3} style={{ color: 'rgba(26,15,10,0.4)' }} />
                        <span className="font-black text-sm uppercase tracking-wide" style={{ color: 'rgba(26,15,10,0.4)' }}>
                          Sudah Diselesaikan
                        </span>
                      </div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(`/app/quest?province=${selectedProv.id}`)}
                        className="w-full py-4 font-black text-base uppercase rounded-2xl"
                        style={{
                          background: selectedStatus === 'current' ? '#FBBF24' : '#F14C38',
                          color: selectedStatus === 'current' ? '#1a0f0a' : 'white',
                          border: '4px solid #1a0f0a', boxShadow: '0 5px 0 #1a0f0a',
                          letterSpacing: '0.1em', transition: 'box-shadow 0.1s, transform 0.1s'
                        }}
                        onMouseDown={e => {
                          (e.currentTarget).style.boxShadow = '0 2px 0 #1a0f0a';
                          (e.currentTarget).style.transform = 'translateY(3px)';
                        }}
                        onMouseUp={e => {
                          (e.currentTarget).style.boxShadow = '0 5px 0 #1a0f0a';
                          (e.currentTarget).style.transform = 'none';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget).style.boxShadow = '0 5px 0 #1a0f0a';
                          (e.currentTarget).style.transform = 'none';
                        }}>
                        {selectedStatus === 'current' ? '⚔️ Lanjutkan Petualangan' : '🗺️ Mulai Petualangan'}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}