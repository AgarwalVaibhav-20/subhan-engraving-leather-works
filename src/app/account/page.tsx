"use client"
import axios from 'axios';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface ProfileData{
  fullname:string;
  email:string;
  phoneNumber?:string;
  profilePic:string;
  address?:string;
  city?:string;
  state?:string;
  zipcode?:string;
}
function page() {
  const [profile , setProfile] = useState<ProfileData[]>([]);
  const [profileData , setProfileData] = useState<ProfileData[]>([])

  const updateData=async()=>{
    const data = await axios.post('/api/profile');
    setProfile(data.data)
  }

  useEffect(()=>{
    const fetchProfileData = async()=>{
      const res = await axios.get("/api/profile");
      setProfileData(res.data)
    }
  },[profileData]
  )
    const user = "vaibhav"
  return (
    <>
    <section className='flex justify-center items-center w-full'>
        <div className='min-h-screen
        justify-center flex items-center flex-col w-full m-3'
        >
            <div className="flex flex-col justify-center items-start space-y-3">
 <h1 className="text-4xl">Profile</h1>
            <h3>view all your profile details is here</h3>
            </div>
          <div className="relative flex py-5 items-center w-full">
    <div className="flex-grow border-t border-gray-400"></div>
    <div className="flex-grow border-t border-gray-400"></div>
</div>
            <div className="image_and_name flex justify-center items-center space-x-4 border p-5">
                <Image src={"/new.png"} width={80} height={80} alt='image'></Image>
                <span>hello {user}</span>
            </div>
            <div>

            </div>
        </div>
    </section>
    </>
  )
}

export default page
