import React from 'react';
import { MapPin, Clock, Coins, CheckCircle } from 'lucide-react';
import { LostItem, FoundItem } from '../App';

interface DashboardProps {
  lostItems: LostItem[];
  foundItems: FoundItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ lostItems, foundItems }) => {
  const allItems = [...lostItems.map(item => ({ ...item, type: 'lost' as const })), 
                   ...foundItems.map(item => ({ ...item, type: 'found' as const }))];

  return (
    <div className="p-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">{lostItems.filter(item => item.status === 'lost').length}</div>
          <div className="text-sm text-blue-700">Items Lost</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600">{lostItems.filter(item => item.status === 'matched').length}</div>
          <div className="text-sm text-green-700">Items Found</div>
        </div>
      </div>

      {/* Recent Activity Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      </div>

      {/* Items Feed */}
      <div className="space-y-4">
        {allItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No items reported yet</p>
          </div>
        ) : (
          allItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-4 shadow-sm border transition-all hover:shadow-md ${
                'status' in item && item.status === 'matched' ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {'itemName' in item ? (
                      <h3 className="font-semibold text-gray-900">{item.itemName}</h3>
                    ) : (
                      <h3 className="font-semibold text-gray-900">Found Item</h3>
                    )}
                    {'status' in item && item.status === 'matched' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                </div>
                {'bounty' in item && (
                  <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-lg">
                    <Coins className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">{item.bounty}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
              </div>

              {'status' in item && item.status === 'matched' && (
                <div className="mt-3 p-2 bg-green-100 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Item has been matched!</span>
                  </div>
                </div>
              )}

              {'type' in item && item.type === 'lost' ? (
                <div className="mt-3 text-xs text-gray-500">
                  Reported by {('reportedBy' in item) ? item.reportedBy : 'Unknown'}
                </div>
              ) : (
                <div className="mt-3 text-xs text-gray-500">
                  Found by {('foundBy' in item) ? item.foundBy : 'Unknown'}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;