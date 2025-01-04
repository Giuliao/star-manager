import { auth } from "@/auth"
import { listUserTagById } from "@/lib/actions/tag"
import { SessionUser } from "@/types/user"
import { TagSidebar } from "@/components/tag-sidebar"
import { parseTagData } from "@/lib/utils"

type Props = React.HTMLAttributes<HTMLDivElement>;

export async function StarTagServer({ children }: Props) {
  const session = await auth();
  const results = await listUserTagById((session?.user as SessionUser).dbId);

  return (
    <TagSidebar
      sessionUser={session?.user as SessionUser}
      initNavItems={parseTagData(results)}
    />
  )
}



