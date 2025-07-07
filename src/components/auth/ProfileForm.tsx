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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"


// Define Zod schema
const formSchema = z.object({
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
})

// Infer form type from schema
type FormData = z.infer<typeof formSchema>

export function ProfileForm() {
  // useForm setup with zod resolver
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
     email: "",
     password:""
    },
  })

  // onSubmit handler
  function onSubmit(values: FormData) {
    console.log("Submitted data:", values)
    // You can also call an API here
  }

  return (
   <main>
    <section>
     
       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono" >E-mail</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com"{...field} />
              </FormControl>
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
                      </FormItem>
                    )}
                  />
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>
    <section className="flex justify-center items-center p-4">
            <div className="space-x-2 flex max-sm:text-sm max-sm:flex-col">
             <span className="text-gray-500 font-mono">Don&apos;t have an account ?</span> 
              <Link href="/signup" className="font-mono max-sm:text-center">Click here </Link > 
            </div>
          </section>
    </section>
   </main>
  )
}
