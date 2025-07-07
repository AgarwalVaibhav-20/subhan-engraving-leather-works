"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import Link from "next/link"

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
});


type SignupFormData = z.infer<typeof signupSchema>;

export function Signup() {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: SignupFormData) => {
    console.log("Signup Data:", data)
    // TODO: Call your API here using fetch or axios
  }

  return (

    <main>
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
                <FormControl >
                  <Input className="font-mono" type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
      </Form>
      <br />
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className=" font-mono mx-2 text-sm text-gray-500">Or</span>
        <hr className="flex-grow border-gray-300" />
      </div>


      <section className="flex justify-center items-center">
        <div className="space-x-2 flex max-sm:text-sm max-sm:flex-col">
         <span className="text-gray-500 font-mono">Already have a account ?</span> 
          <Link href="/login" className="font-mono max-sm:text-center">Click here </Link > 
        </div>
      </section>
    </main>

  )
}