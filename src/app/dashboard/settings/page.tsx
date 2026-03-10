export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-bold text-slate-900">Settings</h2>
      <p className="text-slate-600">
        Platform and account settings can be added here.
      </p>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-slate-500 text-sm">No settings configured yet.</p>
      </div>
    </div>
  );
}
