import WelcomeCard from "../components/WelcomeCard"
import StatisticCards from "../components/StatisticCards"

import QuickMenu from "../components/QuickMenu"
import RevenueChart from "../components/RevenueChart"
import RecentActivity from "../components/RecentActivity" 

export default function Dashboard() {
  return (
    <div className="space-y-5 pb-24">

      <WelcomeCard />

<StatisticCards />

<RevenueChart />

<RecentActivity />

<QuickMenu />
    </div>
  )
}