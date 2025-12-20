import { useWallet } from 'column-catalogue'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Dashboard } from './components/Dashboard'
import './index.css'

function App() {
  const { isConnected } = useWallet()

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', flex: 1 }}>
        <div className="card">
          {/* View Switcher: Login -> Home */}
          {isConnected ? (
            <Dashboard />
          ) : (
            <Hero />
          )}
        </div>

        {/* Shared Footer */}
        <footer style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #f0f0f0',
          fontSize: '0.75rem',
          color: '#bbb',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <span>v1.0.1</span>
          <span>Built by Joseph Sunday</span>
        </footer>
      </div>
    </div>
  )
}

export default App
