import { signIn, auth, signOut } from "@/auth";

export default async function Page() {
  let session = await auth();
  let user = session?.user?.name;

  return (
    <div>
      <header className="w-full h-16 absolute top-0 bg-gray-500 flex justify-between items-center px-16">
        <div></div>

        {user ? <SignOut>{`Welcome ${user}`}</SignOut> : <SignIn />}
      </header>

      <main className="mt-16 w-full">hello</main>
    </div>
  );
}

function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", {
          redirectTo: "/console"
        });
      }}>
      <button type="submit">login</button>
    </form>
  );
}

function SignOut({ children }: { children: React.ReactNode }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}>
      <p>{children}</p>
      <button type="submit">Sign out</button>
    </form>
  );
}
