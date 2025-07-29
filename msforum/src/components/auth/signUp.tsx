"use client";
import { useFormState } from "react-dom";
import { signUpAction } from "@/actions/auth";

const SignUp = () => {
    // Remove useFormState, use action directly in form
    // You may want to handle errors via server actions or useFormStatus if needed

    // Wrap signUpAction to satisfy the expected return type
    const handleSignUp = async (formData: FormData) => {
        await signUpAction(formData);
    };

    return (
        <form action={handleSignUp} method="post">
            <input type="text" name="username" placeholder="Username" required />
            <input type="email" name="email" placeholder="Email" required />
            {/* Error handling can be added here if you return errors from signUpAction and pass them as props */}
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Registrati</button>
        </form>
    );
}

export default SignUp;