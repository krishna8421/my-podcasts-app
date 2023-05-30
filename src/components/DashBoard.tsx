import { useSession, signOut } from "next-auth/react";

const DashBoard = () => {
  const { data: session } = useSession();
  console.log(session);
  if (!session) {
    return (
      <div>
        <h1>Something went wrong, Please clear cookies and try again.</h1>
      </div>
    );
  }
  return (
    <div className="w-screen flex flex-col items-center m-auto max-w-5xl">
      <h3>Welcome {session.user?.name}! </h3>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default DashBoard;
