import React from 'react'

export default function Home({ onStart, onViewConstruction }:{ onStart:()=>void, onViewConstruction:()=>void }){
  return (
    <div>
      <h1>U Can AI</h1>
      <p>Simple AI-powered tools for small local businesses — pilot demos below.</p>
      <div style={{marginTop:20}}>
        <button onClick={onStart}>Adventure consultation (Okanagan) — try demo</button>
        <button style={{marginLeft:12}} onClick={onViewConstruction}>Construction estimate example</button>
      </div>

      <section style={{marginTop:30}}>
        <h2>About U Can AI</h2>
        <p>We build customized prompt-driven middleware and dashboards so small businesses can offer structured proposals, itineraries and recommendations to their clients using modern LLMs.</p>
      </section>

      <section style={{marginTop:30}}>
        <h2>Pilot verticals</h2>
        <ul>
          <li>Adventure sports (mountain biking, kayaking, hiking) — pilot in the Okanagan</li>
          <li>Construction estimates and proposals</li>
        </ul>
      </section>
    </div>
  )
}
