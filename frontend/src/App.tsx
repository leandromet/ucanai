import React, { useState } from 'react'
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

  return (
    <div className="container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:18}}>
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <button onClick={() => setView('home')}>U Can AI</button>
          <button onClick={() => setView('form')}>Adventure Plan</button>
          <button onClick={() => setView('construction')}>Construction</button>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={() => setView('result')} disabled={!lastResult}>Last Result</button>
        </div>
      </div>

      {view === 'home' && <Home onStart={() => setView('form')} onViewConstruction={() => setView('construction')} />}

      {view === 'form' && (
        <div style={{display:'flex',gap:18,alignItems:'flex-start'}}>
          <div style={{flex:1}}>
            <SportPlanForm
              onSubmit={(payload, result) => { setLastPayload(payload); setLastResult(result); setPreviewResult(result); /* stay on form so preview remains visible */ }}
              onPreview={(p, r) => { setPreviewPrompt(p); setPreviewResult(r) }}
            />
          </div>

          <aside style={{width:340,flex:'0 0 340px'}}>
            <section style={{marginBottom:12}}>
              <h3 style={{marginTop:0}}>Simulated LLM prompt</h3>
              <pre style={{whiteSpace:'pre-wrap',background:'rgba(0,0,0,0.06)',padding:12,borderRadius:8, color:'var(--text)'}}>{previewPrompt ?? 'Prompt preview will appear here as you edit the form.'}</pre>
            </section>

            <section>
              <h3>Normalized JSON (preview)</h3>
              <pre style={{whiteSpace:'pre-wrap',background:'rgba(0,0,0,0.06)',padding:12,borderRadius:8, color:'var(--text)'}}>{previewResult ? JSON.stringify(previewResult, null, 2) : 'Result preview will appear after generating.'}</pre>
            </section>
          </aside>
        </div>
      )}

      {view === 'result' && lastResult && (
        <ResultView
          payload={lastPayload}
          result={lastResult}
          onRegenerate={(newResult) => setLastResult(newResult)}
        />
      )}

      {view === 'construction' && (
        <ConstructionPage />
      )}
    </div>
  )
}
