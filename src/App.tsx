import { useState } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import FloatingChat from './components/FloatingChat'
import OnboardingModal, { ONBOARDING_FLAG } from './modals/OnboardingModal'
import { useTelegramBack } from './hooks/useTelegramBack'
import { getFlag } from './utils/persist'

import HomeScreen from './screens/HomeScreen'
import ExchangeScreen from './screens/ExchangeScreen'
import OfficesScreen from './screens/OfficesScreen'
import KycScreen from './screens/KycScreen'
import RaffleScreen from './screens/RaffleScreen'
import EventsScreen from './screens/EventsScreen'
import OrdersScreen from './screens/OrdersScreen'
import SuccessScreen from './screens/SuccessScreen'

/** Экраны с общим хромом (нижний навбар + плавающий чат). */
function ChromeLayout() {
  return (
    <>
      <Outlet />
      <div className="nav-scrim" aria-hidden="true" />
      <BottomNav />
      <FloatingChat />
    </>
  )
}

export default function App() {
  useTelegramBack()
  const [onboarding, setOnboarding] = useState(() => !getFlag(ONBOARDING_FLAG))

  return (
    <>
      {/* Сцена: всё приложение, которое уходит вглубь под открытой шторкой (шторки — порталом в body) */}
      <div className="app-stage">
        <div className="app-glow" aria-hidden="true">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="orb orb-3" />
        </div>
        <Routes>
          {/* Фокус-экран без навбара/чата */}
          <Route path="/exchange/success" element={<SuccessScreen />} />

          <Route element={<ChromeLayout />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/exchange" element={<ExchangeScreen />} />
            <Route path="/offices" element={<OfficesScreen />} />
            <Route path="/kyc" element={<KycScreen />} />
            <Route path="/raffle" element={<RaffleScreen />} />
            <Route path="/events" element={<EventsScreen />} />
            <Route path="/orders" element={<OrdersScreen />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {onboarding && <OnboardingModal onClose={() => setOnboarding(false)} />}
    </>
  )
}
