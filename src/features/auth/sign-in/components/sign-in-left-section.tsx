import appIcon from "../../../../assets/app.png";
const SignInLeftSection = () => {
  return (
    <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
      <div className="absolute inset-0 bg-zinc-900" />
      <div className="relative z-20 flex items-center text-lg font-medium">
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg> */}
        <div>
          <img
            src={appIcon}
            className="relative m-auto"
            height={60}
            width={60}
            alt="Vite"
          />
        </div>
        FieldTrack360
      </div>

      {/* <img
                src={RedLogo}
                className='relative m-auto'
                width={301}
                height={60}
                alt='Vite'
            /> */}
      <h1 className="relative z-20 mt-auto text-4xl font-bold text-center">
        FieldTrack360
      </h1>

      <div className="relative z-20 mt-auto"></div>
    </div>
  );
};

export default SignInLeftSection;
