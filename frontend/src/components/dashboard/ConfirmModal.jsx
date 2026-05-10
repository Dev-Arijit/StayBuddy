export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-surface-container rounded-xl p-6 w-96 border border-outline-variant animate-scale-in">

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
            <span className="material-icons-round text-error">warning</span>
          </div>
          <h2 className="text-lg font-semibold text-on-surface tracking-tight">{title}</h2>
        </div>

        <p className="text-on-surface-variant text-sm mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary text-sm">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-sm bg-error text-white py-2.5 px-5 rounded-lg hover:brightness-110 transition font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}