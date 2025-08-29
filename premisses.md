# U Can AI

U Can AI is a small-business focused platform and web app that helps local companies adopt practical AI-powered workflows using modern LLMs and API-driven middlewares. The goal is to provide each client with a personalized, logged-in area where tailored AI services, prompt templates, and integrations can be developed and managed.

## Mission

Enable small businesses in towns and cities to improve day-to-day operations, customer proposals, and decision-making by combining simple web forms, reusable prompt templates, and backend middleware that orchestrates modern LLMs (for example: gpt-4o, gpt-4-mini, gpt-5-mini, Gemini, DeepSeek).

## Target users

- Local service companies (construction, dentistry, repair, trades)
- Small travel agencies and tour operators
- Sports and outdoor activity guides (biking, trail running, climbing, snow sports)
- Any SMB that benefits from structured proposals, simple automation, or guided recommendations

## Core concept

Each client receives a personalized workspace (marketplace) with configurable prompt constructors. Staff fill friendly forms (selecting service type, scope, quality, dates, preferences) and the middleware composes a structured JSON prompt that is sent to an LLM. The LLM returns a normalized JSON response which is rendered as reports, proposals, schedules, or guidance in the client area.

## Example use cases

- Construction: estimate generator that outputs itemized proposals, alternatives with different materials and cost breakdowns, plus graphs and tables for transparency.
- Travel agency: itinerary and weather-aware recommendations based on destination, travel period, and traveler preferences.
- Dentistry: friendly visit summaries, follow-up suggestions, and patient communications based on prior records.
- Outdoor activities: daily route plans, difficulty-adjusted itineraries, equipment lists, and nearest access points.

## Features to implement (MVP)

- User accounts and per-client dashboard
- Form-driven prompt builder with reusable templates
- Middleware that builds/validates JSON prompts and calls LLM APIs
- Rendered reports: proposals, tables, and simple charts
- Basic analytics and prompt/version tracking
- Configurable model/provider selection and cost controls

## Data & privacy

Store only data necessary for the service and keep client data isolated per account. Offer clear export and deletion flows. For sensitive or regulated data, provide guidance to the client and use encryption/secure storage.

## Technology suggestions

- Backend: Node.js/Express or Python/FastAPI for API and middleware
- Frontend: React or Vue for dashboard and form builders
- LLM integration: provider-agnostic middleware that supports multiple models/APIs
- Storage: PostgreSQL (or equivalent) and object storage for reports

## Next steps

1. Draft an MVP feature list and user flow for one pilot vertical (pick one example use case).
2. Design the client dashboard wireframe and form templates.
3. Implement middleware that composes JSON prompts and integrates with an LLM provider.
4. Run a small pilot with one local business, gather feedback, iterate.
