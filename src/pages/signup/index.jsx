import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Link from "next/link";
import { Divider } from "@nextui-org/react";
import { Input, Button } from "@nextui-org/react";
function Signup() {
  const domain = process.env.NEXT_PUBLIC_APP_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const handleFacebookSignIn = async () => {
    await signIn("facebook");
  };
  async function handleSubmit(event) {
    event.preventDefault();
    console.log(email, password);
    console.log("I'm clicked");

    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim(),
      }),
    };

    try {
      const res = await fetch(`${domain}/api/accounts`, postData);
      const data = await res.json();
      console.log(data);

      if (res.status === 409) {
        Swal.fire({
          title: "Error!",
          text: "User already exists",
          icon: "error",
        });
      } else if (res.ok) {
        Swal.fire({
          title: "Success!",
          text: "Account created successfully",
          icon: "success",
        });
        setEmail("");
        setPassword("");
      } else {
        Swal.fire({
          title: "Error!",
          text: data.error || "Failed to create account",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Function to handle Google OAuth sign-in
  const handleGoogleSignIn = async () => {
    await signIn("google");
  };

  // Redirect to homepage if session is active
  // if (status === "authenticated" && session?.user) {
  //   router.push("/homepage");
  // }

  return (
    // <div>
    //   <h1>SIgnup</h1>
    //   <form
    //     action=""
    //     autoComplete="off"
    //     className="flex flex-col gap-2"
    //     onSubmit={handleSubmit}
    //   >
    //     <input
    //       type="text"
    //       name="email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       placeholder="Enter your email"
    //     />
    //     <label htmlFor="email">Email</label>
    //     <input
    //       type="password"
    //       name="password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       placeholder="Enter your password"
    //     />
    //     <label htmlFor="password">Password</label>
    //     <button type="submit" className="p-2 bg-slate-700 text-slate-50">
    //       Submit
    //     </button>
    //   </form>
    //   <button
    //     className="p-2 bg-blue-600 text-white mt-4"
    //     onClick={handleGoogleSignIn}
    //   >
    //     Continue with Google
    //   </button>
    //   <Link href="/">Already have an account?</Link>
    // </div>
    <div className="flex min-w-screen min-h-screen bg-[#7469b6]">
      <div className="min-w-[60%] h-screen overflow-hidden">
        <img
          src="noteeee.svg"
          alt=""
          className="w-full h-full m-auto object-cover"
        />
      </div>
      <div className="w-full bg-[#f5f5f5]">
        <div className="logo absolute top-0">
          <img
            src="logo.svg"
            alt=""
            className="w-[200px] h-[100px] object-cover"
          />
        </div>
        <div className="card flex flex-col justify-center items-center h-full w-full">
          <div className="greet flex flex-col justify-center items-center gap-4 ">
            <h1 className="text-5xl font-bold text-[#7469b6]">
              Create an acccount
            </h1>
            <Divider className="max-w-80 bg-[#7469b6] mb-5" />
          </div>
          <form
            action=""
            autoComplete="off"
            className="flex flex-col gap-2 w-7/12"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-4 bg-blue-600 rounded-xl border border-[#7469b6] bg-transparent text-[#7469b6] transition ease relative inline-flex items-center justify-center"
            />
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-4 bg-blue-600 rounded-xl border border-[#7469b6] bg-transparent text-[#7469b6] transition ease relative inline-flex items-center justify-center"
            />
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Button
              type="submit"
              className="rounded-xl p-7 bg-[#7469b6] text-slate-50 text-lg hover:bg-[#473f7e] transition ease-in-out "
            >
              Submit
            </Button>
            <div className="or flex justify-center items-center">
              <Divider className="w-1/2" />
              <p className="mx-2 my-4 text-sm">OR</p>
              <Divider className="w-1/2" />
            </div>
          </form>
          <button
            className="w-7/12 mt-2 p-4 bg-blue-600 rounded-xl border border-[#7469b6] bg-transparent text-slate-700 font-bold hover:bg-[#7469b6] hover:text-white transition ease relative inline-flex items-center justify-center"
            onClick={handleGoogleSignIn}
          >
            <svg
              className="absolute left-4"
              width="30px"
              height="30px"
              viewBox="0 0 32 32"
              data-name="Layer 1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16"
                fill="#00ac47"
              />
              <path
                d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16"
                fill="#4285f4"
              />
              <path
                d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z"
                fill="#ffba00"
              />
              <polygon
                fill="#2ab2db"
                points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374"
              />
              <path
                d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z"
                fill="#ea4435"
              />
              <polygon
                fill="#2ab2db"
                points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626"
              />
              <path
                d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z"
                fill="#4285f4"
              />
            </svg>
            <span className="mx-autofont-bold">Continue with Google</span>
          </button>
          <button
            className="w-7/12 mt-2 p-4 rounded-xl border bg-[#1f7bf2] font-bold hover:bg-[#4762b1] text-white transition ease relative inline-flex items-center justify-center"
            onClick={handleFacebookSignIn}
          >
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <path
                fill="#1877F2"
                d="M15 8a7 7 0 00-7-7 7 7 0 00-1.094 13.915v-4.892H5.13V8h1.777V6.458c0-1.754 1.045-2.724 2.644-2.724.766 0 1.567.137 1.567.137v1.723h-.883c-.87 0-1.14.54-1.14 1.093V8h1.941l-.31 2.023H9.094v4.892A7.001 7.001 0 0015 8z"
              />
              <path
                fill="#ffffff"
                d="M10.725 10.023L11.035 8H9.094V6.687c0-.553.27-1.093 1.14-1.093h.883V3.87s-.801-.137-1.567-.137c-1.6 0-2.644.97-2.644 2.724V8H5.13v2.023h1.777v4.892a7.037 7.037 0 002.188 0v-4.892h1.63z"
              />
            </svg>
            <span className="mx-auto">Continue with Facebook</span>
          </button>
          <div className="footer flex mt-4">
            <p>Already have an account? </p>
            <Link href="/" className="ml-1 text-[#7469b6] font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
