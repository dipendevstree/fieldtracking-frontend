import appIcon from "../../../../assets/app.svg";

const SignInLeftSection = () => {
  return (
    <div className="bg-muted relative flex h-auto flex-col p-6 text-white lg:h-full lg:p-10 lg:border-r">
      <div className="absolute inset-0 bg-zinc-900" />

      {/* Top Left Mini Logo */}
      <div className="absolute left-10 top-10 z-20 hidden items-center text-lg font-medium lg:flex">
        <img
          src={appIcon}
          className="mr-2 h-10 w-10"
          alt="FieldTrack360 Logo"
        />
        FieldTrack360
      </div>

      {/* Main Centered Logo */}
      <div className="relative z-20 flex flex-1 flex-col items-center justify-center py-6 lg:py-0">
        <img
          src={appIcon}
          className="h-24 w-auto object-contain transition-all hover:scale-105 lg:h-56"
          alt="FieldTrack360 Logo"
        />
        <h1 className="mt-6 text-4xl font-bold lg:text-5xl">FieldTrack360</h1>
      </div>
    </div>
  );
};

export default SignInLeftSection;
