import { motion } from "framer-motion";

const ConfirmDialog = ({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0B0F1A] text-white rounded-2xl mx-5 p-6 max:w-[350px] shadow-lg border border-white/10"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-300 mt-2">{message}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition"
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmDialog;
