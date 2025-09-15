import React from 'react';
import { Wallet, TrendingUp, Gift, ExternalLink, Coins, History } from 'lucide-react';

interface WalletRewardsProps {
  balance: number;
  isConnected: boolean;
  walletAddress?: string
  onConnect: () => void;
}

const WalletRewards: React.FC<WalletRewardsProps> = ({ balance, isConnected, onConnect }) => {
  const transactions = [
    {
      id: '1',
      type: 'earned',
      amount: 25,
      description: 'Found: Black Wallet',
      date: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'earned',
      amount: 15,
      description: 'Found: Set of Keys',
      date: '1 day ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'spent',
      amount: -50,
      description: 'Bounty: MacBook Pro',
      date: '2 days ago',
      status: 'pending'
    },
    {
      id: '4',
      type: 'earned',
      amount: 30,
      description: 'Found: Phone Charger',
      date: '3 days ago',
      status: 'completed'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Wallet & Rewards</h1>
        <p className="text-sm text-gray-600">Manage your FIND tokens and rewards</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Coins className="w-6 h-6 text-yellow-300" />
            <span className="text-lg font-semibold">FIND Balance</span>
          </div>
          <div className="bg-blue-400 bg-opacity-50 rounded-full p-2">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-bold mb-2">{balance}</div>
        <div className="text-blue-100 text-sm">Total tokens earned</div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Gift className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Total Earned</span>
          </div>
          <div className="text-xl font-bold text-green-600">85</div>
          <div className="text-xs text-green-600">+15 this week</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <History className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Items Found</span>
          </div>
          <div className="text-xl font-bold text-yellow-600">3</div>
          <div className="text-xs text-yellow-600">This month</div>
        </div>
      </div>

      {/* Wallet Connection */}
      {!isConnected ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-gray-600 mb-4">
            Connect your crypto wallet to withdraw FIND tokens
          </p>
          <button
            onClick={onConnect}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
          >
            <Wallet className="w-5 h-5" />
            <span>Connect Wallet</span>
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-800">Wallet Connected</span>
            </div>
            <ExternalLink className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-sm text-green-700 mt-1">0x1234...5678</div>
        </div>
      )}

      {/* Transaction History */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'earned'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'earned' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <Coins className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500">{transaction.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    transaction.type === 'earned'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'earned' ? '+' : ''}{transaction.amount}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {transaction.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Program */}
      <div className="bg-yellow-50 rounded-xl p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">🏆 Rewards Program</h3>
        <div className="space-y-2 text-sm text-yellow-800">
          <div className="flex justify-between">
            <span>Find 5 items</span>
            <span className="font-medium">+10 bonus tokens</span>
          </div>
          <div className="flex justify-between">
            <span>Weekly finder</span>
            <span className="font-medium">+25 bonus tokens</span>
          </div>
          <div className="flex justify-between">
            <span>Campus hero (10 items)</span>
            <span className="font-medium">+50 bonus tokens</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletRewards;