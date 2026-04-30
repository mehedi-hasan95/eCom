import { UsersTable } from "./_components/user-table";
import { UsersHeader } from "./_components/users-header";

const Page = async () => {
  return (
    <>
      <UsersHeader />
      <UsersTable />
    </>
  );
};

export default Page;
