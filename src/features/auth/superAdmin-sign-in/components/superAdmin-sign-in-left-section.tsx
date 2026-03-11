import appIcon from "../../../../assets/app.png";
const SignInLeftSection = () => {
  return (
    <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex lg:border-r">
      <div className="absolute inset-0 bg-zinc-900" />
      <div className="relative z-20 flex items-center text-lg font-medium">
        <img
          src={appIcon}
          className="mr-2 h-10 w-10"
          alt="FieldTrack360 Logo"
        />
        FieldTrack360
      </div>

      <div className="relative z-20 flex flex-1 flex-col items-center justify-center py-10 lg:py-0">
        <img
          src={appIcon}
          className="h-75 w-auto object-contain transition-all hover:scale-105"
          alt="FieldTrack360 Logo"
        />
      </div>
    </div>
  );
};

export default SignInLeftSection;
