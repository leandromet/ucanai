import React, { useState, useEffect } from 'react'

export default function ConstructionPage(){
  const [scope, setScope] = useState<'painting'|'painting_repairs'|'renovation'|'flooring'>('painting')
  const [quality, setQuality] = useState<'economy'|'standard'|'premium'>('standard')
  const [rooms, setRooms] = useState<number>(3)
  const [includeFinish, setIncludeFinish] = useState<boolean>(false)
  const [budget, setBudget] = useState<number | undefined>(undefined)
  const [result, setResult] = useState<any | null>(null)
  const [prompt, setPrompt] = useState<string | null>(null)
  const [previewVisible, setPreviewVisible] = useState<boolean>(true)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'options'|'breakdown'|'notes'>('options')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-generate on first load
  useEffect(() => {
    onGenerate();
  }, []);

  function buildPromptPayload() {
    return {
      template_id: 'construction_estimate_v2',
      activity: 'construction_estimate',
      scope,
      quality,
      rooms,
      include_finish: includeFinish,
      budget,
      timestamp: new Date().toISOString()
    };
  }

  function mockGPTResponse(payload: any) {
    // Enhanced mapping to simulate GPT normalized output
    const scopeMultiplier = 
      payload.scope === 'painting' ? 1 :
      payload.scope === 'painting_repairs' ? 1.2 :
      payload.scope === 'renovation' ? 2.5 : 
      payload.scope === 'flooring' ? 1.8 : 1;
    
    const baseCostPerRoom = quality === 'economy' ? 300 : quality === 'standard' ? 600 : 1100;
    const finishCost = includeFinish ? (quality === 'premium' ? 800 : 400) : 0;
    const total = (baseCostPerRoom * payload.rooms * scopeMultiplier) + finishCost;
    
    // More detailed options
    const options = [
      { 
        name: 'Basic', 
        cost: Math.round(total * 0.75), 
        materials: getScopeBasedMaterials('basic'),
        timeline: `${Math.max(1, Math.ceil(payload.rooms * scopeMultiplier / 2))} days`,
        pros: ['Most affordable option', 'Quick completion', 'Suitable for rental properties'],
        cons: ['Limited warranty', 'Basic materials only', 'May require more frequent maintenance']
      },
      { 
        name: 'Standard', 
        cost: Math.round(total), 
        materials: getScopeBasedMaterials('standard'),
        timeline: `${Math.max(2, Math.ceil(payload.rooms * scopeMultiplier / 1.5))} days`,
        pros: ['Good value for money', 'Durable materials', '5-year warranty'],
        cons: ['May require touch-ups after 3-4 years', 'Limited color options']
      },
      { 
        name: 'Premium', 
        cost: Math.round(total * 1.5), 
        materials: getScopeBasedMaterials('premium'),
        timeline: `${Math.max(3, Math.ceil(payload.rooms * scopeMultiplier))} days`,
        pros: ['Top-quality materials', 'Extended 10-year warranty', 'Custom color matching'],
        cons: ['Higher upfront cost', 'Longer completion time', 'May require specialized maintenance']
      }
    ];

    // More detailed breakdown with additional items
    const breakdown = [
      { item: getMaterialType(), qty: Math.max(1, payload.rooms * 3), unit: 'L', cost: Math.round(0.2 * total) },
      { item: 'Labor', cost: Math.round(0.4 * total) },
      { item: 'Equipment', cost: Math.round(0.1 * total) },
      { item: 'Preparation', cost: Math.round(0.1 * total) },
      ...(payload.scope !== 'painting' ? [{ item: getScopeExtraItem(), cost: Math.round(0.2 * total) }] : []),
      ...(payload.include_finish ? [{ item: 'Finishing', cost: finishCost }] : [])
    ];

    const recommendedOption = payload.budget && payload.budget < total ? 'Basic' : 'Standard';
    
    return {
      overview: `Estimate for ${payload.rooms} room${payload.rooms > 1 ? 's' : ''} — ${getScopeName()} (${payload.quality} quality)`,
      options,
      breakdown,
      recommended: recommendedOption,
      total_cost: { 
        min: Math.round(total * 0.75), 
        max: Math.round(total * 1.5),
        average: Math.round(total)
      },
      notes: [
        'This is a simulated estimate. Final quote requires on-site inspection.',
        'Prices include all materials and labor unless otherwise noted.',
        'Additional costs may apply for structural repairs discovered during work.',
        'All work complies with local building codes and regulations.'
      ],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  }
  
  // Helper functions for detailed materials and scope descriptions
  function getScopeBasedMaterials(tier: string) {
    if (scope === 'painting' || scope === 'painting_repairs') {
      return tier === 'basic' 
        ? 'Economy water-based paint' 
        : tier === 'standard' 
          ? 'Mid-range acrylic paint with primer' 
          : 'Premium washable paint with 10-year warranty';
    } else if (scope === 'renovation') {
      return tier === 'basic' 
        ? 'Standard drywall and basic fixtures' 
        : tier === 'standard' 
          ? 'Moisture-resistant materials and mid-range fixtures' 
          : 'Premium materials with designer fixtures';
    } else if (scope === 'flooring') {
      return tier === 'basic' 
        ? 'Laminate flooring' 
        : tier === 'standard' 
          ? 'Engineered hardwood' 
          : 'Solid hardwood or premium tile';
    }
    return '';
  }
  
  function getMaterialType() {
    if (scope === 'painting' || scope === 'painting_repairs') {
      return 'Paint';
    } else if (scope === 'renovation') {
      return 'Materials';
    } else if (scope === 'flooring') {
      return 'Flooring';
    }
    return 'Materials';
  }
  
  function getScopeExtraItem() {
    if (scope === 'painting_repairs') {
      return 'Repairs & Patching';
    } else if (scope === 'renovation') {
      return 'Fixtures & Hardware';
    } else if (scope === 'flooring') {
      return 'Underlayment & Adhesives';
    }
    return 'Additional Materials';
  }
  
  function getScopeName() {
    switch(scope) {
      case 'painting': return 'painting';
      case 'painting_repairs': return 'painting with repairs';
      case 'renovation': return 'room renovation';
      case 'flooring': return 'flooring installation';
      default: return scope.replace('_', ' ');
    }
  }

  function onGenerate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    
    setIsGenerating(true);
    const payload = buildPromptPayload();
    
    // Simulate the prompt we would send to an LLM
    const promptText = JSON.stringify({
      instruction: 'Generate a detailed construction estimate with options based on the following inputs',
      input: payload,
      output_schema: {
        overview: 'string - Brief description of the estimate',
        options: '[{name:string, cost:number, materials:string, timeline:string, pros:[string], cons:[string]}]',
        breakdown: '[{item:string, qty?:number, unit?:string, cost:number}]',
        recommended: 'string - Recommended option name',
        total_cost: '{min:number, max:number, average:number}',
        notes: '[string]',
        valid_until: 'string - YYYY-MM-DD'
      }
    }, null, 2);
    
    setPrompt(promptText);
    
    // Simulate API delay
    setTimeout(() => {
      const gpt = mockGPTResponse(payload);
      setResult(gpt);
      setIsGenerating(false);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'success-notification';
      notification.textContent = 'Estimate generated successfully!';
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    }, 800);
  }

  return (
    <div className="construction-page">
      <div className="construction-header">
        <h2>Interactive Construction Estimator</h2>
        <p className="form-description">
          Generate detailed estimates for construction projects. Adjust the parameters below to see how different factors affect pricing.
        </p>
      </div>

      <div className="form-layout">
        <div className="form-panel">
          <form onSubmit={onGenerate} className="construction-form">
            <div className="form-grid">
              <div className="form-col">
                <label>
                  <span>Project Scope</span>
                  <select 
                    value={scope} 
                    onChange={e => setScope(e.target.value as any)}
                    className="scope-select"
                  >
                    <option value="painting">Painting only</option>
                    <option value="painting_repairs">Painting + minor repairs</option>
                    <option value="renovation">Full room renovation</option>
                    <option value="flooring">Flooring installation</option>
                  </select>
                </label>
                
                <label>
                  <span>Quality Level</span>
                  <div className="quality-selector">
                    <button 
                      type="button"
                      className={`quality-btn ${quality === 'economy' ? 'active' : ''}`}
                      onClick={() => setQuality('economy')}
                    >
                      Economy
                    </button>
                    <button 
                      type="button"
                      className={`quality-btn ${quality === 'standard' ? 'active' : ''}`}
                      onClick={() => setQuality('standard')}
                    >
                      Standard
                    </button>
                    <button 
                      type="button"
                      className={`quality-btn ${quality === 'premium' ? 'active' : ''}`}
                      onClick={() => setQuality('premium')}
                    >
                      Premium
                    </button>
                  </div>
                </label>
              </div>
              
              <div className="form-col">
                <label>
                  <span>Number of Rooms</span>
                  <div className="room-selector">
                    <button 
                      type="button" 
                      className="room-btn"
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                      disabled={rooms <= 1}
                    >
                      -
                    </button>
                    <span className="room-count">{rooms}</span>
                    <button 
                      type="button" 
                      className="room-btn"
                      onClick={() => setRooms(rooms + 1)}
                    >
                      +
                    </button>
                  </div>
                </label>
                
                <label className="checkbox-container">
                  <span>Include Premium Finish</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={includeFinish}
                      onChange={() => setIncludeFinish(!includeFinish)}
                      id="finish-toggle"
                    />
                    <label htmlFor="finish-toggle" className="toggle-label">
                      <span className="toggle-inner"></span>
                      <span className="toggle-switch-label">
                        {includeFinish ? 'Yes' : 'No'}
                      </span>
                    </label>
                  </div>
                </label>
              </div>
            </div>
            
            <label>
              <span>Target Budget (optional)</span>
              <div className="budget-input">
                <span className="currency-symbol">$</span>
                <input 
                  type="number" 
                  min={0} 
                  value={budget ?? ''} 
                  onChange={e => setBudget(e.target.value === '' ? undefined : Number(e.target.value))} 
                  placeholder="e.g. 1500"
                />
              </div>
            </label>
            
            <button 
              type="submit" 
              className={`generate-btn ${isGenerating ? 'loading' : ''}`}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating estimate...' : 'Generate Estimate'}
            </button>
          </form>
          
          {isMobile && prompt && previewVisible && (
            <div className="mobile-preview">
              <button 
                className="preview-toggle" 
                onClick={() => setPreviewVisible(!previewVisible)}
              >
                {previewVisible ? 'Hide Prompt' : 'Show Prompt'}
              </button>
              {previewVisible && (
                <section className="preview-section">
                  <h3>AI Prompt Template</h3>
                  <pre className="preview-code">{prompt}</pre>
                </section>
              )}
            </div>
          )}
        </div>
        
        {!isMobile && prompt && (
          <aside className="preview-panel-desktop">
            <section className="preview-section">
              <h3 className="preview-heading">AI Prompt Template</h3>
              <pre className="preview-code">{prompt}</pre>
            </section>
          </aside>
        )}
      </div>

      {result && (
        <div className="estimate-results">
          <div className="estimate-header">
            <h3>{result.overview}</h3>
            <p className="estimate-validity">
              Valid until: {result.valid_until}
            </p>
            <div className="estimate-cost-range">
              <span className="cost-range-label">Estimated cost range:</span>
              <span className="cost-range-value">${result.total_cost.min} - ${result.total_cost.max}</span>
            </div>
          </div>

          <div className="result-tabs">
            <button 
              className={`tab-button ${activeTab === 'options' ? 'active' : ''}`}
              onClick={() => setActiveTab('options')}
            >
              Options
            </button>
            <button 
              className={`tab-button ${activeTab === 'breakdown' ? 'active' : ''}`}
              onClick={() => setActiveTab('breakdown')}
            >
              Cost Breakdown
            </button>
            <button 
              className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'options' && (
              <div className="options-grid">
                {result.options.map((o:any, i:number) => (
                  <div 
                    key={i} 
                    className={`option-card ${o.name === result.recommended ? 'recommended' : ''}`}
                  >
                    {o.name === result.recommended && (
                      <div className="recommended-badge">Recommended</div>
                    )}
                    <h4>{o.name} Package</h4>
                    <div className="option-price">${o.cost}</div>
                    <div className="option-timeline">
                      <span className="timeline-icon">⏱️</span> {o.timeline}
                    </div>
                    <div className="option-materials">
                      <strong>Materials:</strong> {o.materials}
                    </div>
                    
                    <div className="option-details">
                      <div className="pros-cons">
                        <div className="pros">
                          <h5>Pros</h5>
                          <ul>
                            {o.pros.map((pro:string, j:number) => (
                              <li key={j}>{pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="cons">
                          <h5>Cons</h5>
                          <ul>
                            {o.cons.map((con:string, j:number) => (
                              <li key={j}>{con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <button className="select-option-btn">
                      Select {o.name} Package
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'breakdown' && (
              <div className="breakdown-table">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.map((b:any, i:number) => (
                      <tr key={i}>
                        <td>{b.item}</td>
                        <td>{b.qty ? `${b.qty} ${b.unit}` : '-'}</td>
                        <td className="cost-cell">${b.cost}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td colSpan={2}><strong>Average Total</strong></td>
                      <td className="cost-cell"><strong>${result.total_cost.average}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'notes' && (
              <div className="notes-container">
                <ul className="notes-list">
                  {result.notes.map((note:string, i:number) => (
                    <li key={i} className="note-item">
                      {note}
                    </li>
                  ))}
                </ul>
                
                <div className="action-buttons">
                  <button className="save-estimate-btn">
                    <span className="btn-icon">📥</span>
                    Save Estimate as PDF
                  </button>
                  <button className="email-estimate-btn">
                    <span className="btn-icon">📧</span>
                    Email Estimate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
