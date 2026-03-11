import appIcon from "../../../../assets/app.png";
const SignInLeftSection = () => {
  return (
    <div className="bg-muted relative flex h-auto flex-col p-6 text-white lg:h-full lg:p-10 lg:border-r">
      <div className="absolute inset-0 bg-zinc-900" />
      <div className="absolute left-10 top-10 z-20 hidden items-center text-lg font-medium lg:flex">
        <img
          src={appIcon}
          className="mr-2 h-10 w-10"
          alt="FieldTrack360 Logo"
        />
        FieldTrack360
      </div>

      <div className="relative z-20 flex flex-1 flex-col items-center justify-center py-6 lg:py-0">
        <img
          src={appIcon}
          className="h-32 w-auto object-contain transition-all hover:scale-105 lg:h-75"
          alt="FieldTrack360 Logo"
        />
      </div>
    </div>
  );
};

export default SignInLeftSection;
