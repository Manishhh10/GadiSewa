import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-margin-mobile py-stack-lg bg-background">
      <div className="max-w-md w-full">
        <div className="text-center mb-stack-lg">
          <h1 className="font-headline-xl text-headline-xl font-extrabold text-primary tracking-tight">
            GadiSewa
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-unit">
            Secure Logistics &amp; Vehicle Booking
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/20 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
          <div className="mb-stack-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Welcome Back
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Please enter your details to sign in
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
