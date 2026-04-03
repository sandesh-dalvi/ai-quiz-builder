import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const Header = async () => {
  const user = await currentUser();

  return (
    <header className=" h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className=" text-sm text-muted-foreground">
        Welcome back,{" "}
        <span className=" font-medium text-foreground">
          {user?.firstName} {user?.lastName}
        </span>
      </div>
      <UserButton />
    </header>
  );
};

export default Header;
