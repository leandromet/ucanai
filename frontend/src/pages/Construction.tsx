import React, { useState } from 'react'

export default function ConstructionPage(){
  const [scope, setScope] = useState<'painting'|'painting_repairs'>('painting')
  const [quality, setQuality] = useState<'economy'|'standard'|'premium'>('standard')
  const [rooms, setRooms] = useState<number>(3)
  const [includeFinish, setIncludeFinish] = useState<boolean>(false)
  const [budget, setBudget] = useState<number | undefined>(undefined)
  const [result, setResult] = useState<any | null>(null)
  const [prompt, setPrompt] = useState<string | null>(null)

  function buildPromptPayload(){
    return {
      template_id: 'construction_estimate_v1',
      activity: 'construction_estimate',
      scope,
      quality,
      rooms,
      include_finish: includeFinish,
      budget
    }
  }

  function mockGPTResponse(payload:any){
    // Very simple mapping to simulate GPT normalized output
    const baseCostPerRoom = quality === 'economy' ? 300 : quality === 'standard' ? 600 : 1100
    const finishCost = includeFinish ? (quality === 'premium' ? 800 : 400) : 0
    const total = (baseCostPerRoom * payload.rooms) + finishCost + (payload.scope === 'painting_repairs' ? 500 : 0)

    const options = [
      { name: 'Basic', cost: Math.round(total * 0.75), materials: quality === 'economy' ? 'Economy paint' : 'Standard paint', timeline: `${Math.max(1, Math.ceil(payload.rooms/2))} days` },
      { name: 'Standard', cost: Math.round(total), materials: quality === 'standard' ? 'Mid-range paint + minor repairs' : (quality === 'premium' ? 'High-end paint' : 'Standard paint'), timeline: `${Math.max(2, Math.ceil(payload.rooms/1.5))} days` },
      { name: 'Premium', cost: Math.round(total * 1.5), materials: 'Premium paint + repairs + finish', timeline: `${Math.max(3, Math.ceil(payload.rooms))} days` }
    ]

    const breakdown = [
      { item: 'Paint', qty: Math.max(1, payload.rooms * 3), unit: 'L', cost: Math.round(0.2 * total) },
      { item: 'Labor', cost: Math.round(0.5 * total) },
      ...(payload.scope === 'painting_repairs' ? [{ item: 'Repairs', cost: 500 }] : []),
      ...(payload.include_finish ? [{ item: 'Finish', cost: finishCost }] : [])
    ]

    return {
      overview: `Estimate for ${payload.rooms} rooms — ${payload.scope === 'painting' ? 'painting' : 'painting + repairs'} (${payload.quality})`,
      options,
      breakdown,
      notes: ['This is a simulated estimate. Final quote after site inspection.']
    }
  }

  function onGenerate(e?:React.FormEvent){
    if(e) e.preventDefault()
    const payload = buildPromptPayload()
    // Simulate the prompt we would send to an LLM (show to user)
    const promptText = `Please produce a normalized JSON estimate for a construction job. Input: ${JSON.stringify(payload)}`
    setPrompt(promptText)
    const gpt = mockGPTResponse(payload)
    setResult(gpt)
  }

  return (
    <div>
      <h2>Construction — Interactive Estimate Example</h2>
      <p>Use the controls to simulate prompt variables and see a mock LLM JSON response and rendered options.</p>

      <form onSubmit={onGenerate} style={{marginTop:16}}>
        <label>
          Scope
          <select value={scope} onChange={e=>setScope(e.target.value as any)}>
            <option value="painting">Painting only</option>
            <option value="painting_repairs">Painting + minor repairs</option>
          </select>
        </label>

        <label>
          Finish quality
          <select value={quality} onChange={e=>setQuality(e.target.value as any)}>
            <option value="economy">Economy</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </label>

        <label>
          Rooms to paint
          <input type="number" min={1} value={rooms} onChange={e=>setRooms(Number(e.target.value))} />
        </label>

        <label>
          Include finish
          <select value={includeFinish ? 'yes' : 'no'} onChange={e=>setIncludeFinish(e.target.value === 'yes')}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>

        <label>
          Target budget per job (optional)
          <input type="number" min={0} value={budget ?? ''} onChange={e=>setBudget(e.target.value === '' ? undefined : Number(e.target.value))} placeholder="e.g. 1500" />
        </label>

        <button type="submit">Generate simulated estimate</button>
      </form>

      {prompt && (
        <section style={{marginTop:18}}>
          <h3>Simulated LLM prompt</h3>
          <pre style={{whiteSpace:'pre-wrap',background:'rgba(0,0,0,0.2)',padding:12,borderRadius:8}}>{prompt}</pre>
        </section>
      )}

      {result && (
        <section style={{marginTop:18}}>
          <h3>Generated estimate (normalized JSON)</h3>
          <pre style={{whiteSpace:'pre-wrap',background:'rgba(0,0,0,0.2)',padding:12,borderRadius:8}}>{JSON.stringify(result, null, 2)}</pre>

          <section style={{marginTop:12}}>
            <h4>Rendered Options</h4>
            <ul>
              {result.options.map((o:any,i:number)=>(<li key={i}><strong>{o.name}</strong> — ${o.cost} — {o.timeline} — {o.materials}</li>))}
            </ul>
          </section>

          <section style={{marginTop:12}}>
            <h4>Breakdown</h4>
            <ul>
              {result.breakdown.map((b:any,i:number)=>(<li key={i}>{b.item}: {b.qty? b.qty + ' ' + b.unit + ' — ': ''}${b.cost}</li>))}
            </ul>
          </section>

          <section style={{marginTop:12}}>
            <h4>Notes</h4>
            <ul>
              {result.notes.map((n:string,i:number)=>(<li key={i}>{n}</li>))}
            </ul>
          </section>
        </section>
      )}
    </div>
  )
}
