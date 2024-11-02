/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useParams } from "next/navigation";

import StreamView from "@/components/StreamView";

const Dashboard = () => {
  const params = useParams();

  return (
    <div>
      <h1>Dashboard page</h1>
      {/* @ts-ignore */}
      <StreamView spaceId={params?.id} />
    </div>
  );
};

export default Dashboard;
