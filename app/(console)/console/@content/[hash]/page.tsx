import { cookies } from "next/headers";
import { StarContent } from "../../_components/star-content";

export default async function Content() {
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;
  const repo = cookieStore.get("repo")?.value;

  return <StarContent key={`${owner}-${repo}`} />


}
