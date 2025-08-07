const SignUpLeftSection = () => {
  return (
    <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
      <div className="absolute inset-0 bg-zinc-900" />
      <div className="relative z-20 flex items-center text-lg font-medium">
        <svg
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
        </svg>
        FieldTrack360
      </div>

      {/* <img
                src={RedLogo}
                className='relative m-auto'
                width={301}
                height={60}
                alt='Vite'
            /> */}
      <h1 className="relative z-20 mt-auto text-center text-4xl font-bold">
        FieldFieldTrack360
      </h1>

      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg">
            &ldquo;Net Part has revolutionized our auto parts business. Managing
            inventory, tracking orders, and serving customers has never been
            this efficient. Our sales have increased by 40% since
            implementation.&rdquo;
          </p>
        </blockquote>
      </div>
    </div>
  );
};

export default SignUpLeftSection;
