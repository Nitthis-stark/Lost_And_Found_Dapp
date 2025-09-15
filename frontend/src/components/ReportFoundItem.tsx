import React, { useState } from 'react';
import { ArrowLeft, MapPin, CheckCircle, Search } from 'lucide-react';
import { LostItem } from '../App';

interface ReportFoundItemProps {
  onSubmit: (description: string, location: string, matchedItemId?: string) => void;
  onCancel: () => void;
  lostItems: LostItem[];
}

const ReportFoundItem: React.FC<ReportFoundItemProps> = ({ onSubmit, onCancel, lostItems }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [matchedItem, setMatchedItem] = useState<string | null>(null);
  const [showMatches, setShowMatches] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const findPotentialMatches = () => {
    if (!description.trim()) return [];
    
    const keywords = description.toLowerCase().split(' ');
    return lostItems.filter(item => {
      const itemText = `${item.itemName} ${item.description}`.toLowerCase();
      return keywords.some(keyword => keyword.length > 2 && itemText.includes(keyword));
    });
  };

  const potentialMatches = findPotentialMatches();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !location) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(description, location, matchedItem || undefined);
    setIsSubmitting(false);
  };

  const handleMatchSelect = (itemId: string) => {
    setMatchedItem(itemId);
    setShowMatches(false);
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
        <h1 className="text-xl font-bold text-gray-900">Report Found Item</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Item Description *</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setShowMatches(false);
              setMatchedItem(null);
            }}
            placeholder="Describe the item you found in detail"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Item Image *</label>
          <div className="text-sm text-gray-500">Upload an image of the item you found</div>
          <input type="file" accept="image/*" className="mt-2" />
        </div>

        {/* Location Found */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Location Found *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where did you find this item?"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        {/* Match Against Lost Items */}
        {description.length > 10 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Check for Matches</label>
              <button
                type="button"
                onClick={() => setShowMatches(!showMatches)}
                className="flex items-center space-x-1 text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                <Search className="w-4 h-4" />
                <span>Find matches ({potentialMatches.length})</span>
              </button>
            </div>

            {showMatches && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {potentialMatches.length > 0 ? (
                  potentialMatches.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 border rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${
                        matchedItem === item.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => handleMatchSelect(item.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Lost at: {item.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-yellow-100 px-2 py-1 rounded text-xs text-yellow-700 font-medium">
                            {item.bounty} tokens
                          </div>
                          {matchedItem === item.id && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No potential matches found
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Match Verification Status */}
        {matchedItem && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Match Selected</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Zero-knowledge verification will be performed automatically
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !description || !location}
          className="w-full bg-green-600 text-white font-semibold py-4 rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : matchedItem ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Confirm Return & Claim Bounty</span>
            </>
          ) : (
            <span>Report Found Item</span>
          )}
        </button>
      </form>

      {/* Info Card */}
      <div className="bg-green-50 rounded-xl p-4">
        <h3 className="font-semibold text-green-900 mb-2">🎯 How it works</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Describe the item you found</li>
          <li>• We'll check for potential matches</li>
          <li>• Zero-knowledge proof verifies ownership</li>
          <li>• Earn bounty tokens for successful returns</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportFoundItem;