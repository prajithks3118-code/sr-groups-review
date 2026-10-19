import { Star, Upload, X } from 'lucide-react'
import { forwardRef } from 'react'

const ReviewForm = forwardRef(
  (
    {
      formData,
      imagePreview,
      submitted,
      submissionError,
      submitting,
      onInputChange,
      onRatingChange,
      onImageUpload,
      onRemoveImage,
      onSubmit,
    },
    ref
  ) => {
    return (
      <section ref={ref} className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Share Your Feedback</h2>

          {submitted ? (
            <div className="rounded-2xl backdrop-blur-md bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 p-12 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Star className="w-8 h-8 text-green-400 fill-green-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-blue-200 mb-2">
                Review submitted successfully!
              </h3>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/5 to-blue-500/5 border border-white/10 p-8 space-y-6"
            >
              {submissionError && (
                <p role="alert" className="text-sm text-red-300">
                  {submissionError}
                </p>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={onInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-400 focus:bg-white/10 transition-all duration-200 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onInputChange}
                  placeholder="yourname@gmail.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-400 focus:bg-white/10 transition-all duration-200 focus:outline-none"
                />
              </div>

              {/* Company and Job Title Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={onInputChange}
                    placeholder="Your company"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-400 focus:bg-white/10 transition-all duration-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={onInputChange}
                    placeholder="Your position"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-400 focus:bg-white/10 transition-all duration-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Industry/Sector */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Industry / Sector <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={onInputChange}
                  placeholder="e.g., Healthcare, IT, Finance"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-400 focus:bg-white/10 transition-all duration-200 focus:outline-none"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-white mb-4">
                  Star Rating <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => onRatingChange(star)}
                      className="transition-transform duration-200 hover:scale-125"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-500 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Write Your Review <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="reviewText"
                  value={formData.reviewText}
                  onChange={onInputChange}
                  placeholder="Share your experience with SR Groups..."
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-400 focus:bg-white/10 transition-all duration-200 focus:outline-none resize-none"
                />
              </div>

              {/* Profile Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Profile Photo
                </label>
                <div className="space-y-4">
                  {!imagePreview ? (
                    <label className="flex items-center justify-center gap-2 px-4 py-8 rounded-lg bg-white/5 border border-dashed border-white/20 hover:border-blue-400 hover:bg-white/10 cursor-pointer transition-all duration-200">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400 text-sm">Click to upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={onRemoveImage}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500/80 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreed"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={onInputChange}
                  className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 accent-blue-400 cursor-pointer"
                />
                <label htmlFor="agreed" className="text-sm text-gray-300 cursor-pointer">
                  I agree to have my review displayed publicly
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-105"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </section>
    )
  }
)

ReviewForm.displayName = 'ReviewForm'

export default ReviewForm
