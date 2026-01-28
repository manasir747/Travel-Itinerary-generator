# Travel Itinerary Generator (Frontend + n8n + AI)

## Project Description

The **Travel Itinerary Generator** is a frontend-driven web application that collects trip details from a user and automatically generates a personalized travel itinerary using an AI model. The generated itinerary is then delivered to the user via email.

The project demonstrates:
- A production-style frontend form (HTML, CSS, JavaScript)
- Backend automation using **n8n** (no traditional server)
- Integration of **LLMs (OpenAI)** for dynamic content generation
- Automated email delivery with structured, readable formatting

---

## Architecture Overview

```
User (Browser)
   ↓
Frontend (HTML/CSS/JS)
   ↓  (HTTP POST)
Webhook (n8n)
   ↓
Data Storage (Google Sheets)
   ↓
AI Processing (OpenAI via n8n)
   ↓
Email Delivery (Gmail via n8n)
   ↓
User Inbox
```

### Components
- **Frontend**: Collects user inputs and validates data
- **n8n Webhook**: Entry point for form submission
- **Google Sheets**: Temporary structured storage of trip data
- **OpenAI (LLM)**: Generates itinerary content dynamically
- **Gmail Node**: Sends formatted HTML email to the user

---

## Frontend → n8n Data Flow Explanation

1. **User fills the form**
   - Name
   - Destination
   - Number of days
   - Budget
   - Mode of travel
   - Number of travelers
   - Additional preferences
   - Email address

2. **Client-side validation**
   - Required fields checked
   - Email format validated
   - Numeric fields validated

3. **Form submission**
   - Data is sent as a JSON payload using `fetch()`
   - POST request is made to an **n8n webhook URL**

4. **n8n Webhook receives data**
   - Payload is parsed
   - Data is passed to subsequent nodes

---

## AI Usage Explanation

### Where AI is Used
- The **OpenAI (Message a model)** node in n8n

### Purpose
- Generate a **day-wise travel itinerary** based on:
  - Destination
  - Trip duration
  - Budget
  - Travel mode
  - Number of travelers
  - User preferences (e.g., vegetarian/non-veg, sightseeing, relaxed pace)

### Prompt Design
- System prompt restricts output to:
  - Email-safe HTML
  - Bordered tables
  - No markdown
  - No `<html>`, `<head>`, or `<body>` tags

This ensures the AI output can be injected **directly into an HTML email** without breaking formatting.

### Output
- AI returns an HTML table containing:
  - Day
  - Morning plan
  - Afternoon plan
  - Evening plan
  - Optional notes

This output is rendered inside Gmail exactly as generated.

---

## Email Generation Flow

1. Gmail node receives:
   - User email address from Google Sheets
   - AI-generated itinerary HTML

2. Email content includes:
   - Friendly greeting
   - Trip summary table (static, from user input)
   - Itinerary table (dynamic, from AI)

3. Email type is set to **HTML**, ensuring:
   - Tables render correctly
   - Borders and spacing are preserved

---

## Known Limitations and Assumptions

### Limitations
- No real-time booking (flights, hotels, tickets)
- Cost estimates are approximate and AI-generated
- Depends on OpenAI API availability
- Email styling depends on Gmail’s HTML support

### Assumptions
- Budget is provided in INR
- User preferences are free-text and interpreted by AI
- Internet connectivity is available
- n8n instance has valid credentials for:
  - OpenAI
  - Gmail
  - Google Sheets

---

## Conclusion

This project demonstrates a modern automation-first approach where:
- The frontend focuses on UX and validation
- n8n handles orchestration and integration
- AI provides dynamic, personalized content


