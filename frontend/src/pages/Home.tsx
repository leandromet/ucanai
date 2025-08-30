import React from 'react'

export default function Home({ onStart, onViewConstruction }:{ onStart:()=>void, onViewConstruction:()=>void }){
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">
          AI-Powered Tools for <span className="highlight">Small Businesses</span>
        </h1>
        <p className="hero-subtitle">
          Transform your customer experience with intelligent, automated planning and proposals
        </p>
        <div className="hero-actions">
          <button 
            className="primary-btn"
            onClick={onStart}
          >
            <span className="btn-icon">🏔️</span>
            Try Adventure Sports Demo
          </button>
          <button 
            className="secondary-btn"
            onClick={onViewConstruction}
          >
            <span className="btn-icon">🏗️</span>
            Construction Estimate Demo
          </button>
        </div>
      </div>

      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Conversational AI</h3>
            <p>Engage your customers with intelligent conversations tailored to your business needs</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Custom Templates</h3>
            <p>Create structured outputs like quotes, itineraries, and proposals with your branding</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Responses</h3>
            <p>Generate detailed plans and quotes in seconds instead of hours</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Data Insights</h3>
            <p>Track customer preferences and optimize your offerings based on AI feedback</p>
          </div>
        </div>
      </div>

      <section className="about-section">
        <h2>About U Can AI</h2>
        <p>
          We build customized prompt-driven middleware and dashboards so small businesses 
          can offer structured proposals, itineraries and recommendations to their clients 
          using modern Large Language Models.
        </p>
        <p>
          Our goal is to make advanced AI accessible to small businesses without requiring 
          technical expertise or large budgets. Start enhancing your customer experience today!
        </p>
      </section>

      <section className="verticals-section">
        <h2>Pilot Industries</h2>
        <div className="verticals-grid">
          <div className="vertical-card">
            <div className="vertical-image adventure"></div>
            <h3>Adventure Sports</h3>
            <p>Customized itineraries for mountain biking, kayaking, hiking and more in the beautiful Okanagan region</p>
            <button className="text-btn" onClick={onStart}>
              Try the demo
            </button>
          </div>
          
          <div className="vertical-card">
            <div className="vertical-image construction"></div>
            <h3>Construction</h3>
            <p>Detailed estimates and proposals for construction projects with material breakdowns and timelines</p>
            <button className="text-btn" onClick={onViewConstruction}>
              Try the demo
            </button>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <h2>Ready to transform your business?</h2>
        <p>Join our pilot program and be among the first to leverage AI for your small business</p>
        <button className="primary-btn cta-btn">Contact Us</button>
      </section>
    </div>
  )
}
