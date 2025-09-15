import React, { useState } from 'react'
import { Search, Plus, Wallet, Gift, Home, Bell } from 'lucide-react'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Account from './components/Account'
import ReportLostItem from './components/ReportLostItem'
import ReportFoundItem from './components/ReportFoundItem'
import WalletRewards from './components/WalletRewards'
import Notification from './components/Notification'
import { useAccount } from 'wagmi'

export type Tab = 'home' | 'report-lost' | 'report-found' | 'wallet' | 'account'

export interface LostItem {
  id: string
  itemName: string
  description: string
  location: string
  date: string
  bounty: number
  secretInfo?: string
  status: 'lost' | 'found' | 'matched'
  reportedBy: string
}

export interface FoundItem {
  id: string
  description: string
  location: string
  date: string
  foundBy: string
  matchedWith?: string
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'info'
    show: boolean
  }>({ message: '', type: 'info', show: false })

  const [lostItems, setLostItems] = useState<LostItem[]>([
    {
      id: '1',
      itemName: 'MacBook Pro',
      description: 'Silver MacBook Pro 13" with stickers',
      location: 'Library - 2nd Floor',
      date: '2 hours ago',
      bounty: 50,
      status: 'lost',
      reportedBy: 'Sarah Chen',
    },
    {
      id: '2',
      itemName: 'Black Wallet',
      description: 'Leather wallet with student ID',
      location: 'Student Union',
      date: '5 hours ago',
      bounty: 25,
      status: 'lost',
      reportedBy: 'Mike Johnson',
    },
    {
      id: '3',
      itemName: 'Set of Keys',
      description: 'Keychain with Toyota car key',
      location: 'Engineering Building',
      date: '1 day ago',
      bounty: 15,
      status: 'matched',
      reportedBy: 'Alex Kumar',
    },
  ])

  const [foundItems, setFoundItems] = useState<FoundItem[]>([
    {
      id: '1',
      description: 'Found iPhone 13 near gym entrance',
      location: 'Recreation Center',
      date: '1 hour ago',
      foundBy: 'Emma Davis',
    },
  ])

  const [walletBalance, setWalletBalance] = useState(125)

  // 🔹 Wagmi hook for wallet status
  const { address, isConnected } = useAccount()

  const handleLogin = (username: string) => {
    setCurrentUser(username)
    setIsAuthenticated(true)
  }

  const handleUpdateProfile = (newUsername: string) => {
    setCurrentUser(newUsername)
  }

  const handlePasswordReset = () => {
    console.log('Password reset requested')
  }

  const showNotification = (message: string, type: 'success' | 'info' = 'info') => {
    setNotification({ message, type, show: true })
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }))
    }, 4000)
  }

  const handleReportLost = (item: Omit<LostItem, 'id' | 'date' | 'status' | 'reportedBy'>) => {
    const newItem: LostItem = {
      ...item,
      id: Date.now().toString(),
      date: 'Just now',
      status: 'lost',
      reportedBy: 'You',
    }
    setLostItems((prev) => [newItem, ...prev])
    setActiveTab('home')
    showNotification('Lost item reported successfully!', 'success')
  }

  const handleReportFound = (description: string, location: string, matchedItemId?: string) => {
    const newFoundItem: FoundItem = {
      id: Date.now().toString(),
      description,
      location,
      date: 'Just now',
      foundBy: 'You',
      matchedWith: matchedItemId,
    }
    setFoundItems((prev) => [newFoundItem, ...prev])

    if (matchedItemId) {
      setLostItems((prev) =>
        prev.map((item) =>
          item.id === matchedItemId ? { ...item, status: 'matched' as const } : item
        )
      )
      const matchedItem = lostItems.find((item) => item.id === matchedItemId)
      if (matchedItem) {
        setWalletBalance((prev) => prev + matchedItem.bounty)
        showNotification(`🎉 Match verified! You earned ${matchedItem.bounty} FIND tokens!`, 'success')
      }
    } else {
      showNotification('Found item reported successfully!', 'success')
    }
    setActiveTab('home')
  }

  // Auth screen
  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard lostItems={lostItems} foundItems={foundItems} />
      case 'report-lost':
        return <ReportLostItem onSubmit={handleReportLost} onCancel={() => setActiveTab('home')} />
      case 'report-found':
        return (
          <ReportFoundItem
            onSubmit={handleReportFound}
            onCancel={() => setActiveTab('home')}
            lostItems={lostItems.filter((item) => item.status === 'lost')}
          />
        )
      case 'wallet':
        return (
          <WalletRewards
            balance={100}
            isConnected={true}
            walletAddress="0x123..."
            onConnect={() => {
              console.log("Wallet connected!");
            }}
          />

        )
      case 'account':
        return (
          <Account
            currentUser={currentUser}
            walletAddress={address || 'Not connected'}
            onUpdateProfile={handleUpdateProfile}
            onPasswordReset={handlePasswordReset}
          />
        )
      default:
        return <Dashboard lostItems={lostItems} foundItems={foundItems} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Lost & Found</h1>
            </div>
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {lostItems.some((item) => item.status === 'matched') && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto">{renderContent()}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around py-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${activeTab === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('report-lost')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${activeTab === 'report-lost'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Search className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">Lost</span>
            </button>

            <button
              onClick={() => setActiveTab('report-found')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${activeTab === 'report-found'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">Found</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative ${activeTab === 'wallet'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">Wallet</span>
              {walletBalance > 100 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${activeTab === 'account'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Gift className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">Account</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
      />
    </div>
  )
}

export default App
