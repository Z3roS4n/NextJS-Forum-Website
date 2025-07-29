import { SignUp } from '@clerk/nextjs';

//import SignUp from '@/components/auth/signUp'

const SignUpPage = () => {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
          <div className="flex w-full max-w-sm md:max-w-3xl items-center justify-center">
              {/*
              <SignUp></SignUp>
              */}
              <SignUp signInUrl='/sign-in'></SignUp>
          </div>
      </div>
    )
}

export default SignUpPage;