"use client"

import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface ProfileData {
  fullname: string
  email: string
  phoneNumber?: string
  profilePic: string
  address?: string
  city?: string
  state?: string
  zipcode?: string
}

export default function AccountPage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  // ✅ Fetch profile data once when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await axios.get("/api/profile")
        setProfileData(res.data)
      } catch (err) {
        console.error("Failed to load profile:", err)
      }
    }

    fetchProfileData()
  }, [])

  const user = profileData?.fullname || "Vaibhav"

  return (
    <section className="flex justify-center items-center w-full">
      <div className="min-h-screen justify-center flex items-center flex-col w-full m-3">
        <div className="flex flex-col justify-center items-start space-y-3">
          <h1 className="text-4xl">Profile</h1>
          <h3>View all your profile details here</h3>
        </div>

        <div className="relative flex py-5 items-center w-full">
          <div className="flex-grow border-t border-gray-400"></div>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        <div className="image_and_name flex justify-center items-center space-x-4 border p-5">
          <Image
            src={profileData?.profilePic || "/new.png"}
            width={80}
            height={80}
            alt="Profile image"
          />
          <span>Hello {user}</span>
        </div>
      </div>
    </section>
  )
}
