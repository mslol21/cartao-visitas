export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-[#05070d] flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute -inset-8 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative h-28 w-28 overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[#061529] shadow-[0_0_45px_rgba(56,189,248,0.18)]">
            <img
              src="/images/koi_hero.png"
              alt="Konnexy"
              className="h-full w-full object-cover object-center scale-110"
            />
          </div>
        </div>

        <p className="bg-gradient-to-r from-[#e8c170] via-[#eef4ff] to-[#d6a94d] bg-clip-text text-3xl font-black uppercase tracking-[0.04em] text-transparent">
          Konnexy
        </p>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.32em] text-slate-400">
          Conecta • Organiza • Vende
        </p>
        <div className="mt-5 h-1 w-20 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full origin-left animate-pulse bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400" />
        </div>
      </div>
    </main>
  );
}
