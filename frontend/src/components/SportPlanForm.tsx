import React, { useState, useEffect } from 'react'
import type { ConsultationPayload } from '../App'

export default function SportPlanForm({ onSubmit, onPreview }:{ onSubmit:(payload:ConsultationPayload, result:any)=>void, onPreview?:(prompt:string|null, result:any|null)=>void }){
  const [activity, setActivity] = useState('mountain_bike')
  const [date, setDate] = useState('2025-09-12')
  const [groupSize, setGroupSize] = useState(2)
  const [skill, setSkill] = useState('intermediate')
  const [duration, setDuration] = useState(4)
  const [prefs, setPrefs] = useState<string[]>(['adventure', 'scenic'])
  const [budget, setBudget] = useState(100)
  const [notes, setNotes] = useState('')
  const [promptText, setPromptText] = useState<string | null>(null)
  const [localResult, setLocalResult] = useState<any | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Available preferences
  const availablePrefs = [
    { id: 'adventure', label: 'Adventure' },
    { id: 'scenic', label: 'Scenic Views' },
    { id: 'family', label: 'Family-friendly' },
    { id: 'technical', label: 'Technical Challenge' },
    { id: 'relaxed', label: 'Relaxed Pace' }
  ]

  // Helper function to build the payload from form state
  const buildPayload = (): ConsultationPayload => {
    return {
      activity,
      date,
      group_size: groupSize,
      skill_level: skill,
      duration_hours: duration,
      preferences: prefs,
      constraints: { budget_per_person: budget },
      notes: notes.trim() || undefined
    };
  };
  
  // Generate preview on mount
  useEffect(() => {
    const payload = buildPayload();
    const prompt = buildPrompt(payload);
    updatePreview(prompt, null);
  }, []);

  function mockGenerate(payload:ConsultationPayload){
    // Simple local mock result to demo UI without backend
    const startTime = payload.activity === 'kayak' ? '08:30' : '09:00';
    const duration = payload.duration_hours || 4; // Default to 4 if undefined
    const r = {
      overview: `A ${duration}-hour ${payload.activity.replace('_',' ')} excursion in the beautiful Okanagan region. This ${payload.skill_level}-level adventure is perfect for a group of ${payload.group_size}${payload.preferences?.includes('family') ? ', family-friendly' : ''}.`,
      timeline: [
        {time: startTime, activity: 'Meet at the trailhead, equipment check and safety briefing'},
        {time: (parseInt(startTime.split(':')[0]) + 0.5) + ':' + startTime.split(':')[1], activity: 'Begin the journey with warm-up on easy terrain'},
        {time: (parseInt(startTime.split(':')[0]) + 2) + ':00', activity: payload.preferences?.includes('scenic') ? 'Scenic viewpoint stop with photo opportunities' : 'Technical section and skills practice'},
        {time: (parseInt(startTime.split(':')[0]) + 3) + ':00', activity: 'Picnic lunch at a beautiful spot'},
        {time: (parseInt(startTime.split(':')[0]) + 4) + ':00', activity: 'Return journey with different route options'},
        {time: (parseInt(startTime.split(':')[0]) + duration) + ':00', activity: 'Return to base, debrief and refreshments'}
      ].slice(0, Math.max(3, Math.min(duration, 6))),
      equipment: [
        'Appropriate footwear',
        payload.activity.includes('bike') ? 'Helmet (mandatory)' : 'Hat and sunglasses',
        'Water bottle (at least 1L)',
        'Snacks/lunch',
        'Sunscreen',
        'Weather-appropriate clothing',
        payload.activity === 'kayak' ? 'Lifejacket (provided)' : 'First aid kit (guide carries)'
      ],
      safety: [
        'Always stay with the group',
        'Alert guide to any medical conditions before departure',
        `Trail difficulty rated as ${payload.skill_level}`,
        'Bring layers for changing weather conditions',
        payload.skill_level === 'advanced' ? 'Technical sections require full attention' : 'Terrain is suitable for stated skill level',
      ],
      cost_estimate: {
        per_person: payload.constraints?.budget_per_person ?? 0,
        included: 'Guide, basic equipment, safety gear',
        extra_costs: 'Optional photography package: $25'
      },
      alternatives: [
        {label: 'Shorter beginner-friendly option', duration_hours: Math.max(2, duration - 2), difficulty: 'easy'},
        {label: 'Extended adventure with extra challenges', duration_hours: duration + 2, difficulty: 'hard'},
        {label: 'Private customized experience', duration_hours: duration, difficulty: payload.skill_level || 'intermediate', price_increase: 30}
      ],
      notes: payload.notes ? `Special requests: ${payload.notes}` : 'No special requests noted.'
    };

    return r;
  }

  function buildPrompt(payload:ConsultationPayload){
    // Example of the structured prompt we would send to an LLM
    const prompt = {
      instruction: 'Create a detailed outdoor activity plan for the Okanagan region based on user preferences.',
      metadata: {source: 'ucanai_pilot', timestamp: new Date().toISOString()},
      input: payload,
      output_schema: {
        overview: 'string - A brief summary of the planned activity',
        timeline: '[{time:string, activity:string}] - Hourly breakdown of the day',
        equipment: '[string] - List of required and recommended equipment',
        safety: '[string] - Important safety considerations',
        cost_estimate: '{per_person:number, included:string, extra_costs:string} - Breakdown of costs',
        alternatives: '[{label:string, duration_hours:number, difficulty:string, price_increase?:number}] - Alternative options',
        notes: 'string - Any special considerations based on user input'
      }
    };
    return JSON.stringify(prompt, null, 2);
  }

  // Helper to update preview in parent
  function updatePreview(prompt:string|null, result:any|null){
    setPromptText(prompt);
    setLocalResult(result);
    if(onPreview) onPreview(prompt, result);
  }

  // Handle form field changes with a single function
  const handleFieldChange = (field: string, value: any) => {
    // Update the local state
    switch(field) {
      case 'activity': setActivity(value); break;
      case 'date': setDate(value); break;
      case 'groupSize': setGroupSize(Number(value)); break;
      case 'skill': setSkill(value); break;
      case 'duration': setDuration(Number(value)); break;
      case 'budget': setBudget(Number(value)); break;
      case 'notes': setNotes(value); break;
      default: break;
    }
    
    // Update payload and preview
    setTimeout(() => {
      const updatedPayload = buildPayload();
      const prompt = buildPrompt(updatedPayload);
      updatePreview(prompt, localResult);
    }, 0);
  };

  // Toggle preference selection
  const togglePreference = (prefId: string) => {
    const newPrefs = prefs.includes(prefId)
      ? prefs.filter(p => p !== prefId)
      : [...prefs, prefId];
    
    setPrefs(newPrefs);
    
    setTimeout(() => {
      const updatedPayload = buildPayload();
      const prompt = buildPrompt(updatedPayload);
      updatePreview(prompt, localResult);
    }, 0);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const payload = buildPayload();
    const prompt = buildPrompt(payload);
    updatePreview(prompt, null);
    
    // Simulate API call delay
    setTimeout(() => {
      const result = mockGenerate(payload);
      updatePreview(prompt, result);
      setIsGenerating(false);
      onSubmit(payload, result);
    }, 800);
  };

  return (
    <div className="sport-plan-form">
      <h2>Adventure Sport Plan</h2>
      <p className="form-description">
        Plan your next outdoor adventure in the beautiful Okanagan region. Complete the form below to generate a customized activity plan.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-col">
            <label>
              <span>Activity Type</span>
              <select 
                value={activity} 
                onChange={(e) => handleFieldChange('activity', e.target.value)}
              >
                <option value="mountain_bike">Mountain Biking</option>
                <option value="road_bike">Road Cycling</option>
                <option value="kayak">Kayaking</option>
                <option value="walking">Hiking Trail</option>
                <option value="climbing">Rock Climbing</option>
                <option value="paddle_board">Paddle Boarding</option>
              </select>
            </label>
            
            <label>
              <span>Planned Date</span>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => handleFieldChange('date', e.target.value)}
              />
            </label>
            
            <label>
              <span>Group Size</span>
              <input 
                type="number" 
                min={1} 
                max={20}
                value={groupSize} 
                onChange={(e) => handleFieldChange('groupSize', e.target.value)}
              />
            </label>
          </div>
          
          <div className="form-col">
            <label>
              <span>Skill Level</span>
              <select 
                value={skill} 
                onChange={(e) => handleFieldChange('skill', e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
            
            <label>
              <span>Duration (hours)</span>
              <input 
                type="range" 
                min={1} 
                max={8}
                value={duration} 
                onChange={(e) => handleFieldChange('duration', e.target.value)}
              />
              <div className="range-value">{duration} hours</div>
            </label>
            
            <label>
              <span>Budget per person ($)</span>
              <input 
                type="number" 
                min={0} 
                max={500}
                step={10}
                value={budget} 
                onChange={(e) => handleFieldChange('budget', e.target.value)}
              />
            </label>
          </div>
        </div>
        
        <div className="preferences-section">
          <label>
            <span>Preferences</span>
            <div className="preferences-group">
              {availablePrefs.map(pref => (
                <label key={pref.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={prefs.includes(pref.id)}
                    onChange={() => togglePreference(pref.id)}
                  />
                  <span>{pref.label}</span>
                </label>
              ))}
            </div>
          </label>
        </div>
        
        <label>
          <span>Special Requests/Notes</span>
          <textarea
            value={notes}
            placeholder="Any special considerations or requests for your adventure..."
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            rows={3}
          />
        </label>
        
        <button 
          type="submit" 
          disabled={isGenerating}
          className={isGenerating ? 'loading' : ''}
        >
          {isGenerating ? 'Generating Plan...' : 'Generate Adventure Plan'}
        </button>
      </form>
    </div>
  )
}
