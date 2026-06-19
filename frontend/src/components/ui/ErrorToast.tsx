interface Props {
  message: string;
  onClose: () => void;
}

export default function ErrorToast({ message, onClose }: Props) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-600 text-white px-5 py-3 rounded-lg shadow-lg">
      <span>{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white font-bold text-lg leading-none">×</button>
    </div>
  );
}
