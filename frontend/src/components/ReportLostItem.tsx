import React, { useState } from 'react';
import { ArrowLeft, MapPin, Eye, EyeOff, Coins } from 'lucide-react';
import { LostItem } from '../App';

interface ReportLostItemProps {
  onSubmit: (item: Omit<LostItem, 'id' | 'date' | 'status' | 'reportedBy'>) => void;
  onCancel: () => void;
}

const ReportLostItem: React.FC<ReportLostItemProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    secretInfo: '',
    bounty: 10
  });
  const [showSecretInfo, setShowSecretInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName || !formData.description || !formData.location) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(formData);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Report Lost Item</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Item Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Item Name *</label>
          <input
            type="text"
            value={formData.itemName}
            onChange={(e) => handleInputChange('itemName', e.target.value)}
            placeholder="e.g., MacBook Pro, Wallet, Keys"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your item in detail (color, size, brand, distinguishing features)"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            required
          />
        </div>

        {/* Last Seen Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Last Seen Location *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Library 2nd Floor, Student Union, Gym"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        {/* Secret Information */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Secret Information
            <span className="text-xs text-gray-500 ml-2">(Only you and the finder can see this)</span>
          </label>
          <div className="relative">
            <input
              type={showSecretInfo ? 'text' : 'password'}
              value={formData.secretInfo}
              onChange={(e) => handleInputChange('secretInfo', e.target.value)}
              placeholder="Something only you would know about this item"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowSecretInfo(!showSecretInfo)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showSecretInfo ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            This helps verify ownership when someone finds your item
          </p>
        </div>

        {/* Bounty */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Bounty (FIND Tokens)</label>
          <div className="relative">
            <Coins className="absolute left-3 top-3 w-5 h-5 text-yellow-500" />
            <input
              type="number"
              min="5"
              max="100"
              step="5"
              value={formData.bounty}
              onChange={(e) => handleInputChange('bounty', parseInt(e.target.value))}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Minimum: 5 tokens</span>
            <span>Maximum: 100 tokens</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.itemName || !formData.description || !formData.location}
          className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Reporting...</span>
            </>
          ) : (
            <span>Report Lost Item</span>
          )}
        </button>
      </form>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for better results</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be as detailed as possible in your description</li>
          <li>• Add unique identifying features</li>
          <li>• Higher bounties get more attention</li>
          <li>• Check back regularly for updates</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportLostItem;