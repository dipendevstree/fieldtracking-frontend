import appIcon from "../../assets/app.png";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="bg-primary-foreground container grid h-svh max-w-none items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
        <div className="mb-4 flex items-center justify-center">
          <div>
            <img
              src={appIcon}
              className="relative m-auto"
              height={60}
              width={60}
              alt="Vite"
            />
          </div>
          <h1 className="text-xl font-medium">FieldTrack360</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
