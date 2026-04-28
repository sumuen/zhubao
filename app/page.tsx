import { CompletionPage } from "@/components/CompletionPage";
import { mockPreferenceSummary } from "@/lib/mock-data";

export default function HomePage() {
  return <CompletionPage data={mockPreferenceSummary} />;
}
