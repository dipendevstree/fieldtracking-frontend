import { useState } from 'react'
import { Star } from 'lucide-react'
import { Main } from '@/components/layout/main'

// You can use any icon library or even emoji

export default function FeedbackForm() {
  const [behaviorRating, setBehaviorRating] = useState(0)
  const [punctualityRating, setPunctualityRating] = useState(0)
  const [knowledgeRating, setKnowledgeRating] = useState(0)
  const [comments, setComments] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: any) => {
    e.preventDefault()
    // You can add API call logic here
    setSubmitted(true)
  }

  const renderStars = (rating: any, setRating: any) => {
    return (
      <div className='flex space-x-1'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition ${
              star <= rating
                ? 'fill-yellow-400 stroke-yellow-400'
                : 'stroke-gray-300'
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <Main>
      <div className='mx-auto mt-10 max-w-lg rounded-2xl bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-semibold'>
          Please provide your valuable feedback for the following meeting:
        </h2>

        <div className='mb-2 text-sm text-gray-700'>
          Sales Rep: <span className='font-medium'>Prashant W</span>
        </div>
        <div className='mb-2 text-sm text-gray-700'>
          Meeting Date: <span className='font-medium'>16/7/2025 11:00 AM</span>
        </div>
        <div className='mb-4 text-sm text-gray-700'>
          Customer Contact: <span className='font-medium'>Vicki C</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='mb-1 block font-medium'>
              Sales Rep Behaviour
            </label>
            {renderStars(behaviorRating, setBehaviorRating)}
          </div>

          <div className='mb-4'>
            <label className='mb-1 block font-medium'>Punctuality</label>
            {renderStars(punctualityRating, setPunctualityRating)}
          </div>

          <div className='mb-4'>
            <label className='mb-1 block font-medium'>
              Skills and Knowledge
            </label>
            {renderStars(knowledgeRating, setKnowledgeRating)}
          </div>

          <div className='mb-4'>
            <label className='mb-1 block font-medium'>
              Describe your experience
            </label>
            <textarea
              className='w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            ></textarea>
          </div>

          <button
            type='submit'
            className='w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700'
          >
            Submit
          </button>
        </form>

        {submitted && (
          <div className='mt-4 rounded-lg bg-green-100 p-3 text-green-700'>
            Thank you for your feedback!
          </div>
        )}
      </div>
    </Main>
  )
}
