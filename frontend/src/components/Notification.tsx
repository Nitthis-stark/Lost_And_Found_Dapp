import React, { useEffect } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'info';
  show: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center">
      <div className={`max-w-md w-full rounded-xl shadow-lg p-4 transition-all transform ${
        show ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      } ${
        type === 'success' 
          ? 'bg-green-50 border border-green-200'
          : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 ${
            type === 'success' ? 'text-green-600' : 'text-blue-600'
          }`}>
            {type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              type === 'success' ? 'text-green-800' : 'text-blue-800'
            }`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${
              type === 'success' 
                ? 'text-green-400 hover:text-green-600'
                : 'text-blue-400 hover:text-blue-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;