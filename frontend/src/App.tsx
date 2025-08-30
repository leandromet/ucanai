import React, { useState, useEffect } from 'react'
import Home from './pages/Home'
import SportPlanForm from './components/SportPlanForm'
import ResultView from './components/ResultView'
import ConstructionPage from './pages/Construction'
import './styles.css'

export type ConsultationPayload = {
  operator_id?: string
  template_id?: string
  activity: string
  date?: string
  group_size?: number
  skill_level?: string
  duration_hours?: number
  preferences?: string[]
  constraints?: { budget_per_person?: number }
  notes?: string
}

export default function App(){
  const [view, setView] = useState<'home'|'form'|'result'|'construction'>('home')
  const [lastPayload, setLastPayload] = useState<ConsultationPayload | null>(null)
  const [lastResult, setLastResult] = useState<any | null>(null)
  const [previewPrompt, setPreviewPrompt] = useState<string | null>(null)
  const [previewResult, setPreviewResult] = useState<any | null>(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [previewVisible, setPreviewVisible] = useState(false)
  
  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle view changes with animations
  const changeView = (newView: 'home'|'form'|'result'|'construction') => {
    // Add fade-out animation
    document.body.classList.add('view-transitioning')
    // Change view after brief animation
    setTimeout(() => {
      setView(newView)
      // Remove animation class after view change
      setTimeout(() => {
        document.body.classList.remove('view-transitioning')
      }, 50)
    }, 150)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-logo" onClick={() => changeView('home')}>U Can AI</h1>
        <nav className="main-nav">
          <button 
            className={`nav-button ${view === 'form' ? 'active' : ''}`}
            onClick={() => changeView('form')}
            aria-label="Adventure Plan Example"
          >
            <span className="nav-icon">🏔️</span>
            <span className="nav-text">Adventure Plan</span>
          </button>
          <button 
            className={`nav-button ${view === 'construction' ? 'active' : ''}`} 
            onClick={() => changeView('construction')}
            aria-label="Construction Example"
          >
            <span className="nav-icon">🏗️</span>
            <span className="nav-text">Construction</span>
          </button>
          <button 
            className={`nav-button ${view === 'result' ? 'active' : ''}`}
            onClick={() => changeView('result')} 
            disabled={!lastResult}
            aria-label="View Saved Results"
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Results</span>
          </button>
        </nav>
      </header>

      <main className="main-content">
        {view === 'home' && <Home onStart={() => changeView('form')} onViewConstruction={() => changeView('construction')} />}

        {view === 'form' && (
          <div className="form-layout">
            <div className="form-panel">
              <SportPlanForm
                onSubmit={(payload, result) => { 
                  setLastPayload(payload); 
                  setLastResult(result); 
                  setPreviewResult(result); 
                  // Show success notification
                  const notification = document.createElement('div');
                  notification.className = 'success-notification';
                  notification.textContent = 'Plan generated successfully!';
                  document.body.appendChild(notification);
                  setTimeout(() => document.body.removeChild(notification), 3000);
                }}
                onPreview={(p, r) => { 
                  setPreviewPrompt(p); 
                  setPreviewResult(r);
                  if (isMobile) setPreviewVisible(true);
                }}
              />
            </div>

            {isMobile ? (
              <div className={`preview-panel-mobile ${previewVisible ? 'visible' : ''}`}>
                <button 
                  className="preview-toggle"
                  onClick={() => setPreviewVisible(!previewVisible)}
                  aria-expanded={previewVisible}
                >
                  {previewVisible ? 'Hide Preview' : 'Show Preview'}
                </button>
                
                {previewVisible && (
                  <div className="preview-content">
                    <section className="preview-section">
                      <h3 className="preview-heading">Simulated LLM prompt</h3>
                      <pre className="preview-code">{previewPrompt ?? 'Prompt preview will appear here as you edit the form.'}</pre>
                    </section>

                    <section className="preview-section">
                      <h3 className="preview-heading">Normalized JSON (preview)</h3>
                      <pre className="preview-code">{previewResult ? JSON.stringify(previewResult, null, 2) : 'Result preview will appear after generating.'}</pre>
                    </section>
                    
                    {previewResult && (
                      <button 
                        className="view-result-btn"
                        onClick={() => changeView('result')}
                      >
                        View Full Results
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <aside className="preview-panel-desktop">
                <section className="preview-section">
                  <h3 className="preview-heading">Simulated LLM prompt</h3>
                  <pre className="preview-code">{previewPrompt ?? 'Prompt preview will appear here as you edit the form.'}</pre>
                </section>

                <section className="preview-section">
                  <h3 className="preview-heading">Normalized JSON (preview)</h3>
                  <pre className="preview-code">{previewResult ? JSON.stringify(previewResult, null, 2) : 'Result preview will appear after generating.'}</pre>
                </section>
                
                {previewResult && (
                  <button 
                    className="view-result-btn"
                    onClick={() => changeView('result')}
                  >
                    View Full Results
                  </button>
                )}
              </aside>
            )}
          </div>
        )}

      {view === 'result' && lastResult && (
        <div className="result-container">
          <ResultView
            payload={lastPayload}
            result={lastResult}
            onRegenerate={(newResult) => setLastResult(newResult)}
          />
          <div className="action-buttons">
            <button 
              className="back-button" 
              onClick={() => changeView('form')}
              aria-label="Back to form"
            >
              Back to Form
            </button>
          </div>
        </div>
      )}

      {view === 'construction' && (
        <div className="construction-container">
          <ConstructionPage />
        </div>
      )}
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} U Can AI - Empowering small businesses with AI</p>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#privacy">Privacy</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </div>
  )
}
