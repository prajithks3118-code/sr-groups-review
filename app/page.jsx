'use client'

import { useState, useRef, useEffect } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import ReviewSummary from '@/components/ReviewSummary'
import ReviewsSection from '@/components/ReviewsSection'
import ReviewForm from '@/components/ReviewForm'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

const toReviewView = (review) => ({
  id: review.id,
  fullName: review.full_name || '',
  company: review.company,
  jobTitle: review.job_title,
  industry: review.industry,
  rating: review.rating,
  reviewText: review.review_text,
  profilePhoto: review.profile_photo_url,
  date: review.created_at,
})

export default function Page() {
  const [reviews, setReviews] = useState([])
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    jobTitle: '',
    industry: '',
    rating: 0,
    reviewText: '',
    profilePhoto: null,
    agreed: false,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [reviewsError, setReviewsError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const fetchReviews = async () => {
      if (!supabase) {
        setReviewsError(
          'Supabase is not configured. Check the public Supabase environment variables and restart the dev server.'
        )
        return
      }

      const { data, error } = await supabase
        .from('reviews')
        .select(
          'id, full_name, company, job_title, industry, rating, review_text, profile_photo_url, created_at'
        )
        .order('created_at', { ascending: false })

      if (cancelled) return
      if (error) {
        setReviewsError(`Could not load reviews: ${error.message}`)
        return
      }

      const fetchedReviews = (data || []).map(toReviewView)
      setReviews((currentReviews) => {
        const fetchedIds = new Set(fetchedReviews.map((review) => review.id))
        const notFetchedYet = currentReviews.filter(
          (review) => !fetchedIds.has(review.id)
        )
        return [...notFetchedYet, ...fetchedReviews]
      })
      setReviewsError('')
    }

    fetchReviews()
    return () => {
      cancelled = true
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: file,
      }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      profilePhoto: null,
    }))
    setImagePreview(null)
  }

  const validateForm = () => {
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.industry.trim() ||
      !formData.reviewText.trim() ||
      formData.rating === 0 ||
      !formData.agreed
    ) {
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(formData.email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmissionError('')

    if (!validateForm()) {
      alert(
        'Please fill in all required fields and accept the consent checkbox.'
      )
      return
    }

    if (!supabase) {
      setSubmissionError(
        'Supabase is not configured. Check the public Supabase environment variables and restart the dev server.'
      )
      return
    }

    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          job_title: formData.jobTitle.trim(),
          industry: formData.industry.trim(),
          rating: formData.rating,
          review_text: formData.reviewText.trim(),
          profile_photo_url: imagePreview,
          agreed: formData.agreed,
        })
        .select()
        .single()

      if (error) throw error

      const newReview = toReviewView(data)
      setReviews((currentReviews) => [
        newReview,
        ...currentReviews.filter((review) => review.id !== newReview.id),
      ])
      setSubmitted(true)
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          company: '',
          jobTitle: '',
          industry: '',
          rating: 0,
          reviewText: '',
          profilePhoto: null,
          agreed: false,
        })
        setImagePreview(null)
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      if (
        error.code === '23505' &&
        error.message?.includes('reviews_email_unique_idx')
      ) {
        setSubmissionError(
          'You have already submitted a review with this email address.'
        )
        return
      }

      setSubmissionError(
        `Could not submit your review: ${error.message || 'Please try again.'}`
      )
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0b0c0d] text-[#f5f3ef] overflow-x-hidden">
      {/* Animated starfield background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .star {
            position: absolute;
            width: 1px;
            height: 1px;
            background: white;
            border-radius: 50%;
            animation: twinkle 3s infinite;
          }
          .prefers-reduced-motion {
            animation: none !important;
          }
        `}</style>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[...Array(50)].map((_, i) => (
            <circle
              key={i}
              cx={(i * 227) % 1200}
              cy={(i * 149) % 800}
              r={0.6 + (i % 3) * 0.35}
              fill="rgba(255,255,255,0.5)"
              filter="url(#glow)"
              style={{
                animation: `twinkle ${(i % 3) + 2}s infinite`,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 lg:px-0">
        <Header onReviewClick={scrollToForm} />
        <HeroSection onWriteReview={scrollToForm} />
        <ReviewSummary reviews={reviews} />
        <ReviewsSection reviews={reviews} error={reviewsError} />
        <ReviewForm
          ref={formRef}
          formData={formData}
          imagePreview={imagePreview}
          submitted={submitted}
          submissionError={submissionError}
          submitting={submitting}
          onInputChange={handleInputChange}
          onRatingChange={handleRatingChange}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          onSubmit={handleSubmit}
        />
        <Footer />
      </div>
    </div>
  )
}
