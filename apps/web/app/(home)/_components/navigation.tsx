import { sessionAction } from "@/lib/actions/auth-server-action";
import Link from "next/link";
import { Author } from "./author";

export const Navigation = async () => {
  const data = await sessionAction();
  return (
    <div className="flex gap-5 items-center">
      <Link href={"/"}>Something</Link>
      {data?.success ? <Author /> : <Link href={"/sign-in"}>Sign In</Link>}
    </div>
  );
};
