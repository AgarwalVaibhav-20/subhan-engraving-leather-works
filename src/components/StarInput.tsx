"use client"

import { Star } from "lucide-react";


function StarInput({rating , setRating}) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((index)=>(
        <Star values={rating} onClick={()=>setRating(index)} key={index} className={`w-6 h-6 cursor-pointer transition  ${index <=rating ? "text-yellow-400 fill-amber-400":"text-gray-400"}` } />
      ))}
    </div>
  )
}

export default StarInput

