import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className=" min-h-screen flex items-center justify-center bg-secondary">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
