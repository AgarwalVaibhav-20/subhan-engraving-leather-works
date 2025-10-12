'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const formSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),
})

type FormValues = z.infer<typeof formSchema>

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const router = useRouter()

  const [resending, setResending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormValues) => {
    if (!email) {
      toast.error('Email is missing from the URL.')
      return
    }

    try {
      await axios.post('/api/verify-otp', {
        email,
        otp: data.otp,
      })

      toast.success('Email verified! Redirecting to login...')

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid OTP')
    }
  }

  const handleResendOtp = async () => {
    if (!email) return
    try {
      setResending(true)
      const res = await axios.post('/api/resend', { email })
      toast.success(res.data.message || 'OTP resent successfully!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to resend OTP.')
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false}  toastOptions={{
    duration: 3000,
  }} />

      <div className="flex items-center justify-center min-h-screen py-8 px-4">
        <Card className="w-full max-w-md shadow-lg p-4">
          <CardHeader>
            <CardTitle className='text-center'>Verify Your Email</CardTitle>
          </CardHeader>
          <CardContent>
            {email && (
              <p className="text-sm text-muted-foreground mb-4 p-2">
                A code was sent to: <span className="font-semibold">{email}</span>
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                placeholder="Enter OTP"
                {...register('otp')}
                maxLength={6}
                className={errors.otp ? 'border-red-500' : ''}
              />
              {errors.otp && (
                <p className="text-sm text-red-500">{errors.otp.message}</p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </form>

            {/* 🔁 Resend OTP */}
            <div className="text-sm text-muted-foreground mt-4 text-center">
              Didn’t get the code?{' '}
              
              <button
                type="button"
                className="text-blue-600 underline"
                onClick={handleResendOtp}
                disabled={resending}
              >
                {resending ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
