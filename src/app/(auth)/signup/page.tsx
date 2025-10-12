"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import Image from 'next/image'
import image from '../../../../public/new.png'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// ✅ Schema
const signupSchema = z.object({
  fullname: z.string().min(2, "Fullname must be at least two characters"),
  email: z.string()
    .min(6, "Email must be at least 6 characters")
    .email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
})

// ✅ Type Inference
type SignupFormData = z.infer<typeof signupSchema>
type ApiResponse = { success: boolean; message: string }

const Page = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 🔔 Alert state
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true)
    setAlert(null)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)

      setAlert({
        type: 'success',
        message: response.data.message || "Account created successfully",
      })

      setTimeout(() => {
        // ✅ Redirect with query param, not dynamic route
        router.replace(`/verify?email=${encodeURIComponent(data.email)}`)
      }, 1000)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message || 'Something went wrong'

      setAlert({
        type: 'error',
        message: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 bg-white shadow rounded">
        <div className="flex justify-center items-center mb-4">
          <div className="w-24 h-24 relative">
            <Image
              src={image}
              alt="Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100px, 150px"
            />
          </div>
        </div>
        <h1 className="text-2xl font-mono mb-4 text-center">Create Account</h1>

        {/* ✅ Alert Component */}
        {alert && (
          <div className="fixed top-17 right-4 z-50">
            <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">Fullname</FormLabel>
                  <FormControl>
                    <Input className="font-mono" placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">Email</FormLabel>
                  <FormControl>
                    <Input className="font-mono" type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">Password</FormLabel>
                  <FormControl>
                    <Input className="font-mono" type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>

        <br />
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="font-mono mx-2 text-sm text-gray-500">Or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <section className="flex justify-center items-center">
          <div className="space-x-2 flex max-sm:text-sm max-sm:flex-col">
            <span className="text-gray-500 font-mono">Already have an account?</span>
            <Link href="/login" className="font-mono max-sm:text-center">Click here</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
export default Page
