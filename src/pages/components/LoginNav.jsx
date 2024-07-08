import React from "react";
import Link from "next/link";
function LoginNav() {
  return (
    <div>
      <Link href="/">Login</Link>
      <Link href="/signup">Signup</Link>
    </div>
  );
}

export default LoginNav;
