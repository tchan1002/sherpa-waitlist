'use client'

import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState<'Personal' | 'Enterprise'>('Personal')
  const [businessWebsite, setBusinessWebsite] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info'
    text: string
  } | null>(null)

  const sheetsWebhookUrl = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid email address.'
      })
      return
    }

    if (!sheetsWebhookUrl) {
      setStatusMessage({
        type: 'info',
        text: 'Waitlist opening soon — check back later.'
      })
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const response = await fetch(sheetsWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          user_type: userType,
          business_website: userType === 'Enterprise' ? businessWebsite : ''
        }),
      })

      if (response.ok) {
        setStatusMessage({
          type: 'success',
          text: "You're on the list. We'll reach out soon."
        })
        // Reset form
        setEmail('')
        setUserType('Personal')
        setBusinessWebsite('')
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      {/* Hero Section - Personal */}
      <section className="hero">
        <div className="container">
          <h1>Web browsing should be dead simple. Never press a button again to get where you need to.</h1>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="enterprise">
        <div className="container">
          <h2>Don't lose another customer because they can't find the info they need.</h2>
          <ul>
            <li>Lower churn by making navigation effortless</li>
            <li>Increase accessibility (vital for clinics, elderly centers, NGOs)</li>
            <li>Get insights: see what your users really want</li>
          </ul>
          <p className="note">
            Add your business website in the form so we can consider it in our development.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="form-section">
        <div className="container">
          <h2>Join the waitlist</h2>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              {statusMessage && (
                <div 
                  className={`status-message ${statusMessage.type}`}
                  role="alert"
                  aria-live="polite"
                >
                  {statusMessage.text}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  aria-describedby="email-error"
                />
              </div>

              <div className="form-group">
                <fieldset>
                  <legend>I'm here as:</legend>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="personal"
                        name="userType"
                        value="Personal"
                        checked={userType === 'Personal'}
                        onChange={(e) => setUserType(e.target.value as 'Personal' | 'Enterprise')}
                        disabled={isSubmitting}
                      />
                      <label htmlFor="personal">Personal</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="enterprise"
                        name="userType"
                        value="Enterprise"
                        checked={userType === 'Enterprise'}
                        onChange={(e) => setUserType(e.target.value as 'Personal' | 'Enterprise')}
                        disabled={isSubmitting}
                      />
                      <label htmlFor="enterprise">Enterprise</label>
                    </div>
                  </div>
                </fieldset>
              </div>

              {userType === 'Enterprise' && (
                <div className="form-group">
                  <label htmlFor="businessWebsite">Business Website</label>
                  <input
                    type="url"
                    id="businessWebsite"
                    value={businessWebsite}
                    onChange={(e) => setBusinessWebsite(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="https://yourcompany.com"
                  />
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting || !sheetsWebhookUrl}
              >
                {isSubmitting ? 'Submitting...' : 'Get Early Access'}
              </button>

              <p className="small-print">
                By joining, you agree to be contacted about Sherpa updates. We never sell your data.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>Made with ❤️ by Sherpa</p>
        </div>
      </footer>
    </main>
  )
}
