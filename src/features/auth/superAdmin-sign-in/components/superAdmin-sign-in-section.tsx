import { SIGN_PAGE_DATA } from "../data/sign-in.data";
import { SuperAdminAuthForm } from "./superAdmin-auth-form";

const SignInSection = () => {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">
            {SIGN_PAGE_DATA.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {SIGN_PAGE_DATA.description}{" "}
          </p>
        </div>
        <SuperAdminAuthForm />
      </div>
    </div>
  );
};

export default SignInSection;
