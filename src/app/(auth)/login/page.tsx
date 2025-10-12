"use client"
import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import image from '../../../../public/new.png'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signInVerification } from '@/schemas/signInSchema'
// const formSchema = z.object({
//   email: z.string().email("Invalid email address."),
//   password: z.string().min(6, "Password must be at least 6 characters."),
// })

type FormData = z.infer<typeof signInVerification>

const LoginPage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(signInVerification),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: FormData) => {
    setLoading(true)

    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })
    console.log("🧪 signIn response:", res);
    setLoading(false)

    if (res?.error) {
      form.setError("email", { message: "Invalid email or password" })
      form.setError("password", { message: " " }) // just to show both fields touched
    } else {
      router.push("/")
    }
  }

  // if (session) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
  //       <p className="text-xl font-mono">Signed in as {session.user?.email}</p>
  //       <Button onClick={() => signOut()}>Sign out</Button>
  //     </div>
  //   )
  // }

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

        <h1 className="text-2xl font-mono mb-4 text-center">Login</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
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
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading} >
              {loading ? "Logging in..." : "Submit"}
            </Button>
          </form>
        </Form>

        <section className="flex justify-center items-center p-4">
          <div className="space-x-2 flex max-sm:text-sm max-sm:flex-col">
            <span className="text-gray-500 font-mono">Don&apos;t have an account?</span>
            <Link href="/signup" className="font-mono max-sm:text-center">Click here</Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default LoginPage