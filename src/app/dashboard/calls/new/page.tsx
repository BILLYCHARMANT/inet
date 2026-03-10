import CallForm from "@/components/dashboard/CallForm";

export default function NewCallPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-bold text-slate-900 mb-2">Create call for application</h2>
      <p className="text-slate-600 mb-6">
        Add a new call. After creating, you can share the link so applicants can submit.
      </p>
      <CallForm mode="create" />
    </div>
  );
}
