'use client';
// Admin panel: everything on the public site is edited from here.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PrivateRoute from '@/components/PrivateRoute';
import { adminFetch } from '../_admin/api';
import { Card, Text, TextArea, Toggle, ColorField, StringList, RowList, ImageField } from '../_admin/fields';
import CollectionEditor from '../_admin/CollectionEditor';
import ReviewsModeration from '../_admin/ReviewsModeration';
import MenuEditor from '../_admin/MenuEditor';
import DockEditor from '../_admin/DockEditor';
import { HomeSectionsEditor, BlogCoversEditor } from '../_admin/HomeEditors';
import AccountSettings from '../_admin/AccountSettings';
import { siteDefaults } from '@/app/data/siteDefaults';
import { hexToRgbTriplet } from '@/lib/content';

const ACCENT_PRESETS = [
  { name: 'Olive', hex: '#5E6B26' },
  { name: 'Warm orange', hex: '#FF6A1A' },
  { name: 'International orange', hex: '#FF4F1A' },
  { name: 'Klein blue', hex: '#2337FF' },
  { name: 'Acid lime', hex: '#C6F432' },
  { name: 'Signal red', hex: '#E5322D' },
  { name: 'Forest green', hex: '#1F6B4F' },
  { name: 'Mustard', hex: '#E3A21A' },
  { name: 'Ultraviolet', hex: '#6B3CFF' },
  { name: 'Terracotta', hex: '#C4532F' },
];

const SERVICE_ICONS = ['Globe', 'Layers', 'Database', 'Cloud', 'Mail', 'Wrench', 'Server'];

const TABS = [
  { id: 'site', label: 'Site & hero' },
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'menu', label: 'Menu' },
  { id: 'dock', label: 'Dock' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'blog', label: 'Blog covers' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'account', label: 'Account' },
];

const PROJECT_SCHEMA = [
  { key: 'title', label: 'Title', wide: false },
  { key: 'category', label: 'Category', wide: false },
  { key: 'description', label: 'Short description', type: 'textarea', rows: 2 },
  { key: 'snapshotUrl', label: 'Screenshot', type: 'image' },
  { key: 'technologies', label: 'Technologies', type: 'list' },
  { key: 'liveUrl', label: 'Live URL', wide: false },
  { key: 'githubUrl', label: 'GitHub URL', wide: false },
  { key: 'impact.metric', label: 'Impact number', hint: 'e.g. 80+', wide: false },
  { key: 'impact.label', label: 'Impact label', hint: 'e.g. Student signups', wide: false },
  { key: 'detailedDescription', label: 'Detailed description', type: 'textarea', rows: 5 },
  { key: 'problemSolved', label: 'Problem solved', type: 'textarea' },
  { key: 'challengesFaced', label: 'Challenges faced', type: 'textarea' },
  { key: 'futureScope', label: 'Future scope', type: 'textarea', rows: 2 },
  { key: 'featured', label: 'Featured', type: 'toggle' },
];

const EXPERIENCE_SCHEMA = [
  { key: 'role', label: 'Role / degree', wide: false },
  { key: 'company', label: 'Company / institution', wide: false },
  { key: 'duration', label: 'Duration', hint: 'e.g. Apr 2026 - Present', wide: false },
  { key: 'type', label: 'Type', type: 'select', options: ['professional', 'education'], wide: false },
  { key: 'description', label: 'Bullet points', type: 'listMultiline' },
];

const SERVICE_SCHEMA = [
  { key: 'title', label: 'Title', wide: false },
  { key: 'icon', label: 'Icon', type: 'select', options: SERVICE_ICONS, wide: false },
  { key: 'description', label: 'Card description', type: 'textarea', rows: 2 },
  { key: 'details', label: 'Details (shown in the popup)', type: 'textarea', rows: 3 },
  { key: 'workflow', label: 'Workflow steps', type: 'listMultiline' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState('site');
  const [settings, setSettings] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  };
  const onAuthError = (msg) => {
    notify(msg, true);
    setTimeout(() => router.push('/admin/login'), 1200);
  };

  useEffect(() => {
    adminFetch('/api/settings')
      .then((s) => setSettings(s || {}))
      .catch((e) => notify(e.message, true));
  }, []);

  // Live-preview the accent colour inside the admin panel too
  useEffect(() => {
    const rgb = hexToRgbTriplet(settings?.accentColor);
    if (rgb) document.documentElement.style.setProperty('--accent-rgb', rgb);
  }, [settings?.accentColor]);

  // Warn before leaving with unsaved settings
  useEffect(() => {
    const h = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  // set('hero.tagline', value)
  const set = (path, value) => {
    setDirty(true);
    setSettings((prev) => {
      const keys = path.split('.');
      const next = { ...prev };
      let o = next;
      keys.slice(0, -1).forEach((k) => {
        o[k] = { ...(o[k] || {}) };
        o = o[k];
      });
      o[keys.at(-1)] = value;
      return next;
    });
  };
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), settings);

  const saveSettings = async () => {
    setSaving(true);
    try {
      setSettings(await adminFetch('/api/settings', { method: 'PUT', body: settings }));
      setDirty(false);
      notify('Settings saved');
    } catch (e) {
      if (/session expired/i.test(e.message)) onAuthError(e.message);
      else notify(e.message, true);
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  const isSettingsTab = ['site', 'home', 'about', 'menu', 'dock', 'blog'].includes(tab);

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <h1 className="text-lg font-bold text-primary">Site admin</h1>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold">
              <Link href="/" target="_blank" className="inline-flex items-center gap-1 text-secondary hover:text-primary">
                View site
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Link>
              <button type="button" onClick={logout} className="text-secondary hover:text-primary">
                Log out
              </button>
            </div>
          </div>
          <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  tab === t.id ? 'bg-primary text-background' : 'text-secondary hover:text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 pb-32">
          {isSettingsTab && !settings && <p className="text-secondary">Loading…</p>}

          {tab === 'site' && settings && (
            <>
              <Card
                title="Hero look (60 / 30 / 10)"
                description="Dark hero: 60% black, 30% white and 10% your brand colour (set below) on the parts you want people to notice. The rest of the site keeps the normal look."
              >
                <Toggle
                  label="Dark hero"
                  hint="Turn off to use the normal light hero."
                  value={get('heroTheme.dark') ?? false}
                  onChange={(v) => set('heroTheme.dark', v)}
                />
              </Card>

              <Card title="Brand colour" description="The third colour used for highlights, the badge dot and hover states.">
                <ColorField label="Accent" value={get('accentColor')} onChange={(v) => set('accentColor', v)} presets={ACCENT_PRESETS} />
              </Card>

              <Card title="Highlight badge" description="A short proof point shown above the greeting, e.g. what you've built or who uses it.">
                <Toggle
                  label="Show highlight badge"
                  hint="Displays a pill with a pulsing accent dot in the hero."
                  value={get('availability.enabled') ?? true}
                  onChange={(v) => set('availability.enabled', v)}
                />
                <Text label="Badge text" hint="Keep it short so it fits on phones (about 40 characters)." value={get('availability.text')} onChange={(v) => set('availability.text', v)} />
              </Card>

              <Card title="Hero">
                <div className="grid gap-5 md:grid-cols-2">
                  <Text label="Greeting" value={get('hero.greeting')} onChange={(v) => set('hero.greeting', v)} />
                  <Text
                    label="Name behind the photo"
                    hint="Revealed by the cursor glow."
                    value={get('hero.outlineName')}
                    onChange={(v) => set('hero.outlineName', v)}
                  />
                </div>
                <Text
                  label="Vertical sidebar text (desktop)"
                  value={get('hero.sidebarText')}
                  onChange={(v) => set('hero.sidebarText', v)}
                />
                <TextArea label="Tagline" rows={2} value={get('hero.tagline')} onChange={(v) => set('hero.tagline', v)} />
                <div className="grid gap-5 md:grid-cols-2">
                  <StringList label="Typed roles (desktop)" value={get('hero.rolesDesktop')} onChange={(v) => set('hero.rolesDesktop', v)} />
                  <StringList label="Typed roles (mobile)" value={get('hero.rolesMobile')} onChange={(v) => set('hero.rolesMobile', v)} />
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  <Text label="Button text (desktop)" value={get('hero.ctaTextDesktop')} onChange={(v) => set('hero.ctaTextDesktop', v)} />
                  <Text label="Button text (mobile)" value={get('hero.ctaTextMobile')} onChange={(v) => set('hero.ctaTextMobile', v)} />
                  <Text label="Button link" value={get('hero.ctaHref')} onChange={(v) => set('hero.ctaHref', v)} />
                </div>
                <RowList
                  label="Stats"
                  hint="Leave the value empty to show the live project count."
                  value={get('hero.stats')}
                  onChange={(v) => set('hero.stats', v)}
                  fields={[
                    { key: 'value', label: 'Value (e.g. 3+)' },
                    { key: 'label', label: 'Label' },
                    { key: 'href', label: 'Link' },
                  ]}
                />
                <ImageField label="Hero photo" value={get('hero.photoUrl')} onChange={(v) => set('hero.photoUrl', v)} folder="site" />
              </Card>

              <Card title="Social links">
                <div className="grid gap-5 md:grid-cols-3">
                  <Text label="GitHub" value={get('socials.github')} onChange={(v) => set('socials.github', v)} />
                  <Text label="LinkedIn" value={get('socials.linkedin')} onChange={(v) => set('socials.linkedin', v)} />
                  <Text label="Email" value={get('socials.email')} onChange={(v) => set('socials.email', v)} />
                </div>
              </Card>
            </>
          )}

          {tab === 'menu' && settings && (
            <Card title="Slide-out menu" description="The links in the hamburger menu. Changes go live when you save.">
              <MenuEditor
                value={get('menu')?.length ? get('menu') : siteDefaults.menu}
                onChange={(v) => set('menu', v)}
              />
            </Card>
          )}

          {tab === 'home' && settings && (
            <Card title="Landing page sections" description="Choose which sections appear below the hero and in what order. Numbers update automatically.">
              <HomeSectionsEditor value={get('homeSections')} onChange={(v) => set('homeSections', v)} />
            </Card>
          )}

          {tab === 'blog' && settings && (
            <Card title="Blog covers" description="Override the cover image for any Medium post.">
              <BlogCoversEditor value={get('blogCovers')} onChange={(v) => set('blogCovers', v)} />
            </Card>
          )}

          {tab === 'dock' && settings && (
            <Card title="Floating dock" description="The bar of icons at the bottom of the screen. Changes go live when you save.">
              <DockEditor
                value={get('dock')?.length ? get('dock') : siteDefaults.dock}
                onChange={(v) => set('dock', v)}
              />
            </Card>
          )}

          {tab === 'account' && <AccountSettings onAuthError={onAuthError} notify={notify} />}

          {tab === 'about' && settings && (
            <>
              <Card title="About text">
                <StringList label="Paragraphs" multiline value={get('about.paragraphs')} onChange={(v) => set('about.paragraphs', v)} />
                <RowList
                  label="Highlight cards"
                  value={get('about.highlights')}
                  onChange={(v) => set('about.highlights', v)}
                  fields={[
                    { key: 'value', label: 'Value (e.g. 4,000+)' },
                    { key: 'label', label: 'Label' },
                  ]}
                />
                <ImageField label="About photo" value={get('about.photoUrl')} onChange={(v) => set('about.photoUrl', v)} folder="site" />
                <div className="grid gap-5 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-secondary">Photo shape</span>
                    <select className="w-full rounded-lg border border-primary/15 bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/40" value={get('about.photoAspect') || 'portrait'} onChange={(e) => set('about.photoAspect', e.target.value)}>
                      <option value="portrait">Portrait (4:5)</option>
                      <option value="tall">Tall (3:4)</option>
                      <option value="square">Square</option>
                      <option value="landscape">Landscape (4:3)</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-secondary">Crop</span>
                    <select className="w-full rounded-lg border border-primary/15 bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/40" value={get('about.photoFit') || 'cover'} onChange={(e) => set('about.photoFit', e.target.value)}>
                      <option value="cover">Fill the frame (crop)</option>
                      <option value="contain">Fit whole photo</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-secondary">Focus point</span>
                    <select className="w-full rounded-lg border border-primary/15 bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/40" value={get('about.photoPosition') || 'center'} onChange={(e) => set('about.photoPosition', e.target.value)}>
                      <option value="top">Top (face)</option>
                      <option value="center">Centre</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </label>
                </div>
                <Toggle
                  label="Show projects count on the photo"
                  hint="The “8+ Projects shipped” overlay with the arrow button."
                  value={get('about.photoBadge') ?? true}
                  onChange={(v) => set('about.photoBadge', v)}
                />
              </Card>
              <Card title="Journey">
                <RowList
                  label="Milestones"
                  value={get('about.milestones')}
                  onChange={(v) => set('about.milestones', v)}
                  fields={[
                    { key: 'year', label: 'Year' },
                    { key: 'text', label: 'What happened', type: 'textarea' },
                  ]}
                />
              </Card>
              <Card title="Tech stack">
                <RowList
                  label="Tools"
                  folder="logos"
                  value={get('toolkit')}
                  onChange={(v) => set('toolkit', v)}
                  fields={[
                    { key: 'name', label: 'Name' },
                    { key: 'logo', label: 'Logo', type: 'image' },
                  ]}
                />
              </Card>
              <Card title="Certifications">
                <RowList
                  label="Certificates"
                  value={get('about.certifications')}
                  onChange={(v) => set('about.certifications', v)}
                  fields={[
                    { key: 'name', label: 'Name' },
                    { key: 'issuer', label: 'Issuer' },
                    { key: 'link', label: 'Verification link' },
                  ]}
                />
              </Card>
            </>
          )}

          {tab === 'projects' && (
            <CollectionEditor
              endpoint="/api/content/projects"
              schema={PROJECT_SCHEMA}
              titleKey="title"
              subtitleKey="category"
              folder="projects"
              emptyItem={{ title: '', category: '', description: '', technologies: [], impact: { metric: '', label: '' }, featured: false }}
              onAuthError={onAuthError}
              notify={notify}
            />
          )}

          {tab === 'experience' && (
            <CollectionEditor
              endpoint="/api/content/experience"
              schema={EXPERIENCE_SCHEMA}
              titleKey="role"
              subtitleKey="company"
              emptyItem={{ role: '', company: '', duration: '', type: 'professional', description: [] }}
              onAuthError={onAuthError}
              notify={notify}
            />
          )}

          {tab === 'services' && (
            <CollectionEditor
              endpoint="/api/content/services"
              schema={SERVICE_SCHEMA}
              titleKey="title"
              subtitleKey="description"
              emptyItem={{ title: '', icon: 'Globe', description: '', details: '', workflow: [] }}
              onAuthError={onAuthError}
              notify={notify}
            />
          )}

          {tab === 'reviews' && <ReviewsModeration onAuthError={onAuthError} notify={notify} />}
        </main>

        {/* Save bar for settings tabs */}
        {isSettingsTab && settings && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/10 bg-surface/95 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
              <p className="text-sm text-secondary">{dirty ? 'You have unsaved changes' : 'All changes saved'}</p>
              <button
                type="button"
                disabled={!dirty || saving}
                onClick={saveSettings}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-background hover:bg-accent transition-colors disabled:opacity-40"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        )}

        {toast && (
          <div
            role="status"
            className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg ${
              toast.isError ? 'bg-red-600 text-white' : 'bg-primary text-background'
            }`}
          >
            {toast.msg}
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
