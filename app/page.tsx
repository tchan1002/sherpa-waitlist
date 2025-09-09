'use client';
import { useEffect, useMemo, useState } from 'react';

type Variant = 'personal' | 'enterprise';

export default function Page() {
  const [variant, setVariant] = useState<Variant>('personal');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ENDPOINT =
    'https://script.google.com/macros/s/AKfycbwJ2pAK55QyRkng01G42BMqqoVzJhbo0kVOG8FZOrhD_jU4J3kVvxmBL0-mF689Yb0Y/exec';

  // initial analytics
  useEffect(() => {
    (window as any).analytics?.track?.('view_variant', { variant: 'personal' });
  }, []);

  const canSubmit = useMemo(() => {
    if (!/\S+@\S+\.\S+/.test(email)) return false;
    return true;
  }, [email, company, variant]);

  const switchTo = (v: Variant) => {
    setVariant(v);
    (window as any).analytics?.track?.('toggle_variant', { to: v });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError(null);

    // Honeypot (hidden field)
    const botTrap = (document.getElementById('website') as HTMLInputElement | null)?.value || '';
    if (botTrap) {
      setSubmitting(false);
      return;
    }

    const payload = new URLSearchParams({
      Email: email.trim(),
      UserType: variant,
      BusinessWebsite: variant === 'enterprise' ? company.trim() : '',
      UserAgent: navigator.userAgent || '',
    });

    // Show success immediately
    (window as any).analytics?.track?.('submit_waitlist', { variant });
    setSubmitted(true);
    setSubmitting(false);

    // Send data in background (fire and forget)
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: payload.toString(),
      mode: 'no-cors',
    }).catch(error => {
      console.error('Background submission error:', error);
    });
  }

  return (
    <main className="min-h-dvh bg-black text-white grid place-items-center p-4">
       <div className="relative w-full max-w-[560px] rounded-3xl border border-zinc-800/70 bg-zinc-900/70 p-8 sm:p-10 shadow-2xl backdrop-blur-sm">
         {/* Wordmark */}
         <div className="mb-6 text-zinc-300/90 tracking-tight text-lg font-medium">Sherpa</div>

         {/* Green pill toggle */}
         <div
           role="tablist"
           aria-label="Select audience"
           className="relative mb-10 grid grid-cols-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 p-1 backdrop-blur-sm"
         >
          {(['personal', 'enterprise'] as Variant[]).map((v) => {
            const active = variant === v;
            return (
              <button
                key={v}
                role="tab"
                aria-selected={active}
                onClick={() => switchTo(v)}
                className={[
                  'relative z-10 h-10 rounded-full text-sm font-medium transition-colors focus:outline-none',
                  active ? 'text-black' : 'text-zinc-300 hover:text-white',
                ].join(' ')}
              >
                <span className="inline-block w-full px-4">
                  {v === 'personal' ? 'Personal' : 'Enterprise'}
                </span>
              </button>
            );
          })}
          {/* sliding green thumb */}
          <span
            aria-hidden
            className="absolute inset-y-1 w-1/2 rounded-full transition-transform duration-200 bg-green-500 shadow-[0_0_0_6px_rgba(34,197,94,0.15)]"
            style={{ transform: variant === 'personal' ? 'translateX(0%)' : 'translateX(100%)' }}
          />
        </div>

         {/* Headline + copy */}
         {variant === 'personal' ? (
           <>
             <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">Sherpa Personal</h1>
             <div className="mt-6 space-y-4 text-zinc-300">
               <p className="leading-relaxed text-lg">
                 Never click a link again to get where you need to.
               </p>
               <p className="leading-relaxed text-lg">
                 Web browsing should be dead simple.
               </p>
             </div>
           </>
         ) : (
           <>
             <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">Sherpa Enterprise</h1>
             <div className="mt-6 space-y-4 text-zinc-300">
               <p className="leading-relaxed text-lg">
                 AI web navigation is here, is your website prepared for Generative Engine Optimization?
               </p>
             </div>
           </>
         )}

         {/* Form / states */}
         {!submitted ? (
           <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {/* Honeypot (not visible) */}
            <input id="website" name="website" type="text" className="hidden" tabIndex={-1} autoComplete="off" />

             <label className="block">
               <span className="sr-only">Email</span>
               <input
                 required
                 type="email"
                 name="email"
                 placeholder="you@email.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full h-12 rounded-full bg-zinc-900/50 border border-zinc-700/50 px-4 text-white placeholder-zinc-400 outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 backdrop-blur-sm"
               />
             </label>

             {variant === 'enterprise' && (
               <label className="block">
                 <span className="sr-only">Company website</span>
                 <input
                   type="text"
                   name="company_website"
                   placeholder="https://company.com"
                   value={company}
                   onChange={(e) => setCompany(e.target.value)}
                   className="w-full h-12 rounded-full bg-zinc-900/50 border border-zinc-700/50 px-4 text-white placeholder-zinc-400 outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 backdrop-blur-sm"
                 />
               </label>
             )}

             <button
               type="submit"
               disabled={!canSubmit || submitting}
               className={[
                 'w-full h-12 rounded-full font-semibold text-black focus:ring-2 focus:ring-green-400 transition-all duration-200',
                 submitting || !canSubmit ? 'bg-green-500/70 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25',
               ].join(' ')}
             >
               {submitting ? 'Submitting…' : variant === 'personal' ? 'Join the Waitlist' : 'Get a Free Consultation'}
             </button>

             {error && <p className="text-sm text-red-400 text-center mt-2">{error}</p>}

             <p className="text-xs text-zinc-500 text-center mt-4 leading-relaxed">
               Made with <span className="text-green-500">❤️</span>
             </p>
          </form>
         ) : (
           <div className="mt-8 rounded-2xl border border-green-600/40 bg-green-500/10 p-6 backdrop-blur-sm">
             <p className="text-green-400 text-center leading-relaxed">
               {variant === 'personal'
                 ? "You're on the list! We'll email you when the beta opens."
                 : "You're on the list! We'll review your site and follow up."}
             </p>
           </div>
         )}
      </div>
    </main>
  );
}

