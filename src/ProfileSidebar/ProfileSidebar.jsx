import React from "react";
import profilePic from "./assets/profile.jpg"; // Replace with your actual image path

export default function ProfileSidebar() {
  return (
    <div className="w-80 bg-gray-900 text-green-500 p-4 flex flex-col items-center">
      <img
        src={profilePic}
        alt="Profile"
        className="w-64 h-64 rounded-full mb-4 border-4 border-green-500 object-cover"
      />
      <h2 className="text-xl font-bold">Pritom Das</h2>
      <p className="text-sm text-center mt-2">
        Developer<br />
        Building Systems that Matter
      </p>
    </div>
  );
}
