import { CompletionPage } from "@/components/CompletionPage";
import { QuestionnairePage } from "@/components/QuestionnairePage";
import { mockPreferenceSummary } from "@/lib/mock-data";

type PreferOnePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PreferOnePage({ searchParams }: PreferOnePageProps) {
  const params = (await searchParams) ?? {};
  const edit = params.edit;
  const isEditing = Array.isArray(edit)
    ? edit.some((value) => value.toLowerCase() === "true")
    : edit?.toLowerCase() === "true";

  if (isEditing) {
    return <QuestionnairePage />;
  }

  return <CompletionPage data={mockPreferenceSummary} />;
}
