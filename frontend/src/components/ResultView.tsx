import React, { useState } from 'react'
import type { ConsultationPayload } from '../App'

export default function ResultView({ payload, result, onRegenerate }:{ payload: ConsultationPayload | null, result:any, onRegenerate:(r:any)=>void }){
  const [activeTab, setActiveTab] = useState('plan');
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Format the date nicely
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };
  
  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      // Simulate minor changes in the plan on regeneration
      const newResult = {
        ...result,
        timeline: result.timeline.map((t: any) => ({
          ...t,
          activity: t.activity.includes('viewpoint') 
            ? t.activity.replace('viewpoint', 'panoramic viewpoint') 
            : t.activity
        })),
        equipment: [...result.equipment, 'Personal identification'],
        overview: result.overview.replace('excursion', 'adventure')
      };
      onRegenerate(newResult);
      setIsRegenerating(false);
    }, 1000);
  };
  
  // Get activity name in a nice format
  const getActivityName = () => {
    if (!payload?.activity) return 'Adventure';
    return payload.activity.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  return (
    <div className="result-view">
      <header className="result-header">
        <h2>Your {getActivityName()} Plan</h2>
        <p className="plan-date">
          {formatDate(payload?.date)}
        </p>
        <div className="result-meta">
          <span className="meta-item">
            <span className="meta-icon">👥</span>
            Group of {payload?.group_size || '2'}
          </span>
          <span className="meta-item">
            <span className="meta-icon">⏱️</span>
            {payload?.duration_hours || '4'} hours
          </span>
          <span className="meta-item">
            <span className="meta-icon">🏅</span>
            {payload?.skill_level ? (payload.skill_level.charAt(0).toUpperCase() + payload.skill_level.slice(1)) : 'Intermediate'}
          </span>
        </div>
      </header>
      
      <div className="result-tabs">
        <button 
          className={`tab-button ${activeTab === 'plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('plan')}
        >
          Plan Details
        </button>
        <button 
          className={`tab-button ${activeTab === 'equipment' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipment')}
        >
          Equipment & Safety
        </button>
        <button 
          className={`tab-button ${activeTab === 'alternatives' ? 'active' : ''}`}
          onClick={() => setActiveTab('alternatives')}
        >
          Alternatives
        </button>
      </div>
      
      <div className="result-content">
        {activeTab === 'plan' && (
          <div className="plan-tab">
            <div className="overview-card">
              <h3>Overview</h3>
              <p>{result.overview}</p>
            </div>
            
            <div className="timeline-card">
              <h3>Itinerary</h3>
              <div className="timeline">
                {result.timeline.map((t:any, i:number) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-time">{t.time}</div>
                    <div className="timeline-connector">
                      <div className="timeline-dot"></div>
                      {i < result.timeline.length - 1 && <div className="timeline-line"></div>}
                    </div>
                    <div className="timeline-activity">{t.activity}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="cost-card">
              <h3>Cost Information</h3>
              <div className="cost-details">
                <div className="cost-amount">
                  <span className="cost-label">Cost per person:</span>
                  <span className="cost-value">${result.cost_estimate.per_person}</span>
                </div>
                {result.cost_estimate.included && (
                  <div className="cost-included">
                    <span className="cost-label">Included:</span>
                    <span>{result.cost_estimate.included}</span>
                  </div>
                )}
                {result.cost_estimate.extra_costs && (
                  <div className="cost-extras">
                    <span className="cost-label">Extra costs:</span>
                    <span>{result.cost_estimate.extra_costs}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'equipment' && (
          <div className="equipment-tab">
            <div className="equipment-card">
              <h3>Required Equipment</h3>
              <ul className="equipment-list">
                {result.equipment.map((e:string, i:number) => (
                  <li key={i} className="equipment-item">
                    <span className="equipment-icon">✓</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="safety-card">
              <h3>Safety Information</h3>
              <ul className="safety-list">
                {result.safety.map((s:string, i:number) => (
                  <li key={i} className="safety-item">
                    <span className="safety-icon">⚠️</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            
            {result.notes && (
              <div className="notes-card">
                <h3>Special Notes</h3>
                <p>{result.notes}</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'alternatives' && (
          <div className="alternatives-tab">
            <h3>Alternative Options</h3>
            <div className="alternatives-grid">
              {result.alternatives.map((alt:any, i:number) => (
                <div key={i} className="alternative-card">
                  <h4>{alt.label}</h4>
                  <div className="alternative-details">
                    <span className="alternative-detail">
                      <span className="detail-label">Duration:</span>
                      {alt.duration_hours} hours
                    </span>
                    <span className="alternative-detail">
                      <span className="detail-label">Difficulty:</span>
                      {alt.difficulty.charAt(0).toUpperCase() + alt.difficulty.slice(1)}
                    </span>
                    {alt.price_increase && (
                      <span className="alternative-detail">
                        <span className="detail-label">Additional cost:</span>
                        +${alt.price_increase} per person
                      </span>
                    )}
                  </div>
                  <button className="select-alternative-btn">
                    Select this option
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="result-actions">
        <button 
          className={`regenerate-btn ${isRegenerating ? 'loading' : ''}`}
          onClick={handleRegenerate}
          disabled={isRegenerating}
        >
          {isRegenerating ? 'Generating new plan...' : 'Regenerate plan'}
        </button>
        <button className="save-btn">
          Save as PDF
        </button>
      </div>
    </div>
  )
}
