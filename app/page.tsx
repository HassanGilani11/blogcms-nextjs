import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect to public homepage
  redirect("/home");
}

