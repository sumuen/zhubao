import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/prefer/1?edit=True");
}
