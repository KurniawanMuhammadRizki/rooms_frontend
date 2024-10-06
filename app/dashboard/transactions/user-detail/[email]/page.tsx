"use client";

import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { email } = useParams();
  return (
    <div>
      <h1>Post Slug: {email}</h1>
    </div>
  );
};

export default Page;
