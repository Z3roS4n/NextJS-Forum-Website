import { SignIn } from '@clerk/nextjs';


const SignInPage = () => {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
          <div className="flex w-full max-w-sm md:max-w-3xl items-center justify-center">
                <SignIn signUpUrl='/sign-up'></SignIn>
          </div>
      </div>
    )
}

export default SignInPage;