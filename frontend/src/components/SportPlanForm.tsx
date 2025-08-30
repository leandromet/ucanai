import React, { useState } from 'react'
import type { ConsultationPayload } from '../App'

export default function SportPlanForm({ onSubmit, onPreview }:{ onSubmit:(payload:ConsultationPayload, result:any)=>void, onPreview?:(prompt:string|null, result:any|null)=>void }){
  const [activity,setActivity] = useState('mountain_bike')
  const [date,setDate] = useState('2025-09-12')
  const [groupSize,setGroupSize] = useState(2)
  const [skill,setSkill] = useState('intermediate')
  const [duration,setDuration] = useState(4)
  const [prefs,setPrefs] = useState<string[]>('adventure,scenic'.split(','))
  const [budget,setBudget] = useState(100)
  const [promptText, setPromptText] = useState<string | null>(null)
  const [localResult, setLocalResult] = useState<any | null>(null)

  function mockGenerate(payload:ConsultationPayload){
    // Simple local mock result to demo UI without backend
    const r = {
      overview: `A ${payload.duration_hours}h ${payload.activity.replace('_',' ')} trip in the Okanagan.`,
      timeline: [
        {time:'09:00', activity:'Meet and gear check'},
        {time:'09:30', activity:'Start route — scenic climb'},
        {time:'12:00', activity:'Picnic / viewpoint'},
        {time:'13:00', activity:'Return and debrief'}
      ],
      equipment: ['Helmet','Water bottle','Snacks','Spare tube'],
      safety: ['Bring layers','Trail has exposed ridgelines; moderate skill needed'],
      cost_estimate: {per_person: payload.constraints?.budget_per_person ?? 0},
      alternatives: [
        {label:'Shorter family-friendly', duration_hours:2, difficulty:'easy'},
        {label:'Full challenge', duration_hours:6, difficulty:'hard'}
      ]
    }

    return r
  }

  function buildPrompt(payload:ConsultationPayload){
    // Example of the structured prompt we would send to an LLM
    const prompt = {
      instruction: 'Produce a normalized JSON plan for an outdoor activity in the Okanagan.',
      metadata: {source: 'ucanai_pilot', timestamp: new Date().toISOString()},
      input: payload,
      output_schema: {
        overview: 'string',
        timeline: ['{time:string, activity:string}'],
        equipment: ['string'],
        safety: ['string'],
        cost_estimate: '{per_person:number}',
        alternatives: ['{label:string, duration_hours:number, difficulty:string}']
      }
    }
    return JSON.stringify(prompt, null, 2)
  }

  // helper to update preview in parent
  function updatePreview(prompt:string|null, result:any|null){
    setPromptText(prompt)
    setLocalResult(result)
    if(onPreview) onPreview(prompt, result)
  }

  return (
    <>
      <h2>Sport plan — Adventure consultation (Okanagan)</h2>
      <form onSubmit={(e)=>{e.preventDefault(); const payload:ConsultationPayload={activity,date,group_size:groupSize,skill_level:skill,duration_hours:duration,preferences:prefs,constraints:{budget_per_person:budget}}; const prompt = buildPrompt(payload); updatePreview(prompt, null); const result = mockGenerate(payload); updatePreview(prompt, result); onSubmit(payload,result)}}>
        <label>Activity
          <select value={activity} onChange={e=>{setActivity(e.target.value); const p = buildPrompt({activity:e.target.value,date,group_size:groupSize,skill_level:skill,duration_hours:duration,preferences:prefs,constraints:{budget_per_person:budget}} as ConsultationPayload); updatePreview(p, localResult)}}>
            <option value="mountain_bike">Mountain Bike</option>
            <option value="road_bike">Road Bike</option>
            <option value="kayak">Kayak</option>
            <option value="walking">Walking Trail</option>
          </select>
        </label>
        <label>Date <input type="date" value={date} onChange={e=>{setDate(e.target.value); const p = buildPrompt({activity,date: e.target.value,group_size:groupSize,skill_level:skill,duration_hours:duration,preferences:prefs,constraints:{budget_per_person:budget}} as ConsultationPayload); updatePreview(p, localResult)}}/></label>
        <label>Group size <input type="number" min={1} value={groupSize} onChange={e=>{setGroupSize(Number(e.target.value)); const p = buildPrompt({activity,date,group_size: Number(e.target.value),skill_level:skill,duration_hours:duration,preferences:prefs,constraints:{budget_per_person:budget}} as ConsultationPayload); updatePreview(p, localResult)}}/></label>
        <label>Skill level
          <select value={skill} onChange={e=>{setSkill(e.target.value); const p = buildPrompt({activity,date,group_size:groupSize,skill_level:e.target.value,duration_hours:duration,preferences:prefs,constraints:{budget_per_person:budget}} as ConsultationPayload); updatePreview(p, localResult)}}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <label>Duration (hours) <input type="number" min={1} value={duration} onChange={e=>{setDuration(Number(e.target.value)); const p = buildPrompt({activity,date,group_size:groupSize,skill_level:skill,duration_hours: Number(e.target.value),preferences:prefs,constraints:{budget_per_person:budget}} as ConsultationPayload); updatePreview(p, localResult)}}/></label>
        <label>Budget per person <input type="number" min={0} value={budget} onChange={e=>{setBudget(Number(e.target.value)); const p = buildPrompt({activity,date,group_size:groupSize,skill_level:skill,duration_hours:duration,preferences:prefs,constraints:{budget_per_person: Number(e.target.value)}} as ConsultationPayload); updatePreview(p, localResult)}}/></label>
        <button type="submit">Generate plan</button>
      </form>

      {promptText && (
        <section style={{marginTop:16}}>
          <h3>Simulated LLM prompt</h3>
          <pre style={{whiteSpace:'pre-wrap',background:'rgba(0,0,0,0.2)',padding:12,borderRadius:8}}>{promptText}</pre>
        </section>
      )}

      {localResult && (
        <section style={{marginTop:12}}>
          <h3>Normalized JSON response (simulated)</h3>
          <pre style={{whiteSpace:'pre-wrap',background:'rgba(0,0,0,0.2)',padding:12,borderRadius:8}}>{JSON.stringify(localResult, null, 2)}</pre>
        </section>
      )}
    </>
  )
}
