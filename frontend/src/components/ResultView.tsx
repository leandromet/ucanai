import React from 'react'
import type { ConsultationPayload } from '../App'

export default function ResultView({ payload, result, onRegenerate }:{ payload: ConsultationPayload | null, result:any, onRegenerate:(r:any)=>void }){
  return (
    <div>
      <h2>Generated Plan</h2>
      <p><strong>Overview:</strong> {result.overview}</p>
      <h3>Timeline</h3>
      <ol>
        {result.timeline.map((t:any, i:number)=>(<li key={i}>{t.time} — {t.activity}</li>))}
      </ol>
      <h3>Equipment</h3>
      <ul>{result.equipment.map((e:string,i:number)=>(<li key={i}>{e}</li>))}</ul>
      <h3>Safety</h3>
      <ul>{result.safety.map((s:string,i:number)=>(<li key={i}>{s}</li>))}</ul>
      <h3>Cost</h3>
      <p>Per person: ${result.cost_estimate.per_person}</p>
      <div style={{marginTop:20}}>
        <button onClick={()=>onRegenerate(result)}>Regenerate</button>
      </div>
    </div>
  )
}
