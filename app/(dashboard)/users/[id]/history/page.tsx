"use client";
import { useParams } from "next/navigation";
import { UserFeedbackHistory } from "@/components/users/history/UserFeedbackHistory";

export default function UserHistoryPage() {
  const params = useParams();
  const userId = params.id as string;

  return <UserFeedbackHistory userId={userId} />;
}
