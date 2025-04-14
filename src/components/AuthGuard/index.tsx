import useAuthGuard from "../../hooks/useAuthGuard";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const redirect = useAuthGuard();
  
  if (redirect) {
    return redirect;
  }

  return children;
};

export default AuthGuard;
